import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import UserContext from '../auth/UserContext';
import "./Homepage.css";

const Homepage = () => {
    const { currentUser } = useContext(UserContext);
    console.debug("Homepage", "currentUser=", currentUser);

    return (
        <div className="Homepage">
            <div className="container text-center">
                <img className='logo' src='/marvel-Comics-logo.png' alt="Marvel Comics" />
                <p className="lead">All the Marvel Characters and comics in one, convenient place.</p>
                {currentUser
                    ?
                    <>
                        <h2>
                            Welcome Back, {currentUser.username}!
                        </h2>
                    </>

                    : (
                        <p>
                            <Link className="btn btn-primary font-weight-bold mr-3"
                                to="/login">
                                Log in
                            </Link>
                            <Link className="btn btn-primary font-weight-bold mx-4"
                                to="/signup">
                                Sign up
                            </Link>
                        </p>
                    )}
            </div>
        </div>
    );
}

export default Homepage