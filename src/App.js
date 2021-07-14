import Routes from "./routes";
import { ThemeProvider, createTheme } from "@material-ui/core/styles";
import MenuContextProvider from "./context/MenuContext";

function App() {
  const theme = createTheme({
    palette: {
      primary: {
        main: "#3f51b5",
      },
      secondary: {
        main: "#2196f3",
      },
      error: {
        main: "#f44336",
      },
      background: {
        main: "#f4f8fb",
        dark: "#202634",
        lightDark: "#293042",
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <MenuContextProvider>
        <Routes />
      </MenuContextProvider>
    </ThemeProvider>
  );
}

export default App;