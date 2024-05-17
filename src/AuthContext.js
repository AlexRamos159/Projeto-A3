import React, { createContext, useContext, useState} from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState(null);
    const [activeModal, setActiveModal] = useState(null);
    const [showCadastroModal, setShowCadastroModal] = useState(false);

    const openModal = (modalName) => {
        setActiveModal(modalName);
    }

    const closeModal = () => {
        setActiveModal(null);
    }

    const handleLogin = (username) => {
        setUsername(username)
        console.log(username)
        setIsLoggedIn(true);
        closeModal();
    };
    const handleLogout = () => {
        setUsername(null);
        setIsLoggedIn(false);
        closeModal();
    };

    const openCadastroModal = () => { 
        setShowCadastroModal(true);
        closeModal();
    };

    const closeCadastroModal = () => {
        setShowCadastroModal(false);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, username, activeModal, openModal, closeModal, handleLogin, handleLogout, showCadastroModal, openCadastroModal, closeCadastroModal }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);