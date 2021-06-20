const router = require('express').Router()
const TabelaFornecedor = require('./TabelaFornecedor')
const Fornecedor = require('./Fornecedor')
const SerializadorFornecedor = require('../../Serializador').SerializadorFornecedor

router.options('/', (req, res) => {
  res.set('Access-Control-Allow-Methods', 'GET, POST')
    .set('Access-Control-Allow-Headers', 'Content-Type')
    .status(204).end()
})

// pega o "res.getHeader("Content-Type")" para enviar a classe e no middleware valida se o type é do tipo aceito
router.get('/', async (req, res) => {
  const resultados = await TabelaFornecedor.listar()
  const serializador = new SerializadorFornecedor(res.getHeader('Content-Type'), ['categoria'])
  res.status(200).send(serializador.serializar(resultados))
})

router.post('/', async (req, res, next) => {
  try {
    const dadosRecebidos = req.body
    const fornecedor = new Fornecedor(dadosRecebidos)
    await fornecedor.criar()
    const serializador = new SerializadorFornecedor(res.getHeader('Content-Type'))
    res.status(201).send(serializador.serializar(fornecedor))
  } catch (erro) {
    next(erro)
  }
})

router.options('/:idFornecedor', (req, res) => {
  res.set('Access-Control-Allow-Methods', 'GET, PUT, DELETE')
    .set('Access-Control-Allow-Headers', 'Content-Type')
    .status(204).end()
})

router.get('/:idFornecedor', async (req, res, next) => {
  try {
    const id = req.params.idFornecedor
    const fornecedor = new Fornecedor({ id: id })
    await fornecedor.buscar()
    const serializador = new SerializadorFornecedor(res.getHeader('Content-Type'), ['email', 'categoria', 'dataCriacao', 'dataAtualizacao', 'versao'])
    res.status(200).send(serializador.serializar(fornecedor))
  } catch (erro) {
    next(erro)
  }
})

router.put('/:idFornecedor', async (req, res, next) => {
  try {
    const id = req.params.idFornecedor
    const novosDados = req.body
    const dadosParaAtualizar = Object.assign({}, novosDados, { id: id })
    const fornecedor = new Fornecedor(dadosParaAtualizar)
    await fornecedor.atualizar()
    res.status(204).end()
  } catch (erro) {
    next(erro)
  }
})

router.delete('/:idFornecedor', async (req, res, next) => {
  try {
    const id = req.params.idFornecedor
    const fornecedor = new Fornecedor({ id: id })
    await fornecedor.buscar()
    await fornecedor.remover()
    res.status(204).end()
  } catch (erro) {
    next(erro)
  }
})

// incluindo produtos no roteamento
const routerProdutos = require('../produtos')

// verifica se o fornecedor indicado existe nas requisições de produto
const verificarFornecedor = async (req, res, next) => {
  try {
    const id = req.params.idFornecedor
    const fornecedor = new Fornecedor({ id: id })
    await fornecedor.buscar()
    req.fornecedor = fornecedor // injeta fornecedor na requisição
    next()
  } catch (erro) {
    next(erro)
  }
}

// como toda requisição irá gerar uma instância de fornecedor, esse objeto foi colocado dentro da requisição e
// será utilizado nos métodos de produtos (ao invés de pegar a informação de req.params)
// essa prática é injeção de dependências
router.use('/:idFornecedor/produtos', verificarFornecedor, routerProdutos)

module.exports = router
