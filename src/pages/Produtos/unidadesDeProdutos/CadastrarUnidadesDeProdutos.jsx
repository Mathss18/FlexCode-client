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

const initialValues = {
  nome: "",
  sigla: "",
  padrao: 0,
};

function CadastrarUnidadeDeProdutos() {
  const history = useHistory();
  const [values, setValues] = useState(initialValues);

  const handleOnChange = (e) => {
    let { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  console.log(values);

  function handleOnSubmit(event) {
    event.preventDefault();
    console.log(values);

    api.post("/unidade-produto", values).then((response) => console.log(response));
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
                <TextField variant="outlined" label="Nome" fullWidth type="text" value={values.nome} name="nome" onChange={handleOnChange} />
              </Grid>
              <Grid item xs={3}>
                <TextField variant="outlined" label="Sigla" fullWidth type="text" value={values.sigla} name="sigla" onChange={handleOnChange} />
              </Grid>
              <Grid item xs={3}>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel>Padrão</InputLabel>
                  <Select className={'input-select'} label="Padrão" onChange={handleOnChange} type="select" name="padrao" value={values.padrao}>
                    <MenuItem value={0}>Não</MenuItem>
                    <MenuItem value={1}>Sim</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <br />
            <Divider />

            <Grid container spacing={0}>
              <Grid item>
                <Button type="submit" variant="outlined" startIcon={<CheckIcon />} className={'btn btn-primary btn-spacing'}>
                  Salvar
                </Button>
              </Grid>
              <Grid item>
                <Button onClick={() => history.push("/unidades-produtos")} variant="outlined" startIcon={<CloseIcon />} className={'btn btn-error btn-spacing'}>
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

export default CadastrarUnidadeDeProdutos;
