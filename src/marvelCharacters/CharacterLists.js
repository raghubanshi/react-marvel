import React, { useEffect, useState } from 'react';
import MarvelApi from '../api/marvelApi';
import LoadingSpinner from '../common/LoadingSpinner';
import CharacterCard from './CharacterCard';
import SearchForm from '../common/SearchForm';

const CharacterLists = () => {

    const [marvelChar, SetMarvelChar] = useState(null);
    let [offset, SetOffset] = useState(0);
    const [isLoadingMore, setIsLoadingMore] = useState(false); // State to track loading more
    const [hasSerached, SetHasSearched] = useState(false);

    useEffect(function loadMarvelData() {
        async function marvel() {
            let data = await MarvelApi.getMarvelCharacters();
            SetMarvelChar(data);
        }
        marvel();
    }, []);

    /** Triggered by search form submit; reloads companies. */
    async function search(name) {
        let data = await MarvelApi.getMarvelCharacterByName(name);
        SetMarvelChar(data);
        SetHasSearched(true);
    }

    /** Load more characters */
    async function more() {
        setIsLoadingMore(true); // Show loading spinner
        SetMarvelChar(null);
        const newOffset = offset + 20; // Calculate the new offset
        SetOffset(newOffset);          // Update state with the new offset
        let data = await MarvelApi.getMarvelCharactersByOffset(newOffset); // Use the new offset directly
        SetMarvelChar(data); // new characters to the current list
        setIsLoadingMore(false); // Hide loading spinner
        SetHasSearched(false);
    }

    if (!marvelChar) return <LoadingSpinner />;


    return (
        <div className='container'>
            <SearchForm searchFor={search} />
            <div className="MarvelList row">
                {marvelChar.map(c => (
                    <CharacterCard
                        key={c.id}
                        handle={c.id}
                        name={c.name}
                        src={`${c.thumbnail.path}.${c.thumbnail.extension}`}
                    />
                ))}
            </div>
            {marvelChar.length > 19 && (
                <div>
                    {isLoadingMore ? (
                        <LoadingSpinner /> // Show spinner while loading
                    ) : (hasSerached ? ("") : (<button onClick={more} className="btn btn-lg btn-primary my-3">More</button>)

                    )}
                </div>
            )}
        </div>
    )
}

export default CharacterLists

