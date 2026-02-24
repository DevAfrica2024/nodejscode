import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { encryptData } from "../utils/crypto";
import { useCookies } from 'react-cookie';
import CryptoJS from 'crypto-js';



const AuthContext = createContext();
const authSessionKey = 'authKey';

export function AuthProvider({ children }) {
        const navigate = useNavigate();
        const [user, setUser] = useState([]);
        const [loading, setLoading] = useState(true);
        const [cookies,setCookies,removeCookies] = useCookies([authSessionKey]);
        const [companies, setCompanies] = useState([]);

       useEffect(() => {
        const initAuth = () => {
            const sessionToken = cookies[authSessionKey];
            const encryptedUser = localStorage.getItem('user_data');

            if (sessionToken && encryptedUser) {
                try {
                    const bytes = CryptoJS.AES.decrypt(
                        encryptedUser,
                        import.meta.env.VITE_CRYPTO_KEY
                    );

                    const decrypted = bytes.toString(CryptoJS.enc.Utf8);

                    if (!decrypted) throw new Error("Décryptage vide");

                    const userData = JSON.parse(decrypted);

                    setUser(userData);
                } catch (error) {
                    console.error('Erreur décryptage user:', error);

                    setUser(null);
                    removeCookies(authSessionKey, { path: '/' });
                    localStorage.removeItem('user_data');
                }
            } else {
                setUser(null);
            }

            setLoading(false);
        };

        initAuth();
        }, []);


           const saveSession = (token, userData) => {
            setCookies(authSessionKey, token, { path: '/' });

            const formattedUser = {
                ...userData,
                Picture: userData?.Picture
                    ? `data:image/jpeg;base64,${userData.Picture}`
                    : null,
            };

            const encryptedData = CryptoJS.AES.encrypt(
                JSON.stringify(formattedUser),
                import.meta.env.VITE_CRYPTO_KEY
            ).toString();

            localStorage.setItem('user_data', encryptedData);

            setUser(formattedUser);
        };
  

        const updateToken = (newToken)=>{   
                setCookies(authSessionKey, newToken, { path: '/'});
            }

        const signIn = async (email, code, password, loginMode) => {
            setLoading(true);

            try {
                const payload =
                    loginMode === 'email'
                        ? { loginMode: 'email', email, password }
                        : { loginMode: 'code', code, password };

                const response = await axios.post(
                    `${import.meta.env.VITE_BASE_URL}/login`,
                    payload
                );

                if (response.data.status === 200) {

                    const { accessible_companies, user } = response.data;

                    if (!accessible_companies || !user?.access_token) {
                            setLoading(false);
                            return { error: "Données invalides reçues du serveur" };
                        }


                    if(!accessible_companies || !user){
                        setLoading(false);
                        return { error: "Données de réponse manquantes" };
                    }

                    // 🔐 Sauvegarde companies encryptées
                    localStorage.setItem(
                        'accessible_companies',
                        encryptData(accessible_companies)
                    );

                    // 🔐 Sauvegarde token (SI TU EN AS BESOIN)
                    localStorage.setItem(
                        'token',
                        encryptData(user.access_token)
                    );

                    sessionStorage.setItem("isTabOpen", "true");

                    setCompanies(accessible_companies);

                    saveSession(user.access_token, user.user);

                    setLoading(false);
                    return { success: true };

                }

                if (response.data.status === 400) {
                    setLoading(false);
                    return { error: response.data.message };
                }

                setLoading(false);
                return { error: "Erreur inconnue" };

            } catch (err) {
                setLoading(false);
                console.error('Erreur lors de la connexion:', err.response?.data || err.message);
                return { error: "Erreur serveur",err };
            }
        };


    return (
        <AuthContext.Provider value={{ user, setUser, loading, setLoading, companies, updateToken,setCompanies, navigate, signIn }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}