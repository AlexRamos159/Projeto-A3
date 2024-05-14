package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

// Definição da estrutura de dados para um usuário
type User struct {
	Username string `json:"username"` // Campo para o nome de usuário
	Password string `json:"password"` // Campo para a senha do usuário
}

func main() {
	// Carrega os usuários do arquivo
	users, err := loadUsers()
	if err != nil {
		log.Fatalf("Erro ao carregar usuários: %v", err)
	}
	r := mux.NewRouter()
	// Manipulador para a rota de login
	r.HandleFunc("/login", func(w http.ResponseWriter, r *http.Request) {
		// Verifica se o método da requisição é POST
		if r.Method != http.MethodPost {
			w.WriteHeader(http.StatusMethodNotAllowed)
			fmt.Fprintf(w, "Método não permitido")
			// Log para método de requisição
			log.Printf("Método de requisição não permitido: %s", r.Method)
			return
		}
		// Extrai os valores do formulário HTTP para username e password
		username := r.FormValue("username")
		password := r.FormValue("password")
		// Verifica se o usuário e a senha fornecidos são válidos
		if !isValidUser(users, username, password) {
			// Retorna status de não autorizado se não forem válidos
			w.WriteHeader(http.StatusUnauthorized)
			fmt.Fprintf(w, "Usuário ou senha inválidos")
			return
		}

		// Se forem válidos, retorna mensagem de autenticação bem-sucedida
		fmt.Fprintf(w, "Autenticado com sucesso!")
	}).Methods("POST")

	// Configuração CORS
	corsOptions := cors.New(cors.Options{
		AllowedOrigins: []string{"http://localhost:3000"},
		AllowedMethods: []string{"POST", "OPTIONS"},
	})

	// Adiciona o middleware CORS ao roteador
	handler := corsOptions.Handler(r)

	// Inicia o servidor HTTP na porta 4000
	fmt.Println("Servidor iniciado na porta 4001")
	http.ListenAndServe(":4001", handler)
}

// Função para carregar os usuários do arquivo JSON
func loadUsers() ([]User, error) {
	// Lê os dados do arquivo de usuários
	data, err := os.ReadFile("../users.json")
	if err != nil {
		return nil, err
	}

	// Decodifica os dados JSON em uma lista de usuários
	var users []User
	err = json.Unmarshal(data, &users)
	if err != nil {
		return nil, err
	}

	return users, nil
}

// Função para verificar se um usuário é válido
func isValidUser(users []User, username, password string) bool {
	// Verifica se existe um usuário com o nome de usuário e senha fornecidos
	for _, user := range users {
		if user.Username == username && user.Password == password {
			return true
		}
	}

	return false
}
