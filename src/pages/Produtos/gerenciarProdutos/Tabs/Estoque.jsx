import { useContext } from "react";
import { GerenciarProdutosContext } from "../../../../context/GerenciarProdutosContext";
import { Grid, TextField } from "@material-ui/core";

export function Estoque() {
  const { values, setValues } = useContext(GerenciarProdutosContext);

  function handleOnChange(event) {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={4}>
        <TextField variant="outlined" label="Estoque mínimo (UN)" fullWidth value={values.estoque_minimo} name="estoque_minimo" onChange={handleOnChange} />
      </Grid>
      <Grid item xs={4}>
        <TextField variant="outlined" label="Estoque máximo (UN)" fullWidth value={values.estoque_maximo} name="estoque_maximo" onChange={handleOnChange} />
      </Grid>
      <Grid item xs={4}>
        <TextField variant="outlined" label="Quantidade atual (UN)" fullWidth value={values.quantidade_atual} name="quantidade_atual" onChange={handleOnChange} />
      </Grid>
    </Grid>
  );
}
