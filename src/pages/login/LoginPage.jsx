import * as React from "react";
import {
	Avatar,
	Button,
	CssBaseline,
	TextField,
	FormControlLabel,
	Checkbox,
	Paper,
	Box,
	Grid,
	Typography,
	createTheme,
	ThemeProvider,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Link } from "react-router-dom";

function Copyright(props) {
	return (
		<Typography
			variant="body2"
			color="text.secondary"
			align="center"
			{...props}
		>
			{"Copyright © "}
			<Link
				color="inherit"
				href="https://images.unsplash.com/photo-1630933047088-597438e2fc9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTYzMjQzNDk3OQ&ixlib=rb-1.2.1&q=80&w=1080"
			>
				FlexCod-Client
			</Link>{" "}
			{new Date().getFullYear()}
			{"."}
		</Typography>
	);
}

const theme = createTheme();

const LoginPage = () => {
	const handleSubmit = (event) => {
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		// eslint-disable-next-line no-console
		console.log({
			email: data.get("email"),
			password: data.get("password"),
		});
	};

	return (
		<ThemeProvider theme={theme}>
			<Grid container component="main" sx={{ height: "100vh" }}>
				<Grid
					item
					xs={false}
					sm={4}
					md={7}
					sx={{
                        backgroundImage: 'https://images.unsplash.com/photo-1630933047088-597438e2fc9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTYzMjQzNDk3OQ&ixlib=rb-1.2.1&q=80&w=1080',
						backgroundColor: (t) =>
							t.palette.mode === "light"
								? t.palette.grey[50]
								: t.palette.grey[900],
						backgroundSize: "cover",
						backgroundPosition: "center",
					}}
				/>
				<Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
					<Box
						sx={{
							my: 8,
							mx: 4,
							pt: 4,
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
						}}
					>
						<Avatar sx={{ m: 2, bgcolor: "secondary.main" }}>
							<LockOutlinedIcon />
						</Avatar>
						<Typography component="h1" variant="h5">
							Formulário de Acesso
						</Typography>
						<Box
							component="form"
							noValidate
							onSubmit={handleSubmit}
							sx={{ mt: 1 }}
						>
							<TextField
								margin="normal"
								required
								fullWidth
								id="email"
								label="Email"
								name="email"
								autoComplete="email"
								autoFocus
								style={{ marginBottom: "20px" }}
							/>
							<TextField
								margin="normal"
								required
								fullWidth
								name="password"
								label="Senha"
								type="password"
								id="password"
								autoComplete="current-password"
								style={{ marginBottom: "20px" }}
							/>
							<FormControlLabel
								control={<Checkbox value="remember" color="primary" />}
								label="Lembrar"
							/>
							<Link to="/Home">
								<Button
									type="submit"
									fullWidth
									variant="contained"
									sx={{ mt: 3, mb: 2 }}
								>
									Iniciar Sessão
								</Button>
							</Link>
							<Grid container>
								<Grid item xs>
									<Link href="#" variant="body2">
										Esqueceu a sua senha?
									</Link>
								</Grid>
								<Grid item>
									<Link href="#" variant="body2">
										{"Não possui uma conta?"}
									</Link>
								</Grid>
							</Grid>
							<Copyright sx={{ mt: 5 }} />
						</Box>
					</Box>
				</Grid>
			</Grid>
		</ThemeProvider>
	);
};

export default LoginPage;
