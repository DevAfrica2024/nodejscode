<?php

namespace App\Services;

use Firebase\JWT\JWT;
use Illuminate\Support\Facades\Log;

class JwtService
{
    // Algorithme et expiration
    private const JWT_ALGORITHM = 'HS256';
    private const JWT_EXPIRATION = 604800; // 1 semaine en secondes

    protected string $jwtSecret;

    /**
     * JwtService constructor.
     */
    public function __construct()
    {
        $this->jwtSecret = 'ad281f29972b56674eed41547f50d9eed78491ea2c70db7e119273f0e962d1e6';

        if (!$this->jwtSecret) {
            Log::error('JWT secret is not set in config/services.php!');
            throw new \Exception('JWT secret not configured.');
        }
    }

    /**
     * Génère un JWT pour un utilisateur et une compagnie donnée
     *
     * @param  object|\App\Models\User $user
     * @param  string|int|null $companyId
     * @return string
     */
    public function generateJWT(object $user, string|int|null $companyId = null): string
    {
        // Debug log pour vérifier les valeurs
        // Log::info('JWT service generate called', [
        //     'user_id' => $user->Customers_Numbers ?? null,
        //     'companyId' => $companyId
        // ]);

        $issuedAt = time();

        // Construire le payload
        $payload = [
            'iss' => 'az-connect-backend',
            'sub' => $user->Customers_Numbers,
            'iat' => $issuedAt,
            'exp' => $issuedAt + self::JWT_EXPIRATION,
            'companyid' => $companyId,
            'user' => [
                'id' => $user->Customers_Numbers,
                //'name' => $user->Names ?? null . ' ' . $user->LastName ?? null
            ]
        ];

        //Log::info('JWT payload', $payload);

        // Retourner le token encodé
        return JWT::encode($payload, $this->jwtSecret, self::JWT_ALGORITHM);
    }
}
