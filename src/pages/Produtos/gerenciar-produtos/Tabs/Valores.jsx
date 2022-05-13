import { useState, useEffect, useRef } from "react";
import { useProdutoContext } from "../../../../context/GerenciarProdutosContext";
import {
  Grid,
  TextField,
  Tooltip,
  Card,
  CardContent,
  Typography,
} from "@material-ui/core";
import api from "../../../../services/api";
import OpenWithIcon from "@mui/icons-material/OpenWith";
import HelpIcon from "@mui/icons-material/Help";
import toast from "react-hot-toast";

export function Valores() {
  const produtoContext = useProdutoContext();
  const [infoGrupo, setInfoGrupo] = useState();

  function handleOnChange(event) {
    const { name, value } = event.target;
    produtoContext.formik.setFieldValue(name, value); // Altera o formik
  }

  useEffect(() => {
    if (produtoContext.formik.values.grupo_produto_id === "") {
      toast("Selecione um grupo de produto", { type: "error" });
      return;
    }
    api
      .get("/grupos-produtos/" + produtoContext.formik.values.grupo_produto_id)
      .then((response) => {
        setInfoGrupo(response.data.data);
      })
      .catch((error) => {});
  }, []);

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
        <OpenWithIcon />
        <h3>Detalhes</h3>
      </div>
      <Grid container>
        <Grid item xs={6}>
          <TextField
            variant="outlined"
            style={{ marginBottom: 24 }}
            type="number"
            min="0"
            step="0.0001"
            label="Valor de Custo *"
            fullWidth
            value={produtoContext.formik.values.valorCusto}
            name="valorCusto"
            onChange={handleOnChange}
            onBlur={produtoContext.formik.handleBlur}
            error={
              produtoContext.formik.touched.valorCusto &&
              Boolean(produtoContext.formik.errors.valorCusto)
            }
            helperText={
              produtoContext.formik.touched.valorCusto &&
              produtoContext.formik.errors.valorCusto
            }
          />
          <TextField
            variant="outlined"
            style={{ marginBottom: 24 }}
            type="number"
            min="0"
            step="0.0001"
            label="Despesas adicionais *"
            fullWidth
            value={produtoContext.formik.values.despesasAdicionais}
            name="despesasAdicionais"
            onChange={handleOnChange}
            onBlur={produtoContext.formik.handleBlur}
            error={
              produtoContext.formik.touched.despesasAdicionais &&
              Boolean(produtoContext.formik.errors.despesasAdicionais)
            }
            helperText={
              produtoContext.formik.touched.despesasAdicionais &&
              produtoContext.formik.errors.despesasAdicionais
            }
          />
          <TextField
            variant="outlined"
            style={{ marginBottom: 24 }}
            type="number"
            min="0"
            step="0.0001"
            label="Outras despesas *"
            fullWidth
            value={produtoContext.formik.values.outrasDespesas}
            name="outrasDespesas"
            onChange={handleOnChange}
            onBlur={produtoContext.formik.handleBlur}
            error={
              produtoContext.formik.touched.outrasDespesas &&
              Boolean(produtoContext.formik.errors.outrasDespesas)
            }
            helperText={
              produtoContext.formik.touched.outrasDespesas &&
              produtoContext.formik.errors.outrasDespesas
            }
          />
          <TextField
            variant="outlined"
            label="Custo final *"
            type="number"
            fullWidth
            value={(
              parseFloat(produtoContext.formik.values.valorCusto) +
              parseFloat(produtoContext.formik.values.despesasAdicionais) +
              parseFloat(produtoContext.formik.values.outrasDespesas)
            ).toFixed(4)}
            InputProps={{
              readOnly: true,
              endAdornment: (
                <Tooltip title="O Custo Final é calculado automaticamente">
                  <HelpIcon />
                </Tooltip>
              ),
            }}
            name="custoFinal"
            onChange={handleOnChange}
            onBlur={produtoContext.formik.handleBlur}
            error={
              produtoContext.formik.touched.valorCusto &&
              Boolean(produtoContext.formik.errors.valorCusto)
            }
            helperText={
              produtoContext.formik.touched.valorCusto &&
              produtoContext.formik.errors.valorCusto
            }
          />
        </Grid>
        <br />
        <Grid container style={{ alignContent: "flex-start" }} xs={6}>
          <h2 style={{ marginTop: 0, marginLeft: 16 }}>
            Grupo de Produto: {infoGrupo?.nome}
          </h2>
          <Grid item xs={12} style={{ marginLeft: 16, display: "flex" }}>
            {infoGrupo?.porcentagem_lucro.map((item, index) => {
              return (
                <Card
                  className="card-valores"
                  sx={{ minWidth: 150 }}
                  style={{ width: 300, marginRight: 8 }}
                >
                  <CardContent>
                    <Typography
                      sx={{ fontSize: 14 }}
                      color="text.secondary"
                      gutterBottom
                    >
                      {item.descricao}
                    </Typography>
                    <Typography variant="h5" component="div">
                      Valor venda: R${" "}
                      {(
                        (
                          parseFloat(produtoContext.formik.values.valorCusto) +
                          parseFloat(
                            produtoContext.formik.values.despesasAdicionais
                          ) +
                          parseFloat(
                            produtoContext.formik.values.outrasDespesas
                          )
                        ).toFixed(4) *
                        (1 + item.porcentagem / 100)
                      ).toLocaleString("pt-br", { minimumFractionDigits: 2 })}
                    </Typography>
                    <Typography
                      sx={{ mb: 1.5 }}
                      color="text.secondary"
                    ></Typography>
                    <Typography variant="body2">
                      {item.porcentagem}% de lucro
                      <br />
                      Comissão do vendedor: R${" "}
                      {(
                        (
                          (
                            parseFloat(
                              produtoContext.formik.values.valorCusto
                            ) +
                            parseFloat(
                              produtoContext.formik.values.despesasAdicionais
                            ) +
                            parseFloat(
                              produtoContext.formik.values.outrasDespesas
                            )
                          ).toFixed(4) *
                          (1 + item.porcentagem / 100)
                        ).toFixed(2) *
                        (produtoContext.formik.values.comissao / 100).toFixed(2)
                      ).toLocaleString("pt-br", { minimumFractionDigits: 2 })}
                    </Typography>
                  </CardContent>
                </Card>
              );
            })}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
