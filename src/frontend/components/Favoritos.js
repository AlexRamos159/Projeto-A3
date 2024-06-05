import React, { useEffect, useState } from 'react';
import styles from './styles/Favoritos.module.css';
import Modal from './Modal';

const Favoritos = ({ username }) => {
    const [favorites, setFavorites] = useState([]);
    const [selectedRecipe, setSelectedRecipe] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:4004/get-favorites?username=${username}`)
            .then(response => response.json())
            .then(data => setFavorites(data.favorites))
            .catch(error => console.error('Erro ao obter favoritos:', error));
    }, [username]);

    const handleRecipeClick = (recipe) => {
        setSelectedRecipe(recipe);
    };

    const handleCloseRecipeModal = () => {
        setSelectedRecipe(null);
    };

    const handleDeleteFavorite = () => {
        if (!selectedRecipe) return;

        const data = {
            username: username,
            titulo: selectedRecipe.titulo
        };

        fetch('http://localhost:4005/del-favorite', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao deletar receita');
            }

            setFavorites(favorites.filter(recipe => recipe.titulo !== selectedRecipe.titulo));
            handleCloseRecipeModal();
        })
        .catch(error => {
            console.error('Erro ao deletar receita:', error);
            alert('Erro ao deletar receita. Por favor, tente novamente');
        });
    };

    return (
        <div className={styles.favoritosModal}>
            <h2>Favoritos</h2>
            {favorites.length === 0 ? (
                <p>Lista de favoritos vazia, por favor, adicione novas receitas.</p>
            ) : (
                <div className={styles.favoritesGrid}>
                    {favorites.map((favorite, index) => (
                        <div key={index} className={styles.favoriteItem} onClick={() => handleRecipeClick(favorite)}>
                            <h3>{favorite.titulo}</h3>
                        </div>
                    ))}
                </div>
            )}
            <Modal isOpen={!!selectedRecipe} onClose={handleCloseRecipeModal}>
                {selectedRecipe && (
                    <div className={styles.recipeModalContent}>
                        <h2>{selectedRecipe.titulo}</h2>
                        <h3>Ingredientes:</h3>
                        <ul>
                            {selectedRecipe.ingredientes.map((ingrediente, index) => (
                                <li key={index}>{ingrediente}</li>
                            ))}
                        </ul>
                        <h3>Modo de Preparo:</h3>
                        <ol>
                            {selectedRecipe.modoPreparo.map((passo, index) => (
                                <li key={index}>{passo}</li>
                            ))}
                        </ol>
                        <button onClick={handleDeleteFavorite} className={styles.deleteButton}>Deletar</button>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Favoritos;
