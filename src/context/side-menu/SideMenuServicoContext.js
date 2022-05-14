import React, { createContext, useContext, useState} from "react";

const SideMenuServicoContext = createContext();

function SideMenuServicoContextProvider({ children }){
  const [openMenu, setOpenMenu] = useState(false);
  return (
    <SideMenuServicoContext.Provider value={[openMenu, setOpenMenu]}>
      {children}
    </SideMenuServicoContext.Provider>
  );
};


export function useServicoMenu(){
  return useContext(SideMenuServicoContext);
}

export default SideMenuServicoContextProvider;
