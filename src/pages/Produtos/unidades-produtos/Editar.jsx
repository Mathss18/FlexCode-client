import { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
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
import { confirmAlert, infoAlert, successAlert } from "../../../utils/alert";
import { useFormik } from "formik";
import { unidadeProdutoValidation } from "../../../validators/validationSchema";

const initialValues = {
  nome: "",
  sigla: "",
  padrao: 0,
};

function EditarUnidadeDeProdutos() {
  const history = useHistory();
  const { id } = useParams();

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: (event) => {
      handleOnSubmit(event);
    },
    validationSchema: unidadeProdutoValidation,
  });

  useEffect(() => {
    api.get("/unidades-produtos/" + id).then((response) => {
      formik.setValues(response.data["data"]);
    });
  }, []);

  function handleOnSubmit(values) {
    api
      .put("/unidades-produtos/" + id, values)
      .then((response) => {
        successAlert("Sucesso", "Unidade de Produto Editada", () =>
          history.push("/unidades-produtos")
        );
      })
      .catch((error) => {
        infoAlert("Atenção", error.response.data.message);
      })
      .finally(() => formik.setSubmitting(false));
  }

  function handleDelete() {
    confirmAlert("Tem certeza?", "Isso será irreversivel", () => {
      deletarUnidadeProduto();
    });
  }

  function deletarUnidadeProduto() {
    api
      .delete("/unidades-produtos/" + id)
      .then((result) => {
        successAlert("Sucesso", "Unidade de Produto Excluida", () =>
          history.push("/unidades-produtos")
        );
      })
      .catch((error) => {
        infoAlert("Atenção", error.response.data.message);
      });
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
                variant="outlined"
                startIcon={<DeleteForeverIcon />}
                className={"btn btn-error btn-spacing"}
                disabled={formik.isSubmitting}
                onClick={handleDelete}
              >
                Excluir
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

export default EditarUnidadeDeProdutos;
