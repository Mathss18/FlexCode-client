import { useProdutoContext } from "../../../../context/GerenciarProdutosContext";
import { Grid, TextField } from "@material-ui/core";
import OpenWithIcon from "@mui/icons-material/OpenWith";

export function Estoque() {
  const produtoContext = useProdutoContext();

  function handleOnChange(event) {
    const { name, value } = event.target;
    produtoContext.useValues.setValues({ ...produtoContext.useValues.values, [name]: value });
    produtoContext.formik.setFieldValue(name, value);
    console.log(produtoContext.formik.values);
  }


  return (
    <>
      <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
        <OpenWithIcon />
        <h3>Estoque</h3>
      </div>
      <Grid container spacing={3}>
        <Grid item xs={4}>
          <TextField variant="outlined"
            label="Estoque mínimo (UN)"
            fullWidth
            value={produtoContext.useValues.values.estoqueMinimo}
            name="estoqueMinimo"
            onChange={handleOnChange} 
            onBlur={produtoContext.formik.handleBlur}
            error={produtoContext.formik.touched.estoqueMinimo && Boolean(produtoContext.formik.errors.estoqueMinimo)}
            helperText={produtoContext.formik.touched.estoqueMinimo && produtoContext.formik.errors.estoqueMinimo}
            />
        </Grid>
        <Grid item xs={4}>
          <TextField variant="outlined"
            label="Estoque máximo (UN)"
            fullWidth
            value={produtoContext.useValues.values.estoqueMaximo}
            name="estoqueMaximo"
            onChange={handleOnChange} 
            onBlur={produtoContext.formik.handleBlur}
            error={produtoContext.formik.touched.estoqueMaximo && Boolean(produtoContext.formik.errors.estoqueMaximo)}
            helperText={produtoContext.formik.touched.estoqueMaximo && produtoContext.formik.errors.estoqueMaximo}
            />
        </Grid>
        <Grid item xs={4}>
          <TextField variant="outlined"
            label="Quantidade atual (UN)"
            fullWidth
            value={produtoContext.useValues.values.quantidadeAtual}
            name="quantidadeAtual"
            onChange={handleOnChange} 
            onBlur={produtoContext.formik.handleBlur}
            error={produtoContext.formik.touched.quantidadeAtual && Boolean(produtoContext.formik.errors.quantidadeAtual)}
            helperText={produtoContext.formik.touched.quantidadeAtual && produtoContext.formik.errors.quantidadeAtual}
            />
        </Grid>
      </Grid>
    </>
  );
}
