import * as yup from "yup";

export const clienteValidation = yup.object().shape({
  tipoCliente: yup.string().required("O tipo de cliente é obrigatório"),
  situacao: yup.number("").required("A situação é obrigatória"),
  tipoContribuinte: yup
    .number("")
    .required("O tipo de contribuinte é obrigatório"),
  inscricaoEstadual: yup
    .string()
    .required("A inscrição estadual é obrigatória"),
  nome: yup.string().required("O nome do cliente é obrigatório"),
  cpfCnpj: yup.string().required("O CPF/CNPJ é obrigatório"),
  email: yup
    .string()
    .email("Digite o e-mail corretamente")
    .required("O e-mail é obrigatório"),
  contato: yup.string().required("O contato é obrigatório"),
  rua: yup.string().required("A rua é obrigatória"),
  cidade: yup.string().required("A cidade é obrigatória"),
  numero: yup.string().required("O número é obrigatório"),
  cep: yup.string().required("O CEP é obrigatório"),
  bairro: yup.string().required("O bairro é obrigatório"),
  estado: yup.string().required("O estado é obrigatório"),
  telefone: yup.string().required("O telefone é obrigatório"),
  celular: yup.string().required("O celular é obrigatório"),
  codigoMunicipio: yup.string().required("O código do município é obrigatório"),
});

export const transportadoraValidation = yup.object().shape({
  tipoTransportadora: yup
    .string()
    .required("O tipo de transportadora é obrigatório"),
  situacao: yup.number("").required("A situação é obrigatória"),
  tipoContribuinte: yup
    .number("")
    .required("O tipo de contribuinte é obrigatório"),
  inscricaoEstadual: yup
    .string()
    .required("A inscrição estadual é obrigatória"),
  nome: yup.string().required("O nome da transportadora é obrigatório"),
  cpfCnpj: yup.string().required("O CPF/CNPJ é obrigatório"),
  email: yup
    .string()
    .email("Digite o e-mail corretamente")
    .required("O e-mail é obrigatório"),
  contato: yup.string().required("O contato é obrigatório"),
  rua: yup.string().required("A rua é obrigatória"),
  cidade: yup.string().required("A cidade é obrigatória"),
  numero: yup.string().required("O número é obrigatório"),
  cep: yup.string().required("O CEP é obrigatório"),
  bairro: yup.string().required("O bairro é obrigatório"),
  estado: yup.string().required("O estado é obrigatório"),
  telefone: yup.string().required("O telefone é obrigatório"),
  celular: yup.string().required("O celular é obrigatório"),
  codigoMunicipio: yup.string().required("O código do município é obrigatório"),
});

export const fornecedorValidation = yup.object().shape({
  tipoFornecedor: yup.string().required("O tipo é obrigatório"),
  situacao: yup.number("").required("A situação é obrigatória"),
  tipoContribuinte: yup
    .number("")
    .required("O tipo de contribuinte é obrigatório"),
  inscricaoEstadual: yup
    .string()
    .required("A inscrição estadual é obrigatória"),
  nome: yup.string().required("O nome é obrigatório"),
  cpfCnpj: yup.string().required("O CPF/CNPJ é obrigatório"),
  email: yup
    .string()
    .email("Digite o e-mail corretamente")
    .required("O e-mail é obrigatório"),
  contato: yup.string().required("O contato é obrigatório"),
  rua: yup.string().required("A rua é obrigatória"),
  cidade: yup.string().required("A cidade é obrigatória"),
  numero: yup.string().required("O número é obrigatório"),
  cep: yup.string().required("O CEP é obrigatório"),
  bairro: yup.string().required("O bairro é obrigatório"),
  estado: yup.string().required("O estado é obrigatório"),
  telefone: yup.string().required("O telefone é obrigatório"),
  celular: yup.string().required("O celular é obrigatório"),
  codigoMunicipio: yup.string().required("O código do município é obrigatório"),
});

export const funcionarioValidationCreate = yup.object().shape({
  situacao: yup.number("").required("A situação é obrigatória"),
  nome: yup.string().required("O nome é obrigatório"),
  cpf: yup.string().required("O CPF é obrigatório"),
  rg: yup.string().required("O RG é obrigatório"),
  dataNascimento: yup.string().required("A data de nascimento é obrigatória"),
  sexo: yup.string().required("O sexo é obrigatório"),
  grupo_id: yup.number("").required("O grupo é obrigatório"),
  email: yup.string().email("Digite o e-mail corretamente").required("O email é obrigatório"),
  senha: yup.string().min(6, "A senha deve ter no mínimo 6 caracteres").required("A senha é obrigatória"),
  comissao: yup.number("").required("A comissão é obrigatória").min(0),
  foto: yup.string().required("A foto é obrigatória"),
  rua: yup.string().required("A rua é obrigatória"),
  cidade: yup.string().required("A cidade é obrigatória"),
  numero: yup.string().required("O número é obrigatório"),
  cep: yup.string().required("O CEP é obrigatório"),
  bairro: yup.string().required("O bairro é obrigatório"),
  estado: yup.string().required("O estado é obrigatório"),
  telefone: yup.string().required("O telefone é obrigatório"),
  celular: yup.string().required("O celular é obrigatório"),
  emailPessoal: yup
    .string()
    .email("Digite o e-mail corretamente")
    .required("O email pessoal é obrigatório"),
});

export const funcionarioValidation = yup.object().shape({
  situacao: yup.number("").required("A situação é obrigatória"),
  nome: yup.string().required("O nome é obrigatório"),
  cpf: yup.string().required("O CPF é obrigatório"),
  rg: yup.string().required("O RG é obrigatório"),
  dataNascimento: yup.string().required("A data de nascimento é obrigatória"),
  sexo: yup.string().required("O sexo é obrigatório"),
  grupo_id: yup.number("").required("O grupo é obrigatório"),
  email: yup.string().email("Digite o e-mail corretamente").required("O email é obrigatório"),
  senha: yup.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
  comissao: yup.number("").required("A comissão é obrigatória").min(0),
  foto: yup.string().required("A foto é obrigatória"),
  rua: yup.string().required("A rua é obrigatória"),
  cidade: yup.string().required("A cidade é obrigatória"),
  numero: yup.string().required("O número é obrigatório"),
  cep: yup.string().required("O CEP é obrigatório"),
  bairro: yup.string().required("O bairro é obrigatório"),
  estado: yup.string().required("O estado é obrigatório"),
  telefone: yup.string().required("O telefone é obrigatório"),
  celular: yup.string().required("O celular é obrigatório"),
  emailPessoal: yup
    .string()
    .email("Digite o e-mail corretamente")
    .required("O email pessoal é obrigatório"),
});

export const grupoValidation = yup.object().shape({
  nome: yup.string().required("O nome é obrigatório"),
  horaInicio: yup.string().required("A hora inicio é obrigatória"),
  horaFim: yup.string().required("A hora fim é obrigatória"),
});

export const grupoProdutoValidation = yup.object().shape({
  nome: yup.string().required("O nome é obrigatório"),
  grupoPai: yup.number("").required("Grupo pai é obrigatório"),
  // porcentagemLucro: yup.number('').required('A porcentagem de lucro é obrigatória'),
});

export const unidadeProdutoValidation = yup.object().shape({
  nome: yup.string().required("O nome é obrigatório"),
  sigla: yup.string().required("A sigla é obrigatória"),
});

export const gradeVariacoesValidation = yup.object().shape({
  nome: yup.string().required("O nome é obrigatório"),
  variacoes: yup
    .mixed("Preencha todos os campos")
    .required("A variação é obrigatória"),
});

export const produtoValidation = yup.object().shape({
  nome: yup.string().required("O nome é obrigatório"),
  codigoInterno: yup.string().required("O código interno é obrigatório"),
  grupo_produto_id: yup
    .number("")
    .required("O grupo é obrigatório")
    .min(0, "O grupo de produto é obrigatório"),
  movimentaEstoque: yup
    .boolean()
    .required("É nescessario informar se o produto movimenta estoque"),
  habilitaNotaFiscal: yup
    .boolean()
    .required("É nescessario informar se o produto habilita nota fiscal"),
  codigoBarras: yup
    .string()
    .required("É nescessario informar o código de barras"),
  peso: yup.number("").min(0, "O peso não pode ser negativo"),
  largura: yup.number("").min(0, "A largura não pode ser negativa"),
  altura: yup.number("").min(0, "A altura não pode ser negativa"),
  comprimento: yup.number("").min(0, "O comprimento não pode ser negativo"),
  comissao: yup
    .number("")
    .required("A comissão é obrigatória")
    .min(0, "A comissão não pode ser negativa"),
  // descricao: "",
  valorCusto: yup
    .number("")
    .required("O valor de custo é obrigatório")
    .min(0, "O valor de custo não pode ser negativo"),
  despesasAdicionais: yup
    .number("")
    .required("As despesas adicionais são obrigatórias")
    .min(0, "As despesas adicionais não podem ser negativas"),
  outrasDespesas: yup
    .number("")
    .required("As outras despesas são obrigatórias")
    .min(0, "As outras despesas não podem ser negativas"),
  custoFinal: yup
    .number("")
    .required("O custo final é obrigatório")
    .min(0, "O custo final não pode ser negativo"),
  estoqueMinimo: yup.number("").min(0, "O valor não pode ser negativo"),
  estoqueMaximo: yup.number("").min(0, "O valor não pode ser negativo"),
  quantidadeAtual: yup.number("").min(0, "O valor não pode ser negativo"),
  // foto: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
  // ncm: "",
  // cest: "",
  // origem: "",
  // pesoLiquido: 0,
  // pesoBruto: 0,
  // numeroFci: 0,
  // valorAproxTribut: 0,
  // valorPixoPis: 0,
  // valorFixoPisSt: 0,
  // valorFixoCofins: 0,
  // valorFixoCofinsSt: 0,
  // porcentagem_lucro_produto: []
});

export const servicoValidation = yup.object().shape({
  nome: yup.string().required("O nome é obrigatório"),
  codigoInterno: yup.string().required("O código interno é obrigatório"),
  valor: yup.number("").min(0, "O valor não pode ser negativo"),
  comissao: yup.number("").required("A comissão é obrigatória").min(0),
  // descricao: yup.string().required('A descrição é obrigatória'),
});

export const ordemServicoValidation = yup.object().shape({
  numero: yup.number("").min(0, "O valor não pode ser negativo"),
  // cliente_id: yup.object().shape({
  //   label: yup.string().required(),
  //   value: yup.number().required(),
  // }),
  // funcionarios_id: yup.array().of(
  //   yup.object().shape({
  //     label: yup.string().required(),
  //     value: yup.number().required(),
  //   })
  // ),
  // produtos: [],
  // servicos: [],
  situacao: yup.number("").required("A situação é obrigatória").min(0),
  dataEntrada: yup.string().required("A data de entrada é obrigatória"),
  horaEntrada: yup.string().required("A hora de entrada é obrigatória"),
  dataSaida: yup.string().nullable(),
  horaSaida: yup.string().nullable(),
  frete: yup.number("").required("O frete é obrigatório").min(0, "O valor não pode ser negativo"),
  outros: yup.number("").required("Outros gastos é obrigatório").min(0,"O valor não pode ser negativo"),
  desconto: yup.number("").required("O desconto é obrigatório").min(0,"O valor não pode ser negativo"),
  total: yup.number("").required("O total é obrigatório").min(0,"O valor não pode ser negativo"),
  observacao: yup.string(),
  observacaoInterna: yup.string(),

  
});

export const orcamentoValidation = yup.object().shape({
  numero: yup.number("").min(0, "O valor não pode ser negativo"),
  // cliente_id: yup.object().shape({
  //   label: yup.string().required(),
  //   value: yup.number().required(),
  // }),
  // funcionarios_id: yup.array().of(
  //   yup.object().shape({
  //     label: yup.string().required(),
  //     value: yup.number().required(),
  //   })
  // ),
  // produtos: [],
  // servicos: [],
  situacao: yup.number("").required("A situação é obrigatória").min(0),
  dataEntrada: yup.string().required("A data de entrada é obrigatória"),
  frete: yup.number("").required("O frete é obrigatório").min(0, "O valor não pode ser negativo"),
  outros: yup.number("").required("Outros gastos é obrigatório").min(0,"O valor não pode ser negativo"),
  desconto: yup.number("").required("O desconto é obrigatório").min(0,"O valor não pode ser negativo"),
  total: yup.number("").required("O total é obrigatório").min(0,"O valor não pode ser negativo"),
  observacao: yup.string(),
  observacaoInterna: yup.string(),
});
