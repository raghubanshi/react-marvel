import { render, screen } from '@testing-library/react';
import LoadingSpinner from './LoadingSpinner';

describe('LoadingSpinner Component', () => {
  test('renders LoadingSpinner component with correct text', () => {
    render(<LoadingSpinner />);

    // Check if the spinner text is present in the document
    const spinnerElement = screen.getByText(/Loading/i);
    expect(spinnerElement).toBeInTheDocument();
  });

  test('contains the correct class name', () => {
    const { container } = render(<LoadingSpinner />);

    // Check if the component has the class 'LoadingSpinner'
    expect(container.firstChild).toHaveClass('LoadingSpinner');
  });
});
