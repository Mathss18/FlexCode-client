import { useContext } from "react";
import { GerenciarProdutosContext } from "../../../../context/GerenciarProdutosContext";
import { Grid, TextField, Typography, Divider } from "@material-ui/core";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";

export function Fiscal() {
  const { values, setValues } = useContext(GerenciarProdutosContext);

  function handleOnChange(event) {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
  }

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={4}>
          <TextField variant="outlined" label="NCM" fullWidth value={values.fiscal_ncm} name="fiscal_ncm" onChange={handleOnChange} />
        </Grid>
        <Grid item xs={4}>
          <TextField variant="outlined" label="CEST" fullWidth value={values.fiscal_cest} name="fiscal_cest" onChange={handleOnChange} />
        </Grid>
        <Grid item xs={4}>
          <TextField variant="outlined" label="Origem" fullWidth value={values.fiscal_origem} name="fiscal_origem" onChange={handleOnChange} />
        </Grid>
        <Grid item xs={3}>
          <TextField variant="outlined" label="Peso líquido" fullWidth value={values.fiscal_peso_liquido} name="fiscal_peso_liquido" onChange={handleOnChange} />
        </Grid>
        <Grid item xs={3}>
          <TextField variant="outlined" label="Peso bruto" fullWidth value={values.fiscal_peso_bruto} name="fiscal_peso_bruto" onChange={handleOnChange} />
        </Grid>
        <Grid item xs={3}>
          <TextField variant="outlined" label="Número FCI" fullWidth value={values.fiscal_fci} name="fiscal_fci" onChange={handleOnChange} />
        </Grid>
        <Grid item xs={3}>
          <TextField variant="outlined" label="% Vr. aprox. tribut." fullWidth value={values.fiscal_aprox_tribut} name="fiscal_aprox_tribut" onChange={handleOnChange} />
        </Grid>
      </Grid>
      <br />
      <Divider />
      <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
        <MonetizationOnIcon />
        <h3>PIS / COFINS</h3>
      </div>
      <Grid container spacing={3}>
        <Grid item xs={3}>
          <TextField variant="outlined" label="Valor fixo PIS" fullWidth value={values.fiscal_pis} name="fiscal_pis" onChange={handleOnChange} />
        </Grid>
        <Grid item xs={3}>
          <TextField variant="outlined" label="Valor fixo PIS ST" fullWidth value={values.fiscal_pis_st} name="fiscal_pis_st" onChange={handleOnChange} />
        </Grid>
        <Grid item xs={3}>
          <TextField variant="outlined" label="Valor fixo COFINS" fullWidth value={values.fiscal_cofins} name="fiscal_cofins" onChange={handleOnChange} />
        </Grid>
        <Grid item xs={3}>
          <TextField variant="outlined" label="Valor fixo COFINS ST" fullWidth value={values.fiscal_cofins_st} name="fiscal_cofins_st" onChange={handleOnChange} />
        </Grid>
      </Grid>
    </>
  );
}
