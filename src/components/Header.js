// Header.js
import React from 'react';
import logo from './assets/Logo-ChefIA.ico'
import styles from './Header.module.css'
import { useAuth } from '../AuthContext';
import Modal from './Modal'
import Login from './Login'
import Logout from './Logout'
import Cadastro from './Cadastro';

const Header = () => {
    const { isLoggedIn, activeModal, openModal, closeModal, handleLogin, handleLogout, showCadastroModal, openCadastroModal, closeCadastroModal } = useAuth();

    const renderModalContent = () => {
        switch (activeModal) {
            case 'login':
                return <Login handleLogin={handleLogin} onClose={closeModal} openCadastroModal={openCadastroModal} />;
            case 'logout':
                return <Logout handleLogout={handleLogout} />;
            default:
                return null;
        }
    };

    return (
        <header className={styles.header}>
            <img className={styles.icon} src={logo} alt="Ícone ChefIA" />
            <ul className={styles.headerItems}>
                <li>Favoritos</li>
                <li onClick={() => openModal(isLoggedIn ? 'logout' : 'login')}>
                    {isLoggedIn ? 'Logout' : 'Login'}
                </li>
            </ul>
            <Modal isOpen={activeModal === 'login' || activeModal === 'logout'} onClose={closeModal}>
                {renderModalContent()}
            </Modal>
            <Modal isOpen={showCadastroModal} onClose={closeCadastroModal}>
                <Cadastro onClose={closeCadastroModal} />
            </Modal>
        </header>
    );
}

export default Header;
