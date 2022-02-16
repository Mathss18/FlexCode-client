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
  Tooltip,
} from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import HelpIcon from '@mui/icons-material/Help';
import InputMask from "react-input-mask";
import AssignmentIcon from "@material-ui/icons/Assignment";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import FormHelperText from '@mui/material/FormHelperText';
import api from "../../../services/api";
import {
  confirmAlert,
  errorAlert,
  infoAlert,
  successAlert,
} from "../../../utils/alert";
import buscarCep from "../../../services/buscarCep";
import { clienteValidation } from "../../../validators/validationSchema";
import { useFormik } from "formik";
import { useFullScreenLoader } from "../../../context/FullScreenLoaderContext";

const initialValues = {
  tipoCliente: "",
  situacao: "",
  tipoContribuinte: "",
  inscricaoEstadual: "",
  nome: "",
  cpfCnpj: "",
  email: "",
  contato: "",
  rua: "",
  cidade: "",
  numero: "",
  cep: "",
  bairro: "",
  estado: "",
  telefone: "",
  celular: "",
  codigoMunicipio: "",
};

function EditarClientePage() {
  const history = useHistory();
  const { id } = useParams();
  const fullScreenLoader = useFullScreenLoader();

  useEffect(() => {
    fullScreenLoader.setLoading(true);
    api
      .get("/clientes/" + id)
      .then((response) => {
        formik.setValues(response.data.data);
      })
      .catch((error) => {
        infoAlert("Atenção", error.response.data.message);
      })
      .finally(() => {
        fullScreenLoader.setLoading(false);
      });
  }, []);

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: (event) => { handleOnSubmit(event) },
    validationSchema: clienteValidation,
  })

  function handleCepChange() {
    const cep = formik.values.cep;
    const validacep = /^[0-9]{8}$/;
    if (validacep.test(cep.replace(/\D/g, ""))) {
      buscarCep(formik.values.cep.replace(/\D/g, ""))
      .then((response) => {
        formik.setValues({
          ...formik.values,
          rua: response.logradouro,
          estado: response.uf,
          bairro: response.bairro,
          cidade: response.localidade,
          codigoMunicipio: response.ibge,
        });
      });
    } else {
      infoAlert("Atenção!", "CEP inválido");
    }
  }

  function handleOnSubmit(values) {
    fullScreenLoader.setLoading(true);
    api
      .put("/clientes/" + id, values)
      .then((response) => {
        successAlert("Sucesso", "Cliente Editado", () =>
          history.push("/clientes")
        );
      })
      .catch((error) => {
        infoAlert("Atenção", error.response.data.message);
      })
      .finally(() => {
        fullScreenLoader.setLoading(false);
      });
  }

  function handleDelete() {
    confirmAlert("Tem certeza?", "Isso será irreversivel", () => {
      deletarCliente();
    });
  }

  function deletarCliente() {
    api
      .delete("/clientes/" + id)
      .then((result) => {
        successAlert("Sucesso", "Cliente Excluido", () =>
          history.push("/clientes")
        );
      })
      .catch((error) => {
        infoAlert("Atenção", error.response.data.message);
      });
  }

  return (
    <>
      <Divider />
      <div
        style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}
      >
        <AssignmentIcon />
        <h3>Dados Pessoais</h3>
      </div>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <FormControl variant="outlined" fullWidth name="tipoCliente">
              <InputLabel>Tipo de Cliente</InputLabel>
              <Select
                className={"input-select"}
                label="Tipo de Cliente"
                name="tipoCliente"
                value={formik.values.tipoCliente}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.tipoCliente && Boolean(formik.errors.tipoCliente)}

              >
                <MenuItem value={"pf"}>Pessoa Física</MenuItem>
                <MenuItem value={"pj"}>Pessoa Jurídica</MenuItem>
              </Select>
              {formik.touched.tipoCliente && Boolean(formik.errors.tipoCliente)
                ? <FormHelperText>{formik.errors.tipoCliente}</FormHelperText>
                : ''
              }

            </FormControl>
          </Grid>

          <Grid item xs={3}>
            <FormControl variant="outlined" fullWidth name="situacao">
              <InputLabel>Situação</InputLabel>
              <Select
                className={"input-select"}
                label="Situação"
                value=""
                name="situacao"
                value={formik.values.situacao}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.situacao && Boolean(formik.errors.situacao)}
              >
                <MenuItem value={1}>Ativo</MenuItem>
                <MenuItem value={0}>Inativo</MenuItem>
              </Select>
              {formik.touched.situacao && Boolean(formik.errors.situacao)
                ? <FormHelperText>{formik.errors.situacao}</FormHelperText>
                : ''
              }
            </FormControl>
          </Grid>

          <Grid item xs={3}>
            <FormControl
              variant="outlined"
              fullWidth
              name="tipoContribuinte"
            >
              <InputLabel>Tipo de contribuinte</InputLabel>
              <Select
                className={"input-select"}
                label="Tipo de contribuinte"
                name="tipoContribuinte"
                value={formik.values.tipoContribuinte}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.tipoContribuinte && Boolean(formik.errors.tipoContribuinte)}
              >
                <MenuItem value={1}>Contribuinte ICMS</MenuItem>
                <MenuItem value={2}>Contribuinte ISENTO</MenuItem>
                <MenuItem value={9}>Não Contribuinte</MenuItem>
              </Select>
              {formik.touched.tipoContribuinte && Boolean(formik.errors.tipoContribuinte)
                ? <FormHelperText>{formik.errors.tipoContribuinte}</FormHelperText>
                : ''
              }
            </FormControl>
          </Grid>

          <Grid item xs={3}>
            <TextField
              variant="outlined"
              fullWidth
              label="Inscrição Estadual"
              value={formik.values.inscricaoEstadual}
              name="inscricaoEstadual"
              InputProps={{
                endAdornment:
                  <Tooltip
                    title="Digite ISENTO caso não haja Inscrição Estadual">
                    <HelpIcon />
                  </Tooltip>
              }}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.inscricaoEstadual && Boolean(formik.errors.inscricaoEstadual)}
              helperText={formik.touched.inscricaoEstadual && formik.errors.inscricaoEstadual}
            />
          </Grid>

          <Grid item xs={3}>
            <TextField
              variant="outlined"
              label="Nome/Razão social"
              fullWidth
              value={formik.values.nome}
              name="nome"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.nome && Boolean(formik.errors.nome)}
              helperText={formik.touched.nome && formik.errors.nome}
            />
          </Grid>

          <Grid item xs={3}>
            <InputMask
              mask={"999.999.999-99"}
              value={formik.values.cpfCnpj}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}

            >
              {() => (
                <TextField
                  variant="outlined"
                  label="CPF/CNPJ"
                  fullWidth
                  name="cpfCnpj"
                  error={formik.touched.cpfCnpj && Boolean(formik.errors.cpfCnpj)}
                  helperText={formik.touched.cpfCnpj && formik.errors.cpfCnpj}
                />
              )}
            </InputMask>
          </Grid>

          <Grid item xs={3}>
            <TextField
              variant="outlined"
              label="Email"
              fullWidth
              value={formik.values.email}
              name="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
          </Grid>

          <Grid item xs={3}>
            <TextField
              variant="outlined"
              label="Contato"
              fullWidth
              value={formik.values.contato}
              name="contato"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.contato && Boolean(formik.errors.contato)}
              helperText={formik.touched.contato && formik.errors.contato}
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
          <LocationOnIcon />
          <h3>Endereço</h3>
        </div>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <TextField
              variant="outlined"
              label="CEP"
              fullWidth
              value={formik.values.cep}
              name="cep"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.cep && Boolean(formik.errors.cep)}
              helperText={formik.touched.cep && formik.errors.cep}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              variant="outlined"
              label="Rua"
              fullWidth
              value={formik.values.rua}
              name="rua"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.rua && Boolean(formik.errors.rua)}
              helperText={formik.touched.rua && formik.errors.rua}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              variant="outlined"
              label="Número"
              fullWidth
              value={formik.values.numero}
              name="numero"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.numero && Boolean(formik.errors.numero)}
              helperText={formik.touched.numero && formik.errors.numero}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              variant="outlined"
              label="Cidade"
              fullWidth
              value={formik.values.cidade}
              name="cidade"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.cidade && Boolean(formik.errors.cidade)}
              helperText={formik.touched.cidade && formik.errors.cidade}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              variant="outlined"
              label="Bairro"
              fullWidth
              value={formik.values.bairro}
              name="bairro"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.bairro && Boolean(formik.errors.bairro)}
              helperText={formik.touched.bairro && formik.errors.bairro}
            />
          </Grid>
          <Grid item xs={3}>
            <FormControl variant="outlined" fullWidth>
              <InputLabel>Estado</InputLabel>
              <Select
                className={"input-select"}
                label="Estado"
                name="estado"
                value={formik.values.estado}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.estado && Boolean(formik.errors.estado)}
              >
                <MenuItem value={"AC"}>Acre</MenuItem>
                <MenuItem value={"AL"}>Alagoas</MenuItem>
                <MenuItem value={"AP"}>Amapá</MenuItem>
                <MenuItem value={"AM"}>Amazonas</MenuItem>
                <MenuItem value={"BA"}>Bahia</MenuItem>
                <MenuItem value={"CE"}>Ceará</MenuItem>
                <MenuItem value={"DF"}>Distrito Federal</MenuItem>
                <MenuItem value={"ES"}>Espírito Santo</MenuItem>
                <MenuItem value={"GO"}>Goiás</MenuItem>
                <MenuItem value={"MA"}>Maranhão</MenuItem>
                <MenuItem value={"MT"}>Mato Grosso</MenuItem>
                <MenuItem value={"MS"}>Mato Grosso do Sul</MenuItem>
                <MenuItem value={"MG"}>Minas Gerais</MenuItem>
                <MenuItem value={"PA"}>Pará</MenuItem>
                <MenuItem value={"PB"}>Paraíba</MenuItem>
                <MenuItem value={"PR"}>Paraná</MenuItem>
                <MenuItem value={"PE"}>Pernambuco</MenuItem>
                <MenuItem value={"PI"}>Piauí</MenuItem>
                <MenuItem value={"RJ"}>Rio de Janeiro</MenuItem>
                <MenuItem value={"RN"}>Rio Grande do Norte</MenuItem>
                <MenuItem value={"RS"}>Rio Grande do Sul</MenuItem>
                <MenuItem value={"RO"}>Rondônia</MenuItem>
                <MenuItem value={"RR"}>Roraima</MenuItem>
                <MenuItem value={"SC"}>Santa Catarina</MenuItem>
                <MenuItem value={"SP"}>São Paulo</MenuItem>
                <MenuItem value={"SE"}>Sergipe</MenuItem>
                <MenuItem value={"TO"}>Tocantins</MenuItem>
              </Select>
              {formik.touched.estado && Boolean(formik.errors.estado)
                ? <FormHelperText>{formik.errors.estado}</FormHelperText>
                : ''
              }
            </FormControl>
          </Grid>
          <Grid item xs={3}>
            <TextField
              variant="outlined"
              label="Telefone"
              fullWidth
              value={formik.values.telefone}
              name="telefone"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.telefone && Boolean(formik.errors.telefone)}
              helperText={formik.touched.telefone && formik.errors.telefone}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              variant="outlined"
              label="Celular"
              fullWidth
              value={formik.values.celular}
              name="celular"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.celular && Boolean(formik.errors.celular)}
              helperText={formik.touched.celular && formik.errors.celular}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              variant="outlined"
              label="Código do Municipio"
              fullWidth
              value={formik.values.codigoMunicipio}
              name="codigoMunicipio"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.codigoMunicipio && Boolean(formik.errors.codigoMunicipio)}
              helperText={formik.touched.codigoMunicipio && formik.errors.codigoMunicipio}
            />
          </Grid>
        </Grid>

        <Grid container spacing={0}>
          <Grid item>
            <Button
              type="submit"
              variant="outlined"
              startIcon={<CheckIcon />}
              className={"btn btn-primary btn-spacing"}
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
            >
              Excluir
            </Button>
          </Grid>
          <Grid item>
            <Button
              onClick={() => history.push("/clientes")}
              variant="outlined"
              startIcon={<CloseIcon />}
              className={"btn btn-error btn-spacing"}
            >
              Cancelar
            </Button>
          </Grid>
        </Grid>
      </form>
    </>
  );
}

export default EditarClientePage;
