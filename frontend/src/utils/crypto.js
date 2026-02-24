import CryptoJS from "crypto-js";

const SECRET_KEY = import.meta.env.VITE_CRYPTO_KEY;


export const encryptData = (data) => {
  if (data === undefined || data === null) {
    console.error("encryptData: data invalide", data);
    return null;
  }

  if (!SECRET_KEY) {
    console.error("SECRET_KEY manquante - vérifiez VITE_CRYPTO_KEY dans .env");
    return null;
  }

  try {
    const stringData =
      typeof data === "string" ? data : JSON.stringify(data);

    return CryptoJS.AES.encrypt(stringData, SECRET_KEY).toString();
  } catch (error) {
    console.error("Erreur encryptData:", error);
    return null;
  }
};

export const decryptData = (cipherText) => {
  if (!cipherText || !SECRET_KEY) {
    return null;
  }

  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);

    if (!decrypted) return null;

    return JSON.parse(decrypted);
  } catch (error) {
    console.error("Decrypt error:", error);
    return null;
  }
};

