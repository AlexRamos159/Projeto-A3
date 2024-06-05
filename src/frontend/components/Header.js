import React from 'react';
import logo from './assets/Logo-ChefIA.ico'
import styles from './styles/Header.module.css'
import { useAuth } from '../AuthContext';
import Modal from './Modal'
import Favoritos from './Favoritos'
import Login from './Login'
import Logout from './Logout'
import Cadastro from './Cadastro';

const Header = () => {
    const { isLoggedIn, username, activeModal, openModal, closeModal, handleLogin, handleLogout, showCadastroModal, openCadastroModal, closeCadastroModal } = useAuth();

    const renderModalContent = () => {
        switch (activeModal) {
            case 'login':
                return <Login handleLogin={handleLogin} onClose={closeModal} openCadastroModal={openCadastroModal} />;
            case 'logout':
                return <Logout username={username} handleLogout={handleLogout} />;
            case 'favoritos':
                return <Favoritos username={username} />;
            default:
                return null;
        }
    };

    return (
        <header className={styles.header}>
            <img className={styles.icon} src={logo} alt="Ícone ChefIA" />
            <ul className={styles.headerItems}>
            <li onClick={() => openModal(isLoggedIn ? 'favoritos' : 'login')}>
                    Favoritos
                </li>
                <li onClick={() => openModal(isLoggedIn ? 'logout' : 'login')}>
                    {isLoggedIn ? 'Logout' : 'Login'}
                </li>
            </ul>
            <Modal isOpen={activeModal === 'login' || activeModal === 'logout' || activeModal === 'favoritos'} onClose={closeModal}>
                {renderModalContent()}
            </Modal>
            <Modal isOpen={showCadastroModal} onClose={closeCadastroModal}>
                <Cadastro onClose={closeCadastroModal} />
            </Modal>
        </header>
    );
}

export default Header;
