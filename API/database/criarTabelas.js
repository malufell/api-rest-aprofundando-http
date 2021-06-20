const modelos = [
  require('../routes/fornecedores/ModeloTabelaFornecedor'),
  require('../routes/produtos/ModeloTabelaProduto')
]

async function criarTabelas () {
  for (let i = 0; i < modelos.length; i++) {
    const modelo = modelos[i]
    await modelo.sync()
  }
};

criarTabelas()
