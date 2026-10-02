import type { D1Migration } from '@cloudflare/vitest-pool-workers';

declare module 'cloudflare:test' {
  interface ProvidedEnv {
    DB: D1Database;
    ADMIN_SECRET: string;
    AI_DAILY_LIMIT: string;
    AI_ENABLED: string;
    TEST_MIGRATIONS: D1Migration[];
  }
}
