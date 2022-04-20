import { render } from '@testing-library/react';

import App from '../App';

test('renders learn react link', () => {
  const { getByText } = render(<App />);
  const element = getByText(/Tango/i);
  expect(element).toBeInTheDocument();
});
