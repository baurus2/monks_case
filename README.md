# Monks - Case Técnico de Estágio (Dashboard de Performance)

![Status](https://img.shields.io/badge/status-concluído-brightgreen)

Projeto full-stack desenvolvido como a solução para o case técnico do processo seletivo de estágio em Engenharia da Monks. A aplicação exibe dados de performance de marketing em um dashboard interativo, com sistema de autenticação e controle de acesso baseado no perfil do usuário.

---

###  [➡️ Acessar a Demonstração Online](https://seu-projeto.onrender.com)

---

## 📋 Índice

* [Sobre o Projeto](#-sobre-o-projeto)
* [Funcionalidades](#-funcionalidades)
* [Tecnologias Utilizadas](#-tecnologias-utilizadas)
* [Como Executar o Projeto](#-como-executar-o-projeto)
* [Usuários de Teste](#-usuários-de-teste)
* [Estrutura da API](#-estrutura-da-api)


---

## 📖 Sobre o Projeto

O desafio consistia em construir uma aplicação web para gestores de uma agência de marketing, exibindo dados de performance de diversas contas. A aplicação foi desenvolvida com um backend em **Python/Flask** que serve uma API RESTful e um frontend em **JavaScript puro** que consome essa API.

O projeto atende a todos os requisitos funcionais, incluindo autenticação segura, filtragem e ordenação de dados, e controle de acesso para ocultar informações sensíveis de usuários não-administrativos.

---

## ✨ Funcionalidades

* ✅ **Autenticação Segura:** Sistema de login com senhas criptografadas usando `bcrypt`.
* ✅ **Controle de Acesso:** A coluna de custos (`cost_micros`) é visível apenas para usuários com perfil `admin`.
* ✅ **Dashboard Interativo:** Exibição dos dados em formato de tabela com paginação.
* ✅ **Filtragem por Datas:** Seleção de um intervalo de datas para análise dos dados.
* ✅ **Ordenação Dinâmica:** Classificação dos dados clicando no cabeçalho de qualquer coluna.
* ✅ **Feedback Visual:** Alertas não-bloqueantes para feedback de ações (login, logout, etc.) e um spinner de carregamento durante a busca de dados.
* ✅ **Validação Inteligente:** O formulário de datas impede a seleção de uma data final anterior à data inicial, corrigindo-a automaticamente.
* ✅ **Limpar datas:** Ao clicar duas vezes na data o filtro é limpo.

---

## 🛠️ Tecnologias Utilizadas

* **Backend:** Python, Flask, Pandas, Bcrypt
* **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
* **Deploy:** Render.com / Gunicorn

---

## 🚀 Como Executar o Projeto

Siga os passos abaixo para executar o projeto localmente.

### Pré-requisitos

Antes de começar, você vai precisar ter instalado em sua máquina:
* [Python 3.10+](https://www.python.org/downloads/)
* [Git](https://git-scm.com/downloads)

### Rodando o Backend

```bash
# 1. Clone este repositório
 git clone [https://github.com/baurus2/monks_case](https://github.com/baurus2/monks_case)

# 2. Navegue até a pasta do backend
 cd monks/backend

# 3. Crie e ative um ambiente virtual
# (No Windows)
python -m venv venv (Com Python to PATH)
py -m venv venv (Sem Python to PATH)
source venv/Scripts/activate

# 4. Instale as dependências
 pip install -r requirements.txt

# 5. Execute o servidor Flask
python app.py (Com Python to PATH)
py app.py (Sem Python to PATH)

# O servidor estará rodando em http://localhost:5000
```

---

## 🔑 Usuários de Teste

As credenciais abaixo podem ser usadas para testar os diferentes níveis de acesso.

| Perfil | Email | Senha | Acesso Especial |
| :--- | :--- | :--- | :--- |
| 👤 **Admin** | `admin@monks.com` | `Admin@2025` | Vê a coluna `cost_micros` |
| 👤 **User** | `user@monks.com` | `User@2025` | Não vê a coluna `cost_micros` |

---

## 📡 Estrutura da API

A API expõe os seguintes endpoints:

| Método | Endpoint | Descrição |
| :--- | :--- | :--- |
| `POST` | `/api/login` | Autentica um usuário e inicia uma sessão. |
| `POST` | `/api/logout` | Encerra a sessão do usuário. |
| `GET` | `/api/me` | Verifica se há um usuário autenticado na sessão atual. |
| `GET` | `/api/data` | Retorna os dados de performance com filtros, ordenação e paginação. |

---

## 👨‍💻 Autor

Desenvolvido por **Júlio Cesar**.

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://br.linkedin.com/in/juliocesar-martins)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/baurus2)
