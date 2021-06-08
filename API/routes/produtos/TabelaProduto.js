const Modelo = require("./ModeloTabelaProduto");
const database = require("../../database/config");
const NaoEncontrado = require("../../erros/NaoEncontrado");

module.exports = {
  listar(idFornecedor) {
    return Modelo.findAll({ where: { fornecedor: idFornecedor }, raw: true });
  },
  inserir(dados) {
    return Modelo.create(dados);
  },
  async buscar(idProduto, idFornecedor) {
    const produto = await Modelo.findOne({ where: { id: idProduto, fornecedor: idFornecedor }, raw: true });

    if (!produto) {
      throw new NaoEncontrado('Produto');
    }
    return produto;
  },
  atualizar(id, dadosParaAtualizar) {
    return Modelo.update(dadosParaAtualizar, { where: { id: id } });
  },
  subtrair(idProduto, idFornecedor, campo, quantidade) {
    return database.transaction(async (transacao) => {
      const produto = await Modelo.findOne({ where: { id: idProduto, fornecedor: idFornecedor }});
      produto[campo] = quantidade;
      await produto.save();
      return produto;
    });
  },
  remover(idProduto, idFornecedor) {
    return Modelo.destroy({
      where: { id: idProduto, fornecedor: idFornecedor },
    });
  },
};
