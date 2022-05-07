import { useFormik } from "formik";
import React, { createContext, useContext, useState } from "react";
import { initialValues } from "../constants/produtosInitialValues";
import { produtoValidation } from "../validators/validationSchema";

export const GerenciarProdutosContext = createContext({});

function GerenciarProdutosContextProvider(props) {

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