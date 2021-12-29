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
          <TextField variant="outlined" label="NCM" fullWidth value={values.ncm} name="ncm" onChange={handleOnChange} />
        </Grid>
        <Grid item xs={4}>
          <TextField variant="outlined" label="CEST" fullWidth value={values.cest} name="cest" onChange={handleOnChange} />
        </Grid>
        <Grid item xs={4}>
          <TextField variant="outlined" label="Origem" fullWidth value={values.origem} name="origem" onChange={handleOnChange} />
        </Grid>
        <Grid item xs={3}>
          <TextField variant="outlined" label="Peso líquido" fullWidth value={values.pesoLiquido} name="pesoLiquido" onChange={handleOnChange} />
        </Grid>
        <Grid item xs={3}>
          <TextField variant="outlined" label="Peso bruto" fullWidth value={values.pesoBruto} name="pesoBruto" onChange={handleOnChange} />
        </Grid>
        <Grid item xs={3}>
          <TextField variant="outlined" label="Número FCI" fullWidth value={values.numeroFci} name="numeroFci" onChange={handleOnChange} />
        </Grid>
        <Grid item xs={3}>
          <TextField variant="outlined" label="% Vr. aprox. tribut." fullWidth value={values.valorAproxTribut} name="valorAproxTribut" onChange={handleOnChange} />
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
          <TextField variant="outlined" label="Valor fixo PIS" fullWidth value={values.valorPixoPis} name="valorPixoPis" onChange={handleOnChange} />
        </Grid>
        <Grid item xs={3}>
          <TextField variant="outlined" label="Valor fixo PIS ST" fullWidth value={values.valorFixoPisSt} name="valorFixoPisSt" onChange={handleOnChange} />
        </Grid>
        <Grid item xs={3}>
          <TextField variant="outlined" label="Valor fixo COFINS" fullWidth value={values.valorFixoCofins} name="valorFixoCofins" onChange={handleOnChange} />
        </Grid>
        <Grid item xs={3}>
          <TextField variant="outlined" label="Valor fixo COFINS ST" fullWidth value={values.valorFixoCofinsSt} name="valorFixoCofinsSt" onChange={handleOnChange} />
        </Grid>
      </Grid>
    </>
  );
}
