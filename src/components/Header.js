import React from 'react';
import logo from './assets/Logo-ChefIA.ico'
import styles from './Header.module.css'
import Login from './Login'
import Logout from './Logout'

const Header = ({ isLoggedIn, toggleLoginModal, showLoginModal, toggleLogoutModal, showLogoutModal, setIsLoggedIn }) => {

    const handleLogin = () => {
        setIsLoggedIn(true);
        toggleLoginModal();
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        toggleLogoutModal();
    }

    return (
        <header>
            <div>
                <img className={styles.icon} src={logo} alt="Ícone ChefIA" />
                <ul className={styles.header}>
                    <li>Favoritos</li>
                    <li onClick={isLoggedIn ? toggleLogoutModal : toggleLoginModal}>
                        {isLoggedIn ? 'Logout' : 'Login'}
                    </li>
                </ul>
            </div>
            {showLoginModal && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <span className={styles.close} onClick={toggleLoginModal}>
                            &times;
                        </span>
                        <Login handleLogin={handleLogin} />
                    </div>
                </div>
            )}
            {showLogoutModal && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <span className={styles.close} onClick={toggleLogoutModal}>
                            &times;
                        </span>
                        <Logout handleLogout={handleLogout} />
                    </div>
                </div>
            )}
        </header>
    )
}

export default Header