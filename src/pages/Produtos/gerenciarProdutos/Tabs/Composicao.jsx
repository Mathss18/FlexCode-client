import { useContext } from "react";
import { GerenciarProdutosContext } from "../../../../context/GerenciarProdutosContext";
import { Grid, TextField } from "@material-ui/core";

export function Composicao() {
  const { values, setValues } = useContext(GerenciarProdutosContext);

  function handleOnChange(event) {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
  }

  return (
    <Grid container spacing={3}>
      <TextField variant="outlined" label="Composicao" fullWidth value={values.composicao} name="composicao" onChange={handleOnChange} />
    </Grid>
  );
}
