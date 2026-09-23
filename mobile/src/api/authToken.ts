// Modul-lokal holder for JWT'et, så API-klienten kan sætte Authorization-headeren.
export const TOKEN_KEY = 'futnight.token';

let token: string | null = null;
let onUnauthorized: (() => void) | null = null;

export const setAuthToken = (t: string | null) => {
  token = t;
};

export const getAuthToken = () => token;

// AuthProvider registrerer en handler her, så et 401 fra et beskyttet endpoint kan logge ud.
export const setOnUnauthorized = (fn: (() => void) | null) => {
  onUnauthorized = fn;
};

export const notifyUnauthorized = () => {
  onUnauthorized?.();
};
