import { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import {
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  Button,
} from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import AssignmentIcon from "@material-ui/icons/Assignment";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import api from "../../../services/api";
import FormHelperText from "@mui/material/FormHelperText";
import { errorAlert, confirmAlert, successAlert } from "../../../utils/alert";
import { useFormik } from "formik";
import * as Yup from "yup";
import Autocomplete from "@mui/material/Autocomplete";
import { useFullScreenLoader } from "../../../context/FullScreenLoaderContext";

const useStyles = makeStyles((theme) => ({
  input: {
    marginBottom: theme.spacing(2),
  },
}));

const initialValues = {
  ordem_servico_id: "",
  material: "",
  acabamento: "",
  tipo: "",
  codigo: "",
  arame: "",
  interno: "",
  externo: "",
  passo: "",
  comprimento_corpo: "",
  comprimento_total: "",
  quantidade: "",
  espiras: "",
};

const medidaValidation = Yup.object().shape({
  ordem_servico_id: Yup.number().required("Ordem de Serviço é obrigatório"),
  material: Yup.string().required("Material é obrigatório"),
  acabamento: Yup.string().required("Acabamento é obrigatório"),
  tipo: Yup.string().required("Tipo é obrigatório"),
  codigo: Yup.string().required("Código é obrigatório"),
  arame: Yup.number().required("Arame é obrigatório"),
  interno: Yup.number(),
  externo: Yup.number(),
  passo: Yup.number(),
  comprimento_corpo: Yup.number(),
  comprimento_total: Yup.number(),
  quantidade: Yup.number().required("Quantidade é obrigatório").integer(),
  espiras: Yup.number(),
});

function EditarMedidaPage() {
  const classes = useStyles();
  const history = useHistory();
  const { id } = useParams();
  const [ordensServicos, setOrdensServicos] = useState([]);
  const fullScreenLoader = useFullScreenLoader();

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: (values) => {
      handleOnSubmit(values);
    },
    validationSchema: medidaValidation,
  });

  useEffect(() => {
    fullScreenLoader.setLoading(true);
    api.get("/ordens-servicos").then((response) => {
      setOrdensServicos(response.data["data"]);
    });

    api
      .get("/medidas/" + id)
      .then((response) => {
        formik.setValues(response.data["data"]);
      })
      .catch((error) => {
        errorAlert("Erro", "Não foi possível carregar a Medida.");
      })
      .finally(() => {
        fullScreenLoader.setLoading(false);
      });
  }, [id]);

  function handleOnChange(field, value) {
    formik.setFieldValue(field, value ? value.id : "");
  }

  function handleOnSubmit(values) {
    try {
      values.arame = parseFloat(values.arame);
      values.interno = parseFloat(values.interno);
      values.externo = parseFloat(values.externo);
      values.passo = parseFloat(values.passo);
      values.comprimento_corpo = parseFloat(values.comprimento_corpo);
      values.comprimento_total = parseFloat(values.comprimento_total);
      values.quantidade = parseInt(values.quantidade);
      values.espiras = parseFloat(values.espiras);
    } catch (error) {
      // Handle error
    }

    api
      .put("/medidas/" + id, values)
      .then((response) => {
        history.push("/medidas");
        successAlert("Sucesso", "Medida Editada");
      })
      .catch((error) => {
        errorAlert("Atenção", error?.response?.data?.message);
      })
      .finally(() => {
        formik.setSubmitting(false);
      });
  }

  function handleDelete() {
    confirmAlert("Tem certeza?", "Isso será irreversível", () => {
      deletarMedida();
    });
  }

  function deletarMedida() {
    api
      .delete("/medidas/" + id)
      .then((result) => {
        history.push("/medidas");
        successAlert("Sucesso", "Medida Excluída");
      })
      .catch((error) => {
        errorAlert("Atenção", error?.response?.data?.message);
      });
  }

  const selectedOrdemServico =
    ordensServicos.find((os) => os.id === formik.values.ordem_servico_id) ||
    null;

  return (
    <>
      <div>
        <Divider />
        <div
          style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}
        >
          <AssignmentIcon />
          <h3>Dados da Medida</h3>
        </div>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <FormControl
                variant="outlined"
                fullWidth
                className={classes.input}
                name="ordem_servico_id"
              >
                <Autocomplete
                  value={selectedOrdemServico}
                  name="ordem_servico_id"
                  onChange={(event, value) =>
                    handleOnChange("ordem_servico_id", value)
                  }
                  onBlur={formik.handleBlur}
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  options={ordensServicos}
                  getOptionLabel={(option) =>
                    `${option.numero.toString()} - ${option.cliente.nome}`
                  }
                  renderInput={(params) => (
                    <TextField
                      variant="outlined"
                      fullWidth
                      {...params}
                      label="Ordem de Serviço *"
                      placeholder="Pesquise..."
                      error={
                        formik.touched.ordem_servico_id &&
                        Boolean(formik.errors.ordem_servico_id)
                      }
                      helperText={
                        formik.touched.ordem_servico_id &&
                        formik.errors.ordem_servico_id
                      }
                    />
                  )}
                />
              </FormControl>
            </Grid>

            <Grid item xs={3}>
              <TextField
                variant="outlined"
                label="Material"
                fullWidth
                className={classes.input}
                name="material"
                value={formik.values.material}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.material && Boolean(formik.errors.material)
                }
                helperText={formik.touched.material && formik.errors.material}
              />
            </Grid>

            <Grid item xs={3}>
              <TextField
                variant="outlined"
                label="Acabamento"
                fullWidth
                className={classes.input}
                name="acabamento"
                value={formik.values.acabamento}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.acabamento && Boolean(formik.errors.acabamento)
                }
                helperText={
                  formik.touched.acabamento && formik.errors.acabamento
                }
              />
            </Grid>

            <Grid item xs={3}>
              <FormControl
                variant="outlined"
                fullWidth
                className={classes.input}
                name="tipo"
              >
                <InputLabel>Tipo *</InputLabel>
                <Select
                  className={"input-select"}
                  label="Tipo *"
                  name="tipo"
                  value={formik.values.tipo}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.tipo && Boolean(formik.errors.tipo)}
                >
                  <MenuItem value={"Tração"}>Tração</MenuItem>
                  <MenuItem value={"Compressão"}>Compressão</MenuItem>
                </Select>
                {formik.touched.tipo && Boolean(formik.errors.tipo) ? (
                  <FormHelperText>{formik.errors.tipo}</FormHelperText>
                ) : (
                  ""
                )}
              </FormControl>
            </Grid>

            <Grid item xs={3}>
              <TextField
                variant="outlined"
                label="Código"
                fullWidth
                className={classes.input}
                name="codigo"
                value={formik.values.codigo}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.codigo && Boolean(formik.errors.codigo)}
                helperText={formik.touched.codigo && formik.errors.codigo}
              />
            </Grid>

            <Grid item xs={3}>
              <TextField
                variant="outlined"
                label="Arame"
                fullWidth
                type="number"
                inputProps={{ step: "0.0001" }}
                className={classes.input}
                name="arame"
                value={formik.values.arame}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.arame && Boolean(formik.errors.arame)}
                helperText={formik.touched.arame && formik.errors.arame}
              />
            </Grid>

            <Grid item xs={3}>
              <TextField
                variant="outlined"
                label="Interno"
                fullWidth
                type="number"
                inputProps={{ step: "0.0001" }}
                className={classes.input}
                name="interno"
                value={formik.values.interno}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.interno && Boolean(formik.errors.interno)}
                helperText={formik.touched.interno && formik.errors.interno}
              />
            </Grid>

            <Grid item xs={3}>
              <TextField
                variant="outlined"
                label="Externo"
                fullWidth
                type="number"
                inputProps={{ step: "0.0001" }}
                className={classes.input}
                name="externo"
                value={formik.values.externo}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.externo && Boolean(formik.errors.externo)}
                helperText={formik.touched.externo && formik.errors.externo}
              />
            </Grid>

            <Grid item xs={3}>
              <TextField
                variant="outlined"
                label="Passo"
                fullWidth
                type="number"
                inputProps={{ step: "0.0001" }}
                className={classes.input}
                name="passo"
                value={formik.values.passo}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.passo && Boolean(formik.errors.passo)}
                helperText={formik.touched.passo && formik.errors.passo}
              />
            </Grid>

            <Grid item xs={3}>
              <TextField
                variant="outlined"
                label="Comprimento do Corpo"
                fullWidth
                type="number"
                inputProps={{ step: "0.0001" }}
                className={classes.input}
                name="comprimento_corpo"
                value={formik.values.comprimento_corpo}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.comprimento_corpo &&
                  Boolean(formik.errors.comprimento_corpo)
                }
                helperText={
                  formik.touched.comprimento_corpo &&
                  formik.errors.comprimento_corpo
                }
              />
            </Grid>

            <Grid item xs={3}>
              <TextField
                variant="outlined"
                label="Comprimento Total"
                fullWidth
                type="number"
                inputProps={{ step: "0.0001" }}
                className={classes.input}
                name="comprimento_total"
                value={formik.values.comprimento_total}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.comprimento_total &&
                  Boolean(formik.errors.comprimento_total)
                }
                helperText={
                  formik.touched.comprimento_total &&
                  formik.errors.comprimento_total
                }
              />
            </Grid>

            <Grid item xs={3}>
              <TextField
                variant="outlined"
                label="Quantidade"
                fullWidth
                type="number"
                className={classes.input}
                name="quantidade"
                value={formik.values.quantidade}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.quantidade && Boolean(formik.errors.quantidade)
                }
                helperText={
                  formik.touched.quantidade && formik.errors.quantidade
                }
              />
            </Grid>

            <Grid item xs={3}>
              <TextField
                variant="outlined"
                label="Espiras"
                fullWidth
                type="number"
                inputProps={{ step: "0.0001" }}
                className={classes.input}
                name="espiras"
                value={formik.values.espiras}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.espiras && Boolean(formik.errors.espiras)}
                helperText={formik.touched.espiras && formik.errors.espiras}
              />
            </Grid>
          </Grid>

          <br />
          <Divider />

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
                variant="outlined"
                startIcon={<DeleteForeverIcon />}
                className={"btn btn-error btn-spacing"}
                onClick={handleDelete}
                disabled={formik.isSubmitting}
              >
                Excluir
              </Button>
            </Grid>
            <Grid item>
              <Button
                onClick={() => history.push("/medidas")}
                variant="outlined"
                startIcon={<CloseIcon />}
                className={"btn btn-error btn-spacing"}
                disabled={formik.isSubmitting}
              >
                Cancelar
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
    </>
  );
}

export default EditarMedidaPage;

