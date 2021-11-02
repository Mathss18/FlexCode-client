import { useContext } from "react";
import { GerenciarProdutosContext } from "../../../../context/GerenciarProdutosContext";
import { Grid, TextField } from "@material-ui/core";

export function Dados() {
  const { values, setValues } = useContext(GerenciarProdutosContext);

  function handleOnChange(event) {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={3}>
        <TextField variant="outlined" label="Nome do produto" fullWidth value={values.name} name="name" onChange={handleOnChange} />
      </Grid>
      <Grid item xs={3}>
        <TextField variant="outlined" label="Código interno" fullWidth value={values.name} name="name" onChange={handleOnChange} />
      </Grid>
      <Grid item xs={3}>
        <TextField variant="outlined" label="Código de barra" fullWidth value={values.name} name="name" onChange={handleOnChange} />
      </Grid>
      <Grid item xs={3}>
        <TextField variant="outlined" label="Grupo do produto" fullWidth value={values.name} name="name" onChange={handleOnChange} />
      </Grid>
      <Grid item xs={3}>
        <TextField variant="outlined" label="Movimenta estoque?" fullWidth value={values.name} name="name" onChange={handleOnChange} />
      </Grid>
      <Grid item xs={3}>
        <TextField variant="outlined" label="Habilitar nota fiscal?" fullWidth value={values.name} name="name" onChange={handleOnChange} />
      </Grid>
      <Grid item xs={3}>
        <TextField variant="outlined" label="Possui variações?" fullWidth value={values.name} name="name" onChange={handleOnChange} />
      </Grid>
      <Grid item xs={3}>
        <TextField variant="outlined" label="Possui composição?" fullWidth value={values.name} name="name" onChange={handleOnChange} />
      </Grid>
    </Grid>
  );
}
