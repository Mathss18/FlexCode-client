import React, { createContext, useContext, useState} from "react";

const SideMenuNotaFiscalContext = createContext();

function SideMenuNotaFiscalContextProvider({ children }){
  const [openMenu, setOpenMenu] = useState(false);
  return (
    <SideMenuNotaFiscalContext.Provider value={[openMenu, setOpenMenu]}>
      {children}
    </SideMenuNotaFiscalContext.Provider>
  );
};


export function useNotaFiscalMenu(){
  return useContext(SideMenuNotaFiscalContext);
}

export default SideMenuNotaFiscalContextProvider;
