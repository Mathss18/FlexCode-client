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
import { errorAlert } from "../../../../utils/alert";
import { initialValues } from "../../../../constants/produtosInitialValues";
import { useFullScreenLoader } from "../../../../context/FullScreenLoaderContext";

export function Dados() {
  const produtoContext = useProdutoContext();
  const [grupoProdutos, setGrupoProdutos] = useState([]);
  const fullScreenLoader = useFullScreenLoader();
  const { id } = useParams();

  function handleOnChange(event) {
    const { name, value } = event.target;
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
          : [];

        produtoContext.formik.setValues(response.data['data']);

        const valuesToFillFormik = {
          nome: response.data['data'].nome,
          codigoInterno: response.data['data'].codigoInterno,
          grupo_produto_id: response.data['data'].grupo_produto_id,
          unidade_produto_id: response.data['data'].unidade_produto_id,
          movimentaEstoque: response.data['data'].movimentaEstoque,
          habilitaNotaFiscal: response.data['data'].habilitaNotaFiscal,
          codigoBarras: response.data['data'].codigoBarras,
          peso: response.data['data'].peso,
          largura: response.data['data'].largura,
          altura: response.data['data'].altura,
          comprimento: response.data['data'].comprimento,
          comissao: response.data['data'].comissao,
          descricao: response.data['data'].descricao,
          valorCusto: response.data['data'].valorCusto,
          despesasAdicionais: response.data['data'].despesasAdicionais,
          outrasDespesas: response.data['data'].outrasDespesas,
          custoFinal: response.data['data'].custoFinal,
          estoqueMinimo: response.data['data'].estoqueMinimo,
          estoqueMaximo: response.data['data'].estoqueMaximo,
          quantidadeAtual: response.data['data'].quantidadeAtual,
          foto_produto: response.data['data'].foto_produto,
          fotoPrincipal: response.data['data'].fotoPrincipal,
          ncm: response.data['data'].ncm,
          cest: response.data['data'].cest,
          origem: response.data['data'].origem,
          pesoLiquido: response.data['data'].pesoLiquido,
          pesoBruto: response.data['data'].pesoBruto,
          numeroFci: response.data['data'].numeroFci,
          valorAproxTribut: response.data['data'].valorAproxTribut,
          valorPixoPis: response.data['data'].valorPixoPis,
          valorFixoPisSt: response.data['data'].valorFixoPisSt,
          valorFixoCofins: response.data['data'].valorFixoCofins,
          valorFixoCofinsSt: response.data['data'].valorFixoCofinsSt,
          porcentagem_lucro_produto: response.data['data'].porcentagem_lucro_produto,
          fornecedores_id: response.data['data'].fornecedores_id,
          cliente_id: response.data['data'].cliente_id,
        }

        produtoContext.formik.setValues(valuesToFillFormik);

        console.log(response.data['data']);
      })
      .catch((error) => {
        errorAlert("Atenção", error?.response?.data?.message);
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
            label="Nome do produto *"
            fullWidth
            value={produtoContext.formik.values.nome}
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
            value={produtoContext.formik.values.codigoInterno}
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
              value={produtoContext.formik.values.grupo_produto_id}
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
              value={produtoContext.formik.values.movimentaEstoque}
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
              value={produtoContext.formik.values.habilitaNotaFiscal}
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
            value={produtoContext.formik.values.codigoBarras}
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
