package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"sync"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

// User representa um usuário do sistema
type User struct {
	Username  string   `json:"username"`
	Password  string   `json:"password"`
	Favorites []Recipe `json:"favorites"`
}

// Recipe representa uma receita
type Recipe struct {
	Titulo       string   `json:"titulo"`
	Ingredientes []string `json:"ingredientes"`
	ModoPreparo  []string `json:"modoPreparo"`
}

// DeleteRecipeRequest representa a estrutura de dados recebida do frontend
type DeleteRecipeRequest struct {
	Username string `json:"username"`
	Titulo   string `json:"titulo"`
}

var userStore UserStore
var usersFilePath = "./src/backend/users.json"

// UserStore mantém uma lista de usuários
type UserStore struct {
	sync.Mutex
	Users []User
}

func main() {
	fmt.Println("Servidor iniciado na porta 4005")
	if err := userStore.LoadUsers(usersFilePath); err != nil {
		log.Fatalf("Erro ao carregar usuários: %v", err)
	}

	r := mux.NewRouter()
	store := &UserStore{}

	r.HandleFunc("/del-favorite", store.handleDeleteFavorite).Methods("POST")

	corsOptions := cors.New(cors.Options{
		AllowedOrigins: []string{"http://localhost:3000"},
		AllowedMethods: []string{"POST", "OPTIONS"},
	})

	handler := corsOptions.Handler(r)
	http.ListenAndServe(":4005", handler)
}

// handleDeleteFavorite manipula a exclusão de uma receita favorita
func (store *UserStore) handleDeleteFavorite(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Endpoint /del-favorite acessado")

	// Carrega os usuários do arquivo JSON
	if err := store.LoadUsers(usersFilePath); err != nil {
		log.Printf("Erro ao carregar usuários: %v", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	// Verifica se o método da solicitação é POST
	if r.Method != http.MethodPost {
		fmt.Fprintf(w, "Método não permitido")
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	var req DeleteRecipeRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		log.Printf("Erro ao decodificar JSON: %v", err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	// Procura o usuário pelo nome de usuário
	var foundUser *User
	for i := range store.Users {
		if store.Users[i].Username == req.Username {
			foundUser = &store.Users[i]
			break
		}
	}
	if foundUser == nil {
		log.Printf("Usuário não encontrado: %v", req.Username)
		log.Println("Usuários na lista carregada:", store.Users)
		w.WriteHeader(http.StatusNotFound)
		return
	}

	log.Printf("Usuário encontrado: %v", foundUser)

	// Procura a receita favorita pelo título
	index := -1
	for i, recipe := range foundUser.Favorites {
		if recipe.Titulo == req.Titulo {
			index = i
			break
		}
	}
	if index == -1 {
		log.Printf("Receita não encontrada: %v", req.Titulo)
		w.WriteHeader(http.StatusNotFound)
		return
	}

	// Remove a receita favorita da lista
	foundUser.Favorites = append(foundUser.Favorites[:index], foundUser.Favorites[index+1:]...)

	// Salva os usuários atualizados no arquivo JSON
	if err := store.SaveUsers(usersFilePath); err != nil {
		http.Error(w, "Erro ao salvar usuários", http.StatusInternalServerError)
		return
	}

	log.Printf("Usuário atualizado após exclusão: %v", foundUser)
	w.WriteHeader(http.StatusOK)
}

// LoadUsers carrega os usuários do arquivo JSON
func (store *UserStore) LoadUsers(filename string) error {
	store.Lock()
	defer store.Unlock()

	// Lê os dados do arquivo de usuários
	data, err := os.ReadFile(filename)
	if err != nil {
		return err
	}

	// Decodifica os dados JSON em uma lista de usuários
	err = json.Unmarshal(data, &store.Users)
	if err != nil {
		return err
	}

	return nil
}

// SaveUsers salva os usuários no arquivo JSON
func (store *UserStore) SaveUsers(filename string) error {
	store.Lock()
	defer store.Unlock()

	data, err := json.MarshalIndent(store.Users, "", "  ")
	if err != nil {
		return err
	}

	err = ioutil.WriteFile(filename, data, 0644)
	if err != nil {
		return err
	}

	return nil
}
