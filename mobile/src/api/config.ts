// Backendens adresse. Overstyres med EXPO_PUBLIC_API_URL (fx din LAN-IP ved test på telefon).
// Standard: lokal udvikling på http://localhost:5080.
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:5080';
