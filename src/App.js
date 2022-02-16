import { useState, useEffect } from 'react';
// Rotas
import Routes from "./routes/routes";
// Providers
import { ThemeProvider } from "styled-components";
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import GerenciarProdutosContextProvider from './context/GerenciarProdutosContext';
import SideMenuContextProvider from "./context/SideMenuContext";
import PusherContextProvider from './context/PusherContext';
// Temas
import WebFont from 'webfontloader';
import { GlobalStyles } from './theme/GlobalStyles';
import { useTheme } from './theme/useTheme';
import MomentUtils from '@date-io/moment';
import FullScreenLoaderProvider from './context/FullScreenLoaderContext';

function App() {
  const { theme, themeLoaded, getFonts } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState(theme);

  useEffect(() => {
    setSelectedTheme(theme);
  }, [themeLoaded]);

  useEffect(() => {
    WebFont.load({
      google: {
        families: getFonts()
      }
    });
  });



  return (
    <>
      {themeLoaded && <ThemeProvider theme={selectedTheme}>
        <GlobalStyles />
        <PusherContextProvider>
          <SideMenuContextProvider>
            <GerenciarProdutosContextProvider>
              <MuiPickersUtilsProvider utils={MomentUtils}>
                <FullScreenLoaderProvider>
                  <Routes />
                </FullScreenLoaderProvider>
              </MuiPickersUtilsProvider>
            </GerenciarProdutosContextProvider>
          </SideMenuContextProvider>
        </PusherContextProvider>
      </ThemeProvider>
      }
    </>
  );

}

export default App;
