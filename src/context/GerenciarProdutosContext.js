import React, { createContext, useState } from "react";

export const GerenciarProdutosContext = createContext({});

export const GerenciarProdutosProvider = (props) => {
  const [values, setValues] = useState({
    nome: "",
    codigoInterno: "",
    grupo_produto_id: 0,
    movimentaEstoque: false,
    habilitaNotaFiscal: false,
    possuiVariacoes: false,
    peso: 0,
    largura: 0,
    altura: 0,
    comprimento: 0,
    comissao: 0,
    descricao: "",
    valor_custo: 0,
    despesasAdicionais: 0,
    outras_despesas: 0,
    custoFinal: 0,
    estoqueMinimo: 0,
    estoqueMaximo: 0,
    quantidadeAtual: 0,
    foto: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    ncm: "",
    cest: "",
    origem: "",
    pesoLiquido: 0,
    pesoBruto: 0,
    numeroFci: 0,
    valorAproxTribut: 0,
    valorPixoPis: 0,
    valorFixoPisSt: 0,
    valorFixoCofins: 0,
    valorFixoCofinsSt: 0,
    values_profit: []
  });

  console.log(values)

  return (
    <GerenciarProdutosContext.Provider value={{values, setValues}}>
      {props.children}
    </GerenciarProdutosContext.Provider>
  );
}