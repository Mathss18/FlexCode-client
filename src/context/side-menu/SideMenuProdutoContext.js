import React, { createContext, useContext, useState} from "react";

const SideMenuProdutoContext = createContext();

function SideMenuProdutoContextProvider({ children }){
  const [openMenu, setOpenMenu] = useState(false);
  return (
    <SideMenuProdutoContext.Provider value={[openMenu, setOpenMenu]}>
      {children}
    </SideMenuProdutoContext.Provider>
  );
};


export function useProdutoMenu(){
  return useContext(SideMenuProdutoContext);
}

export default SideMenuProdutoContextProvider;
