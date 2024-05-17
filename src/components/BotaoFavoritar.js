import React, { useState } from 'react';
import styles from './BotaoFavoritar.module.css';
import { useAuth } from '../AuthContext';

const BotaoFavoritar = ({ titulo, ingredientes, modoPreparo }) => {
    const [favoritado, setFavoritado] = useState(false);
    const { isLoggedIn, username, openModal } = useAuth();

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
    
        console.log("Dados enviados para o backend:", data);
    
        fetch('http://localhost:4003/add-favorite', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Especifica que o corpo é JSON
            },
            body: JSON.stringify(data) // Converte os dados para JSON
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
