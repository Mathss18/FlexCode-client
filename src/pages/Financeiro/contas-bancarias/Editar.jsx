import {
  Grid,
  TextField,
  Divider,
  Button,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import api from "../../../services/api";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import AssignmentIcon from "@material-ui/icons/Assignment";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import { useFormik } from "formik";
import { contasBancariasValidation } from "../../../validators/validationSchema";
import { confirmAlert, errorAlert, successAlert } from "../../../utils/alert";
import { useEffect, useState } from "react";
import { useFullScreenLoader } from "../../../context/FullScreenLoaderContext";
import { useParams } from "react-router-dom";

const initialValues = {
  nome: "",
  saldo: 0,
};

function EditarContasBancariasPage() {
  const history = useHistory();
  const { id } = useParams();
  const fullScreenLoader = useFullScreenLoader();

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: (event) => {
      handleOnSubmit(event);
    },
    validationSchema: contasBancariasValidation,
  });

  function handleOnSubmit(values) {
    api
      .put("/contas-bancarias/" + id, values)
      .then((response) => {
        successAlert("Sucesso", "Conta Bancária Editada", () =>
          history.push("/contas-bancarias")
        );
      })
      .catch((error) => {
        errorAlert("Atenção", error?.response?.data?.message);
      })
      .finally(() => formik.setSubmitting(false));
  }

  function handleDelete() {
    confirmAlert("Tem certeza?", "Isso será irreversivel", () => {
      deletarContaBancaria();
    });
  }

  function deletarContaBancaria() {
    api
      .delete("/contas-bancarias/" + id)
      .then((result) => {
        successAlert("Sucesso", "Conta Bacária Excluida", () =>
          history.push("/contas-bancarias")
        );
      })
      .catch((error) => {
        errorAlert("Atenção", error?.response?.data?.message);
      });
  }

  useEffect(() => {
    fullScreenLoader.setLoading(true);
    api.get("/contas-bancarias/" + id).then((response) => {
      formik.setValues(response.data['data']);
    })
      .catch((error) => {
        console.log("Erro:" + error);
      })
      .finally(() => fullScreenLoader.setLoading(false));

  }, []);

  return (
    <>
      <div>
        <Divider />
        <div
          style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}
        >
          <AssignmentIcon />
          <h3>Dados da Conta Bancária</h3>
        </div>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                variant="outlined"
                label="Nome *"
                fullWidth
                type="text"
                value={formik.values.nome}
                name="nome"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.nome && Boolean(formik.errors.nome)
                }
                helperText={formik.touched.nome && formik.errors.nome}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                disabled
                variant="outlined"
                label="Saldo *"
                fullWidth
                type="number"
                step="0.01"
                value={formik.values.saldo}
                name="saldo"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.saldo && Boolean(formik.errors.saldo)}
                helperText={formik.touched.saldo && formik.errors.saldo}
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
                onClick={() => history.push("/contas-bancarias")}
                variant="outlined"
                startIcon={<CloseIcon />}
                className={"btn btn-error btn-spacing"}
                disabled={formik.isSubmitting}
              >
                Cancelar
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
          </Grid>
        </form>
      </div>
    </>
  );
}

export default EditarContasBancariasPage;
