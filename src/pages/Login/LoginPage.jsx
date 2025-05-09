import "./login.css";
import {
  TextField,
  FormControl,
  Button,
  Paper,
  Box,
  Typography,
  Container,
  InputAdornment,
  IconButton,
  Grid,
} from "@material-ui/core";
import { useState } from "react";
import api from "../../services/api";
import { setToLS } from "../../utils/storage";
import { useHistory } from "react-router-dom";
import { usePusherContext } from "../../context/PusherContext";
import { useFullScreenLoader } from "../../context/FullScreenLoaderContext";
import { infoAlert } from "../../utils/alert";
import { encrypt } from "../../utils/crypto";
import {
  Visibility,
  VisibilityOff,
  Email,
  LockOutlined,
} from "@material-ui/icons";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const history = useHistory();
  const pusherContext = usePusherContext();
  const fullScreenLoader = useFullScreenLoader();

  var dados = {
    email: email,
    senha: senha,
  };

  function alterarSenha(event) {
    setSenha(event.target.value);
  }

  function redirecionar(response) {
    localStorage.setItem("token", response.data.access_token);
    localStorage.setItem("config", JSON.stringify(response.data.config));
    localStorage.setItem("grupo", encrypt(JSON.stringify(response.data.grupo)));
    localStorage.setItem("foto", response.data.foto);
    setToLS("user", response.data.user);
    pusherContext.useIsLogged.setIsLogged(true);
    history.push("/home");
  }

  function onSubmit(event) {
    event.preventDefault();
    fullScreenLoader.setLoading(true);

    api
      .post("/login", dados)
      .then((response) => {
        redirecionar(response);
      })
      .catch((error) => {
        if (error?.response?.data?.code === 403) {
          infoAlert("Não autorizado!", "Usuário ou senha inválidos");
        } else {
          infoAlert("Não autorizado!", "Tenant não encontrado");
        }
      })
      .finally(() => {
        fullScreenLoader.setLoading(false);
      });
  }

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container maxWidth="100%" className="login-container" disableGutters>
      <Box className="pattern-background">
        <div className="pattern-overlay"></div>
      </Box>

      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        className="content-container"
      >
        <Grid container className="login-grid">
          <Grid item xs={12} md={6} className="logo-side">
            <div className="logo-content">
              <div className="accent-bar"></div>
              <Typography variant="h3" className="welcome-text">
                Bem-vindo à plataforma
              </Typography>
              <div className="logo-wrapper">
                <Typography variant="h2" className="brand-name">
                  <span className="brand-grupo">Grupo</span>
                  <span className="brand-flex">Flex</span>
                </Typography>
                <div className="tagline">Flex Mol & Metal Flex</div>
              </div>
            </div>
          </Grid>

          <Grid item xs={12} md={6} className="form-side">
            <Paper elevation={0} className="login-paper">
              <Box p={4}>
                <Box mb={4}>
                  <Typography variant="h4" className="login-title">
                    Acesse sua conta
                  </Typography>
                  <Typography variant="body2" className="login-subtitle">
                    Digite suas credenciais para entrar no sistema
                  </Typography>
                </Box>

                <form onSubmit={onSubmit} autoComplete="off">
                  <FormControl fullWidth margin="normal">
                    <Box mb={1}>
                      <Typography variant="subtitle2" className="custom-label">
                        E-mail
                      </Typography>
                    </Box>
                    <TextField
                      variant="outlined"
                      type="email"
                      name="email"
                      autoComplete="somerandomstring"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="Digite seu e-mail"
                      InputProps={{
                        className: "white-input no-label-input",
                      }}
                      fullWidth
                      className="input-field"
                    />
                  </FormControl>

                  <FormControl fullWidth margin="normal">
                    <Box mb={1} display="flex" alignItems="center">
                      <Typography variant="subtitle2" className="custom-label">
                        Senha
                      </Typography>
                    </Box>
                    <TextField
                      variant="outlined"
                      type={showPassword ? "text" : "password"}
                      name="senha"
                      autoComplete="new-password"
                      value={senha}
                      onChange={alterarSenha}
                      placeholder="Digite sua senha"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={handleClickShowPassword}
                              edge="end"
                              className="visibility-toggle"
                            >
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                        className: "white-input no-label-input",
                      }}
                      fullWidth
                      className="input-field"
                    />
                  </FormControl>

                  <Box mt={4}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth
                      size="large"
                      className="login-button"
                    >
                      ENTRAR
                    </Button>
                  </Box>
                </form>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        <footer className="modern-footer">
          <Typography variant="body2" align="center">
            © {new Date().getFullYear()} - Grupo Flex | Todos os direitos
            reservados
          </Typography>
        </footer>
      </Box>
    </Container>
  );
}

export default LoginPage;
