<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Mail\LinkMail;
use App\Models\Company;
use App\Models\Customer;
use App\Models\Employer;
use App\Services\JwtService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Config;

class CompanyController extends Controller
{
    //
     public function selectCompany(Request $request, JwtService $jwtService)
        {
            $userId = $request->user_id; // injecté par JwtAuth
            $companyId = $request->company_id;

            $company = Company::with('user:Customers_Numbers,Names,customer_db')
                ->where('company_number', $companyId)
            // ->where('employee_number', $userId)
                ->firstOrFail();



            //Log::info("Generating token for Company:", ['company_number' => $company]);

            $token = $jwtService->generateJWT(
                (object)['Customers_Numbers' => $userId],
                $company->company_number
            );

            return response()->json([
                'status' => true,
                'access_token' => $token,
                'token_type' => 'Bearer',
            ]);
        }

     public function getAllEmployers(Request $request)
        {
            // Utiliser la base de données fournie ou celle de la session du middleware
            $customerID = $request->input('company_id') ?? session('company_db');
           // Log::info("Customer DB for getAllEmployers:", ['customer_db' => $customerID]);

            if ($customerID) {
                 $customers = User::where('type','webcompany')
                             ->where('Customers_Numbers', $customerID)
                                   ->select('Customers_Numbers','Names','customer_db')
                                  ->first();
                if (!$customers) {
                    return response()->json([
                        'status' => 404,
                        'message' => 'Entreprise non trouvée.',
                    ]);
                }     
                if(!$customers->customer_db){
                    return response()->json([
                        'status'=>404,
                        'message'=>'Cette entreprise ne dispose pas de base de donnee'
                    ]);
                }         
                Config::set('database.connections.mysql2.database', $customers->customer_db);                   
                DB::purge('mysql2');
                DB::reconnect('mysql2');
            } 

            $employers = Employer::on('mysql2')->where('Status','Actif') ->get(['employees_Number','FirstName','LastName','Email','TypeEmplyement']);

            if ($employers->isEmpty()) {
                return response()->json([
                    'status' => 404,
                    'message' => 'Aucun employé trouvé pour cette entreprise.',
                ]);
            }
            return response()->json([
                'status' => 200,
                'employers' => $employers,
            ]);
        }

     public function getCustomers(Request $request)
        {
            $userId = $request->user_id; // injecté par JwtAuth

            $customers = Customer::where('type','webcompany')
                                   ->select('Customers_Numbers','Names','customer_db','az_id')
                                  ->get();

            if ($customers->isEmpty()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Aucune entreprise accessible pour cet utilisateur.',
                ], 404);
            }

           // $companies = $employer->company()->get(['company_number', 'company_name']);

            return response()->json([
                'status' => 200,
                'customers' => $customers,
            ]);
        }

     public function inviteEmployee(Request $request)
        {
            $userId = $request->user_id; // injecté par JwtAuth
            $mail = $request->email;
            $code = rand(100000, 999999); // Générer un code aléatoire à 6 chiffres
            $cacheKey = 'invitation_code_' . $mail;
            $name = $request->name;
            $lastname = $request->lastname;

            Cache::put(
                $cacheKey,
                Hash::make($code),
                now()->addMinutes(30)
            );

            $link = "http://localhost:5173/sender";
            //$link ='https://remotedesk.az-companies.com/sender';

           Mail::send(new LinkMail($link, $mail, $code,$name,$lastname));


            // Logique pour envoyer le lien d'invitation à l'email fourni
            // Vous pouvez utiliser un service de messagerie comme Mailgun, SendGrid, etc.

            return response()->json([
                'status' => 200,
                'message' => 'Lien d\'invitation envoyé avec succès.',
            ]);
        }

        public function verifyCode(Request $request)
        {
            $email = $request->email;
            $code = $request->code;
            $cacheKey = 'invitation_code_' . $email;

            if (!Cache::has($cacheKey)) {
                return response()->json([
                    'status' => false,
                    'message' => 'Code de vérification expiré ou invalide.',
                ], 400);
            }

            $hashedCode = Cache::get($cacheKey);

            if (!Hash::check($code, $hashedCode)) {
                return response()->json([
                    'status' => false,
                    'message' => 'Code de vérification incorrect.',
                ], 400);
            }

            // Code de vérification correct, vous pouvez procéder à l'ajout de l'employé à la base de données

            // Supprimer le code de vérification du cache
            Cache::forget($cacheKey);

            return response()->json([
                'status' => 200,
                'message' => 'Code de vérification validé avec succès.',
            ]);
        }
}
