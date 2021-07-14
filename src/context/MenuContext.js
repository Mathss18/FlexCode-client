import React , {createContext, useContext, useState} from 'react'

const MenuContext = createContext();

export default MenuContextProvider = ({children}) => {
   const [openMenu, setOpenMenu] = useState(false);
   return (
     <MenuContext.Provider values={[openMenu, setOpenMenu]}>
      {children}
     </MenuContext.Provider>
    );
}

export const useMenu = () => useContext(MenuContext);