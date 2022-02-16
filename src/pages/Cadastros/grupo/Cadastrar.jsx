import { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Grid,
  TextField,
  FormControl,
  Divider,
  Button,
  FormLabel,
  FormControlLabel,
  FormGroup,
  Switch,
} from "@material-ui/core";
import { TimePicker } from "@material-ui/pickers";
import { useHistory } from "react-router-dom";
import api from "../../../services/api";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import AssignmentIcon from "@material-ui/icons/Assignment";
import SettingsIcon from "@mui/icons-material/Settings";
import moment from "moment";
import "moment/locale/pt-br";
import { grupoValidation } from "../../../validators/validationSchema";
import { useFormik } from "formik";
import { infoAlert, successAlert } from "../../../utils/alert";
import { useFullScreenLoader } from "../../../context/FullScreenLoaderContext";

const initialValues = {
  nome: "",
  segunda: false,
  terca: false,
  quarta: false,
  quinta: false,
  sexta: false,
  sabado: false,
  domingo: false,

  horaInicio: "07:00:00",
  horaFim: "17:00:00",

  acessoCliente: [0, 0, 0, 0],
  clientes: "0.0.0.0",

  acessoFornecedor: [0, 0, 0, 0],
  fornecedores: "0.0.0.0",

  acessoFuncionario: [0, 0, 0, 0],
  funcionarios: "0.0.0.0",

  acessoTransportadora: [0, 0, 0, 0],
  transportadoras: "0.0.0.0",

  acessoGrupo: [0, 0, 0, 0],
  grupos: "0.0.0.0",

  acessoUsuario: [0, 0, 0, 0],
  usuarios: "0.0.0.0",
};

function CadastrarGrupoPage() {
  const history = useHistory();
  const fullScreenLoader = useFullScreenLoader();
  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: (event) => { handleOnSubmit(event) },
    validationSchema: grupoValidation,
  })


  const handleOnChange = (e) => {
    let { name, value, checked, type, id } = e.target;

    if (type === "checkbox") {
      if (id !== "") {
        var tipoOperacao = id.split(".")[1]; // C, R, U, D
        var acesso = formik.values?.[name];

        // eslint-disable-next-line default-case
        switch (tipoOperacao) {
          case "C":
            acesso[0] == 1 ? (acesso[0] = 0) : (acesso[0] = 1);
            break;
          case "R":
            acesso[1] == 1 ? (acesso[1] = 0) : (acesso[1] = 1);
            break;
          case "U":
            acesso[2] == 1 ? (acesso[2] = 0) : (acesso[2] = 1);
            break;
          case "D":
            acesso[3] == 1 ? (acesso[3] = 0) : (acesso[3] = 1);
            break;
        }
        formik.setValues({
          ...formik.values,
          clientes: formik.values.acessoCliente.toString().replaceAll(",", "."),
          transportadoras: formik.values.acessoTransportadora.toString().replaceAll(",", "."),
          fornecedores: formik.values.acessoFornecedor.toString().replaceAll(",", "."),
          grupos: formik.values.acessoGrupo.toString().replaceAll(",", "."),
          funcionarios: formik.values.acessoFuncionario.toString().replaceAll(",", "."),
          usuarios: formik.values.acessoUsuario.toString().replaceAll(",", "."),
        });
      } else {
        formik.setValues({ ...formik.values, [name]: checked });
      }
    } else {
      formik.setValues({ ...formik.values, [name]: value });
    }

    console.log(formik.values);
  };

  function handleOnSubmit(values) {
    fullScreenLoader.setLoading(true);
    api.post("/grupos", values).then((response) => {
      successAlert("Sucesso", "Grupo Cadastrado", () =>
        history.push("/grupos")
      );
    })
    .catch((error) => {
      infoAlert("Atenção", error.response.data.message);
    })
    .finally(() => {
      fullScreenLoader.setLoading(false);
    });
  }

  const setHoraInicio = (e) => {
    formik.setValues({ ...formik.values, horaInicio: new Date(e._d).toLocaleTimeString() });
    console.log(formik.values);
  };

  const setHoraFim = (e) => {
    formik.setValues({ ...formik.values, horaFim: new Date(e._d).toLocaleTimeString() });
    console.log(formik.values);
  };

  return (
    <>
      <div>
        <Divider />
        <div
          style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}
        >
          <AssignmentIcon />
          <h3>Dados do Grupo</h3>
        </div>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                variant="outlined"
                label="Nome do Grupo"
                fullWidth
                type="text"
                name="nome"
                value={formik.values.nome}
                onChange={handleOnChange}
                onBlur={formik.handleBlur}
                error={formik.touched.nome && Boolean(formik.errors.nome)}
                helperText={formik.touched.nome && formik.errors.nome}
              />
            </Grid>
            <Grid item xs={3}>
              <TimePicker
                clearable={false}
                ampm={false}
                fullWidth
                inputVariant="outlined"
                minutesStep={5}
                label="Hora ínicio"
                value={moment(formik.values.horaInicio, "hh:mm:ss")}
                onAccept={setHoraInicio}
                onChange={setHoraInicio}
                onBlur={formik.handleBlur}
                error={formik.touched.horaInicio && Boolean(formik.errors.horaInicio)}
                helperText={formik.touched.horaInicio && formik.errors.horaInicio}
              />
            </Grid>
            <Grid item xs={3}>
              <TimePicker
                clearable={false}
                fullWidth
                inputVariant="outlined"
                ampm={false}
                minutesStep={5}
                label="Hora fim"
                value={moment(formik.values.horaFim, "hh:mm:ss")}
                onAccept={setHoraFim}
                onChange={setHoraFim}
                onBlur={formik.handleBlur}
                error={formik.touched.horaFim && Boolean(formik.errors.horaFim)}
                helperText={formik.touched.horaFim && formik.errors.horaFim}
              />
            </Grid>
          </Grid>
          <br />
          <Divider />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <SettingsIcon />
            <h3>Configurações</h3>
          </div>
          <Grid container spacing={2}>

            <Grid item xs={2}>
              <FormControl component="fieldset" variant="standard">
                <FormLabel component="legend">Dias de acesso</FormLabel>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formik.values.segunda}
                        onChange={handleOnChange}
                        name="segunda"
                        type="checkbox"
                      />
                    }
                    label="Segunda-feira"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formik.values.terca}
                        onChange={handleOnChange}
                        name="terca"
                      />
                    }
                    label="Terça-feira"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formik.values.quarta}
                        onChange={handleOnChange}
                        name="quarta"
                      />
                    }
                    label="Quarta-feira"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formik.values.quinta}
                        onChange={handleOnChange}
                        name="quinta"
                      />
                    }
                    label="Quinta-feira"
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={formik.values.sexta}
                        onChange={handleOnChange}
                        name="sexta"
                      />
                    }
                    label="Sexta-feira"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formik.values.sabado}
                        onChange={handleOnChange}
                        name="sabado"
                      />
                    }
                    label="Sabádo"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formik.values.domingo}
                        onChange={handleOnChange}
                        name="domingo"
                      />
                    }
                    label="Domingo"
                  />
                </FormGroup>
              </FormControl>
            </Grid>

            <Grid item xs={2}>
              <FormControl component="fieldset" variant="standard">
                <FormLabel component="legend">Controle de Clientes</FormLabel>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formik.values.acessoCliente[0]}
                        onChange={handleOnChange}
                        name="acessoCliente"
                        type="checkbox"
                        id="acessoCliente.C"
                      />
                    }
                    label="Criar"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formik.values.acessoCliente[1]}
                        onChange={handleOnChange}
                        name="acessoCliente"
                        id="acessoCliente.R"
                      />
                    }
                    label="Listar"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formik.values.acessoCliente[2]}
                        onChange={handleOnChange}
                        name="acessoCliente"
                        id="acessoCliente.U"
                      />
                    }
                    label="Editar"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formik.values.acessoCliente[3]}
                        onChange={handleOnChange}
                        name="acessoCliente"
                        id="acessoCliente.D"
                      />
                    }
                    label="Excluir"
                  />
                </FormGroup>
              </FormControl>
            </Grid>

            <Grid item xs={2}>
              <FormControl component="fieldset" variant="standard">
                <FormLabel component="legend">
                  Controle de Fornecedores
                </FormLabel>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formik.values.acessoFornecedor[0]}
                        onChange={handleOnChange}
                        name="acessoFornecedor"
                        type="checkbox"
                        id="acessoFornecedor.C"
                      />
                    }
                    label="Criar"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formik.values.acessoFornecedor[1]}
                        onChange={handleOnChange}
                        name="acessoFornecedor"
                        id="acessoFornecedor.R"
                      />
                    }
                    label="Listar"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formik.values.acessoFornecedor[2]}
                        onChange={handleOnChange}
                        name="acessoFornecedor"
                        id="acessoFornecedor.U"
                      />
                    }
                    label="Editar"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formik.values.acessoFornecedor[3]}
                        onChange={handleOnChange}
                        name="acessoFornecedor"
                        id="acessoFornecedor.D"
                      />
                    }
                    label="Excluir"
                  />
                </FormGroup>
              </FormControl>
            </Grid>

            <Grid item xs={2}>
              <FormControl component="fieldset" variant="standard">
                <FormLabel component="legend">
                  Controle de Transportadoras
                </FormLabel>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formik.values.acessoTransportadora[0]}
                        onChange={handleOnChange}
                        name="acessoTransportadora"
                        type="checkbox"
                        id="acessoTransportadora.C"
                      />
                    }
                    label="Criar"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formik.values.acessoTransportadora[1]}
                        onChange={handleOnChange}
                        name="acessoTransportadora"
                        id="acessoTransportadora.R"
                      />
                    }
                    label="Listar"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formik.values.acessoTransportadora[2]}
                        onChange={handleOnChange}
                        name="acessoTransportadora"
                        id="acessoTransportadora.U"
                      />
                    }
                    label="Editar"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formik.values.acessoTransportadora[3]}
                        onChange={handleOnChange}
                        name="acessoTransportadora"
                        id="acessoTransportadora.D"
                      />
                    }
                    label="Excluir"
                  />
                </FormGroup>
              </FormControl>
            </Grid>

            <Grid item xs={2}>
              <FormControl component="fieldset" variant="standard">
                <FormLabel component="legend">Controle de Grupos</FormLabel>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formik.values.acessoGrupo[0]}
                        onChange={handleOnChange}
                        name="acessoGrupo"
                        type="checkbox"
                        id="acessoGrupo.C"
                      />
                    }
                    label="Criar"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formik.values.acessoGrupo[1]}
                        onChange={handleOnChange}
                        name="acessoGrupo"
                        id="acessoGrupo.R"
                      />
                    }
                    label="Listar"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formik.values.acessoGrupo[2]}
                        onChange={handleOnChange}
                        name="acessoGrupo"
                        id="acessoGrupo.U"
                      />
                    }
                    label="Editar"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formik.values.acessoGrupo[3]}
                        onChange={handleOnChange}
                        name="acessoGrupo"
                        id="acessoGrupo.D"
                      />
                    }
                    label="Excluir"
                  />
                </FormGroup>
              </FormControl>
            </Grid>

            <Grid item xs={2}>
              <FormControl component="fieldset" variant="standard">
                <FormLabel component="legend">
                  Controle de Funcionários
                </FormLabel>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formik.values.acessoFuncionario[0]}
                        onChange={handleOnChange}
                        name="acessoFuncionario"
                        type="checkbox"
                        id="acessoFuncionario.C"
                      />
                    }
                    label="Criar"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formik.values.acessoFuncionario[1]}
                        onChange={handleOnChange}
                        name="acessoFuncionario"
                        id="acessoFuncionario.R"
                      />
                    }
                    label="Listar"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formik.values.acessoFuncionario[2]}
                        onChange={handleOnChange}
                        name="acessoFuncionario"
                        id="acessoFuncionario.U"
                      />
                    }
                    label="Editar"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formik.values.acessoFuncionario[3]}
                        onChange={handleOnChange}
                        name="acessoFuncionario"
                        id="acessoFuncionario.D"
                      />
                    }
                    label="Excluir"
                  />
                </FormGroup>
              </FormControl>
            </Grid>

            <Grid item xs={2}>
              <FormControl component="fieldset" variant="standard">
                <FormLabel component="legend">
                  Controle de Usuários
                </FormLabel>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formik.values.acessoUsuario[0]}
                        onChange={handleOnChange}
                        name="acessoUsuario"
                        type="checkbox"
                        id="acessoUsuario.C"
                      />
                    }
                    label="Criar"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formik.values.acessoUsuario[1]}
                        onChange={handleOnChange}
                        name="acessoUsuario"
                        id="acessoUsuario.R"
                      />
                    }
                    label="Listar"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formik.values.acessoUsuario[2]}
                        onChange={handleOnChange}
                        name="acessoUsuario"
                        id="acessoUsuario.U"
                      />
                    }
                    label="Editar"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formik.values.acessoUsuario[3]}
                        onChange={handleOnChange}
                        name="acessoUsuario"
                        id="acessoUsuario.D"
                      />
                    }
                    label="Excluir"
                  />
                </FormGroup>
              </FormControl>
            </Grid>

          </Grid>
          <br />
          <Divider />
          <br />
          <Grid container spacing={2}></Grid>

          <Grid container spacing={0}>
            <Grid item>
              <Button
                type="submit"
                variant="outlined"
                startIcon={<CheckIcon />}
                className={'btn btn-primary btn-spacing'}
              >
                Salvar
              </Button>
            </Grid>
            <Grid item>
              <Button
                onClick={() => history.push("/clientes")}
                variant="outlined"
                startIcon={<CloseIcon />}
                className={'btn btn-error btn-spacing'}
              >
                Cancelar
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>

    </>
  );
}

export default CadastrarGrupoPage;
