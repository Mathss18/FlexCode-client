import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Route, Redirect } from "react-router-dom";
import { errorAlert } from "../utils/alert";
import { decrypt } from "../utils/crypto";

function PrivateRoutes({ Component, ...rest }) {
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);
  try {
    var path = rest.location.pathname;
    var grupo = JSON.parse(decrypt(localStorage.getItem("grupo")));
    var acessos = JSON.parse(grupo.acessos);
  } catch (error) {
    toast.error("Erro ao carregar acessos, fale com o suporte!");
    return <Redirect to="/login" />;
  }

  // console.log(path);
  // console.log(grupo);
  // console.log(acessos)

  // ==== VERIFICAÇÃO DE DIA DA SEMANA ====
  if (verificarDiaDaSemana() === false) {
    errorAlert("Você não tem permissão para acessar o sistema hoje!");
    localStorage.removeItem("token");
    setTimeout(() => {
      return <Redirect to="/home" />;
    }, 1000);
  }
  // ==== VERIFICAÇÃO DE HORARIO ====
  if (verificarHorario() === false) {
    errorAlert("Você não tem permissão para acessar o sistema nesse horário!");
    localStorage.removeItem("token");
    setTimeout(() => {
      return <Redirect to="/home" />;
    }, 1000);
  }
  // ==== VERIFICAÇÃO DE ACESSO ====
  if (verificarAcessos() === false) {
    toast.error("Você não tem permissão para acessar esta página!");
    return <Redirect to="/home" />;
  }

  if (token == null) {
    return <Redirect to="/login" />;
  }

  function verificarDiaDaSemana() {
    var semana = [
      "domingo",
      "segunda",
      "terca",
      "quarta",
      "quinta",
      "sexta",
      "sabado",
    ];
    const diaSemana = semana[new Date().getDay()];
    if (grupo[diaSemana] == 0) {
      return false;
    }
  }

  function verificarHorario() {
    var now = new Date();
    var currentTimeInSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

    var [inicioHour, inicioMinute, inicioSecond] = grupo.horaInicio.split(":").map(Number);
    var inicioTimeInSeconds = inicioHour * 3600 + inicioMinute * 60 + inicioSecond;

    var [fimHour, fimMinute, fimSecond] = grupo.horaFim.split(":").map(Number);
    var fimTimeInSeconds = fimHour * 3600 + fimMinute * 60 + fimSecond;

    return currentTimeInSeconds > inicioTimeInSeconds && currentTimeInSeconds < fimTimeInSeconds;
  }


  function verificarAcessos() {
    for (let i = 0; i < acessos.length; i++) {
      if (path.includes(acessos[i].path)) {
        if (acessos[i].situacao === false) {
          return false;
        }
      }
    }
    return true;
  }

  return <Route {...rest} render={() => <Component {...rest} />} />;
}

export default PrivateRoutes;
