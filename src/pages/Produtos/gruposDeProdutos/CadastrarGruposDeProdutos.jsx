import { useState, useEffect } from "react";
import SideMenu from "../../../components/SideMenu";
import TopBar from "../../../components/TopBar";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, TextField, Select, Divider, Button, MenuItem, FormControl, InputLabel } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import api from "../../../services/api";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import AssignmentIcon from "@material-ui/icons/Assignment";

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
  grupoPai: 0,
};

function CadastrarGrupoDeProdutos() {
  const classes = useStyles();
  const history = useHistory();
  const [values, setValues] = useState(initialValues);
  const [ grupos, setGrupos ] = useState([]);

  useEffect(() => {
    listarGruposDeProdutos();
  }, [])

  const handleOnChange = (e) => {
    let { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  console.log(values);


  const listarGruposDeProdutos = () => {
    api.get("/grupos-produtos").then(res => {
        setGrupos(res.data.data);
    }).catch(err => {
      console.log('Erro:' + err);
    });
  }

  function handleOnSubmit(event) {
    event.preventDefault();
    console.log(values);

    api.post("/grupo-produto", values).then((response) => console.log(response));
  }

  return (
    <>
      <TopBar />

      <SideMenu>
        <div>
          <Divider />
          <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
            <AssignmentIcon />
            <h3>Dados do Grupo</h3>
          </div>
          <form onSubmit={handleOnSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField variant="outlined" label="Nome do Grupo" fullWidth type="text" className={classes.input} value={values.nome} name="nome" onChange={handleOnChange} />
              </Grid>
              <Grid item xs={6}>
                <FormControl variant="outlined" fullWidth className={classes.input}>
                  <InputLabel id="label-grupo-pai">Grupo Pai</InputLabel>
                  <Select label="Grupo pai" onChange={handleOnChange} name="grupoPai" value={values.grupoPai}>
                    <MenuItem value={0}>
                      Nenhum
                    </MenuItem>
                    {grupos && 
                      grupos.map((grupo) => {
                        return <MenuItem value={grupo.id}>{grupo.nome}</MenuItem>
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
                <Button onClick={() => history.push("/grupos-produtos")} variant="outlined" startIcon={<CloseIcon />} className={classes.cancelButton}>
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

export default CadastrarGrupoDeProdutos;
