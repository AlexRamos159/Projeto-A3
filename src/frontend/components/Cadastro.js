import React, { useState } from 'react'
import styles from './styles/Cadastro.module.css'

const Cadastro = ({ onClose }) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);

        fetch('http://localhost:4002/register', {
            method: 'POST',
            body: formData
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Não foi possível cadastrar o usuário')
                }
                alert("Usuário cadastrado com sucesso!")
                onClose()
            })
            .then(data => {
                console.log('Usuário cadastrado com sucesso:', data);
            })
            .catch(error => {
                console.log("Erro ao efetuar cadastro:", error)
                alert("Erro ao efetuar cadastro. Por favor, verifique suas credenciais e tente novamente.")
            })
    }

    return (
        <div>
            <h2 className={styles.title}>Cadastro</h2>
            <form className={styles.form} onSubmit={handleSubmit}>
                <div>
                    <label className={styles.label} htmlFor='username'>Nome de Usuário:</label>
                    <input className={styles.input}
                        type='text'
                        id='username'
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className={styles.label} htmlFor='password'>Senha:</label>
                    <input
                        className={styles.input}
                        type='password'
                        id='password'
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        required
                    />
                </div>
                <button className={styles.botao} type='submit'>Cadastrar</button>
            </form>
        </div>
    )
}

export default Cadastro