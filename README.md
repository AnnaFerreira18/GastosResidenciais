# 💰 Sistema de Controle de Gastos Residenciais

![React](https://img.shields.io/badge/React_19-20232A?style=flat&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![.NET 8](https://img.shields.io/badge/.NET_8-512BD4?style=flat&logo=dotnet&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-07405E?style=flat&logo=sqlite&logoColor=white)
![xUnit](https://img.shields.io/badge/xUnit-25A162?style=flat&logo=dotnet&logoColor=white)

Este projeto é um sistema de gestão financeira doméstica. Ele permite o cadastro de pessoas, categorias e a movimentação de transações (receitas e despesas), aplicando regras de negócio específicas e gerando relatórios de saldo.

## 🚀 Funcionalidades Principais

* **Gestão de Pessoas:** Cadastro completo com validação de dados.
* **Categorias Personalizadas:** Separação por finalidade (Receita, Despesa ou Ambas).
* **Lançamentos com Regras de Negócio:**
  * 🔞 **Restrição de Idade:** Menores de 18 anos são impedidos de registrar Receitas (validação robusta no Front-end e Back-end).
  * 🔍 **Filtro de Compatibilidade:** O sistema sugere dinamicamente apenas categorias compatíveis com o tipo de transação selecionado.
* **Relatórios Consolidados:**
  * Visão geral por pessoa (Receitas, Despesas e Saldo Líquido).
  * Resumo por categoria para melhor controle de gastos.
  * Saldo geral do sistema.

## 🛠️ Tecnologias e Arquitetura

### Back-end
* **Linguagem & Framework:** C# com .NET 8 (ASP.NET Core Web API).
* **Banco de Dados & ORM:** SQLite (Persistência local facilitada) com Entity Framework Core.
* **Testes:** xUnit para garantir a integridade das regras de negócio.
* **Arquitetura:** Organização em camadas (Controllers, Services, DTOs, Models).
* **Diferencial:** Configuração de *Cascade Delete* (exclusão em cascata) para limpeza automática de dados vinculados.

### Front-end
* **Linguagem & Lib:** TypeScript e React 19.
* **Ferramenta:** Vite para um ambiente de desenvolvimento.
* **Comunicação & Rotas:** Axios para consumo da API e React Router Dom para navegação.
* **UI/UX:** Design responsivo com tabelas adaptadas para dispositivos móveis.

---

## ⚙️ Como executar o projeto

### 📌 Pré-requisitos
* [.NET SDK 8.0+](https://dotnet.microsoft.com/download/dotnet/8.0)
* [Node.js 22+](https://nodejs.org/)

### 1. Configurando o Back-end (API)

```bash
# Acesse a pasta do servidor
cd Backend

# Restaure as dependências do projeto
dotnet restore

# Crie o banco de dados local via migrations
dotnet ef database update

# Inicie a API
dotnet run
```
> **Nota:** A API geralmente iniciará em `https://localhost:7123` ou `http://localhost:5000`. Verifique o terminal para confirmar a porta exata.

### 2. Configurando o Front-end

Abra um **novo terminal** e execute:

```bash
# Acesse a pasta do cliente
cd Frontend

# Instale as dependências do Node
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```
> **Atenção:** Verifique se o endereço da API no arquivo `src/services/api.ts` coincide com a porta onde o seu backend está rodando.
> 
> Acesse: `http://localhost:5173`

---

## 📂 Estrutura de Pastas

### 📁 Back-end
* `Models/`: Entidades principais e Enums.
* `Data/`: Contexto do banco e configurações de persistência.
* `Services/`: Onde a "mágica" acontece (Lógica de negócio e validações).
* `DTOs/`: Objetos para trânsito seguro de dados.
* `Controllers/`: Exposição dos endpoints da API.

### 📁 Front-end
* `src/pages/`: Telas da aplicação (Pessoas, Categorias, Transações e Relatórios).
* `src/services/`: Configuração do Axios para chamadas à API.
* `src/types/`: Definições de interfaces para garantir o Type Safety.

---
Desenvolvido por [Anna Ferreira](https://github.com/AnnaFerreira18) 🚀
