import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FavoriteCharacters from './FavoriteCharacters';
import UserContext from '../auth/UserContext';
import ExpressApi from '../api/expessApi';

// Mocking the ExpressApi methods
jest.mock('../api/expessApi', () => ({
    getCurrentUserCharacter: jest.fn(),
    removeCurrentUserCharacter: jest.fn(),
}));

// Mocking UserContext
const mockUserContext = {
    currentUser: {
        username: 'testuser',
        id: '123',
    },
};

describe('FavoriteCharacters', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Clear mocks before each test
    });

    it('renders loading spinner initially', () => {
        // Mock the API call to return a pending promise
        ExpressApi.getCurrentUserCharacter.mockReturnValue(new Promise(() => { }));

        render(
            <UserContext.Provider value={mockUserContext}>
                <FavoriteCharacters />
            </UserContext.Provider>
        );

        // Expect the loading spinner to be displayed
        expect(screen.getByText(/Loading .../i)).toBeInTheDocument();
    });

    it('displays characters after loading', async () => {
        const mockCharacters = [
            {
                character_id: '1',
                name: 'Character 1',
                image: 'http://example.com/image1.jpg',
                description: 'Description 1',
            },
            {
                character_id: '2',
                name: 'Character 2',
                image: 'http://example.com/image2.jpg',
                description: 'Description 2',
            },
        ];

        // Mock API to return characters
        ExpressApi.getCurrentUserCharacter.mockResolvedValue(mockCharacters);

        render(
            <UserContext.Provider value={mockUserContext}>
                <FavoriteCharacters />
            </UserContext.Provider>
        );

        // Wait for characters to be rendered
        await waitFor(() => {
            expect(screen.getByText('Character 1')).toBeInTheDocument();
            expect(screen.getByText('Character 2')).toBeInTheDocument();
        });
    });

    it('displays no favorite character message when no characters are available', async () => {
        ExpressApi.getCurrentUserCharacter.mockResolvedValue([]);

        render(
            <UserContext.Provider value={mockUserContext}>
                <FavoriteCharacters />
            </UserContext.Provider>
        );

        // Wait for the "No Favorite Character" message to appear
        await waitFor(() => {
            expect(screen.getByText(/No Favorite Character/i)).toBeInTheDocument();
        });
    });
});
