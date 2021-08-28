import React, { createContext, useContext, useState} from "react";

const SideMenuCadastroContext = createContext();

function SideMenuCadastroContextProvider({ children }){
  const [openMenu, setOpenMenu] = useState(false);
  return (
    <SideMenuCadastroContext.Provider value={[openMenu, setOpenMenu]}>
      {children}
    </SideMenuCadastroContext.Provider>
  );
};


export function useCadastroMenu(){
  return useContext(SideMenuCadastroContext);
}

export default SideMenuCadastroContextProvider;
