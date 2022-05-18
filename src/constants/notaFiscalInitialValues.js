import moment from "moment";
export const initialValues = {
  tpNF: 1,
  finNFe: 1,
  natOp: [],
  clienteFornecedor_id: [],
  indFinal: 1,
  indPres: "2",
  transportadora_id: [],
  modFrete: 2,
  frete: 0,

  produtos: [],
  parcelas: [],
  totalProdutos: 0,

  forma_pagamento_id: null,
  quantidadeParcelas: 1,
  intervaloParcelas: 0,
  tipoFormaPagamento: "1", // 0 - À vista, 1 - A prazo
  dataPrimeiraParcela: moment().format("YYYY-MM-DD"),
  esp: "",
  qVol: "",
  desconto: 0,
  pesoB: "",
  pesoL: "",
  unidadePadrao: "",
  infCpl: "",

  totalFinal: 0,

};
