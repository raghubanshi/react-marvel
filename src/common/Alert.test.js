import { render, screen } from '@testing-library/react';
import Alert from './Alert';

describe('Alert Component', () => {

    test('renders with default danger type and displays messages', () => {
        const messages = ["Error 1", "Error 2"];

        render(<Alert messages={messages} />); // 'type' defaults to 'danger'

        // Check if messages are rendered
        messages.forEach(message => {
            expect(screen.getByText(message)).toBeInTheDocument();
        });

        // Check if the alert type is set to danger by default
        const alertElement = screen.getByRole('alert');
        expect(alertElement).toHaveClass('alert-danger');
    });

    test('renders with a different type when provided', () => {
        const messages = ["Warning message"];

        render(<Alert type="warning" messages={messages} />);

        // Check if the message is rendered
        expect(screen.getByText(messages[0])).toBeInTheDocument();

        // Check if the alert type is set to warning
        const alertElement = screen.getByRole('alert');
        expect(alertElement).toHaveClass('alert-warning');
    });

    test('renders with no messages', () => {
        render(<Alert messages={[]} />);

        // Check if the alert element is still rendered even with an empty message list
        const alertElement = screen.getByRole('alert');
        expect(alertElement).toBeInTheDocument();
    });
});
