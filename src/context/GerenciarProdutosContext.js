import React, { createContext, useState } from "react";

export const GerenciarProdutosContext = createContext({});

export const GerenciarProdutosProvider = (props) => {
  const [values, setValues] = useState({
    name: '',
    codigo_interno: '',
    codigo_barras: '',
    grupo_do_produto: '',
    movimenta_estoque: 0,
    habilitar_nota_fiscal: 0,
    possui_variacoes: 0,
    possui_composicao: 0,
    peso: '',
    largura: '',
    altura: '',
    comprimento: '',
    descricao: '',
    comicao: '',
    valor_custo: '',
    despesa_acessoria: '',
    outras_despesas: '',
    custo_final: '',
    estoque_minimo: '',
    estoque_maximo: '',
    quantidade_atual: '',
    foto: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    fiscal_ncm: '',
    fiscal_cest: '',
    fiscal_origem: '',
    fiscal_peso_liquido: '',
    fiscal_peso_bruto: '',
    fiscal_fci: '',
    fiscal_aprox_tribut: '',
    fiscal_pis: '',
    fiscal_pis_st: '',
    fiscal_cofins: '',
    fiscal_cofins_st: '',
    values_profit: [{}]
  });

  console.log(values)

  return (
    <GerenciarProdutosContext.Provider value={{values, setValues}}>
      {props.children}
    </GerenciarProdutosContext.Provider>
  );
}