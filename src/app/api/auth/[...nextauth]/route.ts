/**
 * NextAuth.js v5 API Route Handler
 * Handles all authentication requests (sign in, sign out, callbacks, etc.)
 */

import { handlers } from '@/auth';

// Export handlers for GET and POST requests
export const { GET, POST } = handlers;
