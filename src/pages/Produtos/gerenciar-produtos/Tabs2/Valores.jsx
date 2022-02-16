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

export function Valores() {
  const produtoContext = useProdutoContext();
  const [infoGrupo, setInfoGrupo] = useState();


  function handleOnChange(event) {
    const { name, value } = event.target;
    produtoContext.useValues.setValues({ ...produtoContext.useValues.values, [name]: value }); // Altera o State
    produtoContext.formik.setFieldValue(name, value); // Altera o formik

    console.log(produtoContext.formik.values);
  }

  useEffect(() => {
    api.get("/grupos-produtos/" + produtoContext.useValues.values.grupo_produto_id)
      .then((response) => {
        console.log(response.data.data);
        setInfoGrupo(response.data.data);

      })
      .catch((error) => { });

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
            label="Valor de Custo"
            fullWidth
            value={produtoContext.useValues.values.valorCusto}
            name="valorCusto"
            onChange={handleOnChange}
            onBlur={produtoContext.formik.handleBlur}
            error={produtoContext.formik.touched.valorCusto && Boolean(produtoContext.formik.errors.valorCusto)}
            helperText={produtoContext.formik.touched.valorCusto && produtoContext.formik.errors.valorCusto}
          />
          <TextField
            variant="outlined"
            style={{ marginBottom: 24 }}
            type="number"
            min="0"
            step="0.0001"
            label="Despesas adicionais"
            fullWidth
            value={produtoContext.useValues.values.despesasAdicionais}
            name="despesasAdicionais"
            onChange={handleOnChange}
            onBlur={produtoContext.formik.handleBlur}
            error={produtoContext.formik.touched.despesasAdicionais && Boolean(produtoContext.formik.errors.despesasAdicionais)}
            helperText={produtoContext.formik.touched.despesasAdicionais && produtoContext.formik.errors.despesasAdicionais}
          />
          <TextField
            variant="outlined"
            style={{ marginBottom: 24 }}
            type="number"
            min="0"
            step="0.0001"
            label="Outras despesas"
            fullWidth
            value={produtoContext.useValues.values.outrasDespesas}
            name="outrasDespesas"
            onChange={handleOnChange}
            onBlur={produtoContext.formik.handleBlur}
            error={produtoContext.formik.touched.outrasDespesas && Boolean(produtoContext.formik.errors.outrasDespesas)}
            helperText={produtoContext.formik.touched.outrasDespesas && produtoContext.formik.errors.outrasDespesas}
          />
          <TextField
            variant="outlined"
            label="Custo final"
            type="number"
            fullWidth
            readOnly
            value={(
              parseFloat(produtoContext.useValues.values.valorCusto) +
              parseFloat(produtoContext.useValues.values.despesasAdicionais) +
              parseFloat(produtoContext.useValues.values.outrasDespesas)
            ).toFixed(4)}
            InputProps={{
              endAdornment: (
                <Tooltip title="O Custo Final é calculado automaticamente">
                  <HelpIcon />
                </Tooltip>
              ),
            }}
            name="custoFinal"
            onChange={handleOnChange}
            onBlur={produtoContext.formik.handleBlur}
            error={produtoContext.formik.touched.valorCusto && Boolean(produtoContext.formik.errors.valorCusto)}
            helperText={produtoContext.formik.touched.valorCusto && produtoContext.formik.errors.valorCusto}
          />
        </Grid>
        <br />
        <Grid
          container
          style={{ alignContent: "flex-start" }}
          xs={6}
        >
          <h2 style={{ marginTop: 0, marginLeft: 16 }}>Grupo de Produto: {infoGrupo?.nome}</h2>
          <Grid item xs={12} style={{ marginLeft: 16, display: 'flex' }} >
            {infoGrupo?.porcentagem_lucro.map((item, index) => {
              return <Card className="card-valores" sx={{ minWidth: 150 }} style={{ width: 300, marginRight: 8 }}>
                <CardContent>
                  <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    {item.descricao}
                  </Typography>
                  <Typography variant="h5" component="div">
                    {item.porcentagem}% de lucro
                  </Typography>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">

                  </Typography>
                  <Typography variant="body2">
                    Preço final: R$ {((
                      parseFloat(produtoContext.useValues.values.valorCusto) +
                      parseFloat(produtoContext.useValues.values.despesasAdicionais) +
                      parseFloat(produtoContext.useValues.values.outrasDespesas)
                    ).toFixed(4) * (1 + (item.porcentagem / 100))).toLocaleString('pt-br', {minimumFractionDigits: 2})}
                    <br />
                    Comissão do vendedor: R$ {(((
                      parseFloat(produtoContext.useValues.values.valorCusto) +
                      parseFloat(produtoContext.useValues.values.despesasAdicionais) +
                      parseFloat(produtoContext.useValues.values.outrasDespesas)
                    ).toFixed(4) * (1 + (item.porcentagem / 100))).toFixed(2) * (produtoContext.useValues.values.comissao / 100).toFixed(2)).toLocaleString('pt-br', {minimumFractionDigits: 2})}
                  </Typography>
                </CardContent>
              </Card>
            })}
          </Grid>

        </Grid>
      </Grid>
    </>
  );
}
