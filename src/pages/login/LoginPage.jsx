import { useEffect, useState } from "react";
import {
  Avatar,
  Button,
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
import { Link, useHistory } from "react-router-dom";
import ImageLogin from "../../assets/image-login.jpg";
import api from '../../services/api';
import Swal from 'sweetalert2';

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
const initialValues = {
  email: '',
  senha: '',
}

function LoginPage() {
  const history = useHistory();
  const [values, setValues] = useState(initialValues);

  function handleSubmit(event) {
    event.preventDefault();

    api.post('/login', values)
      .then(response => {
        console.log(response);
        localStorage.setItem('token', response.data.access_token);
        //api.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.access_token
        history.push("/home")
      })
      .catch(error => {
        console.log(error);
        Swal.fire({
          title: 'Erro ao logar usuário!',
          html: 'Usuário ou senha incorreta',
          position: 'center',
          icon: 'error',
        })
      })

  }

  function handleOnChange(event) {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
  }

  return (
    <ThemeProvider theme={theme}>
      <Grid
        container
        component="main"
        justify="center"
        alignItems="center"
        style={{ minHeight: "100vh" }}
      >
        <Grid
          item
          xs={false}
          sm={false}
          md={7}
          lg={8}
          sx={{
            backgroundImage: `url("${ImageLogin}")`,
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "100vh",
          }}
        />
        <Grid
          item
          xs={12}
          sm={12}
          md={5}
          lg={4}
          elevation={4}
          container
          alignItems="center"
          justify="center"
          style={{ minHeight: "100vh", backgroundColor: "#0C2D48" }}
        >
          <Box
            p={4}
            sx={{
              borderRadius: "30px",
              mx: 8,
              pt: 6,
              flexDirection: "column",
              backgroundColor: "#FFF",
            }}
          >
            <Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <img src="https://via.placeholder.com/300x110" alt="FlexCode" />
              </Box>
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
                  value={values.email}
                  onChange={handleOnChange}
                  autoComplete="email"
                  autoFocus
                  style={{ marginBottom: "20px" }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="senha"
                  label="Senha"
                  type="password"
                  id="senha"
                  value={values.senha}
                  onChange={handleOnChange}
                  autoComplete="current-password"
                  style={{ marginBottom: "20px" }}
                />
                <FormControlLabel
                  control={<Checkbox value="remember" color="primary" />}
                  label="Lembrar"
                />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    ACESSAR CONTA
                  </Button>
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
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default LoginPage;
