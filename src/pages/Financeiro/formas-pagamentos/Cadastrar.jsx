import {
  Grid,
  TextField,
  Divider,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import api from "../../../services/api";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import AssignmentIcon from "@material-ui/icons/Assignment";
import { useFormik } from "formik";
import { formasPagamentoValidation } from "../../../validators/validationSchema";
import { infoAlert, successAlert } from "../../../utils/alert";
import { useEffect, useState } from "react";
import { useFullScreenLoader } from "../../../context/FullScreenLoaderContext";

const initialValues = {
  nome: "",
  conta_bancaria_id: 0,
  numeroMaximoParcelas: '',
  intervaloParcelas: '',
};

function CadastrarFormasPagamentosPage() {
  const history = useHistory();
  const [contasBancarias, setContasBancarias] = useState([]);
  const fullScreenLoader = useFullScreenLoader();

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: (event) => {
      handleOnSubmit(event);
    },
    validationSchema: formasPagamentoValidation,
  });

  function handleOnSubmit(values) {
    api
      .post("/formas-pagamentos", values)
      .then((response) => {
        successAlert("Sucesso", "Porcentagens de Lucros Cadastrada", () =>
          history.push("/formas-pagamentos")
        );
      })
      .catch((error) => {
        infoAlert("Atenção", error.response.data.message);
      })
      .finally(() => formik.setSubmitting(false));
  }

  useEffect(() => {
    fullScreenLoader.setLoading(true);
    api.get("/contas-bancarias").then((response) => {
      setContasBancarias(response.data['data']);
    })
    .catch((error) => {
      console.log("Erro:" + error);
    })
    .finally(() => fullScreenLoader.setLoading(false));

  }, []);

  function handleOnChange(event) {
    const { name, value } = event.target;
    formik.setValues({ ...formik.values, [name]: value }); // Altera o State 
  }

  return (
    <>
      <div>
        <Divider />
        <div
          style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}
        >
          <AssignmentIcon />
          <h3>Dados da Forma de Pagamento</h3>
        </div>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <TextField
                variant="outlined"
                label="Nome"
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
            <Grid item xs={3}>
              <TextField
                variant="outlined"
                label="Número Máximo de Parcelas"
                fullWidth
                type="text"
                value={formik.values.numeroMaximoParcelas}
                name="numeroMaximoParcelas"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.numeroMaximoParcelas && Boolean(formik.errors.numeroMaximoParcelas)}
                helperText={formik.touched.numeroMaximoParcelas && formik.errors.numeroMaximoParcelas}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                variant="outlined"
                label="Intervalor de Parcelas"
                fullWidth
                type="text"
                value={formik.values.intervaloParcelas}
                name="intervaloParcelas"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.intervaloParcelas && Boolean(formik.errors.intervaloParcelas)}
                helperText={formik.touched.intervaloParcelas && formik.errors.intervaloParcelas}
              />
            </Grid>
            <Grid item xs={3}>
              <FormControl variant="outlined" fullWidth name="conta_bancaria_id">
                <InputLabel>Conta Bancária *</InputLabel>
                <Select
                  className={"input-select"}
                  label="Conta Bancária *"
                  name="conta_bancaria_id"
                  value={formik.values.conta_bancaria_id}
                  onChange={handleOnChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.conta_bancaria_id && Boolean(formik.errors.conta_bancaria_id)}
                >
                  <MenuItem value={null}> Nenhum</MenuItem>
                  {contasBancarias &&
                    contasBancarias.map((conta) => {
                      return <MenuItem value={conta.id} key={conta.id}>{conta.nome}</MenuItem>
                    })}
                </Select>
                {formik.touched.conta_bancaria_id && Boolean(formik.errors.conta_bancaria_id)
                  ? <FormHelperText>{formik.errors.conta_bancaria_id}</FormHelperText>
                  : ''
                }
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

export default CadastrarFormasPagamentosPage;
