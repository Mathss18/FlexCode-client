import { useEffect, useState } from "react";
import api from "../../../../services/api";
import { useProdutoContext } from "../../../../context/GerenciarProdutosContext";
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@material-ui/core";
import OpenWithIcon from "@mui/icons-material/OpenWith";
import { useParams } from "react-router-dom";
import { initialValues } from "../../../../constants/produtosInitialValues";

export function Dados() {
  const produtoContext = useProdutoContext();
  const [grupoProdutos, setGrupoProdutos] = useState([]);
  const parametros = useParams();

  function handleOnChange(event) {
    const { name, value } = event.target;
    produtoContext.useValues.setValues({ ...produtoContext.useValues.values, [name]: value }); // Altera o State 
    produtoContext.formik.setFieldValue(name, value); // Altera o formik
    console.log(produtoContext.formik.values);
  }

  useEffect(() => {
    api
      .get("/grupos-produtos")
      .then((response) => {
        setGrupoProdutos(response.data.data);
      })
      .catch((error) => {
        console.log("Erro:" + error);
      });
  }, []);

  useEffect(() => {

    produtoContext.useValues.setValues(initialValues); // Reseta o State 
    produtoContext.formik.resetForm(); // Reseta o formik



  }, []);

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
        <OpenWithIcon />
        <h3>Detalhes</h3>
      </div>
      <Grid container spacing={3}>
        <Grid item xs={4}>
          <TextField
            variant="outlined"
            label="Nome do produto *"
            fullWidth
            value={produtoContext.useValues.values.nome}
            name="nome"
            onChange={handleOnChange}
            onBlur={produtoContext.formik.handleBlur}
            error={produtoContext.formik.touched.nome && Boolean(produtoContext.formik.errors.nome)}
            helperText={produtoContext.formik.touched.nome && produtoContext.formik.errors.nome}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            variant="outlined"
            label="Código interno *"
            fullWidth
            value={produtoContext.useValues.values.codigoInterno}
            name="codigoInterno"
            onChange={handleOnChange}
            onBlur={produtoContext.formik.handleBlur}
            error={produtoContext.formik.touched.codigoInterno && Boolean(produtoContext.formik.errors.codigoInterno)}
            helperText={produtoContext.formik.touched.codigoInterno && produtoContext.formik.errors.codigoInterno}
          />
        </Grid>
        <Grid item xs={4}>
          <FormControl variant="outlined" fullWidth name="grupo_produto_id">
            <InputLabel>Grupo de Produtos *</InputLabel>
            <Select
              className={"input-select"}
              label="Grupo de Produtos *"
              name="grupo_produto_id"
              value={produtoContext.useValues.values.grupo_produto_id}
              onChange={handleOnChange}
              onBlur={produtoContext.formik.handleBlur}
              error={produtoContext.formik.touched.grupo_produto_id && Boolean(produtoContext.formik.errors.grupo_produto_id)}
            >
              <MenuItem value={null}> Nenhum</MenuItem>
              {grupoProdutos &&
                grupoProdutos.map((grupo) => {
                  return <MenuItem value={grupo.id} key={grupo.id}>{grupo.nome}</MenuItem>
                })}
            </Select>
            {produtoContext.formik.touched.grupo_produto_id && Boolean(produtoContext.formik.errors.grupo_produto_id)
              ? <FormHelperText>{produtoContext.formik.errors.grupo_produto_id}</FormHelperText>
              : ''
            }
          </FormControl>
        </Grid>
        <Grid item xs={4}>
          <FormControl variant="outlined" fullWidth name="movimentaEstoque">
            <InputLabel>Movimenta Estoque? *</InputLabel>
            <Select
              className={"input-select"}
              label="Movimenta Estoque? *"
              name="movimentaEstoque"
              value={produtoContext.useValues.values.movimentaEstoque}
              onChange={handleOnChange}
              onBlur={produtoContext.formik.handleBlur}
              error={produtoContext.formik.touched.movimentaEstoque && Boolean(produtoContext.formik.errors.movimentaEstoque)}
            >
              <MenuItem value={false}>Não</MenuItem>
              <MenuItem value={true}>Sim</MenuItem>
            </Select>
            {produtoContext.formik.touched.movimentaEstoque && Boolean(produtoContext.formik.errors.movimentaEstoque)
              ? <FormHelperText>{produtoContext.formik.errors.movimentaEstoque}</FormHelperText>
              : ''
            }
          </FormControl>
        </Grid>
        <Grid item xs={4}>
          <FormControl variant="outlined" fullWidth name="habilitaNotaFiscal">
            <InputLabel>Habilitar Nota Fiscal?</InputLabel>
            <Select
              className={"input-select"}
              label="Habilitar Nota Fiscal?"
              name="habilitaNotaFiscal"
              value={produtoContext.useValues.values.habilitaNotaFiscal}
              onChange={handleOnChange}
              onBlur={produtoContext.formik.handleBlur}
              error={produtoContext.formik.touched.habilitaNotaFiscal && Boolean(produtoContext.formik.errors.habilitaNotaFiscal)}
            >
              <MenuItem value={false}>Não</MenuItem>
              <MenuItem value={true}>Sim</MenuItem>
            </Select>
            {produtoContext.formik.touched.habilitaNotaFiscal && Boolean(produtoContext.formik.errors.habilitaNotaFiscal)
              ? <FormHelperText>{produtoContext.formik.errors.habilitaNotaFiscal}</FormHelperText>
              : ''
            }
          </FormControl>
        </Grid>
        <Grid item xs={4}>
        <TextField
            variant="outlined"
            label="Código de Barras"
            fullWidth
            value={produtoContext.useValues.values.codigoBarras}
            name="codigoBarras"
            onChange={handleOnChange}
            onBlur={produtoContext.formik.handleBlur}
            error={produtoContext.formik.touched.codigoBarras && Boolean(produtoContext.formik.errors.codigoBarras)}
            helperText={produtoContext.formik.touched.codigoBarras && produtoContext.formik.errors.codigoBarras}
          />
        </Grid>
      </Grid>
    </>
  );
}
