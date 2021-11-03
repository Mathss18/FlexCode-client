import React, { createContext, useState } from "react";

export const GerenciarProdutosContext = createContext({});

export const GerenciarProdutosProvider = (props) => {
  const [values, setValues] = useState({
    name: 'Fulano',
    peso: ''
  });

  console.log(values)

  return (
    <GerenciarProdutosContext.Provider value={{values, setValues}}>
      {props.children}
    </GerenciarProdutosContext.Provider>
  );
}