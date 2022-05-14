import React, { createContext, useContext, useState} from "react";

const SideMenuFinanceiroContext = createContext();

function SideMenuFinanceiroContextProvider({ children }){
  const [openMenu, setOpenMenu] = useState(false);
  return (
    <SideMenuFinanceiroContext.Provider value={[openMenu, setOpenMenu]}>
      {children}
    </SideMenuFinanceiroContext.Provider>
  );
};


export function useFinanceiroMenu(){
  return useContext(SideMenuFinanceiroContext);
}

export default SideMenuFinanceiroContextProvider;
