import Routes from "./routes/routes";
import { ThemeProvider, createTheme } from "@material-ui/core/styles";
import SideMenuContextProvider from "./context/SideMenuContext";
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';


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
			<SideMenuContextProvider>
				<MuiPickersUtilsProvider utils={MomentUtils}>
					<Routes />
				</MuiPickersUtilsProvider>
			</SideMenuContextProvider>
		</ThemeProvider>
	);
}

export default App;
