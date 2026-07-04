// preload.cjs
// Force prefers-reduced-motion to behave like "reduce: false" inside the renderer,
// so framer-motion animations are not suppressed.
(() => {
  const orig = window.matchMedia?.bind(window);

  if (!orig) return;

  window.matchMedia = (query) => {
    if (query === "(prefers-reduced-motion: reduce)") {
      return {
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      };
    }
    return orig(query);
  };
})();
