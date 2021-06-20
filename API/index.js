const express = require('express')
const app = express()
const router = require('./routes/fornecedores')
const routerV2 = require('./routes/fornecedores/rotas.v2')
const NaoEncontrado = require('./erros/NaoEncontrado')
const CampoInvalido = require('./erros/CampoInvalido')
const DadosNaoFornecidos = require('./erros/DadosNaoFornecidos')
const ValorNaoSuportado = require('./erros/ValorNaoSuportado')
const formatosAceitos = require('./Serializador').formatosAceitos
const SerializadorErro = require('./Serializador').SerializadorErro

app.use(express.json())

// esse middleware antes do router valida se os dados foram requisitados nos padrões suportados
// cabeçalho "Accept" que informa qual o formato aceito pelo cliente da API
// caso solicite formato não aceito, a requisição nem vai pra frente, o que é bom pra não consumir recursos desnecessários
app.use((req, res, next) => {
  let formatoRequisitado = req.header('Accept')

  // se o formato não é especificado, o valor default é */*, por isso aqui ele será alterado para json
  if (formatoRequisitado === '*/*') {
    formatoRequisitado = 'application/json'
  }
  if (formatosAceitos.indexOf(formatoRequisitado) === -1) {
    res.status(406).end()
    return
  }
  res.setHeader('Content-Type', formatoRequisitado)
  next()
})

// CORS - acesso a API por outro domínio
app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', 'https://developer.mozilla.org')
  next()
})

app.use('/api/fornecedores', router)
app.use('/api/v2/fornecedores', routerV2)

app.use((erro, req, res, next) => {
  let status = 500
  if (erro instanceof NaoEncontrado) {
    status = 404
  }
  if (erro instanceof CampoInvalido || erro instanceof DadosNaoFornecidos) {
    status = 400
  }
  if (erro instanceof ValorNaoSuportado) {
    status = 406
  }

  // a resposta do erro tbm foi padronizada
  const serializador = new SerializadorErro(res.getHeader('Content-Type'))
  res.status(status).send(serializador.serializar({ mensagem: erro.message, id: erro.idErro }))
})

app.listen(3000, () => console.log('servidor rodando na porta 3000'))
