import { useEffect, useState, useRef } from "react";
import {
  Grid,
  TextField,
  Select,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  Checkbox,
  InputAdornment,
  RadioGroup,
  FormControlLabel,
  Radio,
  IconButton,
  Tooltip,
} from "@material-ui/core";
import { useHistory, useParams } from "react-router-dom";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import AssignmentIcon from "@material-ui/icons/Assignment";
import { useFormik } from "formik";
import { Autocomplete } from "@mui/material";
import api from "../../../services/api";
import { DataGrid } from "@mui/x-data-grid";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import moment from "moment";
import {
  deleteFromArrayByIndex,
  isArrayEqual,
  objectToArray,
} from "../../../utils/functions";
import { comprasValidation } from "../../../validators/validationSchema";
import { useFullScreenLoader } from "../../../context/FullScreenLoaderContext";
import { errorAlert, infoAlert, successAlert } from "../../../utils/alert";
import DragAndDrop from "../../../components/dragdrop/DragAndDrop";
import toast from "react-hot-toast";

const initialValues = {
  numero: "",
  fornecedor_id: null,
  transportadora_id: null,
  forma_pagamento_id: null,
  numeroNF: "",
  quantidadeParcelas: 1,
  intervaloParcelas: 0,
  tipoFormaPagamento: '0', // 0 - À vista, 1 - A prazo
  somarFreteAoTotal: false,
  produtos: [],
  parcelas: [],
  anexos: [],
  situacao: 0,
  dataEntrada: moment().format("YYYY-MM-DD"),
  dataPrimeiraParcela: moment().format("YYYY-MM-DD"),
  frete: 0,
  impostos: 0,
  desconto: 0,
  total: 0,
  observacao: "",
  observacaoInterna: "",

  qtdeMaximaParcelas: Infinity // Para não permitir que o usuário digite uma quantidade de parcelas maior que o permitido (Não faz parte do formulário em sí)
};

function EditarComprasPage() {
  const { id } = useParams();
  const history = useHistory();
  const [fornecedores, setFornecedores] = useState([]);
  const [formasPagamentos, setFormasPagamentos] = useState([]);
  const [transportadoras, setTransportadoras] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [rowsProdutos, setRowsProdutos] = useState([]);
  const [rowsParcelas, setRowsParcelas] = useState([]);
  const [isBtnDisabled, setIsBtnDisabled] = useState(false);
  const [files, setFiles] = useState([]);
  const isRecebida = useRef(false);
  const isCancelada = useRef(false);
  const formasPagamentosOriginal = useRef([]);

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: (event) => {
      handleOnSubmit(event);
    },
    validationSchema: comprasValidation,
  });

  const columnsProdutos = [
    {
      field: "produto_id",
      headerName: "Produto",
      flex: 2,
      sortable: false,
      headerAlign: 'letf',
      renderCell: (params) => (
        <>
          <Autocomplete
            fullWidth
            disableClearable={true}
            value={
              params.row.produto_id == ""
                ? { label: "", value: null }
                : { label: params.row.nome, value: params.row.produto_id }
            }
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
      field: "quantidade",
      headerName: "Quantidade",
      type: 'number',
      editable: true,
      sortable: false,
      headerAlign: 'letf',
      flex: 1,
    },
    {
      field: "preco",
      headerName: "Preço Unitário",
      type: 'number',
      editable: true,
      sortable: false,
      headerAlign: 'letf',
      flex: 1,
    },
    {
      field: "total",
      headerName: "Total",
      type: 'number',
      editable: false,
      sortable: false,
      headerAlign: 'letf',
      flex: 1,
    },
    {
      field: "observacao",
      headerName: "Observação",
      editable: true,
      sortable: false,
      headerAlign: 'letf',
      flex: 2,
    },
    {
      field: "excluir",
      headerName: "Excluir",
      sortable: false,
      headerAlign: 'letf',
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

  const columnsParcelas = [
    {
      field: "dataVencimento",
      headerName: "Data Vencimento",
      flex: 1,
      type: "date",
      editable: true,
      sortable: false,
      headerAlign: 'letf',
    },
    {
      field: "valorParcela",
      headerName: "Valor Parcela",
      editable: true,
      sortable: false,
      headerAlign: 'letf',
      type: "number",
      flex: 1,
    },
    {
      field: "forma_pagamento_id",
      headerName: "Forma Pagamento",
      sortable: false,
      headerAlign: 'letf',
      flex: 1,
      renderCell: (params) => (
        <>
          <Autocomplete
            fullWidth
            disableClearable={true}
            value={
              params.row.forma_pagamento_id == ""
                ? { label: "", value: null }
                : { label: params.row.nome, value: params.row.forma_pagamento_id }
            }
            name="forma_pagamento_id"
            onChange={(event, value) => handleFormaPagamentoChange(params, value)}
            isOptionEqualToValue={(option, value) =>
              option.value === value.value
            }
            options={formasPagamentos}
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
      field: "observacao",
      headerName: "Observação",
      editable: true,
      sortable: false,
      headerAlign: 'letf',
      flex: 2,
    },
    // {
    //   field: "excluir",
    //   headerName: "Excluir",
    //   sortable: false,
    //   headerAlign: 'letf',
    //   renderCell: (params) => (
    //     <>
    //       <DeleteIcon
    //         className={"btn btn-lista"}
    //         onClick={() => removeParcelaRow(params)}
    //       />
    //     </>
    //   ),
    // },
  ];


  useEffect(() => {
    api
      .get("/fornecedores")
      .then((response) => {
        var array = [];
        response.data["data"].forEach((fornecedor) => {
          array.push({ label: fornecedor.nome, value: fornecedor.id });
        });
        setFornecedores(array);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    api
      .get("/formas-pagamentos")
      .then((response) => {
        formasPagamentosOriginal.current = response.data["data"];
        var array = [];
        response.data["data"].forEach((formaPagamento) => {
          array.push({ label: formaPagamento.nome, value: formaPagamento.id });
        });
        setFormasPagamentos(array);
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
      .catch((error) => { });
  }, []);

  useEffect(() => {
    fullScreenLoader.setLoading(true);

    api
      .get("/compras/" + id)
      .then((response) => {
        if (response.data["data"].situacao == 1) {
          isRecebida.current = true;
        }
        else if(response.data["data"].situacao == 2){
          toast("Compra cancelada!, não é possivel fazer alterações", { type: "error" });
          isCancelada.current = true;
          isRecebida.current = true;
        }
        else{
          isRecebida.current = false;
          isCancelada.current = false;
        }

        if (response.data["data"].fornecedor_id) {
          response.data["data"].fornecedor_id = {
            value: response.data["data"].fornecedor.id,
            label: response.data["data"].fornecedor.nome,
          };
        }

        if (response.data["data"].transportadora_id) {
          response.data["data"].transportadora_id = {
            value: response.data["data"].transportadora.id,
            label: response.data["data"].transportadora.nome,
          };
        }

        if (response.data["data"].forma_pagamento_id) {
          response.data["data"].forma_pagamento_id = {
            value: response.data["data"].forma_pagamento.id,
            label: response.data["data"].forma_pagamento.nome,
          };
        }

        const valuesToFillFormik = {
          numero: response.data["data"].numero,
          cliente_id: response.data["data"].cliente_id,
          fornecedor_id: response.data["data"].fornecedor_id,
          transportadora_id: response.data["data"].transportadora_id,
          forma_pagamento_id: response.data["data"].forma_pagamento_id,
          numeroNF: response.data["data"].numeroNF,
          quantidadeParcelas: response.data["data"].quantidadeParcelas,
          intervaloParcelas: response.data["data"].intervaloParcelas,
          tipoFormaPagamento: response.data["data"].tipoFormaPagamento,
          somarFreteAoTotal: response.data["data"].somarFreteAoTotal,
          situacao: response.data["data"].situacao,
          dataEntrada: response.data["data"].dataEntrada,
          dataPrimeiraParcela: response.data["data"].dataPrimeiraParcela,
          frete: response.data["data"].frete,
          desconto: response.data["data"].desconto,
          impostos: response.data["data"].impostos,
          total: response.data["data"].total,
          observacao: response.data["data"].observacao,
          observacaoInterna: response.data["data"].observacaoInterna,
        };
        formik.setValues(valuesToFillFormik);

        var prods = [];
        response.data["data"].produtos.map((item, index) => {
          prods.push({
            id: item.id,
            observacao: item.pivot.observacao,
            preco: item.pivot.preco,
            produto_id: item.pivot.produto_id,
            quantidade: item.pivot.quantidade,
            total: item.pivot.total,
            nome: item.nome,
          });
        });
        setRowsProdutos(prods);

        var parcs = [];
        response.data["data"].parcelas.map((item, index) => {
          parcs.push({
            id: item.id,
            dataVencimento: item.dataVencimento,
            valorParcela: item.valorParcela.toFixed(2),
            forma_pagamento_id: item.forma_pagamento.id,
            nome: item.forma_pagamento.nome,
            observacao: item.observacao
          });
        });
        setRowsParcelas(parcs);

        var anexos = [];
        response.data["data"].anexos.map((item, index) => {
          anexos.push({
            id: item.id,
            url: item.url,
            nome: item.nome,
            tamanho: item.tamanho,
            compra_id: item.compra_id,
          });
        });
        setFiles(anexos);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        fullScreenLoader.setLoading(false);
      });
  }, []);

  useEffect(() => {
    calcularTotalFinal();
  }, [
    rowsProdutos,
    formik.values.frete,
    formik.values.impostos,
    formik.values.desconto,
    formik.values.somarFreteAoTotal,
  ]);

  useEffect(() => {
    console.log(files)
  }, [files]);

  useEffect(() => {
    if (!formik.values.tipoFormaPagamento) return;
    // Se for a vista, seta a quantidade de parcelas como 1 e o intervalo como 0
    if (formik.values.tipoFormaPagamento == '0') {
      formik.setFieldValue("quantidadeParcelas", 1);
      formik.setFieldValue("intervaloParcelas", 0);
    }
  }, [formik.values.tipoFormaPagamento]);

  useEffect(() => {
    if (formik.values.tipoFormaPagamento == '0') return
    var formaPaga = formasPagamentosOriginal.current.filter((formaPagamento) => {
      return formaPagamento.id == formik.values.forma_pagamento_id.value;
    });
    if(formaPaga.length == 1){
      formik.setFieldValue("intervaloParcelas", formaPaga[0].intervaloParcelas);
      formik.setFieldValue("qtdeMaximaParcelas", formaPaga[0].numeroMaximoParcelas);
    }
    if(formik.values.quantidadeParcelas > formik.values.qtdeMaximaParcelas){
      toast("A quantidade máxima de parcelas para essa forma de pagamento é "+formik.values.qtdeMaximaParcelas, { type: "error" });
    }
    
  }, [formik.values.forma_pagamento_id, formik.isSubmitting]);

  const fullScreenLoader = useFullScreenLoader();

  function handleOnSubmit(values) {
    if (rowsProdutos.length === 0) {
      formik.setSubmitting(false);
      errorAlert("É necessário adicionar pelo menos um produto!");
      return;
    }
    if (rowsProdutos.find((produto) => produto.produto_id === "")) {
      formik.setSubmitting(false);
      errorAlert(
        "Por favor, selecione um produto para cada linha de produtos!"
      );
      return;
    }
    if (rowsProdutos.find((produto) => produto.quantidade <= 0)) {
      formik.setSubmitting(false);
      errorAlert(
        "Por favor, selecione uma quantidade válida para cada linha de produtos!"
      );
      return;
    }
    if (rowsProdutos.find((produto) => produto.preco < 0)) {
      formik.setSubmitting(false);
      errorAlert(
        "Por favor, selecione uma preço válido para cada linha de produtos!"
      );
      return;
    }
    if (rowsParcelas.length <= 0) {
      formik.setSubmitting(false);
      errorAlert(
        "A compra deve ter pelo menos uma parcela!"
      );
      return;
    }
    if (rowsParcelas.find((parcela) => Number(parcela.valorParcela) < 0)) {
      formik.setSubmitting(false);
      errorAlert(
        "Por favor, selecione uma valor válido para cada parcela!"
      );
      return;
    }
    const totalParcelas = rowsParcelas.reduce((acc, item) => acc + Number(item.valorParcela), 0);
    if (Number(totalParcelas.toFixed(2)) != Number(formik.values.total.toFixed(2))) {
      formik.setSubmitting(false);
      errorAlert(
        "Erro no calculo das parcelas!",
        "A soma das parcelas deve ser igual ao valor final da compra"
      );
      return;
    }

    if (formik.values.tipoFormaPagamento == '0' && rowsParcelas.length != 1) {
      formik.setSubmitting(false);
      errorAlert(
        "Erro no calculo das parcelas!",
        "Compras à vista devem ter apenas uma parcela!"
      );
      return;
    }

    const rowParcelasSanitezed = rowsParcelas.map((parcela) => {
      return {
        ...parcela,
        valorParcela: Number(parcela.valorParcela),
        dataVencimento: moment(parcela.dataVencimento).format("DD/MM/YYYY"),
      };
    });

    const params = {
      ...formik.values,
      produtos: rowsProdutos,
      parcelas: rowParcelasSanitezed,
      anexos: files
    };


    fullScreenLoader.setLoading(true);
    api
      .put("/compras/" + id, params)
      .then((response) => {
        successAlert("Sucesso", "Compra Editada", () =>
          history.push("/compras")
        );
      })
      .catch((error) => {
        infoAlert("Atenção", error.response.data.message);
      })
      .finally(() => {
        fullScreenLoader.setLoading(false);
        formik.setSubmitting(false);
      });
  }

  function handleOnChange(name, value) {
    formik.setFieldValue(name, value); // Altera o formik
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

  function handleParcelaRowStateChange(dataGrid) {
    if (isArrayEqual(objectToArray(dataGrid.rows.idRowsLookup), rowsParcelas))
      return;
    if (objectToArray(dataGrid.rows.idRowsLookup).length != rowsParcelas.length)
      return;

    const total = formik.values.total;
    const parcelas = formik.values.quantidadeParcelas;
    var acumulador = 0;
    var resto = 0;
    var totalParcelas = 0;

    objectToArray(dataGrid.rows.idRowsLookup).forEach((row, index) => {
      // Caso o preço daquela row tenha sido alterado, entrara no if
      if (objectToArray(dataGrid.rows.idRowsLookup)[index].valorParcela != rowsParcelas[index].valorParcela) {
        resto = Number(total) - (Number(acumulador) + Number(objectToArray(dataGrid.rows.idRowsLookup)[index].valorParcela)); // Calcula o restante TOTAL para ser dividido entra as parcelas restantes
        var restoCadaParcela = resto / (parcelas - (index + 1)); // Calcula o restante INDIVIDUAL para ser dividido entre as parcelas restantes

        // Para cada parcela restante, altera o valor da parcela (se o valor restante for negativo, o valor da parcela será 0)
        for (let i = index + 1; i < parcelas; i++) {
          if (restoCadaParcela > 0) {
            objectToArray(dataGrid.rows.idRowsLookup)[i].valorParcela = restoCadaParcela.toFixed(2);
          }
          else {
            objectToArray(dataGrid.rows.idRowsLookup)[i].valorParcela = 0;
          }
        }

      }
      else {
        acumulador = acumulador + Number(rowsParcelas[index].valorParcela); // Acumula o valor das parcelas que não foram alteradas
      }

      totalParcelas += Number(objectToArray(dataGrid.rows.idRowsLookup)[index].valorParcela); // Soma os valores de todas as parcelas (usado somente para calcular a diferença)

    });

    var diferenca = total - totalParcelas;
    diferenca = Number(diferenca.toFixed(2));

    // se hover diferença, adiciona a diferença na ultima parcela
    if (Number(diferenca) !== 0) {
      objectToArray(dataGrid.rows.idRowsLookup)[parcelas - 1].valorParcela = Number(objectToArray(dataGrid.rows.idRowsLookup)[parcelas - 1].valorParcela) + Number(diferenca.toFixed(2));
    }

    setRowsParcelas(objectToArray(dataGrid.rows.idRowsLookup).map((row) => {
      row.valorParcela = row.valorParcela > 0 ? Number(row.valorParcela).toFixed(2) : 0;
      return row;
    }));
  }

  function handleClienteChange(params, value) {
    params.row.produto_id = value.value;
  }

  // ==== Funções de parcelas ====

  function refreshParcelas() {
    if (!formik.values.forma_pagamento_id) {
      errorAlert("Por favor, selecione uma forma de pagamento!");
      return;
    }
    var aux = [];

    var diferenca = formik.values.total / formik.values.quantidadeParcelas;
    diferenca = (formik.values.total - (diferenca.toFixed(2) * formik.values.quantidadeParcelas)).toFixed(2);

    for (let i = 0; i < formik.values.quantidadeParcelas; i++) {
      aux.push({
        id: new Date().getTime() + i,
        dataVencimento: moment(formik.values.dataPrimeiraParcela).add(formik.values.intervaloParcelas * i, 'days').format("DD/MM/YYYY"),
        valorParcela: Number((Number(formik.values.total) / Number(formik.values.quantidadeParcelas))).toFixed(2),
        forma_pagamento_id: formik.values.forma_pagamento_id.value,
        nome: formik.values.forma_pagamento_id.label,
        observacao: "",
      });
    }
    // Se houver diferência, adiciona a última parcela com o valor da diferença
    if (Number(diferenca) !== 0) {
      aux[aux.length - 1].valorParcela = Number(aux[aux.length - 1].valorParcela) + Number(diferenca);
    }
    setRowsParcelas(aux);
  }


  function handleFormaPagamentoChange(params, value) {
    params.row.forma_pagamento_id = value.value;
    params.row.nome = value.label;
  }

  function calcularTotalFinal() {
    var total = 0.0;
    rowsProdutos.forEach((row) => {
      total = total + Number(row.total);
    });

    if (formik.values.somarFreteAoTotal) {
      total = total + Number(formik.values.frete);
    }
    total = total + Number(formik.values.impostos);
    total = total - Number(formik.values.desconto);

    formik.setFieldValue("total", total);
    formik.setFieldValue("total", total);
  }

  return (
    <>
      <form onSubmit={formik.handleSubmit} style={{pointerEvents: isCancelada.current ? 'none': 'auto'}}>
        <div style={{ marginTop: 0, boxShadow: '0px 2px 4px -1px rgb(0 0 0 / 20%), 0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%)', padding: 24 }}>
          <div
            style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}
          >
            <AssignmentIcon />
            <h3>Dados da Compra</h3>
          </div>

          <Grid container spacing={3}>
            <Grid item xs={4}>
              <TextField
                disabled
                variant="outlined"
                label="Número *"
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
                disabled={isRecebida.current}
                value={formik.values.fornecedor_id}
                name="fornecedor_id"
                onChange={(event, value) => handleOnChange("fornecedor_id", value)}
                onBlur={formik.handleBlur}
                isOptionEqualToValue={(option, value) =>
                  option.value === value.value
                }
                disablePortal
                options={fornecedores}
                renderInput={(params) => (
                  <TextField
                    variant="outlined"
                    fullWidth
                    {...params}
                    label="Fornecedor *"
                    placeholder="Pesquise..."
                    error={formik.touched.fornecedor_id && Boolean(formik.errors.fornecedor_id)}
                    helperText={formik.touched.fornecedor_id && formik.errors.fornecedor_id}
                  />
                )}
              />
            </Grid>
            <Grid item xs={4}>
              <FormControl variant="outlined" fullWidth name="situacao">
                <InputLabel>Situação *</InputLabel>
                <Select
                  className={"input-select"}
                  label="Situação *"
                  name="situacao"
                  value={formik.values.situacao}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.situacao && Boolean(formik.errors.situacao)
                  }
                >
                  <MenuItem value={0}>Aberta</MenuItem>
                  <MenuItem value={1}>Recebida</MenuItem>
                  <MenuItem value={2}>Cancelada</MenuItem>
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
                label="Data Entrada *"
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
            <Grid item xs={4}>
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
            <Grid item xs={4}>
              <TextField
                variant="outlined"
                label="Número Nota Fiscal"
                fullWidth
                type="text"
                value={formik.values.numeroNF}
                name="numeroNF"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.numeroNF &&
                  Boolean(formik.errors.numeroNF)
                }
                helperText={
                  formik.touched.numeroNF && formik.errors.numeroNF
                }
              />
            </Grid>
          </Grid>
        </div>

        <div style={{ pointerEvents: isRecebida.current ? 'none' : 'auto', marginTop: 38, boxShadow: '0px 2px 4px -1px rgb(0 0 0 / 20%), 0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%)', padding: 24 }}>
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

        <div style={{ pointerEvents: isRecebida.current ? 'none' : 'auto', marginTop: 38, boxShadow: '0px 2px 4px -1px rgb(0 0 0 / 20%), 0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%)', padding: 24 }}>
          <div
            style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}
          >
            <AssignmentIcon />
            <h3>Frete, Impostos e Descontos</h3>
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
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title="Somar frete ao total" arrow>
                        <Checkbox
                          checked={formik.values.somarFreteAoTotal}
                          onChange={formik.handleChange}
                          name="somarFreteAoTotal"
                          inputProps={{ 'aria-label': 'controlled' }}
                        />
                      </Tooltip>
                    </InputAdornment>
                  ),
                }}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => { }}
                      edge="end"
                    >
                      {<CloseIcon />}
                    </IconButton>
                  </InputAdornment>
                }
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
                label="Impostos"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">R$:</InputAdornment>
                  ),
                }}
                type="number"
                value={formik.values.impostos}
                name="impostos"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.impostos && Boolean(formik.errors.impostos)}
                helperText={formik.touched.impostos && formik.errors.impostos}
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

        <div style={{ pointerEvents: isRecebida.current ? 'none' : 'auto', marginTop: 38, boxShadow: '0px 2px 4px -1px rgb(0 0 0 / 20%), 0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%)', padding: 24 }}>
          <div
            style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}
          >
            <AssignmentIcon />
            <h3>Pagamento</h3>
            <div style={{ marginLeft: 'auto' }}>
              <FormControl>
                <RadioGroup
                  value={formik.values.tipoFormaPagamento}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  name="tipoFormaPagamento"
                  row>
                  <FormControlLabel value={'0'} control={<Radio />} label="À vista" />
                  <FormControlLabel value={'1'} control={<Radio />} label="A prazo" />
                </RadioGroup>
                <FormHelperText>{formik.touched.tipoFormaPagamento && formik.errors.tipoFormaPagamento}</FormHelperText>
              </FormControl>
              {rowsParcelas.length <= 0 ?
                <Button
                  style={{ height: 28, fontSize: 12, marginTop: 8 }}
                  className={"btn btn-primary"}
                  startIcon={<AddIcon />}
                  onClick={refreshParcelas}
                  disabled={isBtnDisabled}
                >
                  Parcelas
                </Button>
                :
                <Button
                  style={{ height: 28, fontSize: 12, marginTop: 8 }}
                  className={"btn btn-primary"}
                  startIcon={<CleaningServicesIcon />}
                  onClick={() => setRowsParcelas([])}
                  disabled={isBtnDisabled}
                >
                  Limpar
                </Button>}


            </div>

          </div>

          <Grid container spacing={3}>
            <Grid item xs={3}>
              <Autocomplete
                value={formik.values.forma_pagamento_id}
                name="forma_pagamento_id"
                onChange={(event, value) => handleOnChange("forma_pagamento_id", value)}
                isOptionEqualToValue={(option, value) =>
                  option.value === value.value
                }
                disablePortal
                options={formasPagamentos}
                renderInput={(params) => (
                  <TextField
                    variant="outlined"
                    fullWidth
                    {...params}
                    label="Forma de pagamento *"
                    placeholder="Pesquise..."
                    error={formik.touched.forma_pagamento_id && Boolean(formik.errors.forma_pagamento_id)}
                    helperText={formik.touched.forma_pagamento_id && formik.errors.forma_pagamento_id}
                  />
                )}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                variant="outlined"
                label="Qtde Parcelas *"
                fullWidth
                type="number"
                value={formik.values.quantidadeParcelas}
                disabled={formik.values.tipoFormaPagamento == '0'}
                name="quantidadeParcelas"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.quantidadeParcelas &&
                  Boolean(formik.errors.quantidadeParcelas)
                }
                helperText={
                  formik.touched.quantidadeParcelas && formik.errors.quantidadeParcelas
                }
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                variant="outlined"
                label="Intervalo (dias) *"
                fullWidth
                type="number"
                value={formik.values.intervaloParcelas}
                disabled={formik.values.tipoFormaPagamento == '0'}
                name="intervaloParcelas"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.intervaloParcelas &&
                  Boolean(formik.errors.intervaloParcelas)
                }
                helperText={
                  formik.touched.intervaloParcelas && formik.errors.intervaloParcelas
                }
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                variant="outlined"
                label="Data 1ª parcela *"
                fullWidth
                type="date"
                value={formik.values.dataPrimeiraParcela}
                name="dataPrimeiraParcela"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.dataPrimeiraParcela &&
                  Boolean(formik.errors.dataPrimeiraParcela)
                }
                helperText={
                  formik.touched.dataPrimeiraParcela && formik.errors.dataPrimeiraParcela
                }
              />
            </Grid>
            <Grid item xs={12}>
              <div
                style={{
                  height: 100 + rowsParcelas.length * 55,
                  width: "100%",
                  color: "#fff",
                }}
              >
                <DataGrid
                  className={"table-data-grid"}
                  rows={rowsParcelas}
                  columns={columnsParcelas}
                  onStateChange={handleParcelaRowStateChange}
                  disableVirtualization
                  hideFooter={true}
                  disableColumnMenu={true}
                  components={{
                    NoRowsOverlay: () => (
                      <div style={{ marginTop: 55, textAlign: "center" }}>
                        <h3>Nenhum serviço adicionado</h3>
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

        <div style={{ marginTop: 38, boxShadow: '0px 2px 4px -1px rgb(0 0 0 / 20%), 0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%)', padding: 24 }}>
          <div
            style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}
          >
            <AssignmentIcon />
            <h3>Anexos</h3>
          </div>

          <Grid container spacing={3}>
            <>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <DragAndDrop state={[files, setFiles]} listFiles></DragAndDrop>
                </Grid>
              </Grid>
            </>
          </Grid>
        </div>

        <div style={{ marginTop: 38, boxShadow: '0px 2px 4px -1px rgb(0 0 0 / 20%), 0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%)', padding: 24 }}>
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

export default EditarComprasPage;
