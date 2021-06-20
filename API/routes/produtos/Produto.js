const Tabela = require('./TabelaProduto')
const CampoInvalido = require('../../erros/CampoInvalido')

class Produto {
  constructor ({
    id,
    titulo,
    preco,
    estoque,
    fornecedor,
    dataCriacao,
    dataAtualizacao,
    versao
  }) {
    this.id = id
    this.titulo = titulo
    this.preco = preco
    this.estoque = estoque
    this.fornecedor = fornecedor
    this.dataCriacao = dataCriacao
    this.dataAtualizacao = dataAtualizacao
    this.versao = versao
  }

  validar () {
    if (typeof this.titulo !== 'string' || this.titulo.length === 0) {
      throw new CampoInvalido('Titulo')
    }
    if (typeof this.preco !== 'number' || this.preco.length === 0) {
      console.log(this.preco)
      throw new CampoInvalido('Preço')
    }
    if (typeof this.estoque !== 'number') {
      throw new CampoInvalido('Estoque')
    }
  }

  async criar () {
    this.validar()
    const resultado = await Tabela.inserir({
      titulo: this.titulo,
      preco: this.preco,
      estoque: this.estoque,
      fornecedor: this.fornecedor
    })

    // para os campos que o usuário não informa, eles vem do próprio sequelize quando cria registro
    this.id = resultado.id
    this.dataCriacao = resultado.dataCriacao
    this.dataAtualizacao = resultado.dataAtualizacao
    this.versao = resultado.versao
  }

  async buscar () {
    const produto = await Tabela.buscar(this.id, this.fornecedor)
    // é necessário especificar os campos que irão retornar
    this.titulo = produto.titulo
    this.preco = produto.preco
    this.estoque = produto.estoque
    this.dataCriacao = produto.dataCriacao
    this.dataAtualizacao = produto.dataAtualizacao
    this.versao = produto.versao
    return produto
  }

  async atualizar () {
    await Tabela.buscar(this.id, this.fornecedor)
    this.validar()
    await Tabela.atualizar(this.id, {
      titulo: this.titulo,
      preco: this.preco,
      estoque: this.estoque
    })
  }

  async remover () {
    await Tabela.remover(this.id, this.fornecedor)
  }

  diminuirEstoque () {
    return Tabela.subtrair(this.id, this.fornecedor, 'estoque', this.estoque)
  }
}

module.exports = Produto
