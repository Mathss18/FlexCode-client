import { useContext } from "react";
import { GerenciarProdutosContext } from "../../../../context/GerenciarProdutosContext";
import { Grid, TextField } from "@material-ui/core";

export function Valores() {
  const { values, setValues } = useContext(GerenciarProdutosContext);

  function handleOnChange(event) {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={6}>
        <TextField variant="outlined" style={{ marginBottom: 24 }} label="Valor de Custo" required fullWidth value={values.valor_custo} name="valor_custo" onChange={handleOnChange} />
        <TextField variant="outlined" style={{ marginBottom: 24 }} label="Despesas acessórias" fullWidth value={values.despesa_acessoria} name="despesa_acessoria" onChange={handleOnChange} />
        <TextField variant="outlined" style={{ marginBottom: 24 }} label="Outras despesas" fullWidth value={values.outras_despesas} name="outras_despesas" onChange={handleOnChange} />
        <TextField variant="outlined" label="Custo final" fullWidth value={values.custo_final} name="custo_final" onChange={handleOnChange} />
      </Grid>
    </Grid>
  );
}
