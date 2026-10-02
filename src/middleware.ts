import { defineMiddleware } from 'astro:middleware';

const canonicalHost = 'cyberdeceptionatlas.org';

export const onRequest = defineMiddleware(async ({ request }, next) => {
  const url = new URL(request.url);
  if (
    url.hostname === 'cyberdeceptionatlas.com' ||
    url.hostname === 'www.cyberdeceptionatlas.com' ||
    url.hostname === 'www.cyberdeceptionatlas.org'
  ) {
    url.protocol = 'https:';
    url.hostname = canonicalHost;
    url.port = '';
    return Response.redirect(url, 301);
  }
  return next();
});
