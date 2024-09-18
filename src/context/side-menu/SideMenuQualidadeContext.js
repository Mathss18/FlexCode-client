import React, { createContext, useContext, useState} from "react";

const SideMenuQualidadeContext = createContext();

function SideMenuQualidadeContextProvider({ children }){
  const [openMenu, setOpenMenu] = useState(false);
  return (
    <SideMenuQualidadeContext.Provider value={[openMenu, setOpenMenu]}>
      {children}
    </SideMenuQualidadeContext.Provider>
  );
};


export function useQualidadeMenu(){
  return useContext(SideMenuQualidadeContext);
}

export default SideMenuQualidadeContextProvider;
