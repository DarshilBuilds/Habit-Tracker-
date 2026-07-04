// preload.cjs
// Force prefers-reduced-motion to behave like "reduce: false" inside the renderer,
// so framer-motion animations are not suppressed in Electron.
(() => {
  const createMediaQueryList = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });

  const originalMatchMedia = window.matchMedia?.bind(window);

  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: (query) => {
      if (query === '(prefers-reduced-motion: reduce)') {
        return createMediaQueryList(query);
      }

      if (typeof originalMatchMedia === 'function') {
        return originalMatchMedia(query);
      }

      return createMediaQueryList(query);
    },
  });
})();
