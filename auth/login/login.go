package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
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
		fmt.Println(err)
		return
	}

	// Manipuladores para diferentes rotas HTTP

	// Manipulador para a rota de login
	http.HandleFunc("/login", func(w http.ResponseWriter, r *http.Request) {
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
		if !isValidUser(users, username, password) {
			// Retorna status de não autorizado se não forem válidos
			w.WriteHeader(http.StatusUnauthorized)
			fmt.Fprintf(w, "Usuário ou senha inválidos")
			return
		}

		// Se forem válidos, retorna mensagem de autenticação bem-sucedida
		fmt.Fprintf(w, "Autenticado com sucesso!")
		// Redireciona para a página principal
		http.Redirect(w, r, "/", http.StatusSeeOther)
	})

	// Inicia o servidor HTTP na porta 8080
	http.ListenAndServe(":8080", nil)
}

// Função para carregar os usuários do arquivo JSON
func loadUsers() ([]User, error) {
	// Lê os dados do arquivo de usuários
	data, err := ioutil.ReadFile("../users.json")
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
