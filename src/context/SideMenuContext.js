import { useState, createContext, useContext } from "react";
import SideMenuCadastroContextProvider from "./SideMenuCadastroContext";

const SideMenuContext = createContext();

function SideMenuContextProvider({ children }) {
    const [openMenu, setOpenMenu] = useState(true);
    return (
        <SideMenuContext.Provider value={[ openMenu, setOpenMenu ]}>
            <SideMenuCadastroContextProvider>
                {children}
            </SideMenuCadastroContextProvider>
        </SideMenuContext.Provider>
    );
}

export const useMenu = () => useContext(SideMenuContext);

export default SideMenuContextProvider;