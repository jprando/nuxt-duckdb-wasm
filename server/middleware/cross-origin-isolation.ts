export default defineEventHandler((event) => {
  setResponseHeaders(event, {
    "Cross-Origin-Opener-Policy": "same-origin",
    "Cross-Origin-Embedder-Policy": "require-corp"
  });
});
