import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  output: 'server',
  session: false,
  adapter: cloudflare({
    imageService: 'compile',
    prerenderEnvironment: 'node',
    remoteBindings: false,
  }),
  devToolbar: { enabled: false },
});
