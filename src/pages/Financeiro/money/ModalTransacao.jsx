import {
  Autocomplete,
  createFilterOptions,
  Dialog,
  Tooltip,
} from "@mui/material";
import {
  Button,
  Checkbox,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import api from "../../../services/api";
import { transacaoValidation } from "../../../validators/validationSchema";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import toast from "react-hot-toast";
import ModalNovoFavorecido from "./ModalNovoFavorecido";
import {
  confirmAlert,
  errorAlert,
  infoAlert,
  successAlert,
} from "../../../utils/alert";
import moment from "moment";

const initialValues = {
  data: "",
  observacao: "",
  valor: "",
  situacao: "",
  favorecido_id: "",
  tipoFavorecido: "",
  conta_bancaria_id: "",

  isRecorrente: false,
};

function ModalTransacao({
  open,
  setOpen,
  clientes,
  fornecedores,
  transportadoras,
  funcionarios,
  tipoTransacao,
  dataSelecionada,
  contasBancarias,
  editTransacao,
  renderTransicoes,
}) {
  const [outroOpen, setOutroOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [outrosFavorecidosRendimentos, setOutrosFavorecidosRendimentos] =
    useState([]);
  const [outrosFavorecidosDespesas, setOutrosFavorecidosDespesas] = useState(
    []
  );
  const filter = createFilterOptions();
  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: (event) => {
      handleOnSubmit(event);
    },
    validationSchema: transacaoValidation,
  });

  function ChooseFavorecidoSelect() {
    switch (formik.values.tipoFavorecido) {
      case "clientes":
        return (
          <Autocomplete
            value={formik.values.favorecido_id}
            name="favorecido_id"
            onChange={(event, value) => handleOnChange("favorecido_id", value)}
            isOptionEqualToValue={(option, value) =>
              option.value === value.value
            }
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
        );
        break;
      case "fornecedores":
        return (
          <Autocomplete
            value={formik.values.favorecido_id}
            name="favorecido_id"
            onChange={(event, value) => handleOnChange("favorecido_id", value)}
            isOptionEqualToValue={(option, value) =>
              option.value === value.value
            }
            options={fornecedores}
            renderInput={(params) => (
              <TextField
                variant="outlined"
                fullWidth
                {...params}
                label="Fornecedor"
                placeholder="Pesquise..."
              />
            )}
          />
        );
        break;
      case "transportadoras":
        return (
          <Autocomplete
            value={formik.values.favorecido_id}
            name="favorecido_id"
            onChange={(event, value) => handleOnChange("favorecido_id", value)}
            isOptionEqualToValue={(option, value) =>
              option.value === value.value
            }
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
        );
        break;
      case "funcionarios":
        return (
          <Autocomplete
            value={formik.values.favorecido_id}
            name="favorecido_id"
            onChange={(event, value) => handleOnChange("favorecido_id", value)}
            isOptionEqualToValue={(option, value) =>
              option.value === value.value
            }
            options={funcionarios}
            renderInput={(params) => (
              <TextField
                variant="outlined"
                fullWidth
                {...params}
                label="Funcionário"
                placeholder="Pesquise..."
              />
            )}
          />
        );
        break;
      case "outros_favorecidos":
        return (
          <Autocomplete
            value={formik.values.favorecido_id}
            onChange={(event, newValue) => {
              handleOnChange("favorecido_id", newValue);
              if (typeof newValue === "string") {
                // timeout to avoid instant validation of the dialog's form.
                setTimeout(() => {
                  setOutroOpen(true);
                });
              } else if (newValue && newValue.inputValue) {
                setOutroOpen(true);
              } else {
                setValue(newValue);
              }
            }}
            filterOptions={(options, params) => {
              const filtered = filter(options, params);

              var exists = options.find(
                (option) => option.label === params.inputValue
              );

              if (params.inputValue !== "" && !exists) {
                filtered.push({
                  inputValue: params.inputValue,
                  label: `Adicionar "${params.inputValue}"`,
                });
              }

              return filtered;
            }}
            id="free-solo-dialog-demo"
            options={
              tipoTransacao.current === "rendimento"
                ? outrosFavorecidosRendimentos
                : outrosFavorecidosDespesas
            }
            getOptionLabel={(option) => {
              // e.g value selected with enter, right from the input
              if (typeof option === "string") {
                return option;
              }
              if (option.inputValue) {
                return option.inputValue;
              }
              return option.label;
            }}
            selectOnFocus
            handleHomeEndKeys
            renderOption={(props, option) => <li {...props}>{option.label}</li>}
            freeSolo
            renderInput={(params) => (
              <TextField
                variant="outlined"
                fullWidth
                {...params}
                label="Outro"
                placeholder="Pesquise..."
              />
            )}
          />
        );
        break;
      default:
        return <></>;
        break;
    }
  }

  function handleOnChange(name, value) {
    formik.setFieldValue(name, value); // Altera o formik
  }

  function handleDelete() {
    formik.resetForm(initialValues);
    setOpen(false);
    confirmAlert("Tem certeza?", "Isso será irreversivel", () => {
      deletarTransacao();
    });
  }

  function deletarTransacao() {
    api
      .delete("/transacoes/" + editTransacao?.id)
      .then((result) => {
        successAlert("Sucesso", "Transação Excluida", () => {
          renderTransicoes();
        });
      })
      .catch((error) => {
        infoAlert("Atenção", error?.response?.data?.message);
      });
  }

  useEffect(() => {
    api
      .get("/outros-favorecidos")
      .then((response) => {
        var arrayRendimentos = [];
        var arrayDespesas = [];
        response.data["data"].forEach((outros) => {
          if (outros.tipo === "rendimento") {
            arrayRendimentos.push({ label: outros.nome, value: outros.id });
          } else if (outros.tipo === "despesa") {
            arrayDespesas.push({ label: outros.nome, value: outros.id });
          }
        });
        setOutrosFavorecidosRendimentos(arrayRendimentos);
        setOutrosFavorecidosDespesas(arrayDespesas);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    if (!open) return;

    if (editTransacao) {
      var editInitialValues = {
        data: editTransacao.start,
        observacao: editTransacao.observacao ?? "",
        valor: editTransacao.valor,
        tipo: editTransacao.tipo,
        situacao: editTransacao.situacao,
        favorecido_id: editTransacao.favorecido_id,
        tipoFavorecido: editTransacao.tipoFavorecido,
        conta_bancaria_id: {
          value: editTransacao.conta_bancaria.id,
          label: editTransacao.conta_bancaria.nome,
        },
      };
      tipoTransacao.current = editTransacao.tipo;

      formik.setValues(editInitialValues);
    } else {
      formik.setFieldValue("data", dataSelecionada);
      if (tipoTransacao.current === "rendimento") {
        formik.setFieldValue("tipo", "rendimento");
        formik.setFieldValue("tipoFavorecido", "clientes");
        formik.setFieldValue("situacao", "aberta");
      }
      if (tipoTransacao.current === "despesa") {
        formik.setFieldValue("tipo", "despesa");
        formik.setFieldValue("tipoFavorecido", "fornecedores");
        formik.setFieldValue("situacao", "aberta");
      }
    }
  }, [open]);

  function handleOnSubmit() {
    setOpen(false);
    if (editTransacao) {
      api
        .put("/transacoes/" + editTransacao.id, {
          ...formik.values,
          title: formik.values.favorecido_id.label,
        })
        .then((response) => {
          renderTransicoes();
          formik.resetForm(initialValues);
          setOpen(false);
          toast("Transação editada com sucesso!", { type: "success" });
        })
        .catch((error) => {
          toast("Erro ao cadastrar ou editar transação!", { type: "error" });
          errorAlert("Erro ao cadastrar ou editar transação!");
        })
        .finally(() => {
          formik.setSubmitting(false);
        });
    } else {
      if (formik.values.isRecorrente) {
        postTransacaoRecorrente();
      } else {
        postTransacao();
      }
    }
  }

  function postTransacaoRecorrente() {
    for (let index = 0; index <= 6; index++) {
      api
        .post("/transacoes", {
          ...formik.values,
          data: moment(formik.values.data).add(index, "M").format("YYYY-MM-DD"),
          situacao: index===0 ? formik.values.situacao : "aberta",
          title: formik.values.favorecido_id.label,
        })
        .then((response) => {
          formik.resetForm(initialValues);
          setOpen(false);
          toast("Transação cadastrada com sucesso!", { type: "success" });
          renderTransicoes();
        })
        .catch((error) => {
          toast("Erro ao cadastrar transação!", { type: "error" });
          errorAlert(
            "Erro ao cadastrar transação!",
            error.response.data.message
          );
        })
        .finally(() => {
          formik.setSubmitting(false);
        });
    }
  }

  function postTransacao() {
    api
      .post("/transacoes", {
        ...formik.values,
        title: formik.values.favorecido_id.label,
      })
      .then((response) => {
        formik.resetForm(initialValues);
        setOpen(false);
        toast("Transação cadastrada com sucesso!", { type: "success" });
        renderTransicoes();
      })
      .catch((error) => {
        toast("Erro ao cadastrar transação!", { type: "error" });
        errorAlert("Erro ao cadastrar transação!", error.response.data.message);
      })
      .finally(() => {
        formik.setSubmitting(false);
      });
  }

  return (
    <>
      <ModalNovoFavorecido
        open={outroOpen}
        setOpen={setOutroOpen}
        tipoTransacao={tipoTransacao.current}
        setTransacaoOpen={setOpen}
      />
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
          formik.resetForm(initialValues);
        }}
        fullWidth={true}
        maxWidth={"lg"}
      >
        <DialogTitle className="dialogBackground">
          <div style={{ display: "flex" }}>
            <b className="dialogTitle">
              {editTransacao ? "Editar Transação" : "Nova Transação"}
            </b>

            <FormControlLabel
              style={{
                marginLeft: "auto",
                display: editTransacao ? "none" : "block",
              }}
              className="dialogTitle"
              value="start"
              control={
                <Tooltip
                  arrow
                  title="Se marcado, irá replicar esta transação para os próximos 6 meses"
                >
                  <Checkbox
                    checked={formik.isRecorrente}
                    onClick={() =>
                      formik.setFieldValue(
                        "isRecorrente",
                        !formik.values.isRecorrente
                      )
                    }
                  />
                </Tooltip>
              }
              label="Marcar como recorrente"
              labelPlacement="start"
            />
          </div>
        </DialogTitle>
        <DialogContent className="dialogBackground">
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={3}>
                <FormControl variant="outlined" fullWidth name="tipo">
                  <InputLabel>Tipo de Favorecido *</InputLabel>
                  <Select
                    className={"input-select"}
                    label="Tipo de Favorecido *"
                    name="tipoFavorecido"
                    value={formik.values.tipoFavorecido}
                    onChange={(e) => {
                      formik.handleChange(e);
                      formik.setFieldValue("favorecido_id", "");
                    }}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.tipoFavorecido &&
                      Boolean(formik.errors.tipoFavorecido)
                    }
                  >
                    {formik.values.tipo === "rendimento" && (
                      <MenuItem value={"clientes"}>Cliente</MenuItem>
                    )}
                    {formik.values.tipo === "despesa" && (
                      <MenuItem value={"fornecedores"}>Fornecedores</MenuItem>
                    )}
                    {formik.values.tipo === "despesa" && (
                      <MenuItem value={"funcionarios"}>Funcionários</MenuItem>
                    )}
                    {formik.values.tipo === "despesa" && (
                      <MenuItem value={"transportadoras"}>
                        Transportadoras
                      </MenuItem>
                    )}
                    <MenuItem value={"outros_favorecidos"}>Outros</MenuItem>
                  </Select>
                  {formik.touched.tipoFavorecido &&
                  Boolean(formik.errors.tipoFavorecido) ? (
                    <FormHelperText>
                      {formik.errors.tipoFavorecido}
                    </FormHelperText>
                  ) : (
                    ""
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                {ChooseFavorecidoSelect()}
              </Grid>
              <Grid item xs={3}>
                <TextField
                  variant="outlined"
                  label="Data"
                  fullWidth
                  name="data"
                  type={"date"}
                  value={formik.values.data}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.data && Boolean(formik.errors.data)}
                  helperText={formik.touched.data && formik.errors.data}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2} style={{ marginTop: 8 }}>
              <Grid item xs={3}>
                <FormControl variant="outlined" fullWidth name="aaaa">
                  <InputLabel>Tipo</InputLabel>
                  <Select
                    readOnly
                    className={"input-select"}
                    label="Tipo"
                    name="tipo"
                    value={formik.values.tipo}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.tipo && Boolean(formik.errors.tipo)}
                  >
                    <MenuItem value={"rendimento"}>Rendimento</MenuItem>
                    <MenuItem value={"despesa"}>Despesa</MenuItem>
                  </Select>
                  {formik.touched.tipo && Boolean(formik.errors.tipo) ? (
                    <FormHelperText>{formik.errors.tipo}</FormHelperText>
                  ) : (
                    ""
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={3}>
                <FormControl variant="outlined" fullWidth name="situacao">
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
                    <MenuItem value={"aberta"}>Aberta</MenuItem>
                    <MenuItem value={"registrada"}>Registrada</MenuItem>
                  </Select>
                  {formik.touched.situacao &&
                  Boolean(formik.errors.situacao) ? (
                    <FormHelperText>{formik.errors.situacao}</FormHelperText>
                  ) : (
                    ""
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={3}>
                <Autocomplete
                  value={formik.values.conta_bancaria_id}
                  name="conta_bancaria_id"
                  onChange={(event, value) =>
                    handleOnChange("conta_bancaria_id", value)
                  }
                  isOptionEqualToValue={(option, value) =>
                    option.value === value.value
                  }
                  options={contasBancarias}
                  renderInput={(params) => (
                    <TextField
                      variant="outlined"
                      fullWidth
                      {...params}
                      label="Conta Bancária"
                      placeholder="Pesquise..."
                    />
                  )}
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  variant="outlined"
                  label="Valor"
                  fullWidth
                  name="valor"
                  type={"number"}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">R$:</InputAdornment>
                    ),
                  }}
                  value={formik.values.valor}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.valor && Boolean(formik.errors.valor)}
                  helperText={formik.touched.valor && formik.errors.valor}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2} style={{ marginTop: 8 }}>
              <Grid item xs={12}>
                <TextField
                  multiline
                  className={"input-select"}
                  variant="outlined"
                  label="Obervação"
                  fullWidth
                  value={formik.values.observacao}
                  rows={2}
                  name="observacao"
                  onChange={formik.handleChange}
                />
              </Grid>
            </Grid>
            <br />
            <Divider />

            <Grid container spacing={0}>
              <div style={{ marginLeft: "auto", display: "flex" }}>
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
                    onClick={() => {
                      setOpen(false);
                      formik.resetForm(initialValues);
                    }}
                    variant="outlined"
                    startIcon={<CloseIcon />}
                    className={"btn btn-error btn-spacing"}
                    disabled={formik.isSubmitting}
                  >
                    Cancelar
                  </Button>
                </Grid>
                {editTransacao && (
                  <Grid item>
                    <Button
                      variant="outlined"
                      startIcon={<DeleteForeverIcon />}
                      className={"btn btn-error btn-spacing"}
                      disabled={formik.isSubmitting}
                      onClick={handleDelete}
                    >
                      Excluir
                    </Button>
                  </Grid>
                )}
              </div>
            </Grid>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ModalTransacao;
