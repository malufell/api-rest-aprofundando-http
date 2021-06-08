const Modelo = require("./ModeloTabelaFornecedor");
const NaoEncontrado = require("../../erros/NaoEncontrado")

module.exports = {
  listar() {
    return Modelo.findAll({ raw: true }); //raw true é para trazer somente as informações dos objetos
  },
  inserir(fornecedor) {
    return Modelo.create(fornecedor);
  },
  async buscar(id) {
    const fornecedor = await Modelo.findOne({ where: { id: id } });

    if (!fornecedor) {
      throw new NaoEncontrado('Fornecedor');
    }
    return fornecedor;
  },
  atualizar (id, dadosParaAtualizar) {
    return Modelo.update(dadosParaAtualizar, { where: { id: id } })
  },
  remover (id) {
    return Modelo.destroy({ where: { id: id } })
  }
};
