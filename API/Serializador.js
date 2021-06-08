const ValorNaoSuportado = require("./erros/ValorNaoSuportado");
const jsontoxml = require("jsontoxml");

class Serializador {
  json(dados) {
    return JSON.stringify(dados);
  }

  //xml é parecido com HTML e possui tags
  xml(dados) {
    let tag = this.tagSingular;

    //ajusta a exibição dos dados, uma TAG externa no plural para o array e tags individuais no singular para cada objeto
    if (Array.isArray(dados)) {
      tag = this.tagPlural;
      dados = dados.map((item) => { return { [this.tagSingular]: item } });
    }

    return jsontoxml({ [tag]: dados });
  }

  serializar(dados) {
    dados = this.filtrar(dados);
    if (this.contentType === "application/json") {
      return this.json(dados);
    }
    if (this.contentType === "application/xml") {
      return this.xml(dados);
    }
    throw new ValorNaoSuportado(this.contentType);
  }

  //vai retornar somente os campos públicos
  filtrarObjeto(dados) {
    const novoObjeto = {};

    //hasOwnProperty() retorna um booleano indicando se o objeto possui a propriedade especificada
    this.camposPublicos.forEach((campo) => {
      if (dados.hasOwnProperty(campo)) {
        novoObjeto[campo] = dados[campo];
      }
    });
    return novoObjeto;
  }

  //identifica se é um array (que se aplica ao retorno do findAll do sequelize)
  //findeOne retorna só um objeto, aí não precisa do map
  filtrar(dados) {
    if (Array.isArray(dados)) {
      dados = dados.map((item) => { return this.filtrarObjeto(item) });
    } else {
      dados = this.filtrarObjeto(dados);
    }
    return dados;
  }
}

class SerializadorFornecedor extends Serializador {
  constructor(contentType, camposExtras) {
    super();
    this.contentType = contentType;
    this.camposPublicos = ["id", "empresa"].concat(camposExtras || []);
    this.tagSingular = "fornecedor";
    this.tagPlural = "fornecedores";
  }
}

class SerializadorProduto extends Serializador {
  constructor (contentType, camposExtras) { 
    super();
    this.contentType = contentType;
    this.camposPublicos = ["id", "titulo"].concat(camposExtras || []);
    this.tagSingular = "produto";
    this.tagPlural = "produtos";
  }
}

class SerializadorErro extends Serializador {
  constructor(contentType, camposExtras) {
    super();
    this.contentType = contentType;
    this.camposPublicos = ["id", "mensagem"].concat(camposExtras || []);
    this.tagSingular = "erro";
    this.tagPlural = "erros";
  }
}

module.exports = {
  Serializador: Serializador,
  SerializadorFornecedor: SerializadorFornecedor,
  SerializadorProduto: SerializadorProduto,
  SerializadorErro: SerializadorErro,
  formatosAceitos: ["application/json", 'application/xml'],
};
