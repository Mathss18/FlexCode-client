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

export function Dados() {
  const produtoContext = useProdutoContext();
  const [grupoProdutos, setGrupoProdutos] = useState([]);

  function handleOnChange(event) {
    const { name, value } = event.target;
    produtoContext.useValues.setValues({ ...produtoContext.useValues.values, [name]: value });
    produtoContext.formik.setFieldValue(name, value);
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
            label="Nome do produto"
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
            label="Código interno"
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
            <InputLabel>Grupo de Produtos</InputLabel>
            <Select
              className={"input-select"}
              label="Grupo de Produtos"
              name="grupo_produto_id"
              value={produtoContext.useValues.values.grupo_produto_id}
              onChange={handleOnChange}
              onBlur={produtoContext.formik.handleBlur}
              error={produtoContext.formik.touched.grupo_produto_id && Boolean(produtoContext.formik.errors.grupo_produto_id)}
            >
              <MenuItem value={-1}> Nenhum</MenuItem>
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
            <InputLabel>Movimenta Estoque?</InputLabel>
            <Select
              className={"input-select"}
              label="Movimenta Estoque?"
              name="movimentaEstoque"
              value={produtoContext.useValues.values.movimentaEstoque}
              onChange={handleOnChange}
              onBlur={produtoContext.formik.handleBlur}
              error={produtoContext.formik.touched.grupo_produto_id && Boolean(produtoContext.formik.errors.grupo_produto_id)}
            >
              <MenuItem value={false}>Não</MenuItem>
              <MenuItem value={true}>Sim</MenuItem>
            </Select>
            {produtoContext.formik.touched.grupo_produto_id && Boolean(produtoContext.formik.errors.grupo_produto_id)
              ? <FormHelperText>{produtoContext.formik.errors.grupo_produto_id}</FormHelperText>
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
              error={produtoContext.formik.touched.grupo_produto_id && Boolean(produtoContext.formik.errors.grupo_produto_id)}
            >
              <MenuItem value={false}>Não</MenuItem>
              <MenuItem value={true}>Sim</MenuItem>
            </Select>
            {produtoContext.formik.touched.grupo_produto_id && Boolean(produtoContext.formik.errors.grupo_produto_id)
              ? <FormHelperText>{produtoContext.formik.errors.grupo_produto_id}</FormHelperText>
              : ''
            }
          </FormControl>
        </Grid>
        <Grid item xs={4}>
          <FormControl variant="outlined" fullWidth name="possuiVariacoes">
            <InputLabel>Possui Variações?</InputLabel>
            <Select
              className={"input-select"}
              label="Possui Variações?"
              name="possuiVariacoes"
              value={produtoContext.useValues.values.possuiVariacoes}
              onChange={handleOnChange}
              onBlur={produtoContext.formik.handleBlur}
              error={produtoContext.formik.touched.grupo_produto_id && Boolean(produtoContext.formik.errors.grupo_produto_id)}
            >
              <MenuItem value={false}>Não</MenuItem>
              <MenuItem value={true}>Sim</MenuItem>
            </Select>
            {produtoContext.formik.touched.grupo_produto_id && Boolean(produtoContext.formik.errors.grupo_produto_id)
              ? <FormHelperText>{produtoContext.formik.errors.grupo_produto_id}</FormHelperText>
              : ''
            }
          </FormControl>
        </Grid>
      </Grid>
    </>
  );
}
