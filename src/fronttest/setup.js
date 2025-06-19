import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock global de matchMedia (utile si tu utilises Tailwind, MUI ou des médias queries)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // obsolète mais parfois utilisé
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Optionnel : mock localStorage si tu l’utilises
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => (store[key] = String(value)),
    removeItem: (key) => delete store[key],
    clear: () => (store = {}),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Optionnel : mock scrollTo pour éviter les erreurs si tu l’utilises
window.scrollTo = vi.fn();
