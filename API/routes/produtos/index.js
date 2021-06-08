const router = require("express").Router({ mergeParams: true });
const Tabela = require("./TabelaProduto");
const Produto = require("./Produto");
const Serializador = require("../../Serializador").SerializadorProduto;

router.options('/', (req, res) => {
  res.set('Access-Control-Allow-Methods', 'GET, POST')
     .set('Access-Control-Allow-Headers', 'Content-Type')
     .status(204).end()
})

router.get("/", async (req, res) => {
  const produtos = await Tabela.listar(req.fornecedor.id);
  const serializador = new Serializador(res.getHeader("Content-Type"));
  res.status(200).send(serializador.serializar(produtos));
});

router.post("/", async (req, res, next) => {
  try {
    const idFornecedor = req.fornecedor.id;
    const dadosProduto = req.body;
    const dadosParaCadastro = Object.assign({}, dadosProduto, { fornecedor: idFornecedor });
    const produto = new Produto(dadosParaCadastro);
    await produto.criar();
    const serializador = new Serializador(res.getHeader("Content-Type"));
    const timestamp = (new Date(produto.dataAtualizacao)).getTime();
    res.set('ETag', produto.versao)
       .set('Last-Modified', timestamp)
       .set('Location', `/api/fornecedores/${produto.fornecedor}/produtos/${produto.id}`)
       .status(201).send(serializador.serializar(produto));
  } catch (erro) {
    next(erro);
  }
});

router.options("/:id", (req, res) => {
  res.set('Access-Control-Allow-Methods', 'GET, PUT, DELETE, HEAD')
     .set('Access-Control-Allow-Headers', 'Content-Type')
     .status(204).end()
})

router.get("/:id", async (req, res, next) => {
  try {
    const dados = { id: req.params.id, fornecedor: req.fornecedor.id };
    const produto = new Produto(dados);
    await produto.buscar();
    const serializador = new Serializador(res.getHeader("Content-Type"), [
      "preco",
      "estoque",
      "fornecedor",
      "dataCriacao",
      "dataAtualizacao",
      "versao",
    ]);
    const timestamp = (new Date(produto.dataAtualizacao)).getTime();
    res.set('ETag', produto.versao)
       .set('Last-Modified', timestamp)
       .status(200).send(serializador.serializar(produto));
  } catch (erro) {
    next(erro);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const dadosParaAtualizar = Object.assign({}, req.body, { id: req.params.id, fornecedor: req.fornecedor.id });
    const produto = new Produto(dadosParaAtualizar);
    await produto.atualizar();
    await produto.buscar(); //chama esse método pra buscar a data de atualização nova e informar no cabeçalho da req
    const timestamp = (new Date(produto.dataAtualizacao)).getTime();
    res.set('ETag', produto.versao)
       .set('Last-Modified', timestamp)
       .status(204).end();
  } catch (erro) {
    next(erro);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const dados = { id: req.params.id, fornecedor: req.fornecedor.id };
    const produto = new Produto(dados);
    await produto.remover();
    res.status(204).end();
  } catch (erro) {
    next(erro);
  }
});

//como acessar somente o cabeçalho, sem o corpo de uma requisição
router.head("/:id", async (req, res, next) => {
  try {
    const dados = { id: req.params.id, fornecedor: req.fornecedor.id };
    const produto = new Produto(dados);
    await produto.buscar();
    const timestamp = (new Date(produto.dataAtualizacao)).getTime();
    res.set('ETag', produto.versao)
       .set('Last-Modified', timestamp)
       .status(200).end();
  } catch (erro) {
    next(erro);
  }
});

router.options("/:id/diminuir-estoque", (req, res) => {
  res.set('Access-Control-Allow-Methods', 'POST')
     .set('Access-Control-Allow-Headers', 'Content-Type')
     .status(204).end()
})

router.post("/:id/diminuir-estoque", async (req, res, next) => {
  const quantidade = req.body.quantidade;
  try {
    const produto = new Produto({ id: req.params.id, fornecedor: req.fornecedor.id });
    await produto.buscar();
    produto.estoque = produto.estoque - quantidade;
    await produto.diminuirEstoque();
    await produto.buscar(); //chama esse método pra buscar a data de atualização nova e informar no cabeçalho da req
    const timestamp = (new Date(produto.dataAtualizacao)).getTime();
    res.set('ETag', produto.versao)
       .set('Last-Modified', timestamp)
       .status(204).end();
  } catch (erro) {
    next(erro);
  }
});
module.exports = router;
