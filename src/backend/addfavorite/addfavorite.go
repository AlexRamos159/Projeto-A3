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

// RecipeRequest representa a estrutura de dados recebida do frontend
type RecipeRequest struct {
	Username string `json:"username"`
	Recipe   Recipe `json:"recipe"`
}

// UserStore mantém uma lista de usuários
type UserStore struct {
	sync.Mutex
	Users []User
}

var userStore UserStore
var usersFilePath = "./src/backend/users.json"

func main() {
	fmt.Println("Servidor iniciado na porta 4003")
	// Carregar os usuários do arquivo JSON
	if err := userStore.LoadUsers(usersFilePath); err != nil {
		log.Fatalf("Erro ao carregar usuários: %v", err)
	}

	r := mux.NewRouter()

	r.HandleFunc("/add-favorite", handleFavoritar).Methods("POST")

	// Configuração CORS
	corsOptions := cors.New(cors.Options{
		AllowedOrigins: []string{"http://localhost:3000"},
		AllowedMethods: []string{"POST", "OPTIONS"},
	})

	// Adiciona o middleware CORS ao roteador
	handler := corsOptions.Handler(r)

	http.ListenAndServe(":4003", handler)
}

func handleFavoritar(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Endpoint /add-favorite acessado")

	// Carrega os dados do JSON usando a func LoadUsers
	err := userStore.LoadUsers(usersFilePath)
	// Tratativa de erro
	if err != nil {
		log.Printf("Erro ao carregar usuários: %v", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	// Verifica se o método da requisição é POST
	if r.Method != http.MethodPost {
		fmt.Fprintf(w, "Método não permitido")
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	// Extrai os valores recebidos em RecipeRequest
	var req RecipeRequest

	// Decodifica o JSON recebido
	err = json.NewDecoder(r.Body).Decode(&req)
	// Tratativa de erro
	if err != nil {
		log.Printf("Erro ao decodificar JSON: %v", err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	log.Printf("Receita recebida: %v", req.Recipe)

	// Encontra o usuário correspondente
	var foundUser *User
	for i := range userStore.Users {
		if userStore.Users[i].Username == req.Username {
			foundUser = &userStore.Users[i]
			break
		}
	}
	// Tratativa de erro
	if foundUser == nil {
		log.Printf("Usuário não encontrado: %v", req.Username)
		w.WriteHeader(http.StatusNotFound)
		return
	}

	log.Printf("Usuário encontrado: %v", foundUser)

	// Verifica se o usuário já possui lista de favoritos
	if foundUser.Favorites == nil {
		foundUser.Favorites = make([]Recipe, 0)
	}

	// Adiciona a nova receita aos favoritos do usuário
	foundUser.Favorites = append(foundUser.Favorites, Recipe{
		Titulo:       req.Recipe.Titulo,
		Ingredientes: req.Recipe.Ingredientes,
		ModoPreparo:  req.Recipe.ModoPreparo,
	})

	log.Println("Favoritos do usuário após a adição:", foundUser.Favorites)

	// Salva os usuários atualizados no arquivo JSON
	if err := userStore.SaveUsers(usersFilePath); err != nil {
		http.Error(w, "Erro ao salvar usuários", http.StatusInternalServerError)
		return
	}

	// Log para mostrar como ficou o usuário
	log.Printf("Usuário atualizado: %v", foundUser)

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
