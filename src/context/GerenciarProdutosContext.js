import { useFormik } from "formik";
import React, { createContext, useContext, useState } from "react";
import { produtoValidation } from "../validators/validationSchema";

export const GerenciarProdutosContext = createContext({});

function GerenciarProdutosContextProvider(props) {
  const initialValues = {
    nome: "",
    codigoInterno: "",
    grupo_produto_id: -1,
    movimentaEstoque: false,
    habilitaNotaFiscal: false,
    possuiVariacoes: false,
    peso: 0,
    largura: 0,
    altura: 0,
    comprimento: 0,
    comissao: 0,
    descricao: "",
    valorCusto: 0,
    despesasAdicionais: 0,
    outrasDespesas: 0,
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
    valuesProfit: []
  };
  const [values, setValues] = useState(initialValues);

  function handleOnSubmit(values) {
    console.log(values);
  }

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: (event) => { handleOnSubmit(event) },
    validationSchema: produtoValidation,
  })

  return (
    <GerenciarProdutosContext.Provider value={
      {
        useValues: {values, setValues},
        formik: formik
      }
    }>
      {props.children}
    </GerenciarProdutosContext.Provider>
  );

}

export function useProdutoContext() {
  return useContext(GerenciarProdutosContext);
}

export default GerenciarProdutosContextProvider;