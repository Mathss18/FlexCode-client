import { useState } from "react";
import SideMenu from "../../components/SideMenu";
import TopBar from "../../components/TopBar";
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
import { useHistory } from "react-router-dom";
import api from "../../services/api";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import AssignmentIcon from "@material-ui/icons/Assignment";
import SettingsIcon from "@mui/icons-material/Settings";

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
}));

const initialValues = {
  nome: "",
  segunda: true,
  terca: false,
  quarta: false,
  quinta: false,
  sexta: false,
  sabado: false,
  domingo: 0,

  horaInicio: 'a',
  horaFim: 'a',

  acessoCliente: [0, 0, 0, 0],
  clientes:'',

  acessoFornecedor: [0, 0, 0, 0],
  fornecedores:'',

  criarFuncionario: false,
  listarFuncionario: false,
  editarFuncionario: false,
  excluirFuncionario: false,
  funcionarios: 'a',

  criarTransportadora: false,
  listarTransportadora: false,
  editarTransportadora: false,
  excluirTransportadora: false,
  transportadoras: 'a',

  criarGrupo: false,
  listarGrupo: false,
  editarGrupo: false,
  excluirGrupo: false,
  grupos: 'a',

  usuarios: 'a'
};

function CadastrarGrupoPage() {
  const classes = useStyles();
  const history = useHistory();
  const [values, setValues] = useState(initialValues);

  const handleOnChange = (e) => {
    let { name, value, type, id } = e.target;

    if (type === "checkbox") {
      var tipoOperacao = id.split('.')[1]; // C, R, U, D

      var acesso = values?.[name];
      switch (tipoOperacao) {
        case 'C':
          acesso[0] == 1 ? acesso[0] = 0 : acesso[0] = 1
          break;
        case 'R':
          acesso[1] == 1 ? acesso[1] = 0 : acesso[1] = 1
          break;
        case 'U':
          acesso[2] == 1 ? acesso[2] = 0 : acesso[2] = 1
          break;
        case 'D':
          acesso[3] == 1 ? acesso[3] = 0 : acesso[3] = 1
          break;
      }
      setValues({
        ...values,
        clientes: values.acessoCliente.toString().replaceAll(',','.'),
        fornecedores: values.acessoFornecedor.toString().replaceAll(',','.'),
      })

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
              <Grid item xs={12}>
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
                  <FormLabel component="legend">Controle de Fornecedores</FormLabel>
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
                  <FormLabel component="legend">Controle de Transportadora</FormLabel>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={values.criarTransportadora}
                          onChange={handleOnChange}
                          name="criarTransportadora"
                          type="checkbox"
                        />
                      }
                      label="Criar"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={values.listarTransportadora}
                          onChange={handleOnChange}
                          name="listarTransportadora"
                        />
                      }
                      label="Listar"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={values.editarTransportadora}
                          onChange={handleOnChange}
                          name="editarTransportadora"
                        />
                      }
                      label="Editar"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={values.excluirTransportadora}
                          onChange={handleOnChange}
                          name="excluirTransportadora"
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
                          checked={values.criarGrupo}
                          onChange={handleOnChange}
                          name="criarGrupo"
                          type="checkbox"
                        />
                      }
                      label="Criar"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={values.listarGrupo}
                          onChange={handleOnChange}
                          name="listarGrupo"
                        />
                      }
                      label="Listar"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={values.editarGrupo}
                          onChange={handleOnChange}
                          name="editarGrupo"
                        />
                      }
                      label="Editar"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={values.excluirGrupo}
                          onChange={handleOnChange}
                          name="excluirGrupo"
                        />
                      }
                      label="Excluir"
                    />
                  </FormGroup>
                </FormControl>
              </Grid>
              <Grid item xs={2}>
                <FormControl component="fieldset" variant="standard">
                  <FormLabel component="legend">Controle de Funcionários</FormLabel>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={values.criarFuncionario}
                          onChange={handleOnChange}
                          name="criarFuncionario"
                          type="checkbox"
                        />
                      }
                      label="Criar"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={values.listarFuncionario}
                          onChange={handleOnChange}
                          name="listarFuncionario"
                        />
                      }
                      label="Listar"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={values.editarFuncionario}
                          onChange={handleOnChange}
                          name="editarFuncionario"
                        />
                      }
                      label="Editar"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={values.excluirFuncionario}
                          onChange={handleOnChange}
                          name="excluirFuncionario"
                        />
                      }
                      label="Excluir"
                    />
                  </FormGroup>
                </FormControl>
              </Grid>
            </Grid>

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
