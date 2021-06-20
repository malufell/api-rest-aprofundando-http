module.exports = {
  listar () {
    return []
  },
  inserir (fornecedor) {
    return {
      id: 2,
      dataCriacao: '01/07/2020',
      dataAtualizacao: '01/07/2020',
      versao: 5
    }
  },
  async pegarPorId (id) {
    return {
      id: 2,
      dataCriacao: '01/07/2020',
      dataAtualizacao: '01/07/2020',
      versao: 5
    }
  },
  async atualizar (id, dadosParaAtualizar) {
  },
  async remover (id) {
  }
}
