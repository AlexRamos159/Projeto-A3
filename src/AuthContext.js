import React, { createContext, useContext, useState} from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState(null);
    const [activeModal, setActiveModal] = useState(null);

    const openModal = (modalName) => {
        setActiveModal(modalName);
    }

    const closeModal = () => {
        setActiveModal(null);
    }

    const handleLogin = (username) => {
        setUsername(username)
        setIsLoggedIn(true);
        closeModal();
    };
    const handleLogout = () => {
        setUsername(null);
        setIsLoggedIn(false);
        closeModal();
    };
    return (
        <AuthContext.Provider value={{ isLoggedIn, username, activeModal, openModal, handleLogin, handleLogout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);