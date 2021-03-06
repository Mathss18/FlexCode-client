import { useProdutoContext } from "../../../../context/GerenciarProdutosContext";
import { Button, Checkbox, Grid, TextField } from "@material-ui/core";
import OpenWithIcon from "@mui/icons-material/OpenWith";
import api from "../../../../services/api";
import { useEffect, useState } from "react";
import { Autocomplete } from "@mui/material";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { infoAlert, successAlert } from "../../../../utils/alert";
import { useHistory } from "react-router-dom";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export function Fornecedores() {
  const history = useHistory();
  const produtoContext = useProdutoContext();
  const [clientes, setClientes] = useState([]);
  const [fornecedores, setFornecedores] = useState([{}]);

  function handleCadastrarProduto() {
    console.log(produtoContext.formik.values);

    api
      .post("/produtos", produtoContext.formik.values)
      .then((response) => {
        successAlert("Sucesso", "Produto cadastrado com sucesso!", () => {
          history.push("/produtos");
        });
      })
      .catch((error) => {
        infoAlert("Atenção", error.response.data.message);
      })
      .finally(() => produtoContext.formik.setSubmitting(false));
  }

  // Calcula o custoFinal
  useEffect(() => {
    var soma = (
      parseFloat(...[produtoContext.useValues.values.valorCusto]) +
      parseFloat(...[produtoContext.useValues.values.despesasAdicionais]) +
      parseFloat(...[produtoContext.useValues.values.outrasDespesas])
    ).toFixed(4);

    produtoContext.useValues.setValues({
      ...produtoContext.formik.values,
      custoFinal: soma,
    }); // Altera o State
    produtoContext.formik.setFieldValue("custoFinal", soma); // Altera o formik
  }, []);

  useEffect(() => {
    api
      .get("/clientes")
      .then((response) => {
        var array = [];
        response.data["data"].forEach((cliente) => {
          array.push({ label: cliente.nome, value: cliente.id });
        });
        produtoContext.useValues.setValues({
          ...produtoContext.useValues.values,
          cliente_id: {},
        }); // Altera o State
        produtoContext.formik.setFieldValue("cliente_id", {}); // Altera o formik
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
          array.push({ label: fornecedor.nome, value: fornecedor.id });
        });
        produtoContext.useValues.setValues({
          ...produtoContext.useValues.values,
          fornecedores_id: [],
        }); // Altera o State
        produtoContext.formik.setFieldValue("fornecedores_id", []); // Altera o formik
        setFornecedores(array);
      })
      .catch((error) => {});
  }, []);

  function handleOnChange(name, value) {
    produtoContext.useValues.setValues({
      ...produtoContext.useValues.values,
      [name]: value,
    }); // Altera o State
    produtoContext.formik.setFieldValue(name, value); // Altera o formik
    console.log(produtoContext.useValues.values);
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
            value={produtoContext.useValues.values.cliente_id}
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
            value={produtoContext.useValues.values.fornecedores_id}
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
