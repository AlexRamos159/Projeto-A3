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
	Username  string   `json:"username"`
	Password  string   `json:"password"`
	Favorites []Recipe `json:"favorites"`
}

// Definição da estrutura de dados para uma receita
type Recipe struct {
	Titulo       string   `json:"titulo"`
	Ingredientes []string `json:"ingredientes"`
	ModoPreparo  []string `json:"modoPreparo"`
}

var usersFilePath = "./src/backend/users.json"

func main() {
	// Carrega os usuários do arquivo
	users, err := loadUsers(usersFilePath)
	if err != nil {
		fmt.Println("Erro ao carregar usuários:", err)
		return
	}

	r := mux.NewRouter()

	// Manipulador para a rota de registro
	r.HandleFunc("/register", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			w.WriteHeader(http.StatusMethodNotAllowed)
			fmt.Fprintf(w, "Método não permitido.")
			return
		}

		// Extrai os valores do formulário HTTP para username e password
		username := r.FormValue("username")
		password := r.FormValue("password")

		if !isValidUsername(users, username) {
			w.WriteHeader(http.StatusUnauthorized)
			fmt.Fprintf(w, "Username já em uso.")
			fmt.Println("Username em uso: ", username)
			return
		}

		// Cria um novo usuário com os dados recebidos
		newUser := User{Username: username, Password: password, Favorites: []Recipe{}}
		users = append(users, newUser)

		err := saveUsers(usersFilePath, users)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			fmt.Fprintf(w, "Erro ao salvar o usuário.")
			fmt.Println("Erro ao salvar o usuário:", err)
			return
		}

		fmt.Fprintf(w, "Cadastrado com sucesso!")
		fmt.Println("Usuário salvo: ", newUser)
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
func loadUsers(filename string) ([]User, error) {

	data, err := os.ReadFile(filename)
	if err != nil {
		return nil, err
	}

	var users []User
	err = json.Unmarshal(data, &users)
	if err != nil {
		return nil, err
	}

	// Inicializa o campo Favorites se estiver ausente
	for i := range users {
		if users[i].Favorites == nil {
			users[i].Favorites = []Recipe{}
		}
	}

	return users, nil
}

// Função para verificar se um usuário é válido
func isValidUsername(users []User, username string) bool {
	for _, user := range users {
		if user.Username == username {
			return false
		}
	}
	return true
}

func saveUsers(filename string, users []User) error {

	data, err := json.MarshalIndent(users, "", "  ")
	if err != nil {
		return err
	}
	err = os.WriteFile(filename, data, 0644)
	if err != nil {
		return err
	}
	return nil
}
