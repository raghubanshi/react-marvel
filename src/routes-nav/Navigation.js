import React, { useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import UserContext from '../auth/UserContext';
import "./Navigation.css";

const Navigation = ({ logout }) => {
    const { currentUser } = useContext(UserContext);
    console.debug("Navigation", "currentUser=", currentUser);

    function loggedInNav() {
        return (
            <>
                <ul className="navbar-nav ml-auto">
                    <li className="nav-item mr-4">
                        <NavLink className="nav-link" to="/characters">
                            Characters
                        </NavLink>
                    </li>
                    <li className="nav-item mr-4">
                        <NavLink className="nav-link" to={`/characters/favorite/${currentUser.username}/${currentUser.id}`}>
                            Favorite
                        </NavLink>
                    </li>
                </ul>
                <Link className="nav-link" to="/" onClick={logout}>
                    Log out {currentUser.username}
                </Link>
            </>
        );
    }

    function loggedOutNav() {
        return (
            <ul className="navbar-nav ml-auto">
                <li className="nav-item mr-4">
                    <NavLink className="nav-link" to="/login">
                        Login
                    </NavLink>
                </li>
                <li className="nav-item mr-4">
                    <NavLink className="nav-link" to="/signup">
                        Sign Up
                    </NavLink>
                </li>
            </ul>
        );
    }

    return (
        <nav className="Navigation navbar navbar-expand-md">
            <div className='container'>
                <Link className="navbar-brand" to="/">
                    <img className='logo' src='/marvel-Comics-logo.png' alt="Marvel Comics" />
                </Link>
                {currentUser ? loggedInNav() : loggedOutNav()}
            </div>
        </nav>
    )
}

export default Navigation