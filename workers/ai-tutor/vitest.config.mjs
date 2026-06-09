import { cloudflareTest } from '@cloudflare/vitest-pool-workers';
import { defineConfig } from 'vitest/config';

// miniflare.bindings overrides wrangler.toml vars AND .dev.vars secrets.
// CLERK_DOMAIN must match the iss claim in test JWTs; .dev.vars has the prod
// value which would otherwise override wrangler.test.toml [vars].
// TEST_JWKS also goes here for the same reason (belt-and-braces).
import { TEST_PUBLIC_JWK } from './tests/test-keys.js';

const TEST_JWKS = JSON.stringify({ keys: [TEST_PUBLIC_JWK] });

export default defineConfig({
  plugins: [
    cloudflareTest({
      wrangler: { configPath: './wrangler.test.toml' },
      miniflare: {
        bindings: {
          CLERK_DOMAIN: 'test.clerk.11plus.dev',
          TEST_JWKS,
        },
      },
    }),
  ],
});
