import { useProdutoContext } from "../../../../context/GerenciarProdutosContext";
import { Grid, TextField, Divider } from "@material-ui/core";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import OpenWithIcon from "@mui/icons-material/OpenWith";

export function Fiscal() {
  const produtoContext = useProdutoContext();

  function handleOnChange(event) {
    const { name, value } = event.target;
    produtoContext.useValues.setValues({ ...produtoContext.useValues.values, [name]: value }); // Altera o State 
    produtoContext.formik.setFieldValue(name, value); // Altera o formik
    console.log(produtoContext.formik.values);
  }

  return (
    <>
    {produtoContext.useValues.values.habilitaNotaFiscal
        ? ""
        : <h2 style={{textAlign: 'center'}}>Este produto não habilita nota fiscal!</h2>}
    <div style={{
      display: produtoContext.useValues.values.habilitaNotaFiscal
        ? "block"
        : "none",
    }}>
      <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
        <OpenWithIcon />
        <h3>Detalhes</h3>
      </div>
      <Grid container spacing={3}>
        <Grid item xs={4}>
          <TextField
            variant="outlined"
            label="NCM"
            fullWidth
            value={produtoContext.useValues.values.ncm}
            name="ncm"
            onChange={handleOnChange}
            onBlur={produtoContext.formik.handleBlur}
            error={produtoContext.formik.touched.ncm && Boolean(produtoContext.formik.errors.ncm)}
            helperText={produtoContext.formik.touched.ncm && produtoContext.formik.errors.ncm}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            variant="outlined"
            label="CEST"
            fullWidth
            value={produtoContext.useValues.values.cest}
            name="cest"
            onChange={handleOnChange}
            onBlur={produtoContext.formik.handleBlur}
            error={produtoContext.formik.touched.cest && Boolean(produtoContext.formik.errors.cest)}
            helperText={produtoContext.formik.touched.cest && produtoContext.formik.errors.cest}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            variant="outlined"
            label="Origem"
            fullWidth
            value={produtoContext.useValues.values.origem}
            name="origem"
            onChange={handleOnChange}
            onBlur={produtoContext.formik.handleBlur}
            error={produtoContext.formik.touched.origem && Boolean(produtoContext.formik.errors.origem)}
            helperText={produtoContext.formik.touched.origem && produtoContext.formik.errors.origem}
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            variant="outlined"
            label="Peso líquido"
            fullWidth
            value={produtoContext.useValues.values.pesoLiquido}
            name="pesoLiquido"
            onChange={handleOnChange}
            onBlur={produtoContext.formik.handleBlur}
            error={produtoContext.formik.touched.pesoLiquido && Boolean(produtoContext.formik.errors.pesoLiquido)}
            helperText={produtoContext.formik.touched.pesoLiquido && produtoContext.formik.errors.pesoLiquido}
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            variant="outlined"
            label="Peso bruto"
            fullWidth
            value={produtoContext.useValues.values.pesoBruto}
            name="pesoBruto"
            onChange={handleOnChange}
            onBlur={produtoContext.formik.handleBlur}
            error={produtoContext.formik.touched.pesoBruto && Boolean(produtoContext.formik.errors.pesoBruto)}
            helperText={produtoContext.formik.touched.pesoBruto && produtoContext.formik.errors.pesoBruto}
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            variant="outlined"
            label="Número FCI"
            fullWidth
            value={produtoContext.useValues.values.numeroFci}
            name="numeroFci"
            onChange={handleOnChange}
            onBlur={produtoContext.formik.handleBlur}
            error={produtoContext.formik.touched.numeroFci && Boolean(produtoContext.formik.errors.numeroFci)}
            helperText={produtoContext.formik.touched.numeroFci && produtoContext.formik.errors.numeroFci}
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            variant="outlined"
            label="% Vr. aprox. tribut."
            fullWidth
            value={produtoContext.useValues.values.valorAproxTribut}
            name="valorAproxTribut"
            onChange={handleOnChange}
            onBlur={produtoContext.formik.handleBlur}
            error={produtoContext.formik.touched.valorAproxTribut && Boolean(produtoContext.formik.errors.valorAproxTribut)}
            helperText={produtoContext.formik.touched.valorAproxTribut && produtoContext.formik.errors.valorAproxTribut}
          />
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
          <TextField
            variant="outlined"
            label="Valor fixo PIS"
            fullWidth
            value={produtoContext.useValues.values.valorPixoPis}
            name="valorPixoPis"
            onChange={handleOnChange}
            onBlur={produtoContext.formik.handleBlur}
            error={produtoContext.formik.touched.valorPixoPis && Boolean(produtoContext.formik.errors.valorPixoPis)}
            helperText={produtoContext.formik.touched.valorPixoPis && produtoContext.formik.errors.valorPixoPis}
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            variant="outlined"
            label="Valor fixo PIS ST"
            fullWidth
            value={produtoContext.useValues.values.valorFixoPisSt}
            name="valorFixoPisSt"
            onChange={handleOnChange}
            onBlur={produtoContext.formik.handleBlur}
            error={produtoContext.formik.touched.valorFixoPisSt && Boolean(produtoContext.formik.errors.valorFixoPisSt)}
            helperText={produtoContext.formik.touched.valorFixoPisSt && produtoContext.formik.errors.valorFixoPisSt}
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            variant="outlined"
            label="Valor fixo COFINS"
            fullWidth
            value={produtoContext.useValues.values.valorFixoCofins}
            name="valorFixoCofins"
            onChange={handleOnChange}
            onBlur={produtoContext.formik.handleBlur}
            error={produtoContext.formik.touched.valorFixoCofins && Boolean(produtoContext.formik.errors.valorFixoCofins)}
            helperText={produtoContext.formik.touched.valorFixoCofins && produtoContext.formik.errors.valorFixoCofins}
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            variant="outlined"
            label="Valor fixo COFINS ST"
            fullWidth
            value={produtoContext.useValues.values.valorFixoCofinsSt}
            name="valorFixoCofinsSt"
            onChange={handleOnChange}
            onBlur={produtoContext.formik.handleBlur}
            error={produtoContext.formik.touched.valorFixoCofinsSt && Boolean(produtoContext.formik.errors.valorFixoCofinsSt)}
            helperText={produtoContext.formik.touched.valorFixoCofinsSt && produtoContext.formik.errors.valorFixoCofinsSt}
          />
        </Grid>
      </Grid>
    </div>
    </>
  );
}
