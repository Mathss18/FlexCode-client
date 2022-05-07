import { useProdutoContext } from "../../../../context/GerenciarProdutosContext";
import {
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@material-ui/core";
import OpenWithIcon from "@mui/icons-material/OpenWith";
import { useEffect, useState } from "react";
import api from "../../../../services/api";

export function Estoque() {
  const produtoContext = useProdutoContext();
  const [unidadesProdutos, setUnidadesProdutos] = useState([]);

  function handleOnChange(event) {
    const { name, value } = event.target;
    produtoContext.formik.setFieldValue(name, value); // Altera o formik
  }

  useEffect(() => {
    api
      .get("/unidades-produtos")
      .then((response) => {
        setUnidadesProdutos(response.data.data);
      })
      .catch((error) => {
        console.log("Erro:" + error);
      });
  }, []);

  return (
    <>
      {produtoContext.formik.values.movimentaEstoque ? (
        ""
      ) : (
        <h2 style={{ textAlign: "center" }}>
          Este produto não movimenta estoque!
        </h2>
      )}

      <div
        style={{
          display: produtoContext.formik.values.movimentaEstoque
            ? "block"
            : "none",
        }}
      >
        <div
          style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}
        >
          <OpenWithIcon />
          <h3>Estoque</h3>
        </div>
        <Grid container spacing={3}>
          <Grid item xs={3}>
            <TextField
              variant="outlined"
              label="Estoque mínimo"
              fullWidth
              type="number"
              value={produtoContext.formik.values.estoqueMinimo}
              name="estoqueMinimo"
              onChange={handleOnChange}
              onBlur={produtoContext.formik.handleBlur}
              error={
                produtoContext.formik.touched.estoqueMinimo &&
                Boolean(produtoContext.formik.errors.estoqueMinimo)
              }
              helperText={
                produtoContext.formik.touched.estoqueMinimo &&
                produtoContext.formik.errors.estoqueMinimo
              }
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              variant="outlined"
              label="Estoque máximo"
              fullWidth
              type="number"
              value={produtoContext.formik.values.estoqueMaximo}
              name="estoqueMaximo"
              onChange={handleOnChange}
              onBlur={produtoContext.formik.handleBlur}
              error={
                produtoContext.formik.touched.estoqueMaximo &&
                Boolean(produtoContext.formik.errors.estoqueMaximo)
              }
              helperText={
                produtoContext.formik.touched.estoqueMaximo &&
                produtoContext.formik.errors.estoqueMaximo
              }
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              variant="outlined"
              label="Quantidade atual"
              fullWidth
              type="number"
              value={produtoContext.formik.values.quantidadeAtual}
              name="quantidadeAtual"
              onChange={handleOnChange}
              onBlur={produtoContext.formik.handleBlur}
              error={
                produtoContext.formik.touched.quantidadeAtual &&
                Boolean(produtoContext.formik.errors.quantidadeAtual)
              }
              helperText={
                produtoContext.formik.touched.quantidadeAtual &&
                produtoContext.formik.errors.quantidadeAtual
              }
            />
          </Grid>
          <Grid item xs={3}>
            <FormControl variant="outlined" fullWidth name="unidade_produto_id">
              <InputLabel>Unidade do Produto</InputLabel>
              <Select
                className={"input-select"}
                label="Unidade do Produto"
                name="unidade_produto_id"
                value={produtoContext.formik.values.unidade_produto_id}
                onChange={handleOnChange}
                onBlur={produtoContext.formik.handleBlur}
                error={
                  produtoContext.formik.touched.unidade_produto_id &&
                  Boolean(produtoContext.formik.errors.unidade_produto_id)
                }
              >
                <MenuItem value={null}> Nenhum</MenuItem>
                {unidadesProdutos &&
                  unidadesProdutos.map((item) => {
                    return (
                      <MenuItem
                        value={item.id}
                        key={item.id}
                      >{`${item.nome} (${item.sigla})`}</MenuItem>
                    );
                  })}
              </Select>
              {produtoContext.formik.touched.unidade_produto_id &&
              Boolean(produtoContext.formik.errors.unidade_produto_id) ? (
                <FormHelperText>
                  {produtoContext.formik.errors.unidade_produto_id}
                </FormHelperText>
              ) : (
                ""
              )}
            </FormControl>
          </Grid>
        </Grid>
      </div>
    </>
  );
}
