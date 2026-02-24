<?php

namespace App\Http\Controllers\Auth;

use App\Models\User;
use App\Models\Company;
use App\Models\Employer;
use App\Services\JwtService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    //

     public function login(Request $request, JwtService $jwtService)
        {
            $validator = Validator::make($request->all(), [
                    'loginMode' => 'required|in:email,code',
                    'email' => 'required_if:loginMode,email|email',
                    'code' => 'required_if:loginMode,code|string',
                    'password' => 'required|string',
                ]);


            if ($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Erreur de validation',
                    'errors' => $validator->errors()
                ], 422);
            }

            try {
                $remember = $request->has('remember');
                $email = $request->input('email');
                $code = $request->input('code');
                $password = md5($request->input('password')); // À remplacer par Hash::check si possible

                $cacheKey = 'auth_attempt_' . md5($email . $password);
                $response =   filter_var($email, FILTER_VALIDATE_EMAIL)
                        ? $this->loginWithEmail($request, $email, $password, $remember,$jwtService)
                        : $this->loginWithCodeId($request, $code, $password, $remember,$jwtService);

                //Log::info("B ",[$response]);

                    // Log::info("Les informations recuperer ",['response' => $response]);
                    $accessibleCompanies=null;
                if($response)
                {
                    $responseData = $response->getData(true); // récupère le tableau
                    // $userNumber = data_get($responseData, 'info.user.Customers_Numbers');
                    if(!isset($responseData['info']['user']['Customers_Numbers'])){
                        return response()->json([
                            'status' => 400,
                            'message' => 'Identifiant incorrect'
                        ]);
                    }

                    $userNumber = $responseData['info']['user']['Customers_Numbers'];

                    //  $findUser = Employer::where('az_id', $userNumber)->first();
                    //  if(!$findUser){
                    //       return response()->json([ 'status' => 400, 'message' => 'Utilisateur non trouvé' ]);
                    //  }
                    $accessibleCompanies = Company::with([
                            'user:Customers_Numbers,customer_db,Names' // sélectionne seulement ces colonnes
                        ])
                        ->select('id', 'company_number')
                        ->where('employee_number', $userNumber)
                        ->get();
                        Log::info("Les entreprises accessibles ",['companies' => $accessibleCompanies]);

                }

            //Log::info("Les entreprises accessibles ",['companies' => $accessibleCompanies]);

                return response()->json([
                    'status' => 200,
                    'user' => $responseData['info'],
                    'accessible_companies' => $accessibleCompanies
                ]);

            } catch (\Exception $e) {
                return response()->json([
                    'status' => false,
                    'message' => 'Une erreur est survenue',
                    'error' => $e->getMessage()
                ], 500);
            }
        }

     private function loginWithEmail($request, $email, $password, $remember,JwtService $jwtService)
        {
            //ConfigAZConnection::init();
            $credential = DB::connection('mysql')
                ->table('customers_credential')
                ->where('userN', $email)
                ->first();

            if (!$credential || $password !== $credential->passW) {
                return response()->json([
                    'status' => false,
                    'message' => 'Email ou mot de passe incorrect'
                ], 401);
            }

            $user = User::where('Customers_Numbers', $credential->customer_number)->first([
                'Customers_Numbers',
                'Country',
                'Province',
                'City',
                'created_date',
                'birth_date',
                'matrimonial',
                'Names',
                'LastName',
                'Phones',
                'E-mails',
                'Adresses',
                'Description',

            ]);
            $user->isVerify = !empty($user->id_doc);
            unset($user->id_doc);
            $token = $jwtService->generateJWT($user,null);
            return response()->json([
                'status' => true,
                'message' => 'Connexion réussie',
                'info' => [
                    'user' => $this->formatUserData($user),
                    'access_token' => $token,
                    'token_type' => 'Bearer'
                ]
            ]);
        }


        private function loginWithCodeId($request, $email, $password, $remember,JwtService $jwtService)
        {
            $str = preg_replace("/[^0-9]/", "", $email);
            if (!is_numeric($str)) {
                return response()->json([
                    'status' => false,
                    'message' => 'Code ID invalide'
                ], 401);
            }

            $baseId = DB::connection('mysql')->table('az_config')
                ->where('config_name', 'base_identifiant')
                ->value('config_value');

            $customerBaseId = (int)$str - (int)$baseId;
            $customer = DB::connection('mysql2')->table('customers_credential')
                ->where('customer_number', $customerBaseId)
                ->first();

            if (!$customer || $password !== $customer->passW) {
                return response()->json([
                    'status' => false,
                    'message' => 'ID ou mot de passe incorrect'
                ], 401);
            }

            $user = $this->getUserWithRelations($customer->customer_number);
            $user->isVerify = !empty($user->id_doc);
            unset($user->id_doc);
            $token = $jwtService->generateJWT($user,null);

            return response()->json([
                'status' => true,
                'message' => 'Connexion réussie',
                'info' => [
                    'user' => $this->formatUserData($user),
                    'access_token' => $token,
                    'token_type' => 'Bearer'
                ]
            ]);
        }

         private function getUserWithRelations($customerId)
        {
          return User::where('Customers_Numbers', $customerId)->first([
                'Customers_Numbers',
                'Country',
                'Province',
                'City',
                'created_date',
                'birth_date',
                'matrimonial',
                'Names',
                'LastName',
                'Phones',
                'E-mails',
                'Adresses',
                'Description',

            ]);
        }

    private function formatUserData($user)
        {
            $userData = $user->toArray();

            if ($user->Picture) {
                $userData['Picture'] = base64_encode($user->Picture);
            }

            array_walk_recursive($userData, function (&$value) {
                if (is_string($value)) {
                    $encoding = mb_detect_encoding($value, ['UTF-8', 'ISO-8859-1', 'Windows-1252'], true);
                    if ($encoding !== 'UTF-8') {
                        $value = mb_convert_encoding($value, 'UTF-8', $encoding ?: 'ISO-8859-1');
                    }
                }
            });

            return $userData;
        }
}
