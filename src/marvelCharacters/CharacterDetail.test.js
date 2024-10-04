import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import UserContext from '../auth/UserContext'; // Adjust based on your file structure
import CharacterDetail from './CharacterDetail';
import MarvelApi from '../api/marvelApi';
import ExpressApi from '../api/expessApi';

// Mock APIs
jest.mock('../api/marvelApi');
jest.mock('../api/expessApi');

describe('CharacterDetail', () => {
    const mockUser = { username: 'testUser', id: '123' };
    const characterHandle = 'character-handle';
    const mockCharacter = {
        id: '1',
        name: 'Character Name',
        thumbnail: { path: 'http://example.com/image', extension: 'jpg' },
        description: 'Character Description',
    };
    const mockComics = [
        { id: '101', title: 'Comic 1', thumbnail: { path: 'http://example.com/comic1', extension: 'jpg' }, urls: [{ url: 'http://example.com/comic1' }] },
        { id: '102', title: 'Comic 2', thumbnail: { path: 'http://example.com/comic2', extension: 'jpg' }, urls: [{ url: 'http://example.com/comic2' }] },
    ];

    beforeEach(() => {
        // Reset mocks before each test
        jest.clearAllMocks();

        // Mock API responses
        MarvelApi.getMarvelCharacterById.mockResolvedValue(mockCharacter);
        MarvelApi.getMarvelComicsByCharacterId.mockResolvedValue(mockComics);
        ExpressApi.getCurrentUserCharacter.mockResolvedValue([]);
    });

    const renderComponent = () => {
        return render(
            <UserContext.Provider value={{ currentUser: mockUser }}>
                <Router>
                    <CharacterDetail />
                </Router>
            </UserContext.Provider>
        );
    };

    test('renders character details after loading', async () => {
        renderComponent();

        // Wait for character details to load
        await waitFor(() => expect(screen.getByText(mockCharacter.name)).toBeInTheDocument());

        // Check character name and description
        expect(screen.getByText(mockCharacter.name)).toBeInTheDocument();
        expect(screen.getByText(mockCharacter.description)).toBeInTheDocument();

        // Check character image
        const characterImage = screen.getByAltText(mockCharacter.name);
        expect(characterImage).toHaveAttribute('src', `${mockCharacter.thumbnail.path}.${mockCharacter.thumbnail.extension}`);
    });

    test('displays alert on success', async () => {
        renderComponent();

        // Wait for character details to load
        await waitFor(() => expect(screen.getByText(mockCharacter.name)).toBeInTheDocument());

        // Simulate clicking the favorite character button
        fireEvent.click(screen.getByRole('button', { name: /favorite character/i }));

        // Mock successful saving
        ExpressApi.createCurrentUserCharacter.mockResolvedValueOnce();

        // Wait for success alert to appear
        await waitFor(() => {
            expect(screen.getByText('Added to Favorite !')).toBeInTheDocument();
        });
    });


    test('renders comics after loading', async () => {
        renderComponent();

        // Wait for character details to load
        await waitFor(() => expect(screen.getByText(mockCharacter.name)).toBeInTheDocument());

        // Check if comics are rendered
        expect(screen.getByText('Comic 1')).toBeInTheDocument();
        expect(screen.getByText('Comic 2')).toBeInTheDocument();

        // Check comic images
        expect(screen.getByAltText('Comic 1')).toHaveAttribute('src', `${mockComics[0].thumbnail.path}.${mockComics[0].thumbnail.extension}`);
        expect(screen.getByAltText('Comic 2')).toHaveAttribute('src', `${mockComics[1].thumbnail.path}.${mockComics[1].thumbnail.extension}`);
    });

    test('displays message when no comics are available', async () => {
        // Change the mock to return no comics
        MarvelApi.getMarvelComicsByCharacterId.mockResolvedValue([]);

        renderComponent();

        // Wait for character details to load
        await waitFor(() => expect(screen.getByText(mockCharacter.name)).toBeInTheDocument());

        // Check for no comics available message
        expect(screen.getByText('No comics available for this character.')).toBeInTheDocument();
    });
});
