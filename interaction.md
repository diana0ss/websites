# Interações da Aplicação de Gestão de Biblioteca Escolar

## Funcionalidades Principais

### 1. Dashboard
- **Visualização**: Cards com estatísticas (total de livros, requisições ativas, utentes registados)
- **Interação**: Clicks nos cards redirecionam para as respetivas secções
- **Filtros**: Período temporal para análises

### 2. Gestão de Livros
- **Listagem**: Grid de cartões com capa, título, autor e estado
- **Pesquisa**: Barra de pesquisa por título, autor ou ISBN
- **Filtros**: Por género, editora, ano de publicação, disponibilidade
- **Ações**: Adicionar novo livro, editar informações, gerir exemplares

### 3. Gestão de Autores
- **Listagem**: Tabela com nome, país e número de livros
- **Pesquisa**: Por nome ou país
- **Ações**: Adicionar, editar, eliminar autores

### 4. Gestão de Editoras
- **Listagem**: Tabela com informações de contacto
- **Pesquisa**: Por nome ou país
- **Ações**: Adicionar, editar, eliminar editoras

### 5. Gestão de Utentes
- **Listagem**: Tabela com informações de contacto e estado
- **Pesquisa**: Por nome, email ou NIF
- **Ações**: Registar novo utente, editar informações, ver histórico de requisições

### 6. Sistema de Requisições
- **Empréstimo**: Selecionar utente e livro disponível
- **Devolução**: Processar devolução e atualizar estado do exemplar
- **Histórico**: Ver todas as requisições com filtros por utente ou livro

## Fluxos de Interação
1. **Navegação**: Menu lateral com acesso rápido a todas as secções
2. **Formulários**: Validação em tempo real e feedback visual
3. **Confirmações**: Diálogos de confirmação para ações destrutivas
4. **Notificações**: Mensagens de sucesso/erro após ações