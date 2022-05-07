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
import { useFormik } from "formik";
import { contasBancariasValidation } from "../../../validators/validationSchema";
import { infoAlert, successAlert } from "../../../utils/alert";
import { useEffect, useState } from "react";
import { useFullScreenLoader } from "../../../context/FullScreenLoaderContext";

const initialValues = {
  nome: "",
  saldoInicial: 0,
};

function CadastrarContasBancariasPage() {
  const history = useHistory();
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
      .post("/contas-bancarias", values)
      .then((response) => {
        successAlert("Sucesso", "Conta Bancária Cadastrada", () =>
          history.push("/contas-bancarias")
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
                variant="outlined"
                label="Saldo Inicial *"
                fullWidth
                type="text"
                value={formik.values.saldoInicial}
                name="saldoInicial"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.saldoInicial && Boolean(formik.errors.saldoInicial)}
                helperText={formik.touched.saldoInicial && formik.errors.saldoInicial}
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
          </Grid>
        </form>
      </div>
    </>
  );
}

export default CadastrarContasBancariasPage;
