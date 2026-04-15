// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Required by useD1Data's module-level API_URL const so the real hook can
// exercise its flush path in integration tests. Tests that do NOT pass a
// getToken still short-circuit out of flushQueue (it checks !getToken),
// so this env var is safe for all existing tests.
process.env.REACT_APP_TUTOR_API_URL = 'http://test-worker.local';
