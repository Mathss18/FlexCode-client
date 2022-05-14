import React, { createContext, useContext, useState} from "react";

const SideMenuEstoqueContext = createContext();

function SideMenuEstoqueContextProvider({ children }){
  const [openMenu, setOpenMenu] = useState(false);
  return (
    <SideMenuEstoqueContext.Provider value={[openMenu, setOpenMenu]}>
      {children}
    </SideMenuEstoqueContext.Provider>
  );
};


export function useEstoqueMenu(){
  return useContext(SideMenuEstoqueContext);
}

export default SideMenuEstoqueContextProvider;
