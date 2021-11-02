import { useContext } from "react";
import { GerenciarProdutosContext } from "../../../../context/GerenciarProdutosContext";
import { Grid, TextField } from "@material-ui/core";

export function Detalhes() {
  const { values, setValues } = useContext(GerenciarProdutosContext);

  function handleOnChange(event) {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={3}>
        <TextField variant="outlined" label="Peso" fullWidth value={values.peso} name="peso" onChange={handleOnChange} />
      </Grid>
    </Grid>
  );
}