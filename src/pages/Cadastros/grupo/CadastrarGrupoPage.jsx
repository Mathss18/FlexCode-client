import { useState } from "react";
import SideMenu from "../../../components/SideMenu";
import TopBar from "../../../components/TopBar";
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

const useStyles = makeStyles((theme) => ({
  root: {
    //flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  input: {
    backgroundColor: "#fff",
    // Estilo do helperText
    "& p": {
      backgroundColor: "#fafafa",
      margin: 0,
      paddingLeft: theme.spacing(1),
    },
  },
  saveButton: {
    backgroundColor: theme.palette.primary.main,
    color: "#fff",
    marginTop: theme.spacing(2),
    marginRight: theme.spacing(2),
    "&:hover": {
      backgroundColor: "#fff",
      color: theme.palette.primary.main,
    },
  },
  cancelButton: {
    backgroundColor: theme.palette.error.main,
    color: "#fff",
    marginTop: theme.spacing(2),
    marginRight: theme.spacing(2),
    "&:hover": {
      backgroundColor: "#fff",
      color: theme.palette.error.main,
    },
  },
  timepicker: {
    backgroundColor: "#FFF",
  },
}));

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
  clientes: "",

  acessoFornecedor: [0, 0, 0, 0],
  fornecedores: "",

  acessoFuncionario: [0, 0, 0, 0],
  funcionarios: "",

  acessoTransportadora: [0, 0, 0, 0],
  transportadoras: "",

  acessoGrupo: [0, 0, 0, 0],
  grupos: "",

  acessoUsuario: [0, 0, 0, 0],
  usuarios: "",
};

function CadastrarGrupoPage() {
  const classes = useStyles();
  const history = useHistory();
  const [values, setValues] = useState(initialValues);
  const [hoursInit, setHoursInit] = useState(initialValues.horaInicio);
  const [hoursFim, setHoursFim] = useState(initialValues.horaFim);

  const handleOnChange = (e) => {
    let { name, value, checked, type, id } = e.target;

    if (type === "checkbox") {
      if (id !== "") {
        var tipoOperacao = id.split(".")[1]; // C, R, U, D
        var acesso = values?.[name];
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
        setValues({
          ...values,
          clientes: values.acessoCliente.toString().replaceAll(",", "."),
          fornecedores: values.acessoFornecedor.toString().replaceAll(",", "."),
        });
      } else {
        setValues({ ...values, [name]: checked });
      }
    } else {
      setValues({ ...values, [name]: value });
    }

    console.log(values);
  };

  function handleOnSubmit(event) {
    event.preventDefault();
    console.log(values);

    api.post("/grupo", values).then((response) => console.log(response));
  }

  const setHoraInicio = (e) => {
    setValues({ ...values, horaInicio: new Date(e._d).toLocaleTimeString() });
    console.log(values);
  };

  const setHoraFim = (e) => {
    setValues({ ...values, horaFim: new Date(e._d).toLocaleTimeString() });
    console.log(values);
  };

  return (
    <>
      <TopBar />

      <SideMenu>
        <div>
          <Divider />
          <div
            style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}
          >
            <AssignmentIcon />
            <h3>Dados do Grupo</h3>
          </div>
          <form onSubmit={handleOnSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  variant="outlined"
                  label="Nome do Grupo"
                  fullWidth
                  type="text"
                  className={classes.input}
                  value={values.nome}
                  name="nome"
                  onChange={handleOnChange}
                />
              </Grid>
              <Grid item xs={3}>
                <TimePicker
                  clearable={false}
                  ampm={false}
                  fullWidth
                  inputVariant="outlined"
                  className={classes.timepicker}
                  minutesStep={5}
                  label="Hora ínicio"
                  value={moment(hoursInit, "hh:mm:ss")}
                  onAccept={setHoursInit}
                  onChange={setHoraInicio}
                />
              </Grid>
              <Grid item xs={3}>
                <TimePicker
                  clearable={false}
                  fullWidth
                  inputVariant="outlined"
                  className={classes.timepicker}
                  ampm={false}
                  minutesStep={5}
                  label="Hora fim"
                  value={moment(hoursFim, "hh:mm:ss")}
                  onAccept={setHoursFim}
                  onChange={setHoraFim}
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
                          checked={values.segunda}
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
                          checked={values.terca}
                          onChange={handleOnChange}
                          name="terca"
                        />
                      }
                      label="Terça-feira"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={values.quarta}
                          onChange={handleOnChange}
                          name="quarta"
                        />
                      }
                      label="Quarta-feira"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={values.quinta}
                          onChange={handleOnChange}
                          name="quinta"
                        />
                      }
                      label="Quinta-feira"
                    />

                    <FormControlLabel
                      control={
                        <Switch
                          checked={values.sexta}
                          onChange={handleOnChange}
                          name="sexta"
                        />
                      }
                      label="Sexta-feira"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={values.sabado}
                          onChange={handleOnChange}
                          name="sabado"
                        />
                      }
                      label="Sabádo"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={values.domingo}
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
                          checked={values.acessoCliente[0]}
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
                          checked={values.acessoCliente[1]}
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
                          checked={values.acessoCliente[2]}
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
                          checked={values.acessoCliente[3]}
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
                          checked={values.acessoFornecedor[0]}
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
                          checked={values.acessoFornecedor[1]}
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
                          checked={values.acessoFornecedor[2]}
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
                          checked={values.acessoFornecedor[3]}
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
                    Controle de Transportadora
                  </FormLabel>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={values.acessoTransportadora[0]}
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
                          checked={values.acessoTransportadora[1]}
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
                          checked={values.acessoTransportadora[2]}
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
                          checked={values.acessoTransportadora[3]}
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
                          checked={values.acessoGrupo[0]}
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
                          checked={values.acessoGrupo[1]}
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
                          checked={values.acessoGrupo[2]}
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
                          checked={values.acessoGrupo[3]}
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
                          checked={values.acessoFuncionario[0]}
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
                          checked={values.acessoFuncionario[1]}
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
                          checked={values.acessoFuncionario[2]}
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
                          checked={values.acessoFuncionario[3]}
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
                  className={classes.saveButton}
                >
                  Salvar
                </Button>
              </Grid>
              <Grid item>
                <Button
                  onClick={() => history.push("/clientes")}
                  variant="outlined"
                  startIcon={<CloseIcon />}
                  className={classes.cancelButton}
                >
                  Cancelar
                </Button>
              </Grid>
            </Grid>
          </form>
        </div>
      </SideMenu>
    </>
  );
}

export default CadastrarGrupoPage;
