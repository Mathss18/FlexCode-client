import { useEffect, useRef, useState } from "react";
import {
  Grid,
  TextField,
  Button,
  InputAdornment,
  Tooltip,
  FormControlLabel,
  Switch,
} from "@material-ui/core";
import AssignmentIcon from "@material-ui/icons/Assignment";
import { Autocomplete } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  deleteFromArrayByIndex,
  isArrayEqual,
  objectToArray,
} from "../../../../utils/functions";
import CalculateIcon from "@mui/icons-material/Calculate";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ModalTabelaPreco from "../../../Financeiro/modalTabelaPreco/ModalTabelaPreco";
import { useFullScreenLoader } from "../../../../context/FullScreenLoaderContext";
import api from "../../../../services/api";
import { errorAlert } from "../../../../utils/alert";
import { useNotaFiscalContext } from "../../../../context/NotaFiscalContext";
import { brPrice } from "../../../../constants/datagridCurrencyFormatter";

export default function Produtos() {
  const notaFiscalContext = useNotaFiscalContext();
  const [produtos, setProdutos] = useState([]);
  const [rowsProdutos, setRowsProdutos] = useState(
    notaFiscalContext.formik.values.produtos
  );
  const [isBtnDisabled, setIsBtnDisabled] = useState(false);
  const fullScreenLoader = useFullScreenLoader();
  const empresaConfig = JSON.parse(localStorage.getItem("config"));
  // === Tabela de Preço
  const [openModalTabelaPreco, setOpenModalTabelaPreco] = useState(false);
  const produtosOriginal = useRef(null);
  const produto = useRef(null);

  const [totalManual, setTotalManual] = useState(false);

  function interceptKeys(event) {
    event = event || window.event; // IE support
    var ctrlDown = event.ctrlKey || event.metaKey; // Mac support

    // Se for ctrl + enter, retorna true
    if (ctrlDown && event.keyCode === 13) return true;
    // Otherwise allow
    return false;
  }

  function CustomInput(params) {
    return (
      <TextField
        variant="outlined"
        fullWidth
        {...params}
        onKeyUp={(event) => {
          if (interceptKeys(event)) {
            var newProduto = rowsProdutos.find((item) => item.id == params.id);
            if (newProduto) {
              setProdutos([
                ...produtos,
                {
                  value: newProduto.produto_id,
                  label: event.target.value,
                  preco: newProduto.preco,
                  cfop: newProduto.cfop,
                },
              ]);
            }
          }
        }}
        placeholder="Pesquise..."
        style={{
          backgroundColor: "transparent",
          paddingTop: 8,
          paddingBottom: 8,
        }}
      />
    );
  }

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
            onKeyUp={(e) => {
              console.log(params);
              params.row.nome = e.target.value;
            }}
            value={
              params.row.produto_id == ""
                ? undefined
                : { label: params.row.nome, value: params.row.produto_id }
            }
            name="produto_id"
            id={params.id}
            onChange={(event, value) => handleProdutoChange(params, value)}
            isOptionEqualToValue={(option, value) =>
              option.value === value.value
            }
            options={produtos}
            renderInput={(params) => CustomInput(params)}
          />
        </>
      ),
    },
    {
      field: "cfop",
      headerName: "CFOP",
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
      ...brPrice,
    },
    {
      field: "total",
      headerName: "Total",
      type: "number",
      editable: true,
      sortable: false,
      headerAlign: "letf",
      flex: 1,
      ...brPrice,
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
      .get("/produtos-mini")
      .then((response) => {
        var array = [];
        response.data["data"].forEach((produto) => {
          produtosOriginal.current = response.data["data"];

          array.push({
            label: produto.codigoInterno + " / " + produto.nome,
            value: produto.id,
            preco: produto.custoFinal,
            cfop: produto.cfop,
          });
        });
        setProdutos(array);
      })
      .catch((error) => {})
      .finally(() => {
        fullScreenLoader.setLoading(false);
      });
  }, []);

  useEffect(
    () => console.log(notaFiscalContext.formik.values),
    [notaFiscalContext.formik.values]
  );

  useEffect(() => {
    calcularTotalDeProdutos();
    notaFiscalContext.formik.setFieldValue("produtos", rowsProdutos);
  }, [rowsProdutos]);

  function handleOnSubmit(values) {
    if (rowsProdutos.length === 0) {
      notaFiscalContext.formik.setSubmitting(false);
      errorAlert("É necessário adicionar pelo menos um produto!");
      return;
    }

    if (rowsProdutos.find((produto) => produto.produto_id === "")) {
      notaFiscalContext.formik.setSubmitting(false);
      errorAlert(
        "Por favor, selecione um produto para cada linha de produtos!"
      );
      return;
    }
    if (rowsProdutos.find((produto) => produto.quantidade <= 0)) {
      notaFiscalContext.formik.setSubmitting(false);
      errorAlert(
        "Por favor, selecione uma quantidade válida para cada linha de produtos!"
      );
      return;
    }
    if (rowsProdutos.find((produto) => produto.preco < 0)) {
      notaFiscalContext.formik.setSubmitting(false);
      errorAlert(
        "Por favor, selecione uma preço válido para cada linha de produtos!"
      );
      return;
    }

    const params = {
      ...notaFiscalContext.formik.values,
      produtos: rowsProdutos,
    };
  }

  function handleOnChange(name, value) {
    notaFiscalContext.formik.setFieldValue(name, value); // Altera o formik
    console.log(notaFiscalContext.formik.values);
  }

  // ==== Funções de produtos ====
  function addProductRow() {
    setRowsProdutos([
      ...rowsProdutos,
      {
        id: new Date().getTime(),
        produto_id: "",
        nome: "",
        cfop: "",
        quantidade: 0,
        preco: 0,
        total: 0,
      },
    ]);
    console.log(rowsProdutos);
  }
  
  function duplicateProducts() {
    setRowsProdutos([
      ...rowsProdutos,
      ...rowsProdutos
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

        if (!totalManual) {
          objectToArray(dataGrid.rows.idRowsLookup)[index].total = (
            objectToArray(dataGrid.rows.idRowsLookup)[index].preco *
            Number(row.quantidade)
          ).toFixed(empresaConfig.quantidadeCasasDecimaisValor);
        }
      }
    });
    setRowsProdutos(objectToArray(dataGrid.rows.idRowsLookup));
  }

  function handleProdutoChange(params, value) {
    params.row.produto_id = value.value;
    params.row.nome = value.label;
    params.row.cfop = value.cfop;
  }

  function calcularTotalDeProdutos() {
    var total = 0;
    rowsProdutos.forEach((row) => {
      total = total + Number(row.total);
    });

    notaFiscalContext.formik.setFieldValue("totalProdutos", total);
  }

  return (
    <>
      <ModalTabelaPreco
        open={openModalTabelaPreco}
        setOpen={setOpenModalTabelaPreco}
        produto={produto.current}
      />
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
          <div style={{ marginLeft: "auto" }}>
            <FormControlLabel
              control={
                <Switch
                  checked={totalManual}
                  onChange={() => setTotalManual(!totalManual)}
                  name="totalManual"
                  type="checkbox"
                />
              }
              labelPlacement="right"
              label="Ajutar totais manualmente?"
            />
            <Button
              style={{ marginLeft: "auto", height: 28, fontSize: 12 }}
              className={"btn btn-primary"}
              startIcon={<ContentCopyIcon />}
              onClick={duplicateProducts}
              disabled={isBtnDisabled}
            >
              Duplicar
            </Button>
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
                disableVirtualization
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

      <p>Dica: para alterar o nome de um produto utilize: CRTL + Enter</p>

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
              value={notaFiscalContext.formik.values.totalProdutos}
              name="totalProdutos"
              onChange={notaFiscalContext.formik.handleChange}
              onBlur={notaFiscalContext.formik.handleBlur}
              error={
                notaFiscalContext.formik.touched.totalProdutos &&
                Boolean(notaFiscalContext.formik.errors.totalProdutos)
              }
              helperText={
                notaFiscalContext.formik.touched.totalProdutos &&
                notaFiscalContext.formik.errors.totalProdutos
              }
            />
          </Grid>
        </Grid>
      </div>
    </>
  );
}
