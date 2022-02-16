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
import { infoAlert } from "../../../../utils/alert";
import { initialValues } from "../../../../constants/produtosInitialValues";
import { useFullScreenLoader } from "../../../../context/FullScreenLoaderContext";

export function Dados() {
  const produtoContext = useProdutoContext();
  const [grupoProdutos, setGrupoProdutos] = useState([]);
  const fullScreenLoader = useFullScreenLoader();
  const { id } = useParams();

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

  // Tras os dados do produto 
  useEffect(() => {
    console.log(fullScreenLoader);
    fullScreenLoader.setLoading(true);
    api
      .get("/produtos/" + id)
      .then((response) => {

        response.data['data'].habilitaNotaFiscal = response.data['data'].habilitaNotaFiscal === 1 ? true : false;
        response.data['data'].movimentaEstoque = response.data['data'].movimentaEstoque === 1 ? true : false;

        response.data['data'].cliente_id = response.data['data'].cliente_id ? { value: response.data['data'].cliente.id, label: response.data['data'].cliente.nome } : initialValues.cliente_id
        response.data['data'].fornecedores_id = response.data['data'].fornecedores
          ? response.data['data'].fornecedores.map((item) => {
            return { value: item.id, label: item.nome };
          })
          : [{ label: '', value: '' }];

        produtoContext.useValues.setValues(response.data['data']);

        produtoContext.formik.setFieldValue("nome", response.data['data'].nome);
        produtoContext.formik.setFieldValue("codigoInterno", response.data['data'].codigoInterno);
        produtoContext.formik.setFieldValue("grupo_produto_id", response.data['data'].grupo_produto_id);
        produtoContext.formik.setFieldValue("unidade_produto_id", response.data['data'].unidade_produto_id);
        produtoContext.formik.setFieldValue("movimentaEstoque", response.data['data'].movimentaEstoque);
        produtoContext.formik.setFieldValue("habilitaNotaFiscal", response.data['data'].habilitaNotaFiscal);
        produtoContext.formik.setFieldValue("codigoBarras", response.data['data'].codigoBarras);
        produtoContext.formik.setFieldValue("peso", response.data['data'].peso);
        produtoContext.formik.setFieldValue("largura", response.data['data'].largura);
        produtoContext.formik.setFieldValue("altura", response.data['data'].altura);
        produtoContext.formik.setFieldValue("comprimento", response.data['data'].comprimento);
        produtoContext.formik.setFieldValue("comissao", response.data['data'].comissao);
        produtoContext.formik.setFieldValue("descricao", response.data['data'].descricao);
        produtoContext.formik.setFieldValue("valorCusto", response.data['data'].valorCusto);
        produtoContext.formik.setFieldValue("despesasAdicionais", response.data['data'].despesasAdicionais);
        produtoContext.formik.setFieldValue("outrasDespesas", response.data['data'].outrasDespesas);
        produtoContext.formik.setFieldValue("custoFinal", response.data['data'].custoFinal);
        produtoContext.formik.setFieldValue("estoqueMinimo", response.data['data'].estoqueMinimo);
        produtoContext.formik.setFieldValue("estoqueMaximo", response.data['data'].estoqueMaximo);
        produtoContext.formik.setFieldValue("quantidadeAtual", response.data['data'].quantidadeAtual);
        produtoContext.formik.setFieldValue("foto_produto", response.data['data'].foto_produto);
        produtoContext.formik.setFieldValue("fotoPrincipal", response.data['data'].fotoPrincipal);
        produtoContext.formik.setFieldValue("ncm", response.data['data'].ncm);
        produtoContext.formik.setFieldValue("cest", response.data['data'].cest);
        produtoContext.formik.setFieldValue("origem", response.data['data'].origem);
        produtoContext.formik.setFieldValue("pesoLiquido", response.data['data'].pesoLiquido);
        produtoContext.formik.setFieldValue("pesoBruto", response.data['data'].pesoBruto);
        produtoContext.formik.setFieldValue("numeroFci", response.data['data'].numeroFci);
        produtoContext.formik.setFieldValue("valorAproxTribut", response.data['data'].valorAproxTribut);
        produtoContext.formik.setFieldValue("valorPixoPis", response.data['data'].valorPixoPis);
        produtoContext.formik.setFieldValue("valorFixoPisSt", response.data['data'].valorFixoPisSt);
        produtoContext.formik.setFieldValue("valorFixoCofins", response.data['data'].valorFixoCofins);
        produtoContext.formik.setFieldValue("valorFixoCofinsSt", response.data['data'].valorFixoCofinsSt);
        produtoContext.formik.setFieldValue("porcentagem_lucro_produto", response.data['data'].porcentagem_lucro_produto);
        produtoContext.formik.setFieldValue("fornecedores_id", response.data['data'].fornecedores);
        produtoContext.formik.setFieldValue("cliente_id", response.data['data'].cliente_id);
        produtoContext.formik.setFieldValue("fornecedores_id", response.data['data'].fornecedores_id);

        console.log(response.data['data']);
      })
      .catch((error) => {
        infoAlert("Atenção", error.response.data.message);
      })
      .finally(() => {
        fullScreenLoader.setLoading(false);
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
