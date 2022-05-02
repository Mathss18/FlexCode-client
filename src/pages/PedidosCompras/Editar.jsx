import { useEffect, useRef, useState } from "react";
import {
  Grid,
  TextField,
  Select,
  Divider,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  Checkbox,
  InputAdornment,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import AssignmentIcon from "@material-ui/icons/Assignment";
import { useFormik } from "formik";
import { Autocomplete, Stack } from "@mui/material";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import api from "../../services/api";
import { DataGrid } from "@mui/x-data-grid";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import moment from "moment";
import {
  deleteFromArrayByIndex,
  getUniqueArrayOfObjectsByKey,
  isArrayEqual,
  objectToArray,
} from "../../utils/functions";
import { useFullScreenLoader } from "../../context/FullScreenLoaderContext";
import { errorAlert, infoAlert, successAlert } from "../../utils/alert";
import { useParams } from "react-router-dom";
import { orcamentoValidation } from "../../validators/validationSchema";

const initialValues = {
  numero: "",
  cliente_id: { label: "", value: null },
  transportadora_id: { label: "", value: null },
  produtos: [],
  servicos: [],
  situacao: 0,
  dataEntrada: moment().format("YYYY-MM-DD"),
  frete: 0,
  outros: 0,
  desconto: 0,
  total: 0,
  observacao: "",
  observacaoInterna: "",
};

function EditarOrdensServicoPage() {
  const history = useHistory();
  const [clientes, setClientes] = useState([]);
  const [transportadoras, setTransportadoras] = useState([{}]);
  const [produtos, setProdutos] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [rowsProdutos, setRowsProdutos] = useState([]);
  const [rowsServicos, setRowsServicos] = useState([]);
  const [isBtnDisabled, setIsBtnDisabled] = useState(false);
  const { id } = useParams();
  const fullScreenLoader = useFullScreenLoader();

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: (event) => {
      handleOnSubmit(event);
    },
    validationSchema: orcamentoValidation,
  });

  const columnsProdutos = [
    {
      field: "produto_id",
      headerName: "Produto",
      flex: 4,
      sortable: false,
      renderCell: (params) => (
        <>
          <Autocomplete
            fullWidth
            name="produto_id"
            disableClearable={true}
            value={
              params.row.produto_id == ""
                ? { label: "", value: null }
                : { label: params.row.nome, value: params.row.produto_id }
            }
            onChange={(event, value) => handleClienteChange(params, value)}
            isOptionEqualToValue={(option, value) =>
              option.value === value.value
            }
            disablePortal
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
      field: "quantidade",
      headerName: "Quantidade",
      editable: true,
      sortable: false,
      flex: 1,
    },
    {
      field: "preco",
      headerName: "Preço Unitário",
      editable: true,
      sortable: false,
      flex: 1,
    },
    {
      field: "total",
      headerName: "Total",
      editable: false,
      sortable: false,
      flex: 1,
    },
    {
      field: "observacao",
      headerName: "Observação",
      editable: true,
      sortable: false,
      flex: 2,
    },
    {
      field: "excluir",
      headerName: "Excluir",
      sortable: false,
      // flex: 1,
      renderCell: (params) => (
        <>
          <DeleteIcon
            className={"btn btn-lista"}
            onClick={() => removeProductRow(params)}
          />
        </>
      ),
    },
  ];

  const columnsServicos = [
    {
      field: "servico_id",
      headerName: "Serviço",
      flex: 4,
      sortable: false,
      renderCell: (params) => (
        <>
          <Autocomplete
            fullWidth
            name="servico_id"
            disableClearable={true}
            value={
              params.row.servico_id == ""
                ? { label: "", value: null }
                : { label: params.row.nome, value: params.row.servico_id }
            }
            onChange={(event, value) => handleServicoChange(params, value)}
            isOptionEqualToValue={(option, value) =>
              option.value === value.value
            }
            disablePortal
            options={servicos}
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
      field: "quantidade",
      headerName: "Quantidade",
      editable: true,
      sortable: false,
      flex: 1,
    },
    {
      field: "preco",
      headerName: "Preço Unitário",
      editable: true,
      sortable: false,
      flex: 1,
    },
    {
      field: "total",
      headerName: "Total",
      editable: false,
      sortable: false,
      flex: 1,
    },
    {
      field: "observacao",
      headerName: "Observação",
      editable: true,
      sortable: false,
      flex: 2,
    },
    {
      field: "excluir",
      headerName: "Excluir",
      sortable: false,
      // flex: 1,
      renderCell: (params) => (
        <>
          <DeleteIcon
            className={"btn btn-lista"}
            onClick={() => removeServicoRow(params)}
          />
        </>
      ),
    },
  ];

  useEffect(() => {
    fullScreenLoader.setLoading(true);

    api
      .get("/orcamentos/" + id)
      .then((response) => {
        
        if (response.data["data"].cliente_id) {
          response.data["data"].cliente_id = {
            value: response.data["data"].cliente.id,
            label: response.data["data"].cliente.nome,
          };
        }

        if (response.data["data"].transportadora_id) {
          response.data["data"].transportadora_id = {
            value: response.data["data"].transportadora.id,
            label: response.data["data"].transportadora.nome,
          };
        }

        const valuesToFillFormik = {
          numero: response.data["data"].numero,
          cliente_id: response.data["data"].cliente_id,
          transportadora_id: response.data["data"].transportadora_id,
          situacao: response.data["data"].situacao,
          dataEntrada: response.data["data"].dataEntrada,
          frete: response.data["data"].frete,
          outros: response.data["data"].outros,
          desconto: response.data["data"].desconto,
          total: response.data["data"].total,
          observacao: response.data["data"].observacao,
          observacaoInterna: response.data["data"].observacaoInterna,
        };
        formik.setValues(valuesToFillFormik);

        var prods = [];
        response.data["data"].produtos.map((item, index) => {
          console.log(item);
          prods.push({
            id: new Date().getTime() + index,
            observacao: item.pivot.observacao,
            preco: item.pivot.preco,
            produto_id: item.pivot.produto_id,
            quantidade: item.pivot.quantidade,
            total: item.pivot.total,
            nome: item.nome,
          });
        });
        setRowsProdutos(prods);

        var servs = [];
        response.data["data"].servicos.map((item, index) => {
          console.log(item);
          servs.push({
            id: new Date().getTime() + index,
            observacao: item.pivot.observacao,
            preco: item.pivot.preco,
            servico_id: item.pivot.servico_id,
            quantidade: item.pivot.quantidade,
            total: item.pivot.total,
            nome: item.nome,
          });
        });
        setRowsServicos(servs);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        fullScreenLoader.setLoading(false);
      });
  }, []);

  useEffect(() => {
    api
      .get("/clientes")
      .then((response) => {
        var array = [];
        response.data["data"].forEach((cliente) => {
          array.push({ label: cliente.nome, value: cliente.id });
        });
        setClientes(array);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    api
      .get("/transportadoras")
      .then((response) => {
        var array = [];
        response.data["data"].forEach((transportadora) => {
          array.push({ label: transportadora.nome, value: transportadora.id });
        });
        setTransportadoras(array);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    api
      .get("/produtos")
      .then((response) => {
        var array = [];
        response.data["data"].forEach((produto) => {
          array.push({
            label: produto.nome,
            value: produto.id,
            preco: produto.custoFinal,
          });
        });
        setProdutos(array);
      })
      .catch((error) => {});
  }, []);

  useEffect(() => {
    api
      .get("/servicos")
      .then((response) => {
        var array = [];
        response.data["data"].forEach((servico) => {
          array.push({
            label: servico.nome,
            value: servico.id,
            preco: servico.valor,
          });
        });
        setServicos(array);
      })
      .catch((error) => {});
  }, []);

  useEffect(() => {
    calcularTotalFinal();
  }, [
    rowsProdutos,
    rowsServicos,
    formik.values.frete,
    formik.values.outros,
    formik.values.desconto,
  ]);

  function handleOnSubmit(values) {
    if (rowsProdutos.length === 0 && rowsServicos.length === 0) {
      console.log(rowsProdutos.length);
      errorAlert("É necessário adicionar pelo menos um produto ou serviço!");
      return;
    }

    if (rowsProdutos.find((produto) => produto.produto_id === "")) {
      errorAlert(
        "Por favor, selecione um produto para cada linha de produtos!"
      );
      return;
    }
    if (rowsProdutos.find((produto) => produto.quantidade <= 0)) {
      errorAlert(
        "Por favor, selecione uma quantidade válida para cada linha de produtos!"
      );
      return;
    }
    if (rowsProdutos.find((produto) => produto.preco < 0)) {
      errorAlert(
        "Por favor, selecione uma preço válido para cada linha de produtos!"
      );
      return;
    }

    if (rowsServicos.find((servico) => servico.servico_id === "")) {
      errorAlert(
        "Por favor, selecione um serviço para cada linha de serviços!"
      );
      return;
    }
    if (rowsServicos.find((servico) => servico.preco < 0)) {
      errorAlert(
        "Por favor, selecione uma preço válido para cada linha de serviços!"
      );
      return;
    }
    if (rowsServicos.find((servico) => servico.quantidade <= 0)) {
      errorAlert(
        "Por favor, selecione uma quantidade válida para cada linha de serviços!"
      );
      return;
    }

    const params = {
      ...formik.values,
      produtos: rowsProdutos,
      servicos: rowsServicos,
    };

    fullScreenLoader.setLoading(true);

    api
      .put("/orcamentos/" + id, params)
      .then((response) => {
        successAlert("Sucesso", "Orçamento Editado", () =>
          history.push("/orcamentos")
        );
      })
      .catch((error) => {
        infoAlert("Atenção", error.response.data.message);
      })
      .finally(() => fullScreenLoader.setLoading(false));
  }

  function handleOnChange(name, value) {
    if (name === "funcionarios_id") {
      formik.setFieldValue(name, getUniqueArrayOfObjectsByKey(value, "value")); // Altera o formik
      return;
    }
    formik.setFieldValue(name, value); // Altera o formik
    console.log(formik.values);
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
        observacao: "",
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
    params.row.nome = value.label;
  }

  // ==== Funções de serviços ====
  function addServicoRow() {
    setRowsServicos([
      ...rowsServicos,
      {
        id: new Date().getTime(),
        servico_id: "",
        quantidade: 0,
        preco: 0,
        total: 0,
        observacao: "",
      },
    ]);
  }

  function removeServicoRow(params) {
    var indexToBeDeleted = rowsServicos.map((row, index) => {
      if (row.id === params.id) return index;
    });
    indexToBeDeleted = indexToBeDeleted.filter((row) => row !== undefined);
    setRowsServicos(deleteFromArrayByIndex(rowsServicos, ...indexToBeDeleted));
  }

  function handleServicoRowStateChange(dataGrid) {
    if (isArrayEqual(objectToArray(dataGrid.rows.idRowsLookup), rowsServicos))
      return;
    if (objectToArray(dataGrid.rows.idRowsLookup).length != rowsServicos.length)
      return;

    objectToArray(dataGrid.rows.idRowsLookup).forEach((row, index) => {
      const selectdServico = servicos.find(
        (servico) => servico.value === row.servico_id
      );
      if (selectdServico) {
        if (objectToArray(dataGrid.rows.idRowsLookup)[index].preco <= 0) {
          objectToArray(dataGrid.rows.idRowsLookup)[index].preco =
            selectdServico.preco;
        } else {
          console.log("Preço original mudado");
        }

        objectToArray(dataGrid.rows.idRowsLookup)[index].total = (
          objectToArray(dataGrid.rows.idRowsLookup)[index].preco *
          Number(row.quantidade)
        ).toFixed(2);
      }
    });
    setRowsServicos(objectToArray(dataGrid.rows.idRowsLookup));
  }

  function handleServicoChange(params, value) {
    params.row.servico_id = value.value;
    params.row.nome = value.label;
  }

  function calcularTotalFinal() {
    var total = 0;
    rowsProdutos.forEach((row) => {
      total = total + Number(row.total);
    });
    rowsServicos.forEach((row) => {
      total = total + Number(row.total);
      console.log("total", typeof total);
    });

    total = total + Number(formik.values.frete);
    total = total + Number(formik.values.outros);
    total = total - Number(formik.values.desconto);

    formik.setFieldValue("total", total);
    formik.setFieldValue("total", total);
  }

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <div>
          <Divider />
          <div
            style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}
          >
            <AssignmentIcon />
            <h3>Dados do Orçamento</h3>
          </div>

          <Grid container spacing={3}>
            <Grid item xs={4}>
              <TextField
                variant="outlined"
                label="Número"
                fullWidth
                type="text"
                value={formik.values.numero}
                name="numero"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.numero && Boolean(formik.errors.numero)}
                helperText={formik.touched.numero && formik.errors.numero}
              />
            </Grid>
            <Grid item xs={4}>
              <Autocomplete
                value={formik.values.cliente_id}
                name="cliente_id"
                onChange={(event, value) => handleOnChange("cliente_id", value)}
                isOptionEqualToValue={(option, value) =>
                  option.value === value.value
                }
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
            <Grid item xs={4}>
              <FormControl variant="outlined" fullWidth name="tipoCliente">
                <InputLabel>Situação</InputLabel>
                <Select
                  className={"input-select"}
                  label="Situação"
                  name="situacao"
                  value={formik.values.situacao}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.situacao && Boolean(formik.errors.situacao)
                  }
                >
                  <MenuItem value={0}>Aberto</MenuItem>
                  <MenuItem value={1}>Aprovado</MenuItem>
                  <MenuItem value={2}>Reprovado</MenuItem>
                </Select>
                {formik.touched.situacao && Boolean(formik.errors.situacao) ? (
                  <FormHelperText>{formik.errors.situacao}</FormHelperText>
                ) : (
                  ""
                )}
              </FormControl>
            </Grid>
          </Grid>
          <Grid container spacing={3} style={{ marginTop: 8 }}>
            <Grid item xs={4}>
              <TextField
                variant="outlined"
                label="Data Entrada"
                fullWidth
                type="date"
                value={formik.values.dataEntrada}
                name="dataEntrada"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.dataEntrada &&
                  Boolean(formik.errors.dataEntrada)
                }
                helperText={
                  formik.touched.dataEntrada && formik.errors.dataEntrada
                }
              />
            </Grid>
            <Grid item xs={8}>
              <Autocomplete
                value={formik.values.transportadora_id}
                name="transportadora_id"
                onChange={(event, value) =>
                  handleOnChange("transportadora_id", value)
                }
                isOptionEqualToValue={(option, value) =>
                  option.value === value.value
                }
                disablePortal
                options={transportadoras}
                renderInput={(params) => (
                  <TextField
                    variant="outlined"
                    fullWidth
                    {...params}
                    label="Transportadora"
                    placeholder="Pesquise..."
                  />
                )}
              />
            </Grid>
          </Grid>
        </div>

        <div style={{ marginTop: 38 }}>
          <Divider />
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

        <div style={{ marginTop: 38 }}>
          <Divider />
          <div
            style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}
          >
            <AssignmentIcon />
            <h3>Adicionar Serviços</h3>
            <Button
              style={{ marginLeft: "auto", height: 28, fontSize: 12 }}
              className={"btn btn-primary"}
              startIcon={<AddIcon />}
              onClick={addServicoRow}
              disabled={isBtnDisabled}
            >
              Serviço
            </Button>
          </div>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <div
                style={{
                  height: 100 + rowsServicos.length * 55,
                  width: "100%",
                  color: "#fff",
                }}
              >
                <DataGrid
                  className={"table-data-grid"}
                  rows={rowsServicos}
                  columns={columnsServicos}
                  hideFooter={true}
                  disableColumnMenu={true}
                  components={{
                    NoRowsOverlay: () => (
                      <div style={{ marginTop: 55, textAlign: "center" }}>
                        <h3>Nenhum serviço adicionado</h3>
                      </div>
                    ),
                  }}
                  onStateChange={handleServicoRowStateChange}
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

        <div style={{ marginTop: 38 }}>
          <Divider />
          <div
            style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}
          >
            <AssignmentIcon />
            <h3>Valores e Precificação</h3>
          </div>

          <Grid container spacing={3}>
            <Grid item xs={3}>
              <TextField
                variant="outlined"
                label="Frete"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">R$:</InputAdornment>
                  ),
                }}
                type="number"
                value={formik.values.frete}
                name="frete"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.frete && Boolean(formik.errors.frete)}
                helperText={formik.touched.frete && formik.errors.frete}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                variant="outlined"
                label="Outros Custos"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">R$:</InputAdornment>
                  ),
                }}
                type="number"
                value={formik.values.outros}
                name="outros"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.outros && Boolean(formik.errors.outros)}
                helperText={formik.touched.outros && formik.errors.outros}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                variant="outlined"
                label="Desconto"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">R$:</InputAdornment>
                  ),
                }}
                type="number"
                value={formik.values.desconto}
                name="desconto"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.desconto && Boolean(formik.errors.desconto)
                }
                helperText={formik.touched.desconto && formik.errors.desconto}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                variant="outlined"
                label="Total Final"
                fullWidth
                type="number"
                InputProps={{
                  readOnly: true,
                  startAdornment: (
                    <InputAdornment position="start">R$:</InputAdornment>
                  ),
                }}
                value={formik.values.total}
                name="total"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.total && Boolean(formik.errors.total)}
                helperText={formik.touched.total && formik.errors.total}
              />
            </Grid>
          </Grid>
        </div>

        <div style={{ marginTop: 38 }}>
          <Divider />
          <div
            style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}
          >
            <AssignmentIcon />
            <h3>Observações</h3>
          </div>

          <Grid container spacing={3}>
            <Grid item xs={6}>
              <TextField
                multiline
                className={"input-select"}
                variant="outlined"
                label="Observações"
                fullWidth
                value={formik.values.observacao}
                rows={5}
                name="observacao"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.observacao && Boolean(formik.errors.observacao)
                }
                helperText={
                  formik.touched.observacao && formik.errors.observacao
                }
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                multiline
                className={"input-select"}
                variant="outlined"
                label="Observações Internas"
                placeholder="Observações Internas não aparecem para o cliente"
                fullWidth
                value={formik.values.observacaoInterna}
                rows={5}
                name="observacaoInterna"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.observacaoInterna &&
                  Boolean(formik.errors.observacaoInterna)
                }
                helperText={
                  formik.touched.observacaoInterna &&
                  formik.errors.observacaoInterna
                }
              />
            </Grid>
          </Grid>
        </div>

        <div style={{ marginTop: 38 }}>
          <Grid container spacing={0}>
            <Grid item>
              <Button
                type="submit"
                variant="outlined"
                startIcon={<CheckIcon />}
                className={"btn btn-primary btn-spacing"}
                disabled={formik.isSubmitting}
              >
                Salvar
              </Button>
            </Grid>
            <Grid item>
              <Button
                onClick={() => history.push("/orcamentos")}
                variant="outlined"
                startIcon={<CloseIcon />}
                className={"btn btn-error btn-spacing"}
                disabled={formik.isSubmitting}
              >
                Cancelar
              </Button>
            </Grid>
          </Grid>
        </div>
      </form>
    </>
  );
}

export default EditarOrdensServicoPage;
