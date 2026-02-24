<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vérification de votre compte</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa;">
    <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

        <!-- Header -->
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center; color: #ffffff;">
            <h1 style="margin: 0; font-size: 28px; font-weight: 600;">🔐 Vérification de Compte</h1>
        </div>

        <!-- Content -->
        <div style="padding: 40px 30px;">
            <p style="font-size: 18px; color: #333333; margin-bottom: 20px;">
                Bonjour / Bonsoir <strong>{{ $name }} {{ $lastname }}</strong>,
            </p>

            <p style="font-size: 16px; color: #555555; line-height: 1.6; margin-bottom: 30px;">
                Nous avons reçu une demande de vérification pour votre compte.
                Pour continuer, veuillez utiliser le code de vérification ci-dessous ou cliquer sur le bouton de vérification.
            </p>

            <!-- OTP Code -->
            <div style="text-align: center; margin: 30px 0;">
                <p style="font-size: 14px; color: #888888; margin-bottom: 10px;">Votre code de vérification :</p>
                <div style="display: inline-block; padding: 20px 40px; background-color: #f8f9fa; border: 3px dashed #667eea; border-radius: 8px; margin: 15px 0;">
                    <div style="font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                        {{ $code }}
                    </div>
                </div>
                <p style="font-size: 14px; color: #888888; margin-top: 10px;">Ce code expire dans 10 minutes</p>
            </div>

            <div style="height: 1px; background-color: #e0e0e0; margin: 30px 0;"></div>

            <!-- Verify Button -->
            <div style="text-align: center; margin: 30px 0;">
                <a href="{{ $link }}?email={{ $mail }}" style="display: inline-block; padding: 14px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: 600;">
                    Vérifier mon compte
                </a>
            </div>

            <!-- Note -->
            <div style="font-size: 14px; color: #888888; background-color: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; border-radius: 4px; margin: 20px 0;">
                <strong>⚠️ Important :</strong> Si vous n'avez pas demandé cette vérification,
                veuillez ignorer cet email et contacter notre support immédiatement.
            </div>

            <p style="font-size: 16px; color: #555555; line-height: 1.6; margin-top: 30px;">
                Cordialement,<br>
                <strong>L'équipe Entreprise</strong>
            </p>
        </div>

        <!-- Footer -->
        <div style="background-color: #f8f9fa; padding: 30px; text-align: center; font-size: 14px; color: #888888;">
            <p style="margin: 0 0 10px 0;">© 2024 Entreprise. Tous droits réservés.</p>
            <p style="margin: 10px 0;">
                <a href="#" style="color: #667eea; text-decoration: none;">Politique de confidentialité</a> |
                <a href="#" style="color: #667eea; text-decoration: none;">Conditions d'utilisation</a> |
                <a href="#" style="color: #667eea; text-decoration: none;">Support</a>
            </p>
            {{-- <p style="margin-top: 15px; font-size: 12px;">
             123 Rue de l'Exemple, 75001 Paris, France
            </p> --}}
        </div>
    </div>
</body>
</html>
