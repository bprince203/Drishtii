/**
 * Clerk Authentication Middleware — Prajnaa
 * Uses @clerk/express to verify JWTs and attach auth to req.
 */

const { clerkMiddleware, requireAuth: clerkRequireAuth } = require('@clerk/express');

/**
 * Global Clerk middleware — parses auth from every request (non-blocking).
 * Mount this ONCE via app.use() before routes.
 */
const clerkAuth = clerkMiddleware();

/**
 * Route-level guard — returns 401 if no valid auth token present.
 * Usage: router.post('/register', requireAuth, handler)
 */
function requireAuth(req, res, next) {
  // clerkMiddleware populates req.auth — check if userId exists
  if (!req.auth || !req.auth.userId) {
    return res.status(401).json({
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authentication required. Please sign in.',
      },
    });
  }
  next();
}

module.exports = { clerkAuth, requireAuth };
