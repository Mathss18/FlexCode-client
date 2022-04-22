import { useState } from "react";
import {
  Grid,
  TextField,
  Select,
  Divider,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import api from "../../../services/api";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import AssignmentIcon from "@material-ui/icons/Assignment";
import { useFormik } from "formik";
import { unidadeProdutoValidation } from "../../../validators/validationSchema";
import { infoAlert, successAlert } from "../../../utils/alert";

const initialValues = {
  nome: "",
  sigla: "",
  padrao: 0,
};

function CadastrarUnidadeDeProdutos() {
  const history = useHistory();
  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: (event) => {
      handleOnSubmit(event);
    },
    validationSchema: unidadeProdutoValidation,
  });

  function handleOnSubmit(values) {
    api
      .post("/unidades-produtos", values)
      .then((response) => {
        successAlert("Sucesso", "Unidade de Produto Cadastrada", () =>
          history.push("/unidades-produtos")
        );
      })
      .catch((error) => {
        infoAlert("Atenção", error.response.data.message);
      })
      .finally(() => formik.setSubmitting(false));
  }

  return (
    <>
      <div>
        <Divider />
        <div
          style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}
        >
          <AssignmentIcon />
          <h3>Dados da Unidade de Produtos</h3>
        </div>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                variant="outlined"
                label="Nome"
                fullWidth
                type="text"
                value={formik.values.nome}
                name="nome"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.nome && Boolean(formik.errors.nome)}
                helperText={formik.touched.nome && formik.errors.nome}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                variant="outlined"
                label="Sigla"
                fullWidth
                type="text"
                value={formik.values.sigla}
                name="sigla"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.sigla && Boolean(formik.errors.sigla)}
                helperText={formik.touched.sigla && formik.errors.sigla}
              />
            </Grid>
            <Grid item xs={3}>
              <FormControl variant="outlined" fullWidth>
                <InputLabel>Padrão</InputLabel>
                <Select
                  className={"input-select"}
                  label="Padrão"
                  onChange={formik.handleChange}
                  type="select"
                  name="padrao"
                  value={formik.values.padrao}
                >
                  <MenuItem value={0}>Não</MenuItem>
                  <MenuItem value={1}>Sim</MenuItem>
                </Select>
              </FormControl>
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
                onClick={() => history.push("/unidades-produtos")}
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

export default CadastrarUnidadeDeProdutos;
