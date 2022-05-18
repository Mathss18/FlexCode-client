import { useFormik } from "formik";
import React, { createContext, useContext, useState } from "react";
import { initialValues } from "../constants/notaFiscalInitialValues";
import { produtoValidation } from "../validators/validationSchema";

export const NotaFiscalContext = createContext({});

function NotaFiscalContextProvider(props) {
  function handleOnSubmit(values) {
    console.log(values);
  }

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: (event) => {
      handleOnSubmit(event);
    },
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

export function useNotaFiscalContext() {
  return useContext(NotaFiscalContext);
}

export default NotaFiscalContextProvider;
