## API REST - aprofundando http

### Sobre

- Projeto em Node.js, com Express, MySQL, Sequelize
- Implementa CRUD de "fornecedores" e "produtos", seguindo a convenção REST
- Serializa as respostas da API no formato JSON ou XML
- Configura CORS (cabeçalho "Access-Control-Allow-Origin") para liberar acesso a API através de outro domínio
- Inclui no cabeçalho das respostas de produtos: 'ETag' (versão), 'Last-Modified' e 'Location'
- Configura OPTIONS, incluindo no cabeçalho das respostas os métodos HTTP permitidos em cada rota 
- Retorna msgs de erro customizadas de acordo com o status do erro: 404, 400, 406, 500
- Possui versionamento de rotas que altera os dados de resposta na listagem de fornecedores
- Rotas (ver arquivo do Postman salvo na raiz do projeto com os métdos HTTP de cada rota)
  - /api/fornecedores = para coleção de fornecedores
  - /api/fornecedores/:idFornecedor = para acessar cada documento da coleção
  - /api/fornecedores/:idFornecedor/produtos = sub-coleção de produtos
  - /api/fornecedores/:idFornecedor/produtos/:idProduto = para cada documento da sub-coleção
  - /api/fornecedores/:idFornecedor/produtos/:idProduto/diminuir-estoque = para ação de diminuir um item do estoque de produto
  - /api/v2/fornecedores = para coleção de fornecedores, com versionamento


### Como executar:

Pré-requisitos: instalação do node.js e mySQL.

1. No terminal, clonar o projeto: `git clone https://github.com/malufell/api-rest-aprofundando-http.git`
2. Entrar na pasta do projeto: `cd api-rest-aprofundando-http`
3. Instalar as dependências: `npm install`
4. Configurar o banco de dados MySQL, arquivo "API\database\config\index.js"
5. Iniciar a aplicação: `npm start`
6. Sincronizar as tabelas no banco de dados: no terminal, acessar a pasta "API\database" e rodar o comando `node criarTabelas.js`
7. Na raiz do projeto há arquivo "API REST.postman_collection.json" com todas as rotas e exemplos, basta importar no Postman 
