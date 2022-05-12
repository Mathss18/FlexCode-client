import * as yup from "yup";

export const clienteValidation = yup.object().shape({
  tipoCliente: yup.string().required("O tipo de cliente é obrigatório"),
  situacao: yup.number("").required("A situação é obrigatória"),
  tipoContribuinte: yup
    .number("")
    .nullable(),
  inscricaoEstadual: yup.string().nullable(),
  nome: yup.string().required("O nome é obrigatório"),
  // cpfCnpj: yup.string().required("O CPF/CNPJ é obrigatório"),
  cpfCnpj: yup.string().nullable(),
  email: yup
    .string()
    .email("Digite o e-mail corretamente")
    .nullable(),
  contato: yup.string().nullable(),
  rua: yup.string().nullable(),
  cidade: yup.string().nullable(),
  numero: yup.string().nullable(),
  cep: yup.string().nullable(),
  bairro: yup.string().nullable(),
  estado: yup.string().nullable(),
  telefone: yup.string().nullable(),
  celular: yup.string().nullable(),
  codigoMunicipio: yup.string().nullable(),
});

export const transportadoraValidation = yup.object().shape({
  tipoTransportadora: yup
    .string()
    .required("O tipo de transportadora é obrigatório"),
    situacao: yup.number("").required("A situação é obrigatória"),
    tipoContribuinte: yup
      .number("")
      .nullable(),
    inscricaoEstadual: yup.string().nullable(),
    nome: yup.string().required("O nome é obrigatório"),
    // cpfCnpj: yup.string().required("O CPF/CNPJ é obrigatório"),
    cpfCnpj: yup.string().nullable(),
    email: yup
      .string()
      .email("Digite o e-mail corretamente")
      .nullable(),
    contato: yup.string().nullable(),
    rua: yup.string().nullable(),
    cidade: yup.string().nullable(),
    numero: yup.string().nullable(),
    cep: yup.string().nullable(),
    bairro: yup.string().nullable(),
    estado: yup.string().nullable(),
    telefone: yup.string().nullable(),
    celular: yup.string().nullable(),
    codigoMunicipio: yup.string().nullable(),
});

export const fornecedorValidation = yup.object().shape({
  tipoFornecedor: yup.string().required("O tipo de fornecedor é obrigatório"),
  situacao: yup.number("").required("A situação é obrigatória"),
  tipoContribuinte: yup
    .number("")
    .nullable(),
  inscricaoEstadual: yup.string().nullable(),
  nome: yup.string().required("O nome é obrigatório"),
  // cpfCnpj: yup.string().required("O CPF/CNPJ é obrigatório"),
  cpfCnpj: yup.string().nullable(),
  email: yup
    .string()
    .email("Digite o e-mail corretamente")
    .nullable(),
  contato: yup.string().nullable(),
  rua: yup.string().nullable(),
  cidade: yup.string().nullable(),
  numero: yup.string().nullable(),
  cep: yup.string().nullable(),
  bairro: yup.string().nullable(),
  estado: yup.string().nullable(),
  telefone: yup.string().nullable(),
  celular: yup.string().nullable(),
  codigoMunicipio: yup.string().nullable(),
});

export const funcionarioValidationCreate = yup.object().shape({
  situacao: yup.number("").required("A situação é obrigatória"),
  nome: yup.string().required("O nome é obrigatório"),
  cpf: yup.string().nullable(),
  rg: yup.string().nullable(),
  dataNascimento: yup.string().nullable(),
  sexo: yup.string().required("O sexo é obrigatório"),
  grupo_id: yup.number("").required('O usuario deve ter um grupo'),
  email: yup
    .string()
    .email("Digite o e-mail corretamente")
    .required("O e-mail é obrigatório"),
  senha: yup
    .string()
    .min(6, "A senha deve ter no mínimo 6 caracteres")
    .required("A senha é obrigatória"),
  comissao: yup
    .number("")
    .min(0, "A comissão deve ser maior que 0")
    .required("A comissão é obrigatória"),
  foto: yup.string().nullable(),
  rua: yup.string().nullable(),
  cidade: yup.string().nullable(),
  numero: yup.string().nullable(),
  cep: yup.string().nullable(),
  bairro: yup.string().nullable(),
  estado: yup.string().nullable(),
  telefone: yup.string().nullable(),
  celular: yup.string().nullable(),
  emailPessoal: yup.string().email("Digite o e-mail corretamente"),
});

export const funcionarioValidation = yup.object().shape({
  situacao: yup.number("").required("A situação é obrigatória"),
  nome: yup.string().required("O nome é obrigatório"),
  cpf: yup.string().nullable(),
  rg: yup.string().nullable(),
  dataNascimento: yup.string().nullable(),
  sexo: yup.string().required("O sexo é obrigatório"),
  grupo_id: yup.number("").required('O usuario deve ter um grupo'),
  email: yup
    .string()
    .email("Digite o e-mail corretamente")
    .required("O e-mail é obrigatório"),
  senha: yup
    .string()
    .min(6, "A senha deve ter no mínimo 6 caracteres"),
  comissao: yup
    .number("")
    .min(0, "A comissão deve ser maior que 0")
    .required("A comissão é obrigatória"),
  foto: yup.string().nullable(),
  rua: yup.string().nullable(),
  cidade: yup.string().nullable(),
  numero: yup.string().nullable(),
  cep: yup.string().nullable(),
  bairro: yup.string().nullable(),
  estado: yup.string().nullable(),
  telefone: yup.string().nullable(),
  celular: yup.string().nullable(),
  emailPessoal: yup.string().email("Digite o e-mail corretamente"),
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

export const porcentagemLucroValidation = yup.object().shape({
  descricao: yup.string().required("O nome é obrigatório"),
  porcentagem: yup.number("").required("A porcentagem é obrigatória"),
});

export const gradeVariacoesValidation = yup.object().shape({
  nome: yup.string().required("O nome é obrigatório"),
  variacoes: yup
    .mixed("Preencha todos os campos")
    .required("A variação é obrigatória"),
});

export const produtoValidation = yup.object().shape({
  nome: yup.string().required("O nome do produto é obrigatório"),
  codigoInterno: yup.string().required("O código interno do produto é obrigatório"),
  grupo_produto_id: yup.number().required("O grupo do produto é obrigatório"),
  movimentaEstoque: yup
    .boolean()
    .required("É nescessario informar se o produto movimenta estoque"),
  habilitaNotaFiscal: yup
    .boolean()
    .required("É nescessario informar se o produto habilita nota fiscal"),
  codigoBarras: yup.string().nullable(),
  peso: yup.number("").min(0, "O peso não pode ser negativo").nullable(),
  largura: yup.number("").min(0, "A largura não pode ser negativa").nullable(),
  altura: yup.number("").min(0, "A altura não pode ser negativa").nullable(),
  comprimento: yup.number("").min(0, "O comprimento não pode ser negativo").nullable(),
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
    .moreThan(0, "O custo final não pode zero"),
  estoqueMinimo: yup.number("").min(0, "O valor não pode ser negativo").nullable(),
  estoqueMaximo: yup.number("").min(0, "O valor não pode ser negativo").nullable(),
  quantidadeAtual: yup.number("").min(0, "O valor não pode ser negativo").nullable(),
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
  valor: yup.number("").required().min(0, "O valor não pode ser negativo"),
  comissao: yup.number("").required("A comissão é obrigatória").min(0),
  descricao: yup.string().required('A descrição é obrigatória'),
});

export const ordemServicoValidation = yup.object().shape({
  numero: yup.number("").required().min(0, "O valor não pode ser negativo"),
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
  dataSaida: yup.string().required('A data de saída é obrigatoria'),
  horaSaida: yup.string().required('A hora de saída é obrigatoria'),
  frete: yup
    .number("")
    .required("O frete é obrigatório")
    .min(0, "O valor não pode ser negativo"),
  outros: yup
    .number("")
    .required("Outros gastos é obrigatório")
    .min(0, "O valor não pode ser negativo"),
  desconto: yup
    .number("")
    .required("O desconto é obrigatório")
    .min(0, "O valor não pode ser negativo"),
  total: yup
    .number("")
    .required("O total é obrigatório")
    .min(0, "O valor não pode ser negativo"),
  observacao: yup.string().nullable(),
  observacaoInterna: yup.string().nullable(),
});

export const orcamentoValidation = yup.object().shape({
  numero: yup.number("").required().min(0, "O valor não pode ser negativo"),
  situacao: yup.number("").required("A situação é obrigatória").min(0),
  dataEntrada: yup.string().required("A data de entrada é obrigatória"),
  frete: yup
    .number("")
    .required("O frete é obrigatório")
    .min(0, "O valor não pode ser negativo"),
  outros: yup
    .number("")
    .required("Outros gastos é obrigatório")
    .min(0, "O valor não pode ser negativo"),
  desconto: yup
    .number("")
    .required("O desconto é obrigatório")
    .min(0, "O valor não pode ser negativo"),
  total: yup
    .number("")
    .required("O total é obrigatório")
    .min(0, "O valor não pode ser negativo"),
  observacao: yup.string().nullable(),
  observacaoInterna: yup.string().nullable(),
});

export const comprasValidation = yup.object().shape({
  numero: yup.number("").required('O Número é obrigatório').min(0, "O valor não pode ser negativo"),
  fornecedor_id: yup.object().shape({
    label: yup.string().required(""),
    value: yup.number().required("")
  })
  .nullable()
  .required('Fornecedor é obrigatorio'),
  dataEntrada: yup.string().required("A data de entrada é obrigatória"),
  situacao: yup.number("").required("A situação é obrigatória").min(0),
  frete: yup
  .number("")
  .required("O frete é obrigatório")
  .min(0, "O valor não pode ser negativo"),
  impostos: yup
  .number("")
  .required("Impotos são obrigatórios")
  .min(0, "O valor não pode ser negativo"),
  desconto: yup
  .number("")
  .required("O desconto é obrigatório")
  .min(0, "O valor não pode ser negativo"),
  total: yup
  .number("")
  .required("O total é obrigatório")
  .min(0, "O valor não pode ser negativo"),
  forma_pagamento_id: yup.object().shape({
    label: yup.string().required(""),
    value: yup.number().required("")
  })
  .nullable()
  .required('Forma de pagamento é obrigatorio'),
  tipoFormaPagamento: yup.string("").required("O tipo de pagamento é obrigatório"),
  intervaloParcelas: yup.number("").required("O intervalo de parcelas é obrigatório"),
  quantidadeParcelas: yup.number("").required("A quantidade de parcelas é obrigatória"),
  dataPrimeiraParcela: yup.string("").required("A data da primeira parcela obrigatória"),

  observacao: yup.string().nullable(),
  observacaoInterna: yup.string().nullable(),
});

export const formasPagamentoValidation = yup.object().shape({
  nome: yup.string("").required('O Nome é obrigatório'),
  conta_bancaria_id: yup.number("").required("").min(0, 'Conta bancaria é obrigatória'),
  numeroMaximoParcelas: yup.number("").required("Número máximo de parcelas é obrigatório").min(1, 'Deve ser maior que 0'),
  intervaloParcelas: yup.number("").required("Intervalo de parcelas é obrigatório").min(1, 'Deve ser maior que 0'),
});

export const contasBancariasValidation = yup.object().shape({
  nome: yup.string("").required('O Nome é obrigatório'),
  saldoInicial: yup.number("").required("").min(0, 'Saldo Inicial é obrigatório'),
});

export const vendasValidation = yup.object().shape({
  numero: yup.number("").required('O Número é obrigatório').min(0, "O valor não pode ser negativo"),
  cliente_id: yup.object().shape({
    label: yup.string().required(""),
    value: yup.number().required("")
  })
  .nullable()
  .required('O cliente é obrigatorio'),
  dataEntrada: yup.string().required("A data de entrada é obrigatória"),
  situacao: yup.number("").required("A situação é obrigatória").min(0),
  frete: yup
  .number("")
  .required("O frete é obrigatório")
  .min(0, "O valor não pode ser negativo"),
  impostos: yup
  .number("")
  .required("Impotos são obrigatórios")
  .min(0, "O valor não pode ser negativo"),
  desconto: yup
  .number("")
  .required("O desconto é obrigatório")
  .min(0, "O valor não pode ser negativo"),
  total: yup
  .number("")
  .required("O total é obrigatório")
  .min(0, "O valor não pode ser negativo"),
  forma_pagamento_id: yup.object().shape({
    label: yup.string().required(""),
    value: yup.number().required("")
  })
  .nullable()
  .required('Forma de pagamento é obrigatorio'),
  tipoFormaPagamento: yup.string("").required("O tipo de pagamento é obrigatório"),
  intervaloParcelas: yup.number("").required("O intervalo de parcelas é obrigatório"),
  quantidadeParcelas: yup.number("").required("A quantidade de parcelas é obrigatória"),
  dataPrimeiraParcela: yup.string("").required("A data da primeira parcela obrigatória"),

  observacao: yup.string().nullable(),
  observacaoInterna: yup.string().nullable(),
});

export const ajusteEstoqueValidation = yup.object().shape({
  quantidade: yup.number("").required('A quantidade é obrigatória').moreThan(0, "A quantidade deve ser maior que 0"),
  valorUnitario: yup.number("").required('O Valor unitário é obrigatório').min(0, "O valor não pode ser negativo"),
  tipo: yup.number("").required('O Tipo é obrigatório'),
  observacao: yup.string().required('O motivo do reajuste é obrigatório'),
});

export const transacaoValidation = yup.object().shape({
  data: yup.string().required('A data é obrigatória'),
  valor: yup.number("").required('O Valor é obrigatório').min(0, "O valor não pode ser negativo"),
  tipo: yup.string().required('O tipo é obrigatório'),
  situacao: yup.string().required('A situação é obrigatória'),
  favorecido_id: yup.object().shape({
    label: yup.string().required(""),
    value: yup.number().required("")
  })
  .nullable()
  .required('O favorecido é obrigatorio'),
  tipoFavorecido:  yup.string().required('A situação é obrigatória'),
  conta_bancaria_id: yup.object().shape({
    label: yup.string().required(""),
    value: yup.number().required("")
  })
  .nullable()
  .required('A conta bancária é obrigatoria'),
});
