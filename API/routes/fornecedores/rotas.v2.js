const router = require("express").Router();
const TabelaFornecedor = require("./TabelaFornecedor");
const SerializadorFornecedor = require("../../Serializador").SerializadorFornecedor;

router.options('/', (req, res) => {
  res.set('Access-Control-Allow-Methods', 'GET, POST')
     .set('Access-Control-Allow-Headers', 'Content-Type')
     .status(204).end()
})

router.get("/", async (req, res) => {
  const resultados = await TabelaFornecedor.listar();
  const serializador = new SerializadorFornecedor(res.getHeader("Content-Type"));
  res.status(200).send(serializador.serializar(resultados));
});

module.exports = router;