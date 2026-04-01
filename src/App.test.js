// Basic smoke test — verifies the app renders without crashing
import { render } from '@testing-library/react';
import App from './App';

test('renders without crashing', () => {
  // App renders with localStorage state — just verify no throw
  expect(() => render(<App />)).not.toThrow();
});
