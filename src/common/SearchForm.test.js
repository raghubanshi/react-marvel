import { render, fireEvent, screen } from '@testing-library/react';
import SearchForm from './SearchForm';

describe('SearchForm Component', () => {
    test('renders the search input and submit button', () => {
        render(<SearchForm searchFor={() => { }} />);

        // Check if the input field is rendered
        const inputElement = screen.getByPlaceholderText('Enter search term..');
        expect(inputElement).toBeInTheDocument();

        // Check if the submit button is rendered
        const submitButton = screen.getByRole('button', { name: /Submit/i });
        expect(submitButton).toBeInTheDocument();
    });

    test('allows user to type in the input field', () => {
        render(<SearchForm searchFor={() => { }} />);

        // Get the input field and simulate typing
        const inputElement = screen.getByPlaceholderText('Enter search term..');
        fireEvent.change(inputElement, { target: { value: 'test search' } });

        // Check if the value is updated
        expect(inputElement).toHaveValue('test search');
    });

    test('calls searchFor with the correct search term when form is submitted', () => {
        const searchForMock = jest.fn();
        render(<SearchForm searchFor={searchForMock} />);

        const inputElement = screen.getByPlaceholderText('Enter search term..');
        const submitButton = screen.getByRole('button', { name: /Submit/i });

        // Simulate typing and form submission
        fireEvent.change(inputElement, { target: { value: 'test search' } });
        fireEvent.click(submitButton);

        // Ensure searchFor was called with the trimmed search term
        expect(searchForMock).toHaveBeenCalledWith('test search');
    });

    test('calls searchFor with undefined when the input is empty', () => {
        const searchForMock = jest.fn();
        render(<SearchForm searchFor={searchForMock} />);

        const submitButton = screen.getByRole('button', { name: /Submit/i });

        // Simulate submitting with an empty input
        fireEvent.click(submitButton);

        // Ensure searchFor was called with undefined
        expect(searchForMock).toHaveBeenCalledWith(undefined);
    });
});
