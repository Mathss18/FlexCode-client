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
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

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
  addButton: {
    marginTop: theme.spacing(2),
  },
  timepicker: {
    backgroundColor: "#FFF",
  },
}));

const initialValues = {
  nome: "",
  variacoes: ["", ""],
};

function CadastrarVariacoes() {
  const classes = useStyles();
  const history = useHistory();
  const [values, setValues] = useState(initialValues);

  const handleOnChange = (e) => {
    let { name, value, id } = e.target;

    console.log(e);

    if (name === "variacoes") {
      const index = id.split("_")[1];
      const newVariacoes = [...values.variacoes];
      newVariacoes[index] = value;
      console.log(newVariacoes);
      setValues({ ...values, variacoes: newVariacoes });
    } else {
      setValues({ ...values, [name]: value });
    }
  };

  const AdicionarVariacao = () => {
    const newVariacoes = [...values.variacoes];
    newVariacoes.push("");
    setValues({ ...values, variacoes: newVariacoes });
  };

  const removerVariacao = (i) => {
    const newVariacoes = [...values.variacoes];
    newVariacoes.splice(i, 1);
    setValues({ ...values, variacoes: newVariacoes });
  }

  console.log(values);

  function handleOnSubmit(e) {
    e.preventDefault();
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
            <h3>Dados da Unidade de Produtos</h3>
          </div>
          <form onSubmit={handleOnSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField variant="outlined" label="Nome" fullWidth type="text" className={classes.input} value={values.nome} name="nome" onChange={handleOnChange} />
              </Grid>
              {values.variacoes.map((variacao, index) => {
                return (
                  <Grid item xs={2} key={index}>
                    <TextField
                      variant="outlined"
                      label={"Variação " + (index + 1)}
                      fullWidth
                      id={"variacoes_" + index}
                      className={classes.input}
                      value={variacao}
                      name="variacoes"
                      onChange={handleOnChange}
                      InputProps={ index !== 0 && {
                          endAdornment: (
                            <IconButton onClick={() => removerVariacao(index)} >
                              <DeleteIcon />
                            </IconButton>
                          ),
                      }}
                    />
                  </Grid>
                );
              })}
            </Grid>
            <Grid>
              <Button className={classes.addButton} variant="outlined" onClick={() => AdicionarVariacao()}>
                Adicionar
              </Button>
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
                <Button onClick={() => history.push("/grades-variacoes")} variant="outlined" startIcon={<CloseIcon />} className={classes.cancelButton}>
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

export default CadastrarVariacoes;
