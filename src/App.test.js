// Basic smoke test — verifies the app renders without crashing
import { render } from '@testing-library/react';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App';
import mathsData from './questionData/mathsData';
import englishData from './questionData/englishData';
import vrData from './questionData/vrData';

// Use a dummy key for testing — Clerk won't actually connect
const TEST_KEY = 'pk_test_dGVzdC10ZXN0LnRlc3QuY2xlcmsuYWNjb3VudHMuZGV2JA';

// Lazy-loaded data is passed in as a prop in production (see index.js).
// Recreate the shape here so App's destructure doesn't throw.
const loadedData = {
  maths: mathsData,
  english: englishData,
  verbalreasoning: vrData
};

test('renders without crashing', () => {
  expect(() =>
    render(
      <ClerkProvider publishableKey={TEST_KEY}>
        <App currentUser="TestUser" loadedData={loadedData} />
      </ClerkProvider>
    )
  ).not.toThrow();
});
