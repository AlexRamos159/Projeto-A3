package main

import (
	"encoding/json"
	"fmt"
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
	// Log para exibir os usuários carregados
	fmt.Println(users)
	if err != nil {
		fmt.Println(err)
		return
	}
	r := mux.NewRouter()

	// Manipulador para a rota de register
	r.HandleFunc("/register", func(w http.ResponseWriter, r *http.Request) {
		// Verifica se o método da requisição é POST
		if r.Method != http.MethodPost {
			w.WriteHeader(http.StatusMethodNotAllowed)
			fmt.Fprintf(w, "Método não permitido.")
			return
		}
		// Extrai os valores do formulário HTTP para username e password
		username := r.FormValue("username")
		password := r.FormValue("password")
		// Log dos valores extraídos
		fmt.Println("Username: ", username)
		fmt.Println("Password:", password)

		// Verifica se o usuário e a senha fornecidos são válidos
		if !isValidUsername(users, username) {
			// Retorna status de não autorizado se não forem válidos
			w.WriteHeader(http.StatusUnauthorized)
			fmt.Fprintf(w, "Username já em uso.")
			//Log de usuário recebido em uso
			fmt.Println("Username in use: ", username)
			return
		}
		newUser := User{Username: username, Password: password}
		users = append(users, newUser)
		err := saveUsers(users)
		// Se o username for válido, inserir
		fmt.Fprintf(w, "Cadastrado com sucesso!")
		// Log de usuário salvo
		fmt.Println("Usuário salvo: ", newUser)
		if err != nil {
			fmt.Println(err)
			return
		}

	}).Methods("POST")
	// Configuração CORS
	corsOptions := cors.New(cors.Options{
		AllowedOrigins: []string{"http://localhost:3000"},
		AllowedMethods: []string{"POST", "OPTIONS"},
	})

	// Adiciona o middleware CORS ao roteador
	handler := corsOptions.Handler(r)

	// Inicia o servidor HTTP na porta 4002
	fmt.Println("Servidor iniciado na porta 4002")
	http.ListenAndServe(":4002", handler)
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
func isValidUsername(users []User, username string) bool {
	// Verifica se existe um usuário com o nome de usuário inserido
	for _, user := range users {
		if user.Username == username {
			return false
		}
	}

	return true
}

func saveUsers(users []User) error {
	// Cria um arquivo JSON com os dados dos usuários
	data, err := json.Marshal(users)
	// Tratativa de erro
	if err != nil {
		return err
	}
	err = os.WriteFile("../users.json", data, 0644)
	// Tratativa de erro
	if err != nil {
		return err
	}
	return nil
}
