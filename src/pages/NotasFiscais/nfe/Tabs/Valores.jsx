import { useEffect, useRef, useState } from "react";
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
import { useHistory } from "react-router-dom";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import AssignmentIcon from "@material-ui/icons/Assignment";
import { useFormik } from "formik";
import { Autocomplete } from "@mui/material";
import api from "../../../../services/api";
import { DataGrid } from "@mui/x-data-grid";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import CleaningServicesIcon from "@mui/icons-material/CleaningServices";
import moment from "moment";
import {
  deleteFromArrayByIndex,
  isArrayEqual,
  objectToArray,
} from "../../../../utils/functions";
import { useFullScreenLoader } from "../../../../context/FullScreenLoaderContext";
import { errorAlert, infoAlert, successAlert } from "../../../../utils/alert";
import toast from "react-hot-toast";
import { useNotaFiscalContext } from "../../../../context/NotaFiscalContext";

export default function Valores() {
  const history = useHistory();
  const notaFiscalContext = useNotaFiscalContext();
  const [formasPagamentos, setFormasPagamentos] = useState([]);
  const [rowsParcelas, setRowsParcelas] = useState(
    notaFiscalContext.formik.values.parcelas
  );
  const [isBtnDisabled, setIsBtnDisabled] = useState(false);
  const formasPagamentosOriginal = useRef([]);
  const fullScreenLoader = useFullScreenLoader();
  const empresaConfig = JSON.parse(localStorage.getItem("config"));

  const columnsParcelas = [
    {
      field: "dataVencimento",
      headerName: "Data Vencimento",
      flex: 1,
      type: "date",
      editable: true,
      sortable: false,
      headerAlign: "letf",
    },
    {
      field: "valorParcela",
      headerName: "Valor Parcela",
      editable: true,
      sortable: false,
      headerAlign: "letf",
      type: "number",
      flex: 1,
    },
    {
      field: "forma_pagamento_id",
      headerName: "Forma Pagamento",
      sortable: false,
      headerAlign: "letf",
      flex: 1,
      renderCell: (params) => (
        <>
          <Autocomplete
            fullWidth
            disableClearable={true}
            value={
              params.row.forma_pagamento_id == ""
                ? { label: "", value: null }
                : {
                    label: params.row.nome,
                    value: params.row.forma_pagamento_id,
                  }
            }
            name="forma_pagamento_id"
            onChange={(event, value) =>
              handleFormaPagamentoChange(params, value)
            }
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

  useEffect(
    () => console.log(notaFiscalContext.formik.values),
    [notaFiscalContext.formik.values]
  );

  useEffect(() => {
    calcularTotalFinal();
    notaFiscalContext.formik.setFieldValue("parcelas", rowsParcelas);
  }, [
    rowsParcelas,
    notaFiscalContext.formik.values.produtos,
    notaFiscalContext.formik.values.frete,
    notaFiscalContext.formik.values.desconto,
  ]);

  useEffect(() => {
    if (!notaFiscalContext.formik.values.tipoFormaPagamento) return;
    // Se for a vista, seta a quantidade de parcelas como 1 e o intervalo como 0
    if (notaFiscalContext.formik.values.tipoFormaPagamento == "0") {
      notaFiscalContext.formik.setFieldValue("quantidadeParcelas", 1);
      notaFiscalContext.formik.setFieldValue("intervaloParcelas", 0);
    }
  }, [notaFiscalContext.formik.values.tipoFormaPagamento]);

  useEffect(() => {
    if (notaFiscalContext.formik.values.tipoFormaPagamento == "0") return;
    var formaPaga = formasPagamentosOriginal.current.filter(
      (formaPagamento) => {
        return (
          formaPagamento.id ==
          notaFiscalContext.formik.values.forma_pagamento_id.value
        );
      }
    );
    if (formaPaga.length == 1) {
      notaFiscalContext.formik.setFieldValue(
        "intervaloParcelas",
        formaPaga[0].intervaloParcelas
      );
      notaFiscalContext.formik.setFieldValue(
        "qtdeMaximaParcelas",
        formaPaga[0].numeroMaximoParcelas
      );
    }
    if (
      notaFiscalContext.formik.values.quantidadeParcelas >
      notaFiscalContext.formik.values.qtdeMaximaParcelas
    ) {
      toast(
        "A quantidade máxima de parcelas para essa forma de pagamento é " +
          notaFiscalContext.formik.values.qtdeMaximaParcelas,
        { type: "error" }
      );
    }
  }, [
    notaFiscalContext.formik.values.forma_pagamento_id,
    notaFiscalContext.formik.isSubmitting,
  ]);

  function handleOnSubmit() {
    if (rowsParcelas.find((parcela) => Number(parcela.valorParcela) < 0)) {
      notaFiscalContext.formik.setSubmitting(false);
      errorAlert("Por favor, selecione uma valor válido para cada parcela!");
      return;
    }
    const totalParcelas = rowsParcelas.reduce(
      (acc, item) => acc + Number(item.valorParcela),
      0
    );

    if (
      notaFiscalContext.formik.values.tipoFormaPagamento == "0" &&
      rowsParcelas.length != 1
    ) {
      notaFiscalContext.formik.setSubmitting(false);
      errorAlert(
        "Erro no calculo das parcelas!",
        "Vendas à vista devem ter apenas uma parcela!"
      );
      return;
    }

    const rowParcelasSanitezed = rowsParcelas.map((parcela, index) => {
      if (typeof parcela.dataVencimento === "object") {
        parcela.dataVencimento = new Date(
          parcela.dataVencimento
        ).toLocaleString("pt-BR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
      } else if (parcela.dataVencimento === null || parcela.dataVencimento === "") {
        errorAlert(
          "Por favor, selecione uma data de vencimento válida a parcela número " +
            (index + 1)
        );
        return;
      }

      return {
        ...parcela,
        valorParcela: Number(parcela.valorParcela),
        dataVencimento: parcela.dataVencimento,
      };
    });

    const params = {
      ...notaFiscalContext.formik.values,
      parcelas: rowParcelasSanitezed,
    };

    api
      .post("/notas-fiscais", params)
      .then((response) => {})
      .catch((error) => {})
      .finally(() => {});
  }

  function handleOnChange(name, value) {
    notaFiscalContext.formik.setFieldValue(name, value); // Altera o formik
  }

  // ==== Funções de parcelas ====

  function handleParcelaRowStateChange(dataGrid) {
    if (isArrayEqual(objectToArray(dataGrid.rows.idRowsLookup), rowsParcelas))
      return;
    if (objectToArray(dataGrid.rows.idRowsLookup).length != rowsParcelas.length)
      return;

    const total = notaFiscalContext.formik.values.totalFinal;
    const parcelas = notaFiscalContext.formik.values.quantidadeParcelas;
    var acumulador = 0;
    var resto = 0;
    var totalParcelas = 0;

    objectToArray(dataGrid.rows.idRowsLookup).forEach((row, index) => {
      // Caso o preço daquela row tenha sido alterado, entrara no if
      if (
        objectToArray(dataGrid.rows.idRowsLookup)[index].valorParcela !=
        rowsParcelas[index].valorParcela
      ) {
        resto =
          Number(total) -
          (Number(acumulador) +
            Number(
              objectToArray(dataGrid.rows.idRowsLookup)[index].valorParcela
            )); // Calcula o restante TOTAL para ser dividido entra as parcelas restantes
        var restoCadaParcela = resto / (parcelas - (index + 1)); // Calcula o restante INDIVIDUAL para ser dividido entre as parcelas restantes

        // Para cada parcela restante, altera o valor da parcela (se o valor restante for negativo, o valor da parcela será 0)
        for (let i = index + 1; i < parcelas; i++) {
          if (restoCadaParcela > 0) {
            objectToArray(dataGrid.rows.idRowsLookup)[i].valorParcela =
              restoCadaParcela.toFixed(empresaConfig.quantidadeCasasDecimaisValor);
          } else {
            objectToArray(dataGrid.rows.idRowsLookup)[i].valorParcela = 0;
          }
        }
      } else {
        acumulador = acumulador + Number(rowsParcelas[index].valorParcela); // Acumula o valor das parcelas que não foram alteradas
      }

      totalParcelas += Number(
        objectToArray(dataGrid.rows.idRowsLookup)[index].valorParcela
      ); // Soma os valores de todas as parcelas (usado somente para calcular a diferença)
    });

    var diferenca = total - totalParcelas;
    diferenca = Number(diferenca.toFixed(empresaConfig.quantidadeCasasDecimaisValor));

    // se hover diferença, adiciona a diferença na ultima parcela
    if (Number(diferenca) !== 0) {
      objectToArray(dataGrid.rows.idRowsLookup)[parcelas - 1].valorParcela =
        Number(
          objectToArray(dataGrid.rows.idRowsLookup)[parcelas - 1].valorParcela
        ) + Number(diferenca.toFixed(empresaConfig.quantidadeCasasDecimaisValor));
    }

    setRowsParcelas(
      objectToArray(dataGrid.rows.idRowsLookup).map((row) => {
        row.valorParcela =
          row.valorParcela > 0 ? Number(row.valorParcela).toFixed(empresaConfig.quantidadeCasasDecimaisValor) : 0;
        return row;
      })
    );
  }

  function refreshParcelas() {
    if (!notaFiscalContext.formik.values.forma_pagamento_id) {
      errorAlert("Por favor, selecione uma forma de pagamento!");
      return;
    }
    var aux = [];

    var diferenca =
      notaFiscalContext.formik.values.totalFinal /
      notaFiscalContext.formik.values.quantidadeParcelas;
    diferenca = (
      notaFiscalContext.formik.values.totalFinal -
      diferenca.toFixed(empresaConfig.quantidadeCasasDecimaisValor) * notaFiscalContext.formik.values.quantidadeParcelas
    ).toFixed(empresaConfig.quantidadeCasasDecimaisValor);

    for (
      let i = 0;
      i < notaFiscalContext.formik.values.quantidadeParcelas;
      i++
    ) {
      aux.push({
        id: new Date().getTime() + i,
        dataVencimento: moment(
          notaFiscalContext.formik.values.dataPrimeiraParcela
        )
          .add(notaFiscalContext.formik.values.intervaloParcelas * i, "days")
          .format("DD/MM/YYYY"),
        valorParcela: Number(
          Number(notaFiscalContext.formik.values.totalFinal) /
            Number(notaFiscalContext.formik.values.quantidadeParcelas)
        ).toFixed(empresaConfig.quantidadeCasasDecimaisValor),
        forma_pagamento_id:
          notaFiscalContext.formik.values.forma_pagamento_id.value,
        nome: notaFiscalContext.formik.values.forma_pagamento_id.label,
      });
    }
    // Se houver diferência, adiciona a última parcela com o valor da diferença
    if (Number(diferenca) !== 0) {
      aux[aux.length - 1].valorParcela =
        Number(aux[aux.length - 1].valorParcela) + Number(diferenca);
    }
    setRowsParcelas(aux);
  }

  function handleFormaPagamentoChange(params, value) {
    params.row.forma_pagamento_id = value.value;
    params.row.nome = value.label;
  }

  function calcularTotalFinal() {
    var total = 0;
    notaFiscalContext.formik.values.produtos.forEach((row) => {
      total = total + Number(row.total);
    });

    total = total + Number(notaFiscalContext.formik.values.frete);
    total = total - Number(notaFiscalContext.formik.values.desconto);

    notaFiscalContext.formik.setFieldValue("totalFinal", total);
  }

  return (
    <>
      <div
        style={{
          boxShadow:
            "0px 2px 4px -1px rgb(0 0 0 / 20%), 0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%)",
          padding: 24,
        }}
      >
        <div
          style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}
        >
          <AssignmentIcon />
          <h3>Pagamento</h3>
          <div style={{ marginLeft: "auto" }}>
            <FormControl>
              <RadioGroup
                value={notaFiscalContext.formik.values.tipoFormaPagamento}
                onChange={notaFiscalContext.formik.handleChange}
                onBlur={notaFiscalContext.formik.handleBlur}
                name="tipoFormaPagamento"
                row
              >
                <FormControlLabel
                  value={"0"}
                  control={<Radio />}
                  label="À vista"
                />
                <FormControlLabel
                  value={"1"}
                  control={<Radio />}
                  label="A prazo"
                />
              </RadioGroup>
              <FormHelperText>
                {notaFiscalContext.formik.touched.tipoFormaPagamento &&
                  notaFiscalContext.formik.errors.tipoFormaPagamento}
              </FormHelperText>
            </FormControl>
            {rowsParcelas.length <= 0 ? (
              <Button
                style={{ height: 28, fontSize: 12, marginTop: 8 }}
                className={"btn btn-primary"}
                startIcon={<AddIcon />}
                onClick={refreshParcelas}
                disabled={isBtnDisabled}
              >
                Parcelas
              </Button>
            ) : (
              <Button
                style={{ height: 28, fontSize: 12, marginTop: 8 }}
                className={"btn btn-primary"}
                startIcon={<CleaningServicesIcon />}
                onClick={() => setRowsParcelas([])}
                disabled={isBtnDisabled}
              >
                Limpar
              </Button>
            )}
          </div>
        </div>

        <Grid container spacing={3}>
          <Grid item xs={3}>
            <Autocomplete
              value={notaFiscalContext.formik.values.forma_pagamento_id}
              name="forma_pagamento_id"
              onChange={(event, value) =>
                handleOnChange("forma_pagamento_id", value)
              }
              isOptionEqualToValue={(option, value) =>
                option.value === value.value
              }
              options={formasPagamentos}
              renderInput={(params) => (
                <TextField
                  variant="outlined"
                  fullWidth
                  {...params}
                  label="Forma de pagamento *"
                  placeholder="Pesquise..."
                  error={
                    notaFiscalContext.formik.touched.forma_pagamento_id &&
                    Boolean(notaFiscalContext.formik.errors.forma_pagamento_id)
                  }
                  helperText={
                    notaFiscalContext.formik.touched.forma_pagamento_id &&
                    notaFiscalContext.formik.errors.forma_pagamento_id
                  }
                />
              )}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              max={notaFiscalContext.formik.values.qtdeMaximaParcelas}
              variant="outlined"
              label="Qtde Parcelas *"
              fullWidth
              type="number"
              value={notaFiscalContext.formik.values.quantidadeParcelas}
              disabled={notaFiscalContext.formik.values.tipoFormaPagamento == 0}
              name="quantidadeParcelas"
              onChange={notaFiscalContext.formik.handleChange}
              onBlur={notaFiscalContext.formik.handleBlur}
              error={
                notaFiscalContext.formik.touched.quantidadeParcelas &&
                Boolean(notaFiscalContext.formik.errors.quantidadeParcelas)
              }
              helperText={
                notaFiscalContext.formik.touched.quantidadeParcelas &&
                notaFiscalContext.formik.errors.quantidadeParcelas
              }
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              variant="outlined"
              label="Intervalo (dias) *"
              fullWidth
              type="number"
              value={notaFiscalContext.formik.values.intervaloParcelas}
              disabled={notaFiscalContext.formik.values.tipoFormaPagamento == 0}
              name="intervaloParcelas"
              onChange={notaFiscalContext.formik.handleChange}
              onBlur={notaFiscalContext.formik.handleBlur}
              error={
                notaFiscalContext.formik.touched.intervaloParcelas &&
                Boolean(notaFiscalContext.formik.errors.intervaloParcelas)
              }
              helperText={
                notaFiscalContext.formik.touched.intervaloParcelas &&
                notaFiscalContext.formik.errors.intervaloParcelas
              }
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              variant="outlined"
              label="Data 1ª parcela *"
              fullWidth
              type="date"
              value={notaFiscalContext.formik.values.dataPrimeiraParcela}
              name="dataPrimeiraParcela"
              onChange={notaFiscalContext.formik.handleChange}
              onBlur={notaFiscalContext.formik.handleBlur}
              error={
                notaFiscalContext.formik.touched.dataPrimeiraParcela &&
                Boolean(notaFiscalContext.formik.errors.dataPrimeiraParcela)
              }
              helperText={
                notaFiscalContext.formik.touched.dataPrimeiraParcela &&
                notaFiscalContext.formik.errors.dataPrimeiraParcela
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
          <h3>Informações Adicionais</h3>
        </div>

        <Grid container spacing={3}>
          <Grid item xs={4}>
            <TextField
              variant="outlined"
              label="Especie *"
              fullWidth
              type="text"
              value={notaFiscalContext.formik.values.esp}
              name="esp"
              onChange={notaFiscalContext.formik.handleChange}
              onBlur={notaFiscalContext.formik.handleBlur}
              error={
                notaFiscalContext.formik.touched.esp &&
                Boolean(notaFiscalContext.formik.errors.esp)
              }
              helperText={
                notaFiscalContext.formik.touched.esp &&
                notaFiscalContext.formik.errors.esp
              }
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              variant="outlined"
              label="Volumes *"
              fullWidth
              type="text"
              value={notaFiscalContext.formik.values.qVol}
              name="qVol"
              onChange={notaFiscalContext.formik.handleChange}
              onBlur={notaFiscalContext.formik.handleBlur}
              error={
                notaFiscalContext.formik.touched.qVol &&
                Boolean(notaFiscalContext.formik.errors.qVol)
              }
              helperText={
                notaFiscalContext.formik.touched.qVol &&
                notaFiscalContext.formik.errors.qVol
              }
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              variant="outlined"
              label="Desconto"
              fullWidth
              type="number"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">R$:</InputAdornment>
                ),
              }}
              value={notaFiscalContext.formik.values.desconto}
              name="desconto"
              onChange={notaFiscalContext.formik.handleChange}
              onBlur={notaFiscalContext.formik.handleBlur}
              error={
                notaFiscalContext.formik.touched.desconto &&
                Boolean(notaFiscalContext.formik.errors.desconto)
              }
              helperText={
                notaFiscalContext.formik.touched.desconto &&
                notaFiscalContext.formik.errors.desconto
              }
            />
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={4}>
            <TextField
              variant="outlined"
              label="Peso Bruto *"
              fullWidth
              type="number"
              value={notaFiscalContext.formik.values.pesoB}
              name="pesoB"
              onChange={notaFiscalContext.formik.handleChange}
              onBlur={notaFiscalContext.formik.handleBlur}
              error={
                notaFiscalContext.formik.touched.pesoB &&
                Boolean(notaFiscalContext.formik.errors.pesoB)
              }
              helperText={
                notaFiscalContext.formik.touched.pesoB &&
                notaFiscalContext.formik.errors.pesoB
              }
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              variant="outlined"
              label="Peso Líquido *"
              fullWidth
              type="number"
              value={notaFiscalContext.formik.values.pesoL}
              name="pesoL"
              onChange={notaFiscalContext.formik.handleChange}
              onBlur={notaFiscalContext.formik.handleBlur}
              error={
                notaFiscalContext.formik.touched.pesoL &&
                Boolean(notaFiscalContext.formik.errors.pesoL)
              }
              helperText={
                notaFiscalContext.formik.touched.pesoL &&
                notaFiscalContext.formik.errors.pesoL
              }
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              variant="outlined"
              label="Unidade Padrão *"
              fullWidth
              type="text"
              value={notaFiscalContext.formik.values.unidadePadrao}
              name="unidadePadrao"
              onChange={notaFiscalContext.formik.handleChange}
              onBlur={notaFiscalContext.formik.handleBlur}
              error={
                notaFiscalContext.formik.touched.unidadePadrao &&
                Boolean(notaFiscalContext.formik.errors.unidadePadrao)
              }
              helperText={
                notaFiscalContext.formik.touched.unidadePadrao &&
                notaFiscalContext.formik.errors.unidadePadrao
              }
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              variant="outlined"
              label="Total Final"
              style={{ border: "2px solid orange", borderRadius: "6px" }}
              fullWidth
              InputProps={{
                readOnly: true,
                startAdornment: (
                  <InputAdornment position="start">R$:</InputAdornment>
                ),
              }}
              type="number"
              value={notaFiscalContext.formik.values.totalFinal}
              name="totalFinal"
              onChange={notaFiscalContext.formik.handleChange}
              onBlur={notaFiscalContext.formik.handleBlur}
              error={
                notaFiscalContext.formik.touched.totalFinal &&
                Boolean(notaFiscalContext.formik.errors.totalFinal)
              }
              helperText={
                notaFiscalContext.formik.touched.totalFinal &&
                notaFiscalContext.formik.errors.totalFinal
              }
            />
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
          <h3>Informações adicionais</h3>
        </div>

        <Grid container spacing={3}>
          <Grid item xs={6}>
            <TextField
              multiline
              className={"input-select"}
              variant="outlined"
              label="Informações complementares"
              placeholder="valor aprox. tributos será acrescentado automaticamente."
              fullWidth
              value={notaFiscalContext.formik.values.infCpl}
              rows={5}
              name="infCpl"
              onChange={notaFiscalContext.formik.handleChange}
              onBlur={notaFiscalContext.formik.handleBlur}
              error={
                notaFiscalContext.formik.touched.infCpl &&
                Boolean(notaFiscalContext.formik.errors.infCpl)
              }
              helperText={
                notaFiscalContext.formik.touched.infCpl &&
                notaFiscalContext.formik.errors.infCpl
              }
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              multiline
              className={"input-select"}
              variant="outlined"
              label="Informações para o Fisco"
              fullWidth
              value={notaFiscalContext.formik.values.infAdFisco}
              rows={5}
              name="infAdFisco"
              onChange={notaFiscalContext.formik.handleChange}
              onBlur={notaFiscalContext.formik.handleBlur}
              error={
                notaFiscalContext.formik.touched.infAdFisco &&
                Boolean(notaFiscalContext.formik.errors.infAdFisco)
              }
              helperText={
                notaFiscalContext.formik.touched.infAdFisco &&
                notaFiscalContext.formik.errors.infAdFisco
              }
            />
          </Grid>
        </Grid>
      </div>

      <div style={{ marginTop: 38 }}>
        <Grid container spacing={0}>
          <Grid item>
            <Button
              variant="outlined"
              startIcon={<CheckIcon />}
              onClick={handleOnSubmit}
              className={"btn btn-primary btn-spacing"}
              disabled={notaFiscalContext.formik.isSubmitting}
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
              disabled={notaFiscalContext.formik.isSubmitting}
            >
              Cancelar
            </Button>
          </Grid>
        </Grid>
      </div>
    </>
  );
}
