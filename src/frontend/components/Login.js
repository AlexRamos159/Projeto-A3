import React, { useState } from 'react';
import styles from './styles/Login.module.css';

const Login = ( { handleLogin, openCadastroModal } ) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // Função para lidar com a submissão do formulário
    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);

        fetch('http://localhost:4001/login', {
            method: 'POST',
            body: formData
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Falha ao efetuar login');
                }
                handleLogin(username);
            })
            .catch(error => {
                console.error('Erro ao efetuar login:', error);
                alert('Erro ao efetuar login. Por favor, verifique suas credenciais e tente novamente');
            });
    };


    const handleOpenCadastro = () => {
        openCadastroModal();
    }

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Login</h2>
            <form className={styles.form} onSubmit={handleSubmit}>
                <div>
                    <label className={styles.label} htmlFor="username">Nome de Usuário:</label>
                    <input
                        className={styles.input}
                        type="text"
                        id="username"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className={styles.label} htmlFor="password">Senha:</label>
                    <input
                        className={styles.input}
                        type="password"
                        id="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        required
                    />
                </div>
                <button className={styles.botao} type="submit">Entrar</button>
                <button className={styles.link} onClick={handleOpenCadastro}>Cadastre-se</button>
            </form>
        </div>
    );
};

export default Login;
