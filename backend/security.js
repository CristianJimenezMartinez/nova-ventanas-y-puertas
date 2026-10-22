/**
 * ============================================================================
 * NOVA SECURITY MODULE — Cifrado scrypt, JWT HMAC-SHA256, Rate Limit y CORS
 * ============================================================================
 */
const crypto = require('crypto');

const JWT_SECRET =
  process.env.JWT_SECRET || 'NovaSoto2026_UltraSecretKey_HMAC_SHA256_Production!';
const ALLOWED_ORIGINS = new Set([
  'https://novaventanasypuertas.com',
  'https://www.novaventanasypuertas.com',
  'https://portal.novaventanasypuertas.com',
  'http://localhost:4200'
]);

const rateLimitStore = new Map();

function hashPassword(plainPassword) {
  const salt = crypto.randomBytes(16).toString('hex');
  const derived = crypto.scryptSync(String(plainPassword), salt, 64).toString('hex');
  return `scrypt:${salt}:${derived}`;
}

function verifyPassword(plainPassword, storedValue) {
  if (!storedValue) return false;
  const input = String(plainPassword || '');
  if (storedValue.startsWith('scrypt:')) {
    const parts = storedValue.split(':');
    if (parts.length !== 3) return false;
    const salt = parts[1];
    const originalHex = parts[2];
    const derivedBuf = crypto.scryptSync(input, salt, 64);
    const originalBuf = Buffer.from(originalHex, 'hex');
    if (derivedBuf.length !== originalBuf.length) return false;
    return crypto.timingSafeEqual(derivedBuf, originalBuf);
  }
  const a = Buffer.from(input);
  const b = Buffer.from(String(storedValue));
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

function base64UrlEncode(objOrStr) {
  const str = typeof objOrStr === 'string' ? objOrStr : JSON.stringify(objOrStr);
  return Buffer.from(str)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function signJwtToken(payload) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const nowSec = Math.floor(Date.now() / 1000);
  const fullPayload = {
    ...payload,
    iat: nowSec,
    exp: nowSec + 60 * 60 * 12 // 12 horas de validez
  };
  const unsigned = `${base64UrlEncode(header)}.${base64UrlEncode(fullPayload)}`;
  const sig = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(unsigned)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
  return `${unsigned}.${sig}`;
}

function verifyJwtToken(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [h, p, s] = parts;
  const expectedSig = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${h}.${p}`)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  const bufA = Buffer.from(s);
  const bufB = Buffer.from(expectedSig);
  if (bufA.length !== bufB.length || !crypto.timingSafeEqual(bufA, bufB)) {
    return null;
  }

  try {
    const decoded = JSON.parse(Buffer.from(p, 'base64').toString('utf8'));
    if (decoded.exp && Math.floor(Date.now() / 1000) > decoded.exp) {
      return null;
    }
    return decoded;
  } catch {
    return null;
  }
}

function checkRateLimit(ip, bucketName, maxRequestsPerMin = 20) {
  const now = Date.now();
  const key = `${bucketName}:${ip || 'unknown'}`;
  const entry = rateLimitStore.get(key);
  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + 60000 });
    return true;
  }
  if (entry.count >= maxRequestsPerMin) {
    return false;
  }
  entry.count += 1;
  return true;
}

function getSecurityHeaders(reqOrigin) {
  const allowOrigin =
    reqOrigin && ALLOWED_ORIGINS.has(reqOrigin)
      ? reqOrigin
      : 'https://novaventanasypuertas.com';
  return {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Tenant-Id',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
  };
}

function resolveAuthorizedTenant(authPayload, requestedTenantHeader, fallbackTenant) {
  const requested = String(requestedTenantHeader || fallbackTenant || 'tenant-nova-soto').replace(
    /[^a-zA-Z0-9_-]/g,
    ''
  );
  if (!authPayload) return requested;
  // Solo SUPERADMIN (Central Grupo Soto) puede cambiar libremente entre empresas/franquicias
  if (authPayload.role === 'SUPERADMIN') {
    return requested || authPayload.tenantId;
  }
  return authPayload.tenantId || requested;
}

module.exports = {
  hashPassword,
  verifyPassword,
  signJwtToken,
  verifyJwtToken,
  checkRateLimit,
  getSecurityHeaders,
  resolveAuthorizedTenant
};
