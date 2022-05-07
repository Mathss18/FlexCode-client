import { useState, createContext, useContext } from "react";
import SideMenuCadastroContextProvider from "./SideMenuCadastroContext";
import SideMenuFinanceiroContextProvider from "./SideMenuFinanceiroContext";
import SideMenuEstoqueContextProvider from "./SideMenuEstoqueContext";
import SideMenuProdutoContextProvider from "./SideMenuProdutoContext";
import SideMenuServicoContextProvider from "./SideMenuServicoContext";

const SideMenuContext = createContext();

function SideMenuContextProvider({ children }) {
  const [openMenu, setOpenMenu] = useState(true);
  return (
    <SideMenuContext.Provider value={[openMenu, setOpenMenu]}>
      <SideMenuCadastroContextProvider>
        <SideMenuProdutoContextProvider>
          <SideMenuServicoContextProvider>
            <SideMenuFinanceiroContextProvider>
              <SideMenuEstoqueContextProvider>
                {children}
              </SideMenuEstoqueContextProvider>
            </SideMenuFinanceiroContextProvider>
          </SideMenuServicoContextProvider>
        </SideMenuProdutoContextProvider>
      </SideMenuCadastroContextProvider>
    </SideMenuContext.Provider>
  );
}

export function useMenu() {
  return useContext(SideMenuContext);
}

export default SideMenuContextProvider;

