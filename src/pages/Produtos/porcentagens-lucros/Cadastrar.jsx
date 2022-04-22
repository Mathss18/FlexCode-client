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
import { porcentagemLucroValidation } from "../../../validators/validationSchema";
import { infoAlert, successAlert } from "../../../utils/alert";

const initialValues = {
  descricao: "",
  porcentagem: null,
  favorito: true,
};

function CadastrarPorcentagensLucros() {
  const history = useHistory();

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: (event) => {
      handleOnSubmit(event);
    },
    validationSchema: porcentagemLucroValidation,
  });

  function handleOnSubmit(values) {
    api
      .post("/porcentagens-lucros", values)
      .then((response) => {
        successAlert("Sucesso", "Porcentagens de Lucros Cadastrada", () =>
          history.push("/porcentagens-lucros")
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
          <h3>Dados da Porcentagem de Lucro</h3>
        </div>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                variant="outlined"
                label="Descrição"
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
            <Grid item xs={6}>
              <TextField
                variant="outlined"
                label="Porcentagem"
                fullWidth
                type="text"
                value={formik.values.porcentagem}
                name="porcentagem"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.porcentagem && Boolean(formik.errors.porcentagem)}
                helperText={formik.touched.porcentagem && formik.errors.porcentagem}
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
                onClick={() => history.push("/porcentagens-lucros")}
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

export default CadastrarPorcentagensLucros;
