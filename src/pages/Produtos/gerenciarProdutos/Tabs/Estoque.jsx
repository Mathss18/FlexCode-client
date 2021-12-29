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
        <TextField variant="outlined" label="Estoque mínimo (UN)" fullWidth value={values.estoqueMinimo} name="estoqueMinimo" onChange={handleOnChange} />
      </Grid>
      <Grid item xs={4}>
        <TextField variant="outlined" label="Estoque máximo (UN)" fullWidth value={values.estoqueMaximo} name="estoqueMaximo" onChange={handleOnChange} />
      </Grid>
      <Grid item xs={4}>
        <TextField variant="outlined" label="Quantidade atual (UN)" fullWidth value={values.quantidadeAtual} name="quantidadeAtual" onChange={handleOnChange} />
      </Grid>
    </Grid>
  );
}
