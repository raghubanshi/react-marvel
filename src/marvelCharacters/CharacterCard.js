import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import UserContext from "../auth/UserContext";
import "./CharacterCard.css";

const CharacterCard = ({ name, src, handle }) => {
  const { currentUser } = useContext(UserContext);
  
  return (
    <div className='CharacterCard card col-md-6'>
      <div className='card-body'>
        <h6 className="card-title">
          {name}
        </h6>
        {/* Only the image is clickable */}
        <Link to={`/characters/${currentUser.username}/${handle}`}>
          <img
            src={src}
            alt={name}
            className="float-right ml-5"
          />
        </Link>
      </div>
    </div>
  );
}

export default CharacterCard