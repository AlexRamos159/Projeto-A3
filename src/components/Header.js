import React from 'react';
import logo from './assets/Logo-ChefIA.ico'
import styles from './Header.module.css'
import { useAuth } from '../AuthContext';
import Modal from './Modal'
import Login from './Login'
import Logout from './Logout'

const Header = () => {
    const { isLoggedIn, username, activeModal, openModal, handleLogin, handleLogout } = useAuth();

    return (
        <header className={styles.header}>
            <img className={styles.icon} src={logo} alt="Ícone ChefIA" />
            <ul className={styles.headerItems}>
                <li>Favoritos</li>
                <li onClick={() => openModal(isLoggedIn ? 'logout' : 'login')}>
                    {isLoggedIn ? 'Logout' : 'Login'}
                </li>
            </ul>
            <Modal isOpen={activeModal === 'login'} onClose={() => openModal(null)}>
                <Login handleLogin={handleLogin} />
            </Modal>
            <Modal isOpen={activeModal === 'logout'} onClose={() => openModal(null)}>
                <Logout handleLogout={handleLogout} />
            </Modal>
        </header >
    )
}

export default Header