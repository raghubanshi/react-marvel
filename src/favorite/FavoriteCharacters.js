import React, { useContext, useEffect, useState } from 'react';
import UserContext from '../auth/UserContext';
import { useParams } from 'react-router-dom';
import ExpressApi from '../api/expessApi';
import LoadingSpinner from '../common/LoadingSpinner';
import './FavoriteCharacters.css';

const FavoriteCharacters = () => {
    const { currentUser } = useContext(UserContext);
    const { handle } = useParams();
    const [characters, setCharacters] = useState(null);
    const [toastMessage, setToastMessage] = useState(""); // New state for toast message

    const getCharacters = async () => {
        const userCharacters = await ExpressApi.getCurrentUserCharacter(currentUser.username, handle);
        setCharacters(userCharacters);
    };

    useEffect(() => {
        getCharacters();
    }, [handle]);

    // Loading state
    if (characters === null) return <LoadingSpinner />;

    function removeCharacter(characterId, characterName) {
        const data = {};
        data.userId = currentUser?.id;
        data.characterId = characterId;

        async function saveToDb() {
            try {
                await ExpressApi.removeCurrentUserCharacter(currentUser.username, data.characterId, data);

                // Refresh the character list
                await getCharacters();

                // Update toast message and timestamp with character name
                setToastMessage(`${characterName} removed successfully.`);

                // Ensure the toast element exists before showing it
                setTimeout(() => {
                    const toastElement = document.getElementById("liveToast");
                    if (toastElement) {
                        const toast = new window.bootstrap.Toast(toastElement);
                        toast.show();
                    }
                }, 100); // Slight delay to ensure DOM updates
            } catch (e) {
                console.error(e);
            }
        }

        saveToDb();
    }

    return (
        <div className='container'>
            {/* Toast Container should always be rendered */}
            <div className='toast-container position-fixed bottom-0 end-0 p-3'>
                <div
                    id='liveToast'
                    className='toast'
                    role='alert'
                    aria-live='assertive'
                    aria-atomic='true'
                    data-bs-autohide='false'
                >
                    <div className='toast-header'>
                        <strong className='me-auto'>Notification</strong>
                        <button
                            type='button'
                            className='btn-close'
                            data-bs-dismiss='toast'
                            aria-label='Close'
                        ></button>
                    </div>
                    <div className='toast-body'>
                        {toastMessage}
                    </div>
                </div>
            </div>

            {/* If no characters, show 'No data' */}
            {characters.length === 0 ? (
                <div className='alert alert-info text-center my-4' role='alert'>
                    No Favorite Character
                </div>
            ) : (
                <div className='row favoriteCard'>
                    {characters.map(c => (
                        <div className='CharacterCard card col-md-4' key={c.character_id}>
                            <div className='card-body'>
                                <h6 className='card-title'>{c.name}</h6>
                                <img src={c.image} alt={c.name} className='float-right ml-5' />

                                <button
                                    className='btn btn-danger mx-4 my-2'
                                    id='liveToastBtn'
                                    onClick={() => removeCharacter(c.character_id, c.name)}
                                >
                                    remove
                                </button>

                                <p className='collapse-description'>
                                    <button
                                        className='btn btn-primary'
                                        type='button'
                                        data-bs-toggle='collapse'
                                        data-bs-target={`#${c.character_id}Exp`}
                                        aria-expanded='false'
                                        aria-controls={`${c.character_id}Exp`}
                                    >
                                        {c.name} Description
                                    </button>
                                </p>
                                <div className='collapse' id={`${c.character_id}Exp`}>
                                    <div className='card card-body'>
                                        {c.description ? <p>{c.description}</p> : 'No Description Available.'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FavoriteCharacters;
