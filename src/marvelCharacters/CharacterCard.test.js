import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import UserContext from '../auth/UserContext'; 
import CharacterCard from './CharacterCard';

describe('CharacterCard', () => {
  const mockUser = { username: 'testUser' }; // Mock user context
  const characterProps = {
    name: 'Character Name',
    src: 'http://example.com/image.jpg',
    handle: 'character-handle',
  };

  const renderComponent = () => {
    return render(
      <UserContext.Provider value={{ currentUser: mockUser }}>
        <Router>
          <CharacterCard {...characterProps} />
        </Router>
      </UserContext.Provider>
    );
  };

  test('renders character name and image', () => {
    renderComponent();

    // Check if character name is rendered
    expect(screen.getByText(characterProps.name)).toBeInTheDocument();

    // Check if character image is rendered
    const image = screen.getByAltText(characterProps.name);
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', characterProps.src);
  });

  test('renders link with correct URL', () => {
    renderComponent();

    // Check if link is rendered
    const link = screen.getByRole('link', { name: characterProps.name });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', `/characters/${mockUser.username}/${characterProps.handle}`);
  });
});
