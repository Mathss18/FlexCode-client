import Routes from "./routes";
import { ThemeProvider, createTheme } from "@material-ui/core/styles";
import SideMenuContextProvider from "./context/SideMenuContext";
import { Provider } from "react-redux";
import store from "./store";

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
		<Provider store={store}>
			<ThemeProvider theme={theme}>
				<SideMenuContextProvider>
					<Routes />
				</SideMenuContextProvider>
			</ThemeProvider>
		</Provider>
	);
}

export default App;
