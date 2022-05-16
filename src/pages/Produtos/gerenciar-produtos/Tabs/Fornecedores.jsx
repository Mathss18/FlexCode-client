import { useProdutoContext } from "../../../../context/GerenciarProdutosContext";
import { Button, Checkbox, Grid, TextField } from "@material-ui/core";
import OpenWithIcon from "@mui/icons-material/OpenWith";
import api from "../../../../services/api";
import { useEffect, useState } from "react";
import { Autocomplete } from "@mui/material";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { errorAlert, infoAlert, successAlert } from "../../../../utils/alert";
import { useHistory } from "react-router-dom";
import { objectToArray } from "../../../../utils/functions";
import toast from "react-hot-toast";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export function Fornecedores() {
  const history = useHistory();
  const produtoContext = useProdutoContext();
  const [clientes, setClientes] = useState([]);
  const [fornecedores, setFornecedores] = useState([]);

  function canSubmit() {
    var errorsMessages = "";
    produtoContext.formik.setSubmitting(true);
    objectToArray(produtoContext.formik.errors).forEach((item) => {
      errorsMessages += "• " + item + "<br>";
    });
    if (produtoContext.formik.values.movimentaEstoque) {
      if (
        produtoContext.formik.values.estoqueMaximo === "" ||
        produtoContext.formik.values.estoqueMinimo === ""
      ) {
        errorsMessages +=
          "• " +
          "Para movimentar o estoque, é necessário informar o estoque mínimo e máximo!" +
          "<br>";
        produtoContext.formik.setSubmitting(false);
      }
      if (
        produtoContext.formik.values.estoqueMinimo >
        produtoContext.formik.values.estoqueMaximo
      ) {
        errorsMessages +=
          "• " +
          "O estoque mínimo não pode ser maior que o estoque máximo!" +
          "<br>";
        produtoContext.formik.setSubmitting(false);
      }
      if (
        produtoContext.formik.values.estoqueMinimo ===
        produtoContext.formik.values.estoqueMaximo
      ) {
        errorsMessages +=
          "• " +
          "O estoque mínimo não pode ser igual ao estoque máximo!" +
          "<br>";
        produtoContext.formik.setSubmitting(false);
      }
      if (produtoContext.formik.values.unidade_produto_id === "") {
        errorsMessages +=
          "• " +
          "Para movimentar o estoque, é necessário informar a unidade do produto!" +
          "<br>";
        produtoContext.formik.setSubmitting(false);
      }
    }

    if (errorsMessages.length > 0) {
      console.log(errorsMessages);
      errorAlert("Atenção", errorsMessages);
      produtoContext.formik.setSubmitting(false);
      return false;
    }
    return true;
  }
  function handleCadastrarProduto() {
    if (!canSubmit()) return;
    api
      .post("/produtos", produtoContext.formik.values)
      .then((response) => {
        successAlert("Sucesso", "Produto cadastrado com sucesso!", () => {
          history.push("/produtos");
        });
      })
      .catch((error) => {
        errorAlert("Atenção", error?.response?.data?.message);
      })
      .finally(() => produtoContext.formik.setSubmitting(false));
  }

  // Calcula o custoFinal
  useEffect(() => {
    var soma = (
      parseFloat(...[produtoContext.formik.values.valorCusto]) +
      parseFloat(...[produtoContext.formik.values.despesasAdicionais]) +
      parseFloat(...[produtoContext.formik.values.outrasDespesas])
    ).toFixed(4);

    produtoContext.formik.setFieldValue("custoFinal", soma); // Altera o formik
  }, []);

  useEffect(() => {
    api
      .get("/clientes")
      .then((response) => {
        var array = [];
        response.data["data"].forEach((cliente) => {
          if (cliente.situacao === 1) {
            array.push({ label: cliente.nome, value: cliente.id });
          }
        });
        setClientes(array);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    api
      .get("/fornecedores")
      .then((response) => {
        var array = [];
        response.data["data"].forEach((fornecedor) => {
          if (fornecedor.situacao === 1) {
            array.push({ label: fornecedor.nome, value: fornecedor.id });
          }
        });
        setFornecedores(array);
      })
      .catch((error) => {});
  }, []);

  function handleOnChange(name, value) {
    produtoContext.formik.setFieldValue(name, value); // Altera o formik
  }

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
        <OpenWithIcon />
        <h3>Detalhes</h3>
      </div>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <Autocomplete
            value={produtoContext.formik.values.cliente_id}
            name="cliente_id"
            onChange={(event, value) => handleOnChange("cliente_id", value)}
            disablePortal
            options={clientes}
            renderInput={(params) => (
              <TextField
                variant="outlined"
                fullWidth
                {...params}
                label="Cliente"
                placeholder="Pesquise..."
              />
            )}
          />
        </Grid>
        <Grid item xs={6}>
          <Autocomplete
            multiple
            value={produtoContext.formik.values.fornecedores_id}
            name="fornecedores_id"
            onChange={(event, value) =>
              handleOnChange("fornecedores_id", value)
            }
            options={fornecedores}
            disableCloseOnSelect
            getOptionLabel={(option) => option.label}
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox
                  icon={icon}
                  checkedIcon={checkedIcon}
                  style={{ marginRight: 8 }}
                  checked={selected}
                />
                {option.label}
              </li>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Fornecedores"
                fullWidth
                variant="outlined"
                placeholder="Pesquise..."
              />
            )}
          />
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Button
            className="btn btn-primary"
            onClick={handleCadastrarProduto}
            disabled={produtoContext.formik.isSubmitting}
          >
            Cadastrar Produto
          </Button>
        </Grid>
      </Grid>
    </>
  );
}
