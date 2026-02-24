<?php

namespace App\Http\Middleware;

use Closure;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Config;
use Symfony\Component\HttpFoundation\Response;

class JwtAuth
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
     public function handle($request, Closure $next)
        {
             $header = $request->header('Authorization');

             //Log::info("Company ID in Middleware:", ['company_id' => $companyId]);

            if (!$header) {
                return response()->json(['message' => 'Token manquant'], 401);
            }

            $token = str_replace('Bearer ', '', $header);

            try {
                $decoded = JWT::decode($token,
                new Key('ad281f29972b56674eed41547f50d9eed78491ea2c70db7e119273f0e962d1e6', 'HS256'));
            } catch (\Exception $e) {
                return response()->json(['message' => 'Token invalide'], 401);
            }

            //Log::info("Decoder ",[$decoded]);

            $request->attributes->add([
                'jwt_user_id'   => $decoded->sub,
                'jwt_company_id'=> $decoded->company_id ?? null,
            ]);

            $db_name = Company::with('user')
                    ->where('company_number', $decoded->companyid)
                // ->where('employee_number', $userId)
                    ->first();
             // Log::info("DB Name from Middleware:", ['db_name' => $db_name] );
            session([
               'company_name' => $db_name->user->Names,
               'company_db'=> $db_name->user->customer_db,
            ]);

                //Log::info("DB Name from Middleware:", ['db_name' =>session('company_db') ]);
            // 🔹 Connexion dynamique à la DB tenant
            if ($db_name) {

                Config::set('database.connections.mysql2.database', $db_name->user->customer_db);
                DB::setDefaultConnection('mysql2');

                DB::purge('mysql2');
                DB::connection('mysql2')->getPdo();
                // DB::reconnect('tenant');
                // DB::setDefaultConnection('tenant');
            }

            return $next($request);
        }
}
