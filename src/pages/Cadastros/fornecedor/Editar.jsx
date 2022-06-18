import { useEffect } from "react";
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
import api from "../../../services/api";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import HelpIcon from "@mui/icons-material/Help";
import AssignmentIcon from "@material-ui/icons/Assignment";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import FormHelperText from "@mui/material/FormHelperText";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import buscarCep from "../../../services/cep";
import InputMask from "react-input-mask";
import {
  confirmAlert,
  infoAlert,
  successAlert,
  errorAlert,
} from "../../../utils/alert";
import { fornecedorValidation } from "../../../validators/validationSchema";
import { useFormik } from "formik";
import { useFullScreenLoader } from "../../../context/FullScreenLoaderContext";

const initialValues = {
  tipoFornecedor: "",
  situacao: "",
  tipoContribuinte: "",
  inscricaoEstadual: "",
  nome: "",
  cpfCnpj: "",
  email: "",
  emailDocumento: "",
  observacao: "",
  contato: "",
  rua: "",
  cidade: "",
  numero: "",
  cep: "",
  bairro: "",
  estado: "",
  complemento: "",
  telefone: "",
  celular: "",
  codigoMunicipio: "",
};

function EditarFornecedorPage() {
  const history = useHistory();
  const { id } = useParams();
  const fullScreenLoader = useFullScreenLoader();
  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: (event) => {
      handleOnSubmit(event);
    },
    validationSchema: fornecedorValidation,
  });

  useEffect(() => {
    fullScreenLoader.setLoading(true);
    api
      .get("/fornecedores/" + id)
      .then((response) => {
        formik.setValues(response.data["data"]);
      })
      .finally(() => {
        fullScreenLoader.setLoading(false);
      });
  }, []);

  function handleCepChange() {
    const cep = formik.values.cep;
    const validacep = /^[0-9]{8}$/;
    if (validacep.test(cep.replace(/\D/g, ""))) {
      buscarCep(formik.values.cep.replace(/\D/g, "")).then((response) => {
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
    // Removendo máscaras antes de enviar dados para API
    try {
      values.cep = values.cep.replace(/[^\d]/g, "");
      values.cpfCnpj = values.cpfCnpj.replace(/[^\d]/g, "");
      values.telefone = values.telefone.replace(/[^\d]/g, "");
      values.celular = values.celular.replace(/[^\d]/g, "");
    } catch (error) {}

    api
      .put("/fornecedores/" + id, values)
      .then((response) => {
        history.push("/fornecedores");
        successAlert("Sucesso", "Fornecedor Editado");
      })
      .catch((error) => {
        infoAlert("Atenção", error.response.request.responseText);
      })
      .finally(() => {
        formik.setSubmitting(false);
      });
  }

  function handleDelete() {
    confirmAlert("Tem certeza?", "Isso será irreversivel", () => {
      deletarFornecedor();
    });
  }

  function deletarFornecedor() {
    api
      .delete("/fornecedores/" + id)
      .then((result) => {
        history.push("/fornecedores");
        successAlert("Sucesso", "Fornecedor Excluido");
      })
      .catch((error) => {
        errorAlert("Atenção", error?.response?.data?.message);
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
          <h3>Dados Pessoais</h3>
        </div>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <FormControl variant="outlined" fullWidth name="tipoFornecedor">
                <InputLabel>Tipo de Fornecedor</InputLabel>
                <Select
                  className={"input-select"}
                  label="Tipo de Fornecedor"
                  name="tipoFornecedor"
                  value={formik.values.tipoFornecedor}
                  onChange={(e) => {
                    formik.handleChange(e);
                    formik.setFieldValue("cpfCnpj", "");
                  }}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.tipoFornecedor &&
                    Boolean(formik.errors.tipoFornecedor)
                  }
                >
                  <MenuItem value={"pf"}>Pessoa Física</MenuItem>
                  <MenuItem value={"pj"}>Pessoa Jurídica</MenuItem>
                </Select>
                {formik.touched.tipoFornecedor &&
                Boolean(formik.errors.tipoFornecedor) ? (
                  <FormHelperText>
                    {formik.errors.tipoFornecedor}
                  </FormHelperText>
                ) : (
                  ""
                )}
              </FormControl>
            </Grid>

            <Grid item xs={3}>
              <FormControl variant="outlined" fullWidth name="situacao">
                <InputLabel>Situação</InputLabel>
                <Select
                  className={"input-select"}
                  label="Situação"
                  name="situacao"
                  value={formik.values.situacao}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.situacao && Boolean(formik.errors.situacao)
                  }
                >
                  <MenuItem value={1}>Ativo</MenuItem>
                  <MenuItem value={0}>Inativo</MenuItem>
                </Select>
                {formik.touched.situacao && Boolean(formik.errors.situacao) ? (
                  <FormHelperText>{formik.errors.situacao}</FormHelperText>
                ) : (
                  ""
                )}
              </FormControl>
            </Grid>

            <Grid item xs={3}>
              <FormControl variant="outlined" fullWidth name="tipoContribuinte">
                <InputLabel>Tipo de contribuinte</InputLabel>
                <Select
                  className={"input-select"}
                  label="Tipo de contribuinte"
                  name="tipoContribuinte"
                  value={formik.values.tipoContribuinte}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.tipoContribuinte &&
                    Boolean(formik.errors.tipoContribuinte)
                  }
                >
                  <MenuItem value={1}>Contribuinte ICMS</MenuItem>
                  <MenuItem value={2}>Contribuinte ISENTO</MenuItem>
                  <MenuItem value={9}>Não Contribuinte</MenuItem>
                </Select>
                {formik.touched.tipoContribuinte &&
                Boolean(formik.errors.tipoContribuinte) ? (
                  <FormHelperText>
                    {formik.errors.tipoContribuinte}
                  </FormHelperText>
                ) : (
                  ""
                )}
              </FormControl>
            </Grid>

            <Grid item xs={3}>
              <TextField
                variant="outlined"
                fullWidth
                label="Inscrição Estadual"
                value={formik.values.inscricaoEstadual}
                name="inscricaoEstadual"
                InputProps={
                  {
                    // endAdornment: (
                    //   <Tooltip title="Digite ISENTO caso não haja Inscrição Estadual">
                    //     <HelpIcon />
                    //   </Tooltip>
                    // ),
                  }
                }
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.inscricaoEstadual &&
                  Boolean(formik.errors.inscricaoEstadual)
                }
                helperText={
                  formik.touched.inscricaoEstadual &&
                  formik.errors.inscricaoEstadual
                }
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
                mask={
                  formik.values.tipoFornecedor === "pf"
                    ? "999.999.999-99"
                    : "99.999.999/9999-99"
                }
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
                    error={
                      formik.touched.cpfCnpj && Boolean(formik.errors.cpfCnpj)
                    }
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
                label="Email Documentos"
                fullWidth
                placeholder="Separar emails por vírgula"
                value={formik.values.emailDocumento}
                name="emailDocumento"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.emailDocumento &&
                  Boolean(formik.errors.emailDocumento)
                }
                helperText={
                  formik.touched.emailDocumento && formik.errors.emailDocumento
                }
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

            <Grid item xs={6}>
              <TextField
                variant="outlined"
                label="Observação"
                fullWidth
                value={formik.values.observacao}
                name="observacao"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.observacao && Boolean(formik.errors.observacao)}
                helperText={formik.touched.observacao && formik.errors.observacao}
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
              <InputMask
                mask={"99999-999"}
                value={formik.values.cep}
                onChange={formik.handleChange}
                onBlur={handleCepChange}
              >
                {() => (
                  <TextField
                    variant="outlined"
                    label="Cep"
                    fullWidth
                    name="cep"
                    error={formik.touched.cep && Boolean(formik.errors.cep)}
                    helperText={formik.touched.cep && formik.errors.cep}
                  />
                )}
              </InputMask>
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
                {formik.touched.estado && Boolean(formik.errors.estado) ? (
                  <FormHelperText>{formik.errors.estado}</FormHelperText>
                ) : (
                  ""
                )}
              </FormControl>
            </Grid>
            <Grid item xs={3}>
              <InputMask
                mask={"(99) 9999-9999"}
                value={formik.values.telefone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                {() => (
                  <TextField
                    variant="outlined"
                    label="Telefone"
                    fullWidth
                    name="telefone"
                    error={
                      formik.touched.telefone && Boolean(formik.errors.telefone)
                    }
                    helperText={
                      formik.touched.telefone && formik.errors.telefone
                    }
                  />
                )}
              </InputMask>
            </Grid>
            <Grid item xs={3}>
              <InputMask
                mask={"(99) 9 9999-9999"}
                value={formik.values.celular}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                {() => (
                  <TextField
                    variant="outlined"
                    label="Celular"
                    fullWidth
                    name="celular"
                    error={
                      formik.touched.celular && Boolean(formik.errors.celular)
                    }
                    helperText={formik.touched.celular && formik.errors.celular}
                  />
                )}
              </InputMask>
            </Grid>

            <Grid item xs={3}>
              <TextField
                variant="outlined"
                label="Complemento"
                fullWidth
                value={formik.values.complemento}
                name="complemento"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.complemento &&
                  Boolean(formik.errors.complemento)
                }
                helperText={
                  formik.touched.complemento &&
                  formik.errors.complemento
                }
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
                error={
                  formik.touched.codigoMunicipio &&
                  Boolean(formik.errors.codigoMunicipio)
                }
                helperText={
                  formik.touched.codigoMunicipio &&
                  formik.errors.codigoMunicipio
                }
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
                disabled={formik.isSubmitting}
                onClick={handleDelete}
              >
                Excluir
              </Button>
            </Grid>
            <Grid item>
              <Button
                onClick={() => history.push("/fornecedores")}
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

export default EditarFornecedorPage;
