import React, { createContext, useContext, useState} from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState(null);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false)
    
    const toggleLoginModal = () => {
        setShowLoginModal(!showLoginModal);
    }

    const toggleLogoutModal = () => {
        setShowLogoutModal(!showLogoutModal)
    }


    const handleLogin = (username) => {
        setUsername(username)
        setIsLoggedIn(true);
        toggleLoginModal();
    };
    const handleLogout = () => {
        setUsername(null);
        setIsLoggedIn(false);
        toggleLogoutModal();
    };
    return (
        <AuthContext.Provider value={{ isLoggedIn, username, toggleLoginModal, toggleLogoutModal, handleLogin, handleLogout, showLoginModal, showLogoutModal }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);