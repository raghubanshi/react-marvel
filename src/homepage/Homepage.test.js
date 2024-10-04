import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import UserContext from '../auth/UserContext'; // Ensure this path is correct
import Homepage from './Homepage';

// Mock the UserContext
const renderWithContext = (user) => {
    return render(
        <UserContext.Provider value={{ currentUser: user }}>
            <BrowserRouter>
                <Homepage />
            </BrowserRouter>
        </UserContext.Provider>
    );
};

describe('Homepage', () => {
    it('renders the welcome message when a user is logged in', () => {
        const user = { username: 'Bobby' }; // Mock user data

        renderWithContext(user);

        expect(screen.getByText(/Welcome Back, Bobby!/)).toBeInTheDocument();
        expect(screen.queryByText(/Log in/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/Sign up/i)).not.toBeInTheDocument();
    });

    it('renders login and signup buttons when no user is logged in', () => {
        renderWithContext(null); // No user

        expect(screen.getByText(/Log in/i)).toBeInTheDocument();
        expect(screen.getByText(/Sign up/i)).toBeInTheDocument();
        expect(screen.queryByText(/Welcome Back/i)).not.toBeInTheDocument();
    });
});
