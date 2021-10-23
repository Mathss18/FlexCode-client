import { useState, createContext, useContext } from "react";
import SideMenuCadastroContextProvider from "./SideMenuCadastroContext";
import SideMenuProdutoContextProvider from "./SideMenuProdutoContext";

const SideMenuContext = createContext();

function SideMenuContextProvider({ children }) {
    const [openMenu, setOpenMenu] = useState(true);
    return (
        <SideMenuContext.Provider value={[ openMenu, setOpenMenu ]}>
            <SideMenuCadastroContextProvider>
                <SideMenuProdutoContextProvider>
                    {children}
                </SideMenuProdutoContextProvider>
            </SideMenuCadastroContextProvider>
        </SideMenuContext.Provider>
    );
}

export function useMenu(){
    return useContext(SideMenuContext);
}

export default SideMenuContextProvider;

