import React, { createContext, useContext, useState } from "react";
import loader from "../assets/loader.svg";

const FullScreenLoaderContext = createContext();

function Loader({ loading }) {
  if (!loading) return null
  return (
    <div className='loader-container' style={{ position: 'absolute', 'top': 0, backgroundColor: 'rgba(0,0,0,0.5)', width: '100%', height: '100%', color: '#fff', zIndex: 1000 }}>
      <div 
      className='loader-img' style={{ position: 'relative', top: '50%', left: '50%', marginRight: '-50%', transform: 'translate(-50%, -50%)', width: 'fit-content' }}>
        <img src={loader} alt="Carregando..." />
      </div>
    </div>
  );
}

function FullScreenLoaderProvider({ children }) {
  const [loading, setLoading] = useState(false);
  return (
    <FullScreenLoaderContext.Provider value={{ setLoading }}>
      <Loader loading={loading} />
      {children}
    </FullScreenLoaderContext.Provider>
  );
};


export function useFullScreenLoader() {
  return useContext(FullScreenLoaderContext);
}

export default FullScreenLoaderProvider;