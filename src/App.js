import { useState, useEffect } from "react";
// Rotas
import Routes from "./routes/routes";
// Providers
import { ThemeProvider } from "styled-components";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import GerenciarProdutosContextProvider from "./context/GerenciarProdutosContext";
import SideMenuContextProvider from "./context/side-menu/SideMenuContext";
import PusherContextProvider from "./context/PusherContext";
// Temas
import WebFont from "webfontloader";
import { GlobalStyles } from "./theme/GlobalStyles";
import { useTheme } from "./theme/useTheme";
import MomentUtils from "@date-io/moment";
import FullScreenLoaderProvider from "./context/FullScreenLoaderContext";
import FaviconNotificationContextProvider from "react-favicon-notification";
import _ from "lodash";
import NotaFiscalContextProvider from "./context/NotaFiscalContext";

function App() {
  const { theme, themeLoaded, getFonts } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState(theme);

  useEffect(() => {
    checkIfThemeHasChanged();
    setSelectedTheme(theme);
  }, [themeLoaded]);

  useEffect(() => {
    WebFont.load({
      google: {
        families: getFonts(),
      },
    });
  });

  function checkIfThemeHasChanged() {
    const allThemes = JSON.parse(localStorage.getItem("all-themes")).data;
    const useSelectedTheme = theme;
    if (!useSelectedTheme) return;

    var romoveThemeFromLs = true;
    for (const key in allThemes) {
      if (_.isEqual(allThemes[key], useSelectedTheme)) {
        romoveThemeFromLs = false;
      }
    }
    if (romoveThemeFromLs) {
      localStorage.removeItem("theme");
      console.log(
        "%c=== Atualização de tema disponível! === ",
        "color:red;font-size:3rem;-webkit-text-stroke: 1px black;font-weight:bold"
      );
      // window.location.reload();
    }
  }

  return (
    <>
      {themeLoaded && (
        <ThemeProvider theme={selectedTheme}>
          <GlobalStyles />
          <FaviconNotificationContextProvider>
            <PusherContextProvider>
              <SideMenuContextProvider>
                <GerenciarProdutosContextProvider>
                  <NotaFiscalContextProvider>
                    <MuiPickersUtilsProvider utils={MomentUtils}>
                      <FullScreenLoaderProvider>
                        <Routes themeSetter={setSelectedTheme} />
                      </FullScreenLoaderProvider>
                    </MuiPickersUtilsProvider>
                  </NotaFiscalContextProvider>
                </GerenciarProdutosContextProvider>
              </SideMenuContextProvider>
            </PusherContextProvider>
          </FaviconNotificationContextProvider>
        </ThemeProvider>
      )}
    </>
  );
}

export default App;
