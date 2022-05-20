import MUIDataTable from "mui-datatables";
import { useEffect, useRef, useState } from "react";
import { config, rowConfig } from "../../../config/tablesConfig";
import api from "../../../services/api";
import EditIcon from "@material-ui/icons/Edit";
import { useHistory } from "react-router-dom";
import AddIcon from "@material-ui/icons/Add";
import ListAltIcon from "@mui/icons-material/ListAlt";
import { useFullScreenLoader } from "../../../context/FullScreenLoaderContext";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import { Autocomplete, Dialog } from "@mui/material";
import {
  Button,
  Tooltip,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
} from "@material-ui/core";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import moment from "moment";

function ListarContasBancariasPage() {
  const columns = [
    {
      name: "Nome",
      options: rowConfig,
    },
    {
      name: "Saldo",
      options: rowConfig,
    },
    {
      name: "Ações",
      options: rowConfig,
    },
  ];

  const data = [];

  const [contasBancarias, setContasBancarias] = useState([]);
  const contasBancariasTransferencia = useRef([]);
  const [open, setOpen] = useState(false);
  const history = useHistory();
  const fullScreenLoader = useFullScreenLoader();
  const empresaConfig = JSON.parse(localStorage.getItem("config"));

  function handleOnClickExtratoButton(event, id) {
    history.push("/extratos/" + id);
  }

  function handleOnClickEditButton(event, id) {
    history.push("/contas-bancarias/editar/" + id);
  }

  useEffect(() => {
    loadContasBancarias();
  }, []);

  function loadContasBancarias(){
    fullScreenLoader.setLoading(true);

    api
      .get("/contas-bancarias")
      .then((response) => {
        if (response != undefined) {
          response.data["data"].forEach((element) => {
            var array = [
              element["nome"],
              `R$: ${element["saldo"].toFixed(2)}`,
              <>
                <EditIcon
                  className={"btn-lista"}
                  onClick={(event) =>
                    handleOnClickEditButton(event, element["id"])
                  }
                />
                <Tooltip title="Visualizar extrato" arrow>
                  <ListAltIcon
                    className={"btn-lista"}
                    onClick={(event) =>
                      handleOnClickExtratoButton(event, element["id"])
                    }
                  />
                </Tooltip>
              </>,
            ];
            data.push(array);
          });
          const array = [];
          response.data["data"].forEach((contaBancaria) => {
            array.push({ label: contaBancaria.nome, value: contaBancaria.id });
          });

          contasBancariasTransferencia.current = array;
          setContasBancarias(data);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        fullScreenLoader.setLoading(false);
      });
  }

  function ModalTransferencia() {
    const initialValues = {
      valor: "",
      observacao: "",
      data: moment().format("YYYY-MM-DD"),
      conta_bancaria_id_origem: "",
      conta_bancaria_id_destino: "",
    };

    const formik = useFormik({
      initialValues: initialValues,
      onSubmit: (event) => {
        handleOnSubmit(event);
      },
    });

    function handleOnSubmit() {
      if (
        formik.values.conta_bancaria_id_origem ===
        formik.values.conta_bancaria_id_destino
      ) {
        toast("Contas bancárias de origem e destino não podem ser iguais", {
          type: "error",
        });
        formik.setSubmitting(false);
        return;
      }
      if (formik.values.valor === "" || formik.values.valor <= 0) {
        toast("Valor inválido", { type: "error" });
        formik.setSubmitting(false);
        return;
      }
      api
        .post("transacoes/contas-bancarias/transferencias", formik.values)
        .then((response) => {
          toast("Transferência realizada com sucesso", { type: "success" });
          setOpen(false);
          loadContasBancarias();
        })
        .catch((error) => {})
        .finally(() => {});
    }

    function handleOnChange(name, value) {
      formik.setFieldValue(name, value); // Altera o formik
    }

    return (
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        fullWidth={true}
        maxWidth={"lg"}
      >
        <form onSubmit={formik.handleSubmit} className="dialogBackground">
          <DialogTitle className="dialogTitle">Nova Transferência</DialogTitle>
          <DialogContent className="dialogBackground">
            <Grid container spacing={2}>
              <Grid item xs={3}>
                <Autocomplete
                  required
                  value={formik.values.conta_bancaria_id_origem}
                  name="conta_bancaria_id_origem"
                  onChange={(event, value) =>
                    handleOnChange("conta_bancaria_id_origem", value)
                  }
                  isOptionEqualToValue={(option, value) =>
                    option.value === value.value
                  }
                  options={contasBancariasTransferencia.current}
                  renderInput={(params) => (
                    <TextField
                      required
                      variant="outlined"
                      fullWidth
                      {...params}
                      label="Conta Bancária ORIGEM"
                      placeholder="Pesquise..."
                    />
                  )}
                />
              </Grid>
              <Grid item xs={3}>
                <Autocomplete
                  required
                  value={formik.values.conta_bancaria_id_destino}
                  name="conta_bancaria_id_destino"
                  onChange={(event, value) =>
                    handleOnChange("conta_bancaria_id_destino", value)
                  }
                  isOptionEqualToValue={(option, value) =>
                    option.value === value.value
                  }
                  options={contasBancariasTransferencia.current}
                  renderInput={(params) => (
                    <TextField
                      required
                      variant="outlined"
                      fullWidth
                      {...params}
                      label="Conta Bancária DESTINO"
                      placeholder="Pesquise..."
                    />
                  )}
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  required
                  variant="outlined"
                  label="Valor"
                  fullWidth
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={formik.values.valor}
                  name="valor"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  required
                  variant="outlined"
                  label="Data"
                  fullWidth
                  type="date"
                  value={formik.values.data}
                  name="data"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  multiline
                  className={"input-select"}
                  variant="outlined"
                  label="Observação"
                  fullWidth
                  value={formik.values.observacao}
                  rows={2}
                  name="observacao"
                  onChange={formik.handleChange}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Grid container spacing={0}>
              <div style={{ marginLeft: "auto", display: "flex" }}>
                <Grid item>
                  <Button
                    type="submit"
                    variant="outlined"
                    startIcon={<CheckIcon />}
                    className={"btn btn-primary btn-spacing"}
                  >
                    Salvar
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    onClick={() => {
                      setOpen(false);
                      {
                      }
                    }}
                    variant="outlined"
                    startIcon={<CloseIcon />}
                    className={"btn btn-error btn-spacing"}
                  >
                    Cancelar
                  </Button>
                </Grid>
              </div>
            </Grid>
          </DialogActions>
        </form>
      </Dialog>
    );
  }



  return (
    <>
      <ModalTransferencia />
      <Button
        onClick={() => history.push("/contas-bancarias/novo")}
        variant="outlined"
        startIcon={<AddIcon />}
        className={"btn btn-primary btn-spacing"}
      >
        Adicionar
      </Button>
      <Button
        onClick={() => setOpen(true)}
        variant="outlined"
        startIcon={<CurrencyExchangeIcon />}
        className={"btn btn-primary btn-spacing"}
      >
        Transferência
      </Button>

      <MUIDataTable
        title={"Lista de contas bancárias"}
        data={contasBancarias}
        columns={columns}
        options={config}
        className={"table-background"}
      ></MUIDataTable>
    </>
  );
}

export default ListarContasBancariasPage;
