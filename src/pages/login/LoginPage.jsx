import "./login.css";
import videoLogin from "../../assets/Busy.mp4";
import { TextField, FormControl, Grid, Button } from "@material-ui/core";
import { useState } from "react";
import api from "../../services/api";
import { setToLS } from "../../utils/storage";
import { useHistory } from "react-router-dom";
import { usePusherContext } from "../../context/PusherContext";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const history = useHistory();
  const pusherContext = usePusherContext();

  var dados = {
    email: email,
    senha: senha,
  };

  function alterarSenha(event) {
    setSenha(event.target.value);
  }

  function redirecionar(response) {
    localStorage.setItem("token", response.data.access_token);
    setToLS("user", response.data.user);
    pusherContext.useIsLogged.setIsLogged(true);
    history.push("/home");
  }

  function onSubmit(event) {
    event.preventDefault();

    api
      .post("/login", dados)
      .then((response) => {
        redirecionar(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <div className="container">
      <header className="header">
        <h1>Flex Code</h1>
        <h2>Sobre</h2>
      </header>

      <section className="showcase">
        <div className="video-container">
          <video src={videoLogin} type="video/mp4" muted autoPlay loop></video>
        </div>
      </section>

      <div className="area-login">
        <h1>Entre com sua conta</h1>

        <form onSubmit={onSubmit}>
          <FormControl>
            <TextField
              className="input-login"
              label="E-mail"
              variant="standard"
              type="email"
              name="email"
              autoComplete="off"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
              }}
            />

            <Grid>
              <TextField
                className="input-login"
                label="Senha"
                variant="standard"
                type="password"
                name="senha"
                style={{ marginTop: "50px" }}
                autocomplete="off"
                value={senha}
                onChange={alterarSenha}
              />
            </Grid>

            <Button type="submit" id="button-login">Login</Button>
          </FormControl>
        </form>
      </div>

      <footer>
        <p className="footer">© 2022 - Matheus Bezerra | Todos os direitos reservados</p>
      </footer>
    </div>
  );
}

export default LoginPage;
