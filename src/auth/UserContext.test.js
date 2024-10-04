import { render, screen } from '@testing-library/react';
import UserContext from './UserContext';

// A mock component that consumes the UserContext
const MockComponent = () => {
    return (
        <UserContext.Consumer>
            {(value) => (
                <div>
                    {value ? `User: ${value.username}` : 'No User'}
                </div>
            )}
        </UserContext.Consumer>
    );
};

describe('UserContext', () => {
    test('provides default value when no user is present', () => {
        render(
            <UserContext.Provider value={null}>
                <MockComponent />
            </UserContext.Provider>
        );

        // Verify that "No User" is displayed when no user is provided
        expect(screen.getByText('No User')).toBeInTheDocument();
    });

    test('provides user data correctly', () => {
        const user = { username: 'testuser' };

        render(
            <UserContext.Provider value={user}>
                <MockComponent />
            </UserContext.Provider>
        );

        // Verify that the correct user information is displayed
        expect(screen.getByText('User: testuser')).toBeInTheDocument();
    });
});
