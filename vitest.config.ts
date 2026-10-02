import path from 'node:path';
import { cloudflareTest, readD1Migrations } from '@cloudflare/vitest-pool-workers';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [
    cloudflareTest(async () => ({
      miniflare: {
        // Pinned to the newest date supported by the pool's bundled workerd.
        compatibilityDate: '2026-08-22',
        compatibilityFlags: ['nodejs_compat'],
        d1Databases: ['DB'],
        bindings: {
          ADMIN_SECRET: 'test-editor-secret-that-is-at-least-32-characters',
          AI_DAILY_LIMIT: '40',
          AI_ENABLED: 'true',
          TEST_MIGRATIONS: await readD1Migrations(path.join(import.meta.dirname, 'migrations')),
        },
      },
    })),
  ],
  test: {
    exclude: [
      'experiments/reporting-schema-study-v1/**/*.test.mjs',
      'experiments/reporting-schema-machine-v1/**/*.test.mjs',
      'node_modules/**',
      'artifacts/**',
    ],
    setupFiles: ['./test/apply-migrations.ts'],
  },
});
