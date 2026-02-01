import { createContext, useContext, useState } from "react";

const RefreshTarefasContext = createContext();

export const useRefreshTarefas = () => {
  const context = useContext(RefreshTarefasContext);
  if (!context) {
    throw new Error("useRefreshTarefas deve ser usado dentro de RefreshTarefasProvider");
  }
  return context;
};

export const RefreshTarefasProvider = ({ children }) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const triggerRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <RefreshTarefasContext.Provider value={{ refreshTrigger, triggerRefresh }}>
      {children}
    </RefreshTarefasContext.Provider>
  );
};
