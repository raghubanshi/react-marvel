import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import MarvelApi from '../api/marvelApi';
import ExpressApi from '../api/expessApi';
import LoadingSpinner from '../common/LoadingSpinner';
import UserContext from '../auth/UserContext';
import Alert from '../common/Alert';
import './CharacterDetail.css';

const CharacterDetail = () => {

    const { currentUser } = useContext(UserContext);

    const { handle } = useParams();
    console.debug("CharacterDetail", "handle=", handle);

    const [character, setCharacter] = useState(null);
    const [comics, setComics] = useState([]);
    const [isLoadingComics, setIsLoadingComics] = useState(true); // Track comics loading state
    const [favoriteSaveError, setFavoriteSaveError] = useState([]);
    const [saveSucess, setsaveSucess] = useState(false);

    useEffect(function getMarvelCharacter() {
        async function getCharacter() {
            const data = await MarvelApi.getMarvelCharacterById(handle);
            setCharacter(data);
            // Fetch comics and update the state
            const comicsData = await MarvelApi.getMarvelComicsByCharacterId(handle);
            setComics(comicsData);
            setIsLoadingComics(false); // Comics finished loading
        }
        getCharacter();
    }, [handle]);

    if (!character) return <LoadingSpinner />;

    function favoriteCharcter() {
        const data = {}
        data.characterId = character?.id;
        data.name = character?.name;
        data.image = `${character?.thumbnail?.path}.${character?.thumbnail?.extension}`
        data.description = character?.description
        data.userId = currentUser?.id

        async function saveToDb() {
            try {
                await ExpressApi.createCurrentUserCharacter(currentUser.username, data.characterId, data)
                setsaveSucess(true);

            }
            catch (e) {
                setsaveSucess(false);
                setFavoriteSaveError(e);
            }

        }

        saveToDb();
    }

    return (
        <div className='CharacterDetail container'>

            {saveSucess
                ? <Alert type="success" messages={["Added to Favorite !"]} />
                : null}
            {favoriteSaveError.length
                ? <Alert type="danger" messages={favoriteSaveError} />
                : null}

            <h1 className='my-2'>{character.name}</h1>
            <div className='row align-items-center'>
                <div className='col-md-8'>
                    <img className='main-img'
                        src={`${character.thumbnail.path}.${character.thumbnail.extension}`}
                        alt={character.name}
                    />
                </div>
                <div className='col-md-4'>
                    <button type="button" className="btn btn-info" onClick={favoriteCharcter}>Favorite Character</button>
                </div>
            </div>
            <p className='my-4'>{character.description}</p>

            {/* Display loading spinner or comics based on the loading state */}
            {isLoadingComics ? (
                <LoadingSpinner />
            ) : (
                <div className="row comics-container my-4">
                    {comics.length > 0 ? (
                        comics.map(c => (
                            <div key={c.id} className="comic-card col-md-4">
                                <Link to={c?.urls[0]?.url} target='_blank'>
                                    <img
                                        src={`${c.thumbnail.path}.${c.thumbnail.extension}`}
                                        alt={c.title}
                                        className="comic-thumbnail"
                                    />
                                </Link>
                                <h5 className="comic-title my-2">{c.title}</h5>
                            </div>
                        ))
                    ) : (
                        <p className='my-2'>No comics available for this character.</p>
                    )}
                </div>
            )}
        </div>
    );
}

export default CharacterDetail;
