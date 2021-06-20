const TabelaFornecedor = require('./TabelaFornecedor')
const CampoInvalido = require('../../erros/CampoInvalido')
const DadosNaoFornecidos = require('../../erros/DadosNaoFornecidos')

class Fornecedor {
  constructor ({
    id,
    empresa,
    email,
    categoria,
    dataCriacao,
    dataAtualizacao,
    versao
  }) {
    this.id = id
    this.empresa = empresa
    this.email = email
    this.categoria = categoria
    this.dataCriacao = dataCriacao
    this.dataAtualizacao = dataAtualizacao
    this.versao = versao
  }

  validar () {
    const campos = ['empresa', 'email', 'categoria']

    campos.forEach((campo) => {
      const valor = this[campo]

      if (typeof valor !== 'string' || valor.length === 0) {
        throw new CampoInvalido(campo)
      }
    })

    return true
  }

  async criar () {
    this.validar()
    const resultado = await TabelaFornecedor.inserir({
      empresa: this.empresa,
      email: this.email,
      categoria: this.categoria
    })

    // para os campos que o usuário não informa, eles vem do próprio sequelize quando cria registro
    this.id = resultado.id
    this.dataCriacao = resultado.dataCriacao
    this.dataAtualizacao = resultado.dataAtualizacao
    this.versao = resultado.versao
  }

  async buscar () {
    const fornecedor = await TabelaFornecedor.buscar(this.id)
    // é necessário especificar os campos que irão retornar:
    this.empresa = fornecedor.empresa
    this.categoria = fornecedor.categoria
    this.email = fornecedor.email
    this.dataCriacao = fornecedor.dataCriacao
    this.dataAtualizacao = fornecedor.dataAtualizacao
    this.versao = fornecedor.versao
    return fornecedor
  }

  async atualizar () {
    await TabelaFornecedor.buscar(this.id)

    const campos = ['empresa', 'email', 'categoria']
    const dadosParaAtualizar = {}

    campos.forEach((campo) => {
      const valor = this[campo]
      if (typeof valor === 'string' && valor.length > 0) {
        dadosParaAtualizar[campo] = valor
      }
    })

    if (Object.keys(dadosParaAtualizar).length === 0) {
      throw new DadosNaoFornecidos()
    }

    await TabelaFornecedor.atualizar(this.id, dadosParaAtualizar)
  }

  async remover () {
    await TabelaFornecedor.remover(this.id)
  }
}

module.exports = Fornecedor
