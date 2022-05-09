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
import toast from "react-hot-toast";
import ModalNovoFavorecido from "./ModalNovoFavorecido";
import { errorAlert } from "../../../utils/alert";

const initialValues = {
  data: "",
  observacao: "",
  valor: "",
  situacao: "aberta",
  favorecido_id: "",
  tipoFavorecido: "clientes",
  conta_bancaria_id: "",

  isRecorrente: false,
};

function ModalTransacao({
  transacoes,
  setTransacoes,
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
}) {
  const [outroOpen, setOutroOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [outrosFavorecidosRendimentos, setOutrosFavorecidosRendimentos] =
    useState([]);
  const [outrosFavorecidosDespesas, setOutrosFavorecidosDespesas] = useState(
    []
  );
  const [dialogValue, setDialogValue] = useState({
    favorecido: "",
  });
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
              if (typeof newValue === "string") {
                // timeout to avoid instant validation of the dialog's form.
                setTimeout(() => {
                  setOutroOpen(true);
                  setDialogValue({
                    favorecido: newValue,
                  });
                });
              } else if (newValue && newValue.inputValue) {
                setOutroOpen(true);
                setDialogValue({
                  favorecido: newValue.inputValue,
                });
              } else {
                setValue(newValue);
              }
            }}
            filterOptions={(options, params) => {
              const filtered = filter(options, params);

              if (params.inputValue !== "") {
                filtered.push({
                  inputValue: params.inputValue,
                  label: `Adicionar "${params.inputValue}"`,
                });
              }

              return filtered;
            }}
            id="free-solo-dialog-demo"
            options={
              tipoTransacao.current === "Rendimento"
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
            clearOnBlur
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

  useEffect(() => {
    api
      .get("/outros-favorecidos")
      .then((response) => {
        var arrayRendimentos = [];
        var arrayDespesas = [];
        response.data["data"].forEach((outros) => {
          if (outros.tipo === "rendimentos") {
            arrayRendimentos.push({ label: outros.nome, value: outros.id });
          } else if (outros.tipo === "despesas") {
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
    console.log("initialValues", initialValues);
    console.log("editTransacao", editTransacao);
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
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;

    if (tipoTransacao.current === "rendimento") {
      formik.setFieldValue("tipo", "rendimento");
    }
    if (tipoTransacao.current === "despesa") {
      formik.setFieldValue("tipo", "despesa");
    }
  }, [open]);

  useEffect(() => {
    formik.setFieldValue("data", dataSelecionada);
  }, [dataSelecionada]);

  useEffect(() => {
    formik.setFieldValue("favorecido_id", "");
  }, [formik.values.tipoFavorecido]);

  function handleOnSubmit() {
    setOpen(false);
    if(editTransacao){
      api
      .put("/transacoes/"+editTransacao.id, {
        ...formik.values,
        title: formik.values.favorecido_id.label,
      })
      .then((response) => {
        formik.resetForm(initialValues);
        setOpen(false);
        toast("Transação editada com sucesso!", { type: "success" });
        
      })
      .catch((error) => {
        toast("Erro ao cadastrar transação!", { type: "error" });
        errorAlert("Erro ao cadastrar transação!", error.response.data.message);
      })
      .finally(() => {
        formik.setSubmitting(false);
      });
    }
    else{
      api
      .post("/transacoes", {
        ...formik.values,
        title: formik.values.favorecido_id.label,
      })
      .then((response) => {
        formik.resetForm(initialValues);
        setOpen(false);
        toast("Transação cadastrada com sucesso!", { type: "success" });
        setTransacoes([
          ...transacoes,
          {
            id: response.data["data"].id,
            title: response.data["data"].title,
            start: response.data["data"].data,
            end: response.data["data"].data,
            allDay: true,
            backgroundColor:
              response.data["data"].tipo === "rendimento"
                ? "#00a65a"
                : "#f56954",
            borderColor:
              response.data["data"].tipo === "rendimento"
                ? "#00a65a"
                : "#f56954",
            fontSize: "12px",

            data: response.data["data"].data,
            observacao: response.data["data"].observacao,
            valor: response.data["data"].valor,
            situacao: response.data["data"].situacao,
            tipo: response.data["data"].tipo,
            favorecido_id: {
              value: response.data["data"].favorecido_id,
              label: response.data["data"].favorecido_nome,
            },
            tipoFavorecido: "clientes",
            conta_bancaria: {
              id: response.data["data"].conta_bancaria_id,
              nome: formik.values.conta_bancaria_id.label,
            },
            conta_bancaria_id: {
              id: response.data["data"].conta_bancaria_id,
              nome: formik.values.conta_bancaria_id.label,
            },
          },
        ]);
      })
      .catch((error) => {
        toast("Erro ao cadastrar transação!", { type: "error" });
        errorAlert("Erro ao cadastrar transação!", error.response.data.message);
      })
      .finally(() => {
        formik.setSubmitting(false);
      });
    }
   
  }

  return (
    <>
      <ModalNovoFavorecido
        open={outroOpen}
        setOpen={setOutroOpen}
        tipoTransacao={tipoTransacao.current}
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
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.tipoFavorecido &&
                      Boolean(formik.errors.tipoFavorecido)
                    }
                  >
                    <MenuItem
                      disabled={
                        formik.values.tipo === "rendimento" ? false : true
                      }
                      value={"clientes"}
                    >
                      Cliente
                    </MenuItem>
                    <MenuItem
                      disabled={
                        formik.values.tipo === "rendimento" ? true : false
                      }
                      value={"fornecedores"}
                    >
                      Fornecedores
                    </MenuItem>
                    <MenuItem
                      disabled={
                        formik.values.tipo === "rendimento" ? true : false
                      }
                      value={"funcionarios"}
                    >
                      Funcionários
                    </MenuItem>
                    <MenuItem
                      disabled={
                        formik.values.tipo === "rendimento" ? true : false
                      }
                      value={"transportadoras"}
                    >
                      Transportadoras
                    </MenuItem>
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
              </div>
            </Grid>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ModalTransacao;
