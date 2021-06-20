const { describe, test, expect } = require('@jest/globals')
const Fornecedor = require('../../../api/routes/fornecedores/Fornecedor')
const CampoInvalido = require('../../../api/erros/CampoInvalido')
// eslint-disable-next-line no-undef
jest.mock('../../../api/routes/fornecedores/TabelaFornecedor')

describe('classe Fornecedor', () => {
  test('ao informar os campos "empresa", "email" e "categoria" com valor no formato string, o método validar() retorna true', () => {
    const fornecedor = new Fornecedor({
      empresa: 'teste123',
      email: 'teste@teste.com',
      categoria: 'brinquedos'
    })
    expect(fornecedor.validar()).toBe(true)
  })

  test('ao informar o campo "empresa" com valor no formato number, o método validar() lança a exceção "campo inválido"', () => {
    const fornecedor = new Fornecedor({
      empresa: 12,
      email: 'teste@teste.com',
      categoria: 'brinquedos'
    })
    expect(() => fornecedor.validar()).toThrow(new CampoInvalido('empresa'))
  })

  test('o método criar() foi executado com sucesso', async () => {
    const fornecedor = new Fornecedor({
      empresa: 'teste',
      email: 'contato@teste.com.br',
      categoria: 'brinquedos'
    })

    await fornecedor.criar()

    expect(fornecedor.id).toBe(2)
    expect(fornecedor.dataCriacao).toBe('01/07/2020')
    expect(fornecedor.dataAtualizacao).toBe('01/07/2020')
    expect(fornecedor.versao).toBe(5)
  })
})
