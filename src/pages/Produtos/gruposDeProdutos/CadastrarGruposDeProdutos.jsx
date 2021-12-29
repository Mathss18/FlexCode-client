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
  grupoPai: null,
};

function CadastrarGrupoDeProdutos() {
  const history = useHistory();
  const [values, setValues] = useState(initialValues);
  const [grupos, setGrupos] = useState([]);

  useEffect(() => {

    api.get("/grupos-produtos").then(res => {
      setGrupos(res.data.data);
    }).catch(err => {
      console.log('Erro:' + err);
    });

  }, [])

  const handleOnChange = (e) => {
    let { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

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
                <TextField variant="outlined" label="Nome do Grupo" fullWidth type="text" value={values.nome} name="nome" onChange={handleOnChange} />
              </Grid>
              <Grid item xs={6}>
                <FormControl variant="outlined" fullWidth className={'input-select'}>
                  <InputLabel id="label-grupo-pai">Grupo Pai</InputLabel>
                  <Select className={'input-select'} label="Grupo pai" onChange={handleOnChange} name="grupoPai" value={values.grupoPai}>
                    <MenuItem value={null}>
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
                <Button type="submit" variant="outlined" startIcon={<CheckIcon />} className={'btn btn-primary btn-spacing'}>
                  Salvar
                </Button>
              </Grid>
              <Grid item>
                <Button onClick={() => history.push("/grupos-produtos")} variant="outlined" startIcon={<CloseIcon />} className={'btn btn-error btn-spacing'}>
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
