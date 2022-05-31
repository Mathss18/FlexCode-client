import {
  Grid,
  TextField,
  FormControl,
  Divider,
  Button,
  FormControlLabel,
  FormGroup,
  Switch,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  List,
} from "@material-ui/core";
import { TimePicker } from "@material-ui/pickers";
import { useHistory, useParams } from "react-router-dom";
import api from "../../../services/api";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import AssignmentIcon from "@material-ui/icons/Assignment";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import SettingsIcon from "@mui/icons-material/Settings";
import moment from "moment";
import "moment/locale/pt-br";
import { grupoValidation } from "../../../validators/validationSchema";
import { useFormik } from "formik";
import { confirmAlert, errorAlert, infoAlert, successAlert } from "../../../utils/alert";
import { useFullScreenLoader } from "../../../context/FullScreenLoaderContext";
import { menu } from "../../../constants/menu";
import { useEffect } from "react";

const initialValues = {
  nome: "",
  segunda: false,
  terca: false,
  quarta: false,
  quinta: false,
  sexta: false,
  sabado: false,
  domingo: false,

  horaInicio: "07:00:00",
  horaFim: "17:00:00",

  acessos: [],
};

menu.map((item) => {
  if (!item.collapse) {
    initialValues.acessos.push({
      path: item.path,
      situacao: false,
    });
  } else {
    item.children.map((child, i) => {
      initialValues.acessos.push({
        path: child.path,
        situacao: false,
      });
    });
  }
});

function EditarGrupoPage() {
  const history = useHistory();
  const fullScreenLoader = useFullScreenLoader();
  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: (event) => {
      handleOnSubmit(event);
    },
    validationSchema: grupoValidation,
  });
  const { id } = useParams();

  useEffect(() => {
    fullScreenLoader.setLoading(true);
    api
      .get("/grupos/" + id)
      .then((response) => {
        formik.setValues({
          ...formik.values,
          nome: response.data["data"].nome,
          horaInicio: response.data["data"].horaInicio,
          horaFim: response.data["data"].horaFim,

          segunda: response.data["data"].segunda,
          terca: response.data["data"].terca,
          quarta: response.data["data"].quarta,
          quinta: response.data["data"].quinta,
          sexta: response.data["data"].sexta,
          sabado: response.data["data"].sabado,
          domingo: response.data["data"].domingo,

          acessos: JSON.parse(response.data["data"].acessos)
        });

        console.log("[RESPONSE]", formik.values);
      })
      .finally(() => {
        fullScreenLoader.setLoading(false);
      });
  }, []);

  const handleOnChange = (name) => {
    var acessos = formik.values.acessos.map((item, i) => {
      if (item.path === name) {
        item.situacao = !item.situacao;
      }
      return item;
    });
    console.log(formik.values);
    formik.setFieldValue("acessos", acessos);
  };

  function handleOnSubmit(values) {
    const params = {
      ...formik.values,
      acessos: JSON.stringify(formik.values.acessos)
    }

    api
      .put("/grupos/"+id, params)
      .then((response) => {
        history.push("/grupos");
        successAlert("Sucesso", "Grupo Cadastrado");
      })
      .catch((error) => {
        errorAlert("Atenção", error?.response?.data?.message);
      })
      .finally(() => {
        formik.setSubmitting(false);
      });
  }

  function handleDelete() {
    confirmAlert("Tem certeza?", "Isso será irreversivel", () => {
      deletarGrupo();
    });
  }

  function deletarGrupo() {
    api
      .delete("/grupos/" + id)
      .then((result) => {
        history.push("/grupos")
        successAlert("Sucesso", "Grupo Excluido");
      })
      .catch((error) => {
        errorAlert("Atenção", error?.response?.data?.message);
      });
  }

  const setHoraInicio = (e) => {
    formik.setValues({
      ...formik.values,
      horaInicio: new Date(e._d).toLocaleTimeString(),
    });
    console.log(formik.values);
  };

  const setHoraFim = (e) => {
    formik.setValues({
      ...formik.values,
      horaFim: new Date(e._d).toLocaleTimeString(),
    });
    console.log(formik.values);
  };

  return (
    <>
      <div>
        <Divider />
        <div
          style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}
        >
          <AssignmentIcon />
          <h3>Dados do Grupo</h3>
        </div>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                variant="outlined"
                label="Nome do Grupo"
                fullWidth
                type="text"
                name="nome"
                value={formik.values.nome}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.nome && Boolean(formik.errors.nome)}
                helperText={formik.touched.nome && formik.errors.nome}
              />
            </Grid>
            <Grid item xs={3}>
              <TimePicker
                clearable={false}
                ampm={false}
                fullWidth
                inputVariant="outlined"
                minutesStep={5}
                label="Hora ínicio"
                value={moment(formik.values.horaInicio, "hh:mm:ss")}
                onAccept={setHoraInicio}
                onChange={setHoraInicio}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.horaInicio && Boolean(formik.errors.horaInicio)
                }
                helperText={
                  formik.touched.horaInicio && formik.errors.horaInicio
                }
              />
            </Grid>
            <Grid item xs={3}>
              <TimePicker
                clearable={false}
                fullWidth
                inputVariant="outlined"
                ampm={false}
                minutesStep={5}
                label="Hora fim"
                value={moment(formik.values.horaFim, "hh:mm:ss")}
                onAccept={setHoraFim}
                onChange={setHoraFim}
                onBlur={formik.handleBlur}
                error={formik.touched.horaFim && Boolean(formik.errors.horaFim)}
                helperText={formik.touched.horaFim && formik.errors.horaFim}
              />
            </Grid>
          </Grid>
          <br />
          <Divider />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <SettingsIcon />
            <h3>Dias de acesso</h3>
          </div>
          <Grid container spacing={2}>
            <Grid item xs={2}>
              <FormControl component="fieldset" variant="standard">
                <FormGroup style={{ display: "flex" }}>
                  <div style={{ display: "flex" }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formik.values.segunda}
                          onChange={formik.handleChange}
                          name="segunda"
                          type="checkbox"
                        />
                      }
                      labelPlacement="top"
                      label="Segunda"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formik.values.terca}
                          onChange={formik.handleChange}
                          name="terca"
                        />
                      }
                      labelPlacement="top"
                      label="Terça"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formik.values.quarta}
                          onChange={formik.handleChange}
                          name="quarta"
                        />
                      }
                      labelPlacement="top"
                      label="Quarta"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formik.values.quinta}
                          onChange={formik.handleChange}
                          name="quinta"
                        />
                      }
                      labelPlacement="top"
                      label="Quinta"
                    />

                    <FormControlLabel
                      control={
                        <Switch
                          checked={formik.values.sexta}
                          onChange={formik.handleChange}
                          name="sexta"
                        />
                      }
                      labelPlacement="top"
                      label="Sexta"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formik.values.sabado}
                          onChange={formik.handleChange}
                          name="sabado"
                        />
                      }
                      labelPlacement="top"
                      label="Sabádo"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formik.values.domingo}
                          onChange={formik.handleChange}
                          name="domingo"
                        />
                      }
                      labelPlacement="top"
                      label="Domingo"
                    />
                  </div>
                </FormGroup>
              </FormControl>
            </Grid>
          </Grid>
          <Divider />
          <div
            style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}
          >
            <AssignmentIcon />
            <h3>Configurações de acesso</h3>
          </div>
          {menu.map((item, index) => {
            return (
              <div
                style={{
                  boxShadow:
                    "0px 2px 4px -1px rgb(0 0 0 / 20%), 0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%)",
                  marginBottom: 8,
                }}
              >
                <>
                  <ListItem button key={index}>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText
                      className={item.className}
                      primary={item.title}
                    />

                    {(() => {
                      if (!item.collapse) {
                        return (
                          <FormControlLabel
                            control={
                              <Switch
                                checked={
                                  formik.values.acessos.find(
                                    (acesso) => acesso.path === item.path
                                  ).situacao
                                }
                                onChange={(e) => {
                                  handleOnChange(item.path);
                                }}
                                name={item.child}
                                type="checkbox"
                              />
                            }
                          />
                        );
                      }
                    })()}
                  </ListItem>
                  {item.collapse && (
                    <Collapse in={true} timeout="auto" unmountOnExit>
                      {item.children.map((child, i) => {
                        return (
                          <List
                            style={{ marginLeft: 24 }}
                            disablePadding
                            key={index}
                          >
                            <div style={{ display: "flex" }}>
                              <ListItem button>
                                <ListItemIcon>{child.icon}</ListItemIcon>
                                <ListItemText
                                  className={child.className}
                                  primary={child.title}
                                />
                              </ListItem>
                              <FormControlLabel
                                control={
                                  <Switch
                                    checked={
                                      formik.values.acessos.find(
                                        (acesso) => acesso.path === child.path
                                      ).situacao
                                    }
                                    onChange={(e) => {
                                      handleOnChange(child.path);
                                    }}
                                    name={child.path}
                                    type="checkbox"
                                  />
                                }
                              />
                            </div>
                          </List>
                        );
                      })}
                    </Collapse>
                  )}
                </>
              </div>
            );
          })}
          <br />
          <Divider />
          <br />
          <Grid container spacing={2}></Grid>

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
                onClick={handleDelete}
                disabled={formik.isSubmitting}
              >
                Excluir
              </Button>
            </Grid>
            <Grid item>
              <Button
                onClick={() => history.push("/grupos")}
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

export default EditarGrupoPage;
