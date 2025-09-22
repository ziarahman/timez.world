import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TimezonePicker from '../components/TimezonePicker';

describe('TimezonePicker alias search', () => {
  it('surfaces America/Los_Angeles when searching for PST', async () => {
    const user = userEvent.setup();
    render(<TimezonePicker onSelect={jest.fn()} />);

    const input = screen.getByLabelText(/select or search for a city/i);
    await user.type(input, 'PST');

    const matches = await screen.findAllByText(/America\/Los_Angeles/i);
    expect(matches.length).toBeGreaterThan(0);
  });

  it('surfaces America/New_York when searching for EDT', async () => {
    const user = userEvent.setup();
    render(<TimezonePicker onSelect={jest.fn()} />);

    const input = screen.getByLabelText(/select or search for a city/i);
    await user.type(input, 'EDT');

    const matches = await screen.findAllByText(/America\/New_York/i);
    expect(matches.length).toBeGreaterThan(0);
  });
});
