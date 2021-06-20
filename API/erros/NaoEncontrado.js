class NaoEncontrado extends Error {
  constructor (nomeEntidade) {
    super(`${nomeEntidade} não encontrado!`)
    this.name = 'NaoEncontrado'
    this.idErro = 0
  }
}

module.exports = NaoEncontrado
