import { useState, useEffect } from 'react';
// Rotas
import Routes from "./routes/routes";
// Providers
import SideMenuContextProvider from "./context/SideMenuContext";
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import styled, { ThemeProvider } from "styled-components";
import { GerenciarProdutosProvider } from './context/GerenciarProdutosContext';
// Temas
import WebFont from 'webfontloader';
import { GlobalStyles } from './theme/GlobalStyles';
import { useTheme } from './theme/useTheme';

import MomentUtils from '@date-io/moment';

const Container = styled.div`
  margin: 5px auto 5px auto;
`;


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
          <Container style={{ fontFamily: selectedTheme.font }}>
            <SideMenuContextProvider>
              <GerenciarProdutosProvider>
                  <MuiPickersUtilsProvider utils={MomentUtils}>
                    <Routes />
                  </MuiPickersUtilsProvider>
              </GerenciarProdutosProvider>
            </SideMenuContextProvider>
          </Container>
        </ThemeProvider>
      }
    </>
  );

}

export default App;
