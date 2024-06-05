import React, { useState, useEffect } from 'react';
import styles from './styles/BotaoFavoritar.module.css';
import { useAuth } from '../AuthContext';

const BotaoFavoritar = ({ titulo, ingredientes, modoPreparo }) => {
    const [favoritado, setFavoritado] = useState(false);
    const { isLoggedIn, username, openModal } = useAuth();

    // useEffect para resetar o estado favoritado quando a receita mudar
    useEffect(() => {
        setFavoritado(false);
    }, [titulo, ingredientes, modoPreparo]);

    const handleFavoritar = () => {
        if (!isLoggedIn) {
            openModal('login');
            return;
        }
    
        const data = {
            username: username,
            recipe: {
                titulo: titulo,
                ingredientes: ingredientes,
                modoPreparo: modoPreparo
            }
        };
    
        fetch('http://localhost:4003/add-favorite', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao favoritar receita');
            }
            
            setFavoritado(true);
        })
        .catch(error => {
            console.error('Erro ao favoritar receita:', error);
            alert('Erro ao favoritar receita. Por favor, tente novamente');
        });
    };
    
    return (
        <div className={styles.botaoFavoritar}>
            {!favoritado ? (
                <button onClick={handleFavoritar} className={styles.botao}>
                    Favoritar
                </button>
            ) : (
                <span className={styles.favoritado}>Favoritado!</span>
            )}
        </div>
    );
};

export default BotaoFavoritar;
