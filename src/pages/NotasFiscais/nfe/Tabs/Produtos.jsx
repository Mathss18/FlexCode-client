import { useEffect, useRef, useState } from "react";
import {
  Grid,
  TextField,
  Button,
  InputAdornment,
  Tooltip,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import AssignmentIcon from "@material-ui/icons/Assignment";
import { Autocomplete } from "@mui/material";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { DataGrid } from "@mui/x-data-grid";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  deleteFromArrayByIndex,
  isArrayEqual,
  objectToArray,
} from "../../../../utils/functions";
import CalculateIcon from "@mui/icons-material/Calculate";
import ModalTabelaPreco from "../../../Financeiro/modalTabelaPreco/ModalTabelaPreco";
import { useFullScreenLoader } from "../../../../context/FullScreenLoaderContext";
import api from "../../../../services/api";
import { errorAlert } from "../../../../utils/alert";
import { useProdutoContext } from "../../../../context/GerenciarProdutosContext";

export default function Produtos() {
  const produtoContext = useProdutoContext();
  const [produtos, setProdutos] = useState([]);
  const [rowsProdutos, setRowsProdutos] = useState([]);
  const [isBtnDisabled, setIsBtnDisabled] = useState(false);
  const fullScreenLoader = useFullScreenLoader();
  // === Tabela de Preço
  const [openModalTabelaPreco, setOpenModalTabelaPreco] = useState(false);
  const produtosOriginal = useRef(null);
  const produto = useRef(null);

  const columnsProdutos = [
    {
      field: "produto_id",
      headerName: "Produto",
      flex: 2,
      sortable: false,
      headerAlign: "letf",
      renderCell: (params) => (
        <>
          <Autocomplete
            fullWidth
            disableClearable={true}
            name="produto_id"
            onChange={(event, value) => handleClienteChange(params, value)}
            isOptionEqualToValue={(option, value) =>
              option.value === value.value
            }
            options={produtos}
            renderInput={(params) => (
              <TextField
                variant="outlined"
                fullWidth
                {...params}
                placeholder="Pesquise..."
                style={{
                  backgroundColor: "transparent",
                  paddingTop: 8,
                  paddingBottom: 8,
                }}
              />
            )}
          />
        </>
      ),
    },
    {
      field: "cfop",
      headerName: "CFOP",
      type: "number",
      editable: true,
      sortable: false,
      headerAlign: "letf",
      flex: 1,
    },
    {
      field: "quantidade",
      headerName: "Quantidade",
      type: "number",
      editable: true,
      sortable: false,
      headerAlign: "letf",
      flex: 1,
    },
    {
      field: "preco",
      headerName: "Preço Unitário",
      type: "number",
      editable: true,
      sortable: false,
      headerAlign: "letf",
      flex: 1,
    },
    {
      field: "total",
      headerName: "Total",
      type: "number",
      editable: false,
      sortable: false,
      headerAlign: "letf",
      flex: 1,
    },
    {
      field: "excluir",
      headerName: "Excluir",
      sortable: false,
      headerAlign: "letf",
      // flex: 1,
      renderCell: (params) => (
        <>
          <DeleteIcon
            className={"btn btn-lista"}
            onClick={() => removeProductRow(params)}
          />
          <Tooltip title="Ver tabela de preços">
            <CalculateIcon
              className={"btn btn-lista"}
              onClick={() => openTabelaDePrecosModal(params)}
            />
          </Tooltip>
        </>
      ),
    },
  ];

  useEffect(() => {
    fullScreenLoader.setLoading(true);
    api
      .get("/produtos")
      .then((response) => {
        var array = [];
        response.data["data"].forEach((produto) => {
          produtosOriginal.current = response.data["data"];

          array.push({
            label: produto.nome,
            value: produto.id,
            preco: produto.custoFinal,
          });
        });
        setProdutos(array);
      })
      .catch((error) => {})
      .finally(() => {
        fullScreenLoader.setLoading(false);
      });
  }, []);

  useEffect(() => {
    calcularDeProdutos();
  }, [rowsProdutos]);

  function handleOnSubmit(values) {
    if (rowsProdutos.length === 0) {
      produtoContext.formik.setSubmitting(false);
      errorAlert("É necessário adicionar pelo menos um produto!");
      return;
    }

    if (rowsProdutos.find((produto) => produto.produto_id === "")) {
      produtoContext.formik.setSubmitting(false);
      errorAlert(
        "Por favor, selecione um produto para cada linha de produtos!"
      );
      return;
    }
    if (rowsProdutos.find((produto) => produto.quantidade <= 0)) {
      produtoContext.formik.setSubmitting(false);
      errorAlert(
        "Por favor, selecione uma quantidade válida para cada linha de produtos!"
      );
      return;
    }
    if (rowsProdutos.find((produto) => produto.preco < 0)) {
      produtoContext.formik.setSubmitting(false);
      errorAlert(
        "Por favor, selecione uma preço válido para cada linha de produtos!"
      );
      return;
    }

    const params = {
      ...produtoContext.formik.values,
      produtos: rowsProdutos,
    };
  }

  function handleOnChange(name, value) {
    produtoContext.formik.setFieldValue(name, value); // Altera o formik
    console.log(produtoContext.formik.values);
  }

  // ==== Funções de produtos ====
  function addProductRow() {
    setRowsProdutos([
      ...rowsProdutos,
      {
        id: new Date().getTime(),
        produto_id: "",
        quantidade: 0,
        preco: 0,
        total: 0,
      },
    ]);
  }

  function removeProductRow(params) {
    var indexToBeDeleted = rowsProdutos.map((row, index) => {
      if (row.id === params.id) return index;
    });
    indexToBeDeleted = indexToBeDeleted.filter((row) => row !== undefined);
    setRowsProdutos(deleteFromArrayByIndex(rowsProdutos, ...indexToBeDeleted));
  }

  function openTabelaDePrecosModal(params) {
    const prod_id = params?.row?.produto_id;
    produto.current = produtosOriginal.current.find(
      (item) => item.id === prod_id
    );
    if (produto.current) setOpenModalTabelaPreco(true);
  }

  function handleProductRowStateChange(dataGrid) {
    if (isArrayEqual(objectToArray(dataGrid.rows.idRowsLookup), rowsProdutos))
      return;
    if (objectToArray(dataGrid.rows.idRowsLookup).length != rowsProdutos.length)
      return;

    objectToArray(dataGrid.rows.idRowsLookup).forEach((row, index) => {
      const selectedProduto = produtos.find(
        (produto) => produto.value === row.produto_id
      );
      if (selectedProduto) {
        if (objectToArray(dataGrid.rows.idRowsLookup)[index].preco <= 0) {
          objectToArray(dataGrid.rows.idRowsLookup)[index].preco =
            selectedProduto.preco;
        } else {
          console.log("Preço original mudado");
        }

        objectToArray(dataGrid.rows.idRowsLookup)[index].total = (
          objectToArray(dataGrid.rows.idRowsLookup)[index].preco *
          Number(row.quantidade)
        ).toFixed(2);
      }
    });
    setRowsProdutos(objectToArray(dataGrid.rows.idRowsLookup));
  }

  function handleClienteChange(params, value) {
    params.row.produto_id = value.value;
  }

  function calcularDeProdutos() {
    var total = 0;
    rowsProdutos.forEach((row) => {
      total = total + Number(row.total);
    });

    produtoContext.formik.setFieldValue("total", total);
  }

  return (
    <>
      <ModalTabelaPreco
        open={openModalTabelaPreco}
        setOpen={setOpenModalTabelaPreco}
        produto={produto.current}
      />
      <form onSubmit={produtoContext.formik.handleSubmit}>
        <div
          style={{
            marginTop: 38,
            boxShadow:
              "0px 2px 4px -1px rgb(0 0 0 / 20%), 0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%)",
            padding: 24,
          }}
        >
          <div
            style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}
          >
            <AssignmentIcon />
            <h3>Adicionar Produtos</h3>
            <Button
              style={{ marginLeft: "auto", height: 28, fontSize: 12 }}
              className={"btn btn-primary"}
              startIcon={<AddIcon />}
              onClick={addProductRow}
              disabled={isBtnDisabled}
            >
              Produto
            </Button>
          </div>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <div
                style={{
                  height: 100 + rowsProdutos.length * 55,
                  width: "100%",
                  color: "#fff",
                }}
              >
                <DataGrid
                  className={"table-data-grid"}
                  rows={rowsProdutos}
                  columns={columnsProdutos}
                  hideFooter={true}
                  disableColumnMenu={true}
                  onStateChange={handleProductRowStateChange}
                  components={{
                    NoRowsOverlay: () => (
                      <div style={{ marginTop: 55, textAlign: "center" }}>
                        <h3>Nenhum produto adicionado</h3>
                      </div>
                    ),
                  }}
                  onCellEditStart={() => {
                    setIsBtnDisabled(true);
                  }}
                  onCellEditStop={() => {
                    setIsBtnDisabled(false);
                  }}
                />
              </div>
            </Grid>
          </Grid>
        </div>

        <div
          style={{
            marginTop: 38,
            boxShadow:
              "0px 2px 4px -1px rgb(0 0 0 / 20%), 0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%)",
            padding: 24,
          }}
        >
          <div
            style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}
          >
            <AssignmentIcon />
            <h3>Total de Produtos</h3>
          </div>

          <Grid container spacing={3}>
            <Grid item xs={3}>
              <TextField
                variant="outlined"
                label="Total Produtos"
                fullWidth
                type="number"
                InputProps={{
                  readOnly: true,
                  startAdornment: (
                    <InputAdornment position="start">R$:</InputAdornment>
                  ),
                }}
                value={produtoContext.formik.values.total}
                name="total"
                onChange={produtoContext.formik.handleChange}
                onBlur={produtoContext.formik.handleBlur}
                error={
                  produtoContext.formik.touched.total &&
                  Boolean(produtoContext.formik.errors.total)
                }
                helperText={
                  produtoContext.formik.touched.total &&
                  produtoContext.formik.errors.total
                }
              />
            </Grid>
          </Grid>
        </div>
      </form>
    </>
  );
}
