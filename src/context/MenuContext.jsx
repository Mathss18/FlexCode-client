import React, { createContext, useContext, useState, ch } from "react";

const MenuContext = createContext();

const MenuContextProvider = ({ children }) => {
  const [openMenu, setOpenMenu] = useState(false);
  return (
    <MenuContext.Provider value={[openMenu, setOpenMenu]}>
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => useContext(MenuContext);

export default MenuContextProvider;
