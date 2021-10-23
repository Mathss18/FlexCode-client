import { useState, useEffect } from "react";
import SideMenu from "../../../components/SideMenu";
import TopBar from "../../../components/TopBar";
import { makeStyles } from "@material-ui/core/styles";
import {
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  Button,
  FormLabel,
  FormControlLabel,
  FormGroup,
  Switch,
} from "@material-ui/core";
import { useHistory, useParams } from "react-router-dom";
import api from "../../../services/api";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import AssignmentIcon from "@material-ui/icons/Assignment";
import SettingsIcon from "@mui/icons-material/Settings";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import Swal from "sweetalert2";

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
  segunda: false,
  terca: false,
  quarta: false,
  quinta: false,
  sexta: false,
  sabado: false,
  domingo: false,
  criarCliente: false,
  listarCliente: false,
  editarCliente: false,
  excluirCliente: false,
  criarFornecedor: false,
  listarFornecedor: false,
  editarFornecedor: false,
  excluirFornecedor: false,
  criarFuncionario: false,
  listarFuncionario: false,
  editarFuncionario: false,
  excluirFuncionario: false,
  criarTransportadora: false,
  listarTransportadora: false,
  editarTransportadora: false,
  excluirTransportadora: false,
  criarGrupo: false,
  listarGrupo: false,
  editarGrupo: false,
  excluirGrupo: false,
};

function EditarGrupoPage() {
  const classes = useStyles();
  const history = useHistory();
  const [values, setValues] = useState(initialValues);
  const { id } = useParams();

  useEffect(() => {
    api.get("/grupo/" + id).then((response) => {
      setValues(response.data["data"]);
    });
  }, []);

  const handleOnChange = (e) => {
    let { name, checked, value, type } = e.target;

    if (type === "checkbox") {
      setValues({ ...values, [name]: checked });
    } else {
      setValues({ ...values, [name]: value });
    }
  };

  function handleOnSubmit(event) {
    event.preventDefault();
    api
      .put("/grupo/" + id, values)
      .then((response) => {
        console.log(response);
        Swal.fire({
          title: "Atualizado com sucesso!",
          html: "Redirecionando...",
          position: "top-end",
          icon: "success",
          timer: 1800,
          timerProgressBar: true,
        }).then((result) => {
          if (result.dismiss === Swal.DismissReason.timer) {
            history.push("/grupos");
          }
        });
      })
      .catch((error) => {
        console.log(error.response.request.responseText);
        Swal.fire({
          title: "Erro ao atualizar!",
          html: error.response.data.message,
          position: "top-end",
          icon: "error",
          timer: 10000,
          timerProgressBar: true,
        }).then((result) => {
          if (result.dismiss === Swal.DismissReason.timer) {
            //history.push("/clientes")
          }
        });
      });
  }

  function handleDelete() {
    Swal.fire({
      title: "Tem certeza?",
      text: "Isso será irreversivel!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3f51b5",
      cancelButtonColor: "#f44336",
      confirmButtonText: "Sim, excluir!",
    }).then((result) => {
      if (result.isConfirmed) {
        api
          .delete("/grupo/" + id)
          .then((result) => {
            Swal.fire("Excluido!", "Cliente excluido com sucesso.", "success");
            history.push("/clientes");
          })
          .catch((error) => {
            console.log(error.response.request.responseText);
            Swal.fire({
              title: "Erro ao excluir!",
              html: error.response.data.message,
              position: "top-end",
              icon: "error",
              timer: 10000,
              timerProgressBar: true,
            }).then((result) => {
              if (result.dismiss === Swal.DismissReason.timer) {
                //history.push("/clientes")
              }
            });
          });
      }
    });
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
                          checked={values.criarCliente}
                          onChange={handleOnChange}
                          name="criarCliente"
                          type="checkbox"
                        />
                      }
                      label="Criar"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={values.listarCliente}
                          onChange={handleOnChange}
                          name="listarCliente"
                        />
                      }
                      label="Listar"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={values.editarCliente}
                          onChange={handleOnChange}
                          name="editarCliente"
                        />
                      }
                      label="Editar"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={values.excluirCliente}
                          onChange={handleOnChange}
                          name="excluirCliente"
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
                          checked={values.criarFornecedor}
                          onChange={handleOnChange}
                          name="criarFornecedor"
                          type="checkbox"
                        />
                      }
                      label="Criar"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={values.listarFornecedor}
                          onChange={handleOnChange}
                          name="listarFornecedor"
                        />
                      }
                      label="Listar"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={values.editarFornecedor}
                          onChange={handleOnChange}
                          name="editarFornecedor"
                        />
                      }
                      label="Editar"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={values.excluirFornecedor}
                          onChange={handleOnChange}
                          name="excluirFornecedor"
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
                  <FormLabel component="legend">
                    Controle de Funcionários
                  </FormLabel>
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
                  variant="outlined"
                  startIcon={<DeleteForeverIcon />}
                  className={classes.cancelButton}
                  onClick={handleDelete}
                >
                  Excluir
                </Button>
              </Grid>
              <Grid item>
                <Button
                  onClick={() => history.push("/grupos")}
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

export default EditarGrupoPage;
