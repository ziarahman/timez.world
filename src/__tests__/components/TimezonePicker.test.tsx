import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TimezonePicker from '../../components/TimezonePicker';

describe('TimezonePicker search behaviour', () => {
  it('reveals Etc/GMT-5 when searching for UTC+5', async () => {
    const user = userEvent.setup();
    render(<TimezonePicker onSelect={jest.fn()} />);

    const input = screen.getByLabelText(/select or search for a city/i);
    await user.type(input, 'UTC+5');

    expect(await screen.findByRole('option', { name: /GMT\+5, TZ/i })).toBeInTheDocument();
  });

  it('shows GMT offset entries when searching for UTC', async () => {
    const user = userEvent.setup();
    render(<TimezonePicker onSelect={jest.fn()} />);

    const input = screen.getByLabelText(/select or search for a city/i);
    await user.type(input, 'UTC');

    expect(await screen.findByRole('option', { name: /GMT\+5, TZ/i })).toBeInTheDocument();
  });
});
