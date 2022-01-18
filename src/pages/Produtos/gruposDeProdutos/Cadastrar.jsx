import { useState, useEffect } from "react";
import { Grid, TextField, Select, Divider, Button, MenuItem, FormControl, InputLabel, FormHelperText } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import api from "../../../services/api";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import AssignmentIcon from "@material-ui/icons/Assignment";
import { useFormik } from "formik";
import { grupoProdutoValidation } from "../../../validators/validationSchema";
import { infoAlert, successAlert } from "../../../utils/alert";



const initialValues = {
  nome: "",
  grupoPai: -1,
};

function CadastrarGrupoDeProdutos() {
  const history = useHistory();
  const [grupos, setGrupos] = useState([]);

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: (event) => { handleOnSubmit(event) },
    validationSchema: grupoProdutoValidation,
  })

  useEffect(() => {

    api.get("/grupos-produtos").then(res => {
      setGrupos(res.data.data);
    }).catch(err => {
      console.log('Erro:' + err);
    });

  }, [])

  function handleOnSubmit(values) {
    console.log(values);

    api.post("/grupo-produto", values).then((response) => {
      successAlert("Sucesso", "Grupo de Produto Cadastrado", () =>
        history.push("/grupos-produtos")
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
        <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
          <AssignmentIcon />
          <h3>Dados do Grupo de Produto</h3>
        </div>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                variant="outlined"
                label="Nome do Grupo"
                fullWidth type="text"
                name="nome"
                value={formik.values.nome}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.nome && Boolean(formik.errors.nome)}
                helperText={formik.touched.nome && formik.errors.nome} />
            </Grid>
            <Grid item xs={6}>
              <FormControl variant="outlined" fullWidth className={'input-select'}>
                <InputLabel id="label-grupo-pai">Grupo Pai</InputLabel>
                <Select
                  className={'input-select'}
                  label="Grupo pai"
                  name="grupoPai"
                  value={formik.values.grupoPai}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.grupoPai && Boolean(formik.errors.grupoPai)} >

                  <MenuItem value={-1}>
                    Nenhum
                  </MenuItem>
                  {grupos &&
                    grupos.map((grupo) => {
                      return <MenuItem value={grupo.id} key={grupo.id}>{grupo.nome}</MenuItem>
                    })}
                </Select>
                {formik.touched.grupoPai && Boolean(formik.errors.grupoPai)
                  ? <FormHelperText>{formik.errors.grupoPai}</FormHelperText>
                  : ''
                }
              </FormControl>
            </Grid>
          </Grid>
          <br />
          <Divider />

          <Grid container spacing={0}>
            <Grid item>
              <Button type="submit" variant="outlined" startIcon={<CheckIcon />} className={'btn btn-primary btn-spacing'}>
                Salvar
              </Button>
            </Grid>
            <Grid item>
              <Button onClick={() => history.push("/grupos-produtos")} variant="outlined" startIcon={<CloseIcon />} className={'btn btn-error btn-spacing'}>
                Cancelar
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
    </>
  );
}

export default CadastrarGrupoDeProdutos;
