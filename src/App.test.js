// Basic smoke test — verifies the app renders without crashing
import { render } from '@testing-library/react';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App';

// Use a dummy key for testing — Clerk won't actually connect
const TEST_KEY = 'pk_test_dGVzdC10ZXN0LnRlc3QuY2xlcmsuYWNjb3VudHMuZGV2JA';

test('renders without crashing', () => {
  expect(() =>
    render(
      <ClerkProvider publishableKey={TEST_KEY}>
        <App currentUser="TestUser" />
      </ClerkProvider>
    )
  ).not.toThrow();
});
