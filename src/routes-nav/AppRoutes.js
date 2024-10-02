import React, { useContext } from 'react'
import { Routes, Route, Navigate } from "react-router-dom";
import Homepage from '../homepage/Homepage';
import LoginForm from '../auth/LoginForm';
import SignupForm from '../auth/SignupForm';
import CharacterLists from '../marvelCharacters/CharacterLists';
import CharacterDetail from '../marvelCharacters/CharacterDetail';
import FavoriteCharacters from '../favorite/FavoriteCharacters';
import PrivateRoute from "./PrivateRoute";
import UserContext from "../auth/UserContext";

const AppRoutes = ({ login, signup }) => {
    const { currentUser } = useContext(UserContext);

    return (
        <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/login" element={<LoginForm login={login} />} />
            <Route path="/signup" element={<SignupForm signup={signup} />} />
            {/* Private routes */}
            <Route element={<PrivateRoute />}>
                <Route path="/characters" element={<CharacterLists />} />
                <Route path={`/characters/${currentUser?.username}/:handle`} element={<CharacterDetail />} />
                <Route path={`/characters/favorite/${currentUser?.username}/:handle`} element={<FavoriteCharacters />} />
            </Route>
            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    )
}

export default AppRoutes