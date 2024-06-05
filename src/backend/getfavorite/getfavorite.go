package main

import (
	"encoding/json"
	"fmt"
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

// UserStore mantém uma lista de usuários
type UserStore struct {
	sync.Mutex
	Users []User
}

var userStore UserStore
var usersFilePath = "./src/backend/users.json"

func main() {
	fmt.Println("Servidor iniciado na porta 4004")
	// Carregar os usuários do arquivo JSON
	if err := userStore.LoadUsers(usersFilePath); err != nil {
		log.Fatalf("Erro ao carregar usuários: %v", err)
	}

	r := mux.NewRouter()

	r.HandleFunc("/get-favorites", handleGetFavorites).Methods("GET")

	// Configuração CORS
	corsOptions := cors.New(cors.Options{
		AllowedOrigins: []string{"http://localhost:3000"},
		AllowedMethods: []string{"GET", "OPTIONS"},
	})

	// Adiciona o middleware CORS ao roteador
	handler := corsOptions.Handler(r)

	http.ListenAndServe(":4004", handler)
}

func handleGetFavorites(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Endpoint /get-favorites acessado")

	// Extrai o username da query string
	username := r.URL.Query().Get("username")
	if username == "" {
		http.Error(w, "Username é obrigatório", http.StatusBadRequest)
		return
	}

	// Carrega os dados do JSON usando a func LoadUsers
	err := userStore.LoadUsers(usersFilePath)
	// Tratativa de erro
	if err != nil {
		log.Printf("Erro ao carregar usuários: %v", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	// Encontra o usuário correspondente
	var foundUser *User
	for i := range userStore.Users {
		if userStore.Users[i].Username == username {
			foundUser = &userStore.Users[i]
			break
		}
	}
	// Tratativa de erro
	if foundUser == nil {
		log.Printf("Usuário não encontrado: %v", username)
		w.WriteHeader(http.StatusNotFound)
		return
	}

	// Retorna os favoritos do usuário como JSON
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"favorites": foundUser.Favorites,
	})
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
