// Sesión del panel: cookie firmada con HMAC-SHA256 (funciona en middleware y en el servidor).
export const SESSION_COOKIE = "pl_admin";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 días, en segundos

const encoder = new TextEncoder();

function getSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("AUTH_SECRET debe estar definido y tener al menos 32 caracteres.");
  }
  return secret;
}

async function sign(value: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(value)));
  return btoa(String.fromCharCode(...signature)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function createSessionToken() {
  const payload = `admin.${Date.now() + SESSION_MAX_AGE * 1000}`;
  return `${payload}.${await sign(payload)}`;
}

export async function verifySessionToken(token: string | undefined) {
  if (!token) return false;
  const lastDot = token.lastIndexOf(".");
  if (lastDot === -1) return false;
  const payload = token.slice(0, lastDot);
  const expiresAt = Number(payload.split(".")[1]);
  if (!Number.isFinite(expiresAt) || expiresAt < Date.now()) return false;
  try {
    return safeEqual(token.slice(lastDot + 1), await sign(payload));
  } catch {
    return false;
  }
}

export async function credentialsMatch(user: string, password: string) {
  const expectedUser = process.env.ADMIN_USER;
  const expectedPassword = process.env.ADMIN_PASSWORD;
  if (!expectedUser || !expectedPassword) return false;
  // Se comparan firmas de igual largo para no filtrar información por tiempo.
  const [a, b, c, d] = await Promise.all([
    sign(user),
    sign(expectedUser),
    sign(password),
    sign(expectedPassword),
  ]);
  return safeEqual(a, b) && safeEqual(c, d);
}
