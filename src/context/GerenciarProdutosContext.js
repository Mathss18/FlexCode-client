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
    peso: '',
    largura: '',
    altura: '',
    comprimento: '',
    comissao: 0,
    descricao: "",
    valorCusto: 0,
    despesasAdicionais: 0,
    outrasDespesas: 0,
    custoFinal: 0,
    estoqueMinimo: '',
    estoqueMaximo: '',
    quantidadeAtual: '',
    fotos: [],
    fotoPrincipal: [],
    ncm: "",
    cest: "",
    origem: "",
    pesoLiquido: '',
    pesoBruto: '',
    numeroFci: '',
    valorAproxTribut: '',
    valorPixoPis: '',
    valorFixoPisSt: '',
    valorFixoCofins: '',
    valorFixoCofinsSt: '',
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