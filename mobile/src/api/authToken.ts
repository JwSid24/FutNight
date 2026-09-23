// Modul-lokal holder for JWT'et, så API-klienten kan sætte Authorization-headeren.
export const TOKEN_KEY = 'futnight.token';

let token: string | null = null;

export const setAuthToken = (t: string | null) => {
  token = t;
};

export const getAuthToken = () => token;
