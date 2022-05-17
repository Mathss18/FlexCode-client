import { useFormik } from "formik";
import React, { createContext, useContext, useState } from "react";
import { initialValues } from "../constants/produtosInitialValues";
import { produtoValidation } from "../validators/validationSchema";

export const NotaFiscalContext = createContext({});

function NotaFiscalContextProvider(props) {
  const [values, setValues] = useState(initialValues);

  function handleOnSubmit(values) {
    console.log(values);
  }

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: (event) => {
      handleOnSubmit(event);
    },
    validationSchema: produtoValidation,
  });

  return (
    <NotaFiscalContext.Provider
      value={{
        formik: formik,
      }}
    >
      {props.children}
    </NotaFiscalContext.Provider>
  );
}

export function useProdutoContext() {
  return useContext(NotaFiscalContext);
}

export default NotaFiscalContextProvider;
