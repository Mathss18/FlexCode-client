import { useEffect, useRef, useState } from "react";
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
import AddIcon from "@material-ui/icons/Add";
import toast from "react-hot-toast";

const initialValues = {
  descricao: "",
  porcentagem: null,
};

function CadastrarPorcentagensLucros() {
  const history = useHistory();
  const selectedRows = useRef([]);

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: (event) => {
      // handleOnSubmit(event);
    },
    validationSchema: unidadeProdutoValidation,
  });

  function handleOnSubmit(values) {
    console.log('OIA OS VALUES', values);
    api
      .post("/porcentagens-lucros/novo", values)
      .then((response) => {
        successAlert("Sucesso", "Porcentagens de Lucros Cadastrado", () =>
          history.push("/porcentagens-lucros")
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
          <h3>Dados da Porcentagem de Lucro</h3>
        </div>
        <form>
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
                onClick={ handleOnSubmit }
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
