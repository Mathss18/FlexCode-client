import { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import SideMenu from "../../../components/SideMenu";
import TopBar from "../../../components/TopBar";
import { Grid, TextField, Select, MenuItem, FormControl, InputLabel, Divider, Button } from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import AssignmentIcon from "@material-ui/icons/Assignment";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import api from "../../../services/api";
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
  grupoPai: null,
};

function EditarGruposDeProdutos() {
  const classes = useStyles();
  const history = useHistory();
  const [values, setValues] = useState(initialValues);
  const { id } = useParams();
  const [grupos, setGrupos] = useState([]);

  useEffect(() => {
    listarGruposDeProdutos();

    api.get("/grupo-produto/" + id).then((response) => {
      setValues(response.data["data"]);
    });
  }, []);

  const listarGruposDeProdutos = async () => {
    await api
      .get("/grupos-produtos")
      .then((res) => {
        setGrupos(res.data);
      })
      .catch((err) => {
        console.log("Erro:" + err);
      });
  };

  function handleOnChange(event) {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
  }

  function handleOnSubmit(event) {
    event.preventDefault();
    api
      .put("/grupo-produto/" + id, values)
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
            history.push("/grupos-produtos");
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
          .delete("/grupo-produto/" + id)
          .then((result) => {
            Swal.fire("Excluido!", "Cliente excluido com sucesso.", "success");
            history.push("/grupos-produtos");
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
          <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
            <AssignmentIcon />
            <h3>Dados Pessoais</h3>
          </div>
          <form onSubmit={handleOnSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField variant="outlined" label="Nome do Grupo" fullWidth type="text" className={classes.input} value={values.nome} name="nome" onChange={handleOnChange} />
              </Grid>
              <Grid item xs={6}>
                <FormControl variant="outlined" fullWidth className={classes.input}>
                  <InputLabel id="label-grupo-pai">Grupo Pai</InputLabel>
                  <Select label="Grupo pai" onChange={handleOnChange} name="nome" value={null}>
                    <MenuItem value={null}>Nenhum</MenuItem>
                    {grupos &&
                      grupos.map((grupo) => {
                        return <MenuItem value={grupo.id}>{grupo.nome}</MenuItem>;
                      })}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <br />
            <Divider />

            <Grid container spacing={0}>
              <Grid item>
                <Button type="submit" variant="outlined" startIcon={<CheckIcon />} className={classes.saveButton}>
                  Salvar
                </Button>
              </Grid>
              <Grid item>
                <Button variant="outlined" startIcon={<DeleteForeverIcon />} className={classes.cancelButton} onClick={handleDelete}>
                  Excluir
                </Button>
              </Grid>
              <Grid item>
                <Button onClick={() => history.push("/clientes")} variant="outlined" startIcon={<CloseIcon />} className={classes.cancelButton}>
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

export default EditarGruposDeProdutos;
