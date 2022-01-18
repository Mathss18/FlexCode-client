import { Grid, TextField } from "@material-ui/core";
import OpenWithIcon from "@mui/icons-material/OpenWith";
import { useProdutoContext } from "../../../../context/GerenciarProdutosContext";

export function Detalhes() {
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
        <h3>Dimensões</h3>
      </div>
      <Grid container spacing={3}>

        <Grid item xs={6}>
          <TextField variant="outlined"
            style={{ marginBottom: 24 }}
            label="Peso (kg)" fullWidth
            value={produtoContext.useValues.values.peso}
            name="peso"
            onChange={handleOnChange}
            onBlur={produtoContext.formik.handleBlur}
            error={produtoContext.formik.touched.peso && Boolean(produtoContext.formik.errors.peso)}
            helperText={produtoContext.formik.touched.peso && produtoContext.formik.errors.peso}
          />
          <TextField variant="outlined"
            style={{ marginBottom: 24 }}
            label="Largura (m)" fullWidth
            value={produtoContext.useValues.values.largura}
            name="largura"
            onChange={handleOnChange}
            onBlur={produtoContext.formik.handleBlur}
            error={produtoContext.formik.touched.peso && Boolean(produtoContext.formik.errors.peso)}
            helperText={produtoContext.formik.touched.peso && produtoContext.formik.errors.peso}
          />
          <TextField variant="outlined"
            style={{ marginBottom: 24 }}
            label="Altura (m)" fullWidth
            value={produtoContext.useValues.values.altura}
            name="altura"
            onChange={handleOnChange}
            onBlur={produtoContext.formik.handleBlur}
            error={produtoContext.formik.touched.altura && Boolean(produtoContext.formik.errors.altura)}
            helperText={produtoContext.formik.touched.altura && produtoContext.formik.errors.altura}
          />
          <TextField variant="outlined"
            label="Comprimento (m)" fullWidth
            value={produtoContext.useValues.values.comprimento}
            name="comprimento"
            onChange={handleOnChange}
            onBlur={produtoContext.formik.handleBlur}
            error={produtoContext.formik.touched.comprimento && Boolean(produtoContext.formik.errors.comprimento)}
            helperText={produtoContext.formik.touched.comprimento && produtoContext.formik.errors.comprimento}
          />
        </Grid>

        <Grid item xs={4}>
          <TextField variant="outlined" style={{ marginBottom: 24 }} label="Comissão (%)" fullWidth value={produtoContext.useValues.values.comissao} name="comissao" onChange={handleOnChange} />
          <TextField multiline className={"input-select"} variant="outlined" label="Descrição do Produto" fullWidth value={produtoContext.useValues.values.descricao} rows={5} name="descricao" onChange={handleOnChange} />
        </Grid>

      </Grid>

    </>
  );
}
