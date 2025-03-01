//https://nitro.unjs.io/config
export default defineNitroConfig({
  srcDir: "server",
  compatibilityDate: "2025-02-24",
  routeRules: {
    '/api/user/**': { cors: true, headers: { 'access-control-allow-methods': 'POST' } },
    '/api/dashboard/**': { cors: true, headers: { 'access-control-allow-methods': 'POST, GET' } },
    '/api/admin/**': { cors: true, headers: { 'access-control-allow-methods': 'POST, GET' } },
    '/api/dormitory/**': { cors: true, headers: { 'access-control-allow-methods': 'POST, GET' } }
  }
});