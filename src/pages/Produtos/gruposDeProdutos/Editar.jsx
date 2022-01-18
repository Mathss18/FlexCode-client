import { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Grid, TextField, Select, MenuItem, FormControl, InputLabel, Divider, Button, FormHelperText } from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import AssignmentIcon from "@material-ui/icons/Assignment";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import api from "../../../services/api";
import { grupoProdutoValidation } from "../../../validators/validationSchema";
import { useFormik } from "formik";
import { confirmAlert, infoAlert, successAlert } from "../../../utils/alert";



const initialValues = {
  nome: "",
  grupoPai: -1,
};

function EditarGruposDeProdutos() {
  const history = useHistory();
  const [grupos, setGrupos] = useState([]);
  const { id } = useParams();

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: (event) => { handleOnSubmit(event) },
    validationSchema: grupoProdutoValidation,
  })
  

  useEffect(() => {

    api.get("/grupos-produtos")
      .then(response => {
        setGrupos(response.data["data"]);
      }).catch(error => {
        console.log('Erro:' + error);
      });

    api.get("/grupo-produto/" + id)
      .then((response) => {
        formik.setValues(response.data["data"]);
      })
      .catch((error) => {
        console.log("Erro:" + error);
      });

      console.log(grupos);

  }, []);




  function handleOnSubmit(values) {
    api
      .put("/grupo-produto/" + id, values)
      .then((response) => {
        successAlert("Sucesso", "Grupo de Produto Editado", () =>
          history.push("/grupos-produtos")
        );
      })
      .catch((error) => {
        infoAlert("Atenção", error.response.data.message);
      });
  }

  function handleDelete() {
    let gruposDependentes = grupos.filter((item) => item.grupoPai == id);
    let info = gruposDependentes.length > 0 ? '\r\n Os seguintes ficarão sem grupo Pai:\r\n' : '';

    confirmAlert("Tem certeza?"+info, gruposDependentes.map(element => ' '+element.nome), () => {
      deletarGrupoProduto();
    });
  }

  function deletarGrupoProduto() {
    api
      .delete("/grupo-produto/" + id)
      .then((result) => {
        successAlert("Sucesso", "Grupo de Produto Excluido", () =>
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
              <Button
                variant="outlined"
                startIcon={<DeleteForeverIcon />}
                className={"btn btn-error btn-spacing"}
                onClick={handleDelete}
              >
                Excluir
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

export default EditarGruposDeProdutos;
