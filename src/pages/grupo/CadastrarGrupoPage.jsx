import { useState } from "react";
import SideMenu from "../../components/SideMenu";
import TopBar from "../../components/TopBar";
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
  Switch
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
  segunda: false,
};

function CadastrarGrupoPage() {
  const classes = useStyles();
  const history = useHistory();
  const [values, setValues] = useState(initialValues);

  function handleOnChange(event) {
    const { name, value } = event.target;

    console.log(typeof(value));
  }

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
              <Grid item xs={3}>
                <FormControl component="fieldset" variant="standard">
                  <FormLabel component="legend">Dias de acesso</FormLabel>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={values.segunda}
                          onChange={handleOnChange}
                          name="segunda"
                        />
                      }
                      label="Segunda"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={values.jason}
                          onChange={handleOnChange}
                          name="jason"
                        />
                      }
                      label="Jason Killian"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={values.antoine}
                          onChange={handleOnChange}
                          name="antoine"
                        />
                      }
                      label="Antoine Llorca"
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
