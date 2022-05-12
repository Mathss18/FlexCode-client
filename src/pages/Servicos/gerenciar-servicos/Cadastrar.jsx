import { useEffect, useState } from "react";
import {
  Grid,
  TextField,
  Select,
  Divider,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  Checkbox,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import api from "../../../services/api";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import AssignmentIcon from "@material-ui/icons/Assignment";
import { useFormik } from "formik";
import { useFullScreenLoader } from "../../../context/FullScreenLoaderContext";
import { infoAlert, successAlert } from "../../../utils/alert";
import { servicoValidation } from "../../../validators/validationSchema";

const initialValues = {
  nome: "",
  codigoInterno: "",
  valor: 0,
  comissao: 0,
  descricao: "",
};

function CadastrarServicoPage() {
  const history = useHistory();
  const fullScreenLoader = useFullScreenLoader();

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: (event) => { handleOnSubmit(event) },
    validationSchema: servicoValidation,
  })

  function handleOnSubmit(values) {
    api
      .post("/servicos",values)
        .then((response) => {
          successAlert("Sucesso", "Serviço Cadastrado", () =>
            history.push("/servicos")
          );
        })
        .catch((error) => {
          infoAlert("Atenção", error.response.data.message);
        })
        .finally(() => {
          formik.setSubmitting(false);
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
          <h3>Dados do Serviço</h3>
        </div>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={3}>
              <TextField
                variant="outlined"
                label="Nome do Serviço *"
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
                label="Código Interno *"
                fullWidth
                type="text"
                value={formik.values.codigoInterno}
                name="codigoInterno"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.codigoInterno &&
                  Boolean(formik.errors.codigoInterno)
                }
                helperText={
                  formik.touched.codigoInterno && formik.errors.codigoInterno
                }
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                variant="outlined"
                label="Valor *"
                fullWidth
                type="number"
                step="0.01"
                value={formik.values.valor}
                name="valor"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.valor && Boolean(formik.errors.valor)}
                helperText={formik.touched.valor && formik.errors.valor}
                />
            </Grid>
            <Grid item xs={3}>
              <TextField
                variant="outlined"
                label="Comissão *"
                fullWidth
                type="number"
                step="0.01"
                value={formik.values.comissao}
                name="comissao"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.comissao && Boolean(formik.errors.comissao)
                }
                helperText={formik.touched.comissao && formik.errors.comissao}
              />
            </Grid>
          </Grid>
          <Grid container spacing={3} style={{ marginTop: 8 }}>
            <Grid item xs={12}>
              <TextField
                multiline
                className={"input-select"}
                rows={5}
                variant="outlined"
                label="Descrição *"
                fullWidth
                type="text"
                value={formik.values.descricao}
                name="descricao"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.descricao && Boolean(formik.errors.descricao)
                }
                helperText={formik.touched.descricao && formik.errors.descricao}
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
                onClick={() => history.push("/servicos")}
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

export default CadastrarServicoPage;
