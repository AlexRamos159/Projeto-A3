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

// Definição da estrutura de dados para um usuário
type User struct {
	Username string `json:"username"` // Campo para o nome de usuário
	Password string `json:"password"` // Campo para a senha do usuário
}

// Estrutura para carregar os usuários do arquivo JSON
type UserStore struct {
	sync.RWMutex
	Users []User
}

var usersFilePath = "./src/backend/users.json"

func main() {
	// Inicia o servidor HTTP na porta 4001
	fmt.Println("Servidor iniciado na porta 4001")
	r := mux.NewRouter()
	store := &UserStore{}

	r.HandleFunc("/login", store.handleLogin).Methods("POST")

	// Configuração CORS
	corsOptions := cors.New(cors.Options{
		AllowedOrigins: []string{"http://localhost:3000"},
		AllowedMethods: []string{"POST", "OPTIONS"},
	})

	// Adiciona o middleware CORS ao roteador
	handler := corsOptions.Handler(r)

	http.ListenAndServe(":4001", handler)
}

// Função para carregar os usuários do arquivo JSON
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

// Função para verificar se um usuário é válido
func (store *UserStore) IsValidUser(username, password string) bool {
	store.RLock()
	defer store.RUnlock()

	// Verifica se existe um usuário com o nome de usuário e senha fornecidos
	for _, user := range store.Users {
		if user.Username == username && user.Password == password {
			return true
		}
	}
	return false
}

func (store *UserStore) handleLogin(w http.ResponseWriter, r *http.Request) {
	// Recarrega os usuários do arquivo JSON a cada requisição
	err := store.LoadUsers(usersFilePath)
	if err != nil {
		log.Printf("Erro ao carregar usuários: %v", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	// Verifica se o método da requisição é POST
	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		fmt.Fprintf(w, "Método não permitido")
		return
	}

	// Extrai os valores do formulário HTTP para username e password
	username := r.FormValue("username")
	password := r.FormValue("password")

	// Verifica se o usuário e a senha fornecidos são válidos
	if !store.IsValidUser(username, password) {
		// Retorna status de não autorizado se não forem válidos
		w.WriteHeader(http.StatusUnauthorized)
		fmt.Fprintf(w, "Usuário ou senha inválidos")
		return
	}

	// Se forem válidos, retorna mensagem de autenticação bem-sucedida
	fmt.Fprintf(w, "Autenticado com sucesso!")
}
