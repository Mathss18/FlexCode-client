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
import { useHistory, useParams } from "react-router-dom";
import api from "../../services/api";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import HelpIcon from "@mui/icons-material/Help";
import AssignmentIcon from "@material-ui/icons/Assignment";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import FormHelperText from "@mui/material/FormHelperText";
import buscarCep from "../../services/cep";
import InputMask from "react-input-mask";
import { infoAlert, successAlert, errorAlert } from "../../utils/alert";
import { useFormik } from "formik";
import DragAndDrop from "../../components/dragdrop/DragAndDrop";
import { useEffect, useState } from "react";
import { useFullScreenLoader } from "../../context/FullScreenLoaderContext";
import LockOpenIcon from "@mui/icons-material/LockOpen";

const initialValues = {
  nome: "",
  nomeFantasia: "",
  logo: "",
  certificadoDigital: "",
  senhaCertificadoDigital: "",
  inscricaoEstadual: "",
  crt: "1",
  cpfCnpj: "",
  rua: "",
  numero: "",
  bairro: "",
  codigoMunicipio: "",
  cidade: "",
  estado: "",
  cep: "",
  telefone: "",
  email: "",
  emailNfe: "",
  celular: "",
  tipoEmpresa: "pj",
  nNF: "",
  serie: "",
  ambienteNfe: "1",
  aliquota: 0,
  proxyIp: "",
  proxyPort: "",
  proxyUser: "",
  proxyPass: "",
  servidorSmtp: "",
  portaSmtp: "",
  encryptionSmtp: "",
  // emailSmtp:'',
  usuarioSmtp: "",
  senhaSmtp: "",
  quantidadeCasasDecimaisValor: 2,
  quantidadeCasasDecimaisQuantidade: 2,
  registrosPorPagina: 10,
  situacao: "1",
};

function EditarConfiguracaoPage() {
  const history = useHistory();
  const { id } = useParams();
  const [logo, setLogo] = useState([]);
  const [certificadoDigital, setCertificadoDigital] = useState([]);
  const fullScreenLoader = useFullScreenLoader();
  const [locked, setLocked] = useState(true);

  useEffect(() => {
    fullScreenLoader.setLoading(true);
    api
      .get("configuracoes/" + id)
      .then((response) => {
        if (response.data["data"]?.logo) {
          setLogo([
            {
              url: response.data["data"]?.logo,
              nome: "logo",
              tamanho: 0,
            },
          ]);
        }

        if (response.data["data"]?.certificadoDigital) {
          setCertificadoDigital([
            {
              url: response.data["data"]?.certificadoDigital,
              nome: "certificadoDigital",
              tamanho: 0,
            },
          ]);
        }

        formik.setValues(response.data["data"]);
      })
      .catch((error) => {
        errorAlert("Atenção", error?.response?.data?.message);
      })
      .finally(() => {
        fullScreenLoader.setLoading(false);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: (event) => {
      handleOnSubmit(event);
    },
    // validationSchema: clienteValidation,
  });

  const commonProps = locked ? { disabled: true } : {};

  function handleUnlock() {
    const input = window.prompt("Digite a senha para desbloquear edição:");
    if (input === "88121747Ma1@") {
      setLocked(false);
      successAlert("Desbloqueado", "Edição liberada.");
    } else if (input !== null) {
      errorAlert("Senha inválida", "Não foi possível desbloquear.");
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

    const params = {
      ...values,
      logo: logo[0],
      certificadoDigital: certificadoDigital[0],
    };
    console.log(params);

    api
      .put("/configuracoes/" + id, params)
      .then((response) => {
        history.push("/configuracoes");
        infoAlert(
          "Sucesso",
          "É nessesário relogar no sistema para que as alterações tenham efeito."
        );
      })
      .catch((error) => {
        errorAlert("Atenção", error?.response?.data?.message);
      })
      .finally(() => {
        formik.setSubmitting(false);
      });
  }

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

  return (
    <>
      <div>
        <Divider />
        <div
          style={{ display: "flex", alignItems: "center", flexWrap: "wrap", justifyContent: "space-between" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <AssignmentIcon />
            <h3 style={{ margin: 0 }}>Dados da Configuração</h3>
          </div>
          {locked ? (
            <Tooltip title="Desbloqueia todos os campos (exceto alíquota, que já está liberada)">
              <Button
                onClick={handleUnlock}
                variant="outlined"
                startIcon={<LockOpenIcon />}
                className={"btn btn-primary btn-spacing"}
              >
                Desbloquear edição
              </Button>
            </Tooltip>
          ) : (
            <div style={{ display: "flex", alignItems: "center", color: "#2e7d32", gap: 6 }}>
              <LockOpenIcon /> Edição liberada
            </div>
          )}
        </div>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <FormControl variant="outlined" fullWidth name="tipoEmpresa">
                <InputLabel>Tipo de Empresa *</InputLabel>
                <Select
                  className={"input-select"}
                  label="Tipo de Empresa "
                  name="tipoEmpresa"
                  value={formik.values.tipoEmpresa}
                  onChange={(e) => {
                    formik.handleChange(e);
                    formik.setFieldValue("cpfCnpj", "");
                  }}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.tipoEmpresa &&
                    Boolean(formik.errors.tipoEmpresa)
                  }
                  {...commonProps}
                >
                  <MenuItem value={"pf"}>Pessoa Física</MenuItem>
                  <MenuItem value={"pj"}>Pessoa Jurídica</MenuItem>
                </Select>
                {formik.touched.tipoEmpresa &&
                Boolean(formik.errors.tipoEmpresa) ? (
                  <FormHelperText>{formik.errors.tipoEmpresa}</FormHelperText>
                ) : (
                  ""
                )}
              </FormControl>
            </Grid>

            <Grid item xs={3}>
              <FormControl variant="outlined" fullWidth name="situacao">
                <InputLabel>Situação *</InputLabel>
                <Select
                  className={"input-select"}
                  label="Situação *"
                  name="situacao"
                  value={formik.values.situacao}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.situacao && Boolean(formik.errors.situacao)
                  }
                  {...commonProps}
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
              <FormControl variant="outlined" fullWidth name="crt">
                <InputLabel>Regime Tributário *</InputLabel>
                <Select
                  className={"input-select"}
                  label="Regime Tributário *"
                  name="crt"
                  value={formik.values.crt}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.crt && Boolean(formik.errors.crt)}
                  {...commonProps}
                >
                  <MenuItem value={1}>Simples Nacional</MenuItem>
                  <MenuItem disabled value={2}>
                    Simples Nacional, excesso sublimite de receita bruta
                  </MenuItem>
                  <MenuItem disabled value={3}>
                    Regime Normal
                  </MenuItem>
                </Select>
                {formik.touched.crt && Boolean(formik.errors.crt) ? (
                  <FormHelperText>{formik.errors.crt}</FormHelperText>
                ) : (
                  ""
                )}
              </FormControl>
            </Grid>

            <Grid item xs={3}>
              <TextField
                variant="outlined"
                fullWidth
                label="Inscrição Estadual *"
                value={formik.values.inscricaoEstadual}
                name="inscricaoEstadual"
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
                {...commonProps}
              />
            </Grid>

            <Grid item xs={3}>
              <TextField
                variant="outlined"
                label="Nome/Razão social *"
                fullWidth
                value={formik.values.nome}
                name="nome"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.nome && Boolean(formik.errors.nome)}
                helperText={formik.touched.nome && formik.errors.nome}
                {...commonProps}
              />
            </Grid>

            <Grid item xs={3}>
              <TextField
                variant="outlined"
                label="Nome Fantasia"
                fullWidth
                value={formik.values.nomeFantasia}
                name="nomeFantasia"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.nomeFantasia &&
                  Boolean(formik.errors.nomeFantasia)
                }
                helperText={
                  formik.touched.nomeFantasia && formik.errors.nomeFantasia
                }
                {...commonProps}
              />
            </Grid>

            <Grid item xs={3}>
              <InputMask
                mask={
                  formik.values.tipoEmpresa === "pf"
                    ? "999.999.999-99"
                    : "99.999.999/9999-99"
                }
                value={formik.values.cpfCnpj}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={locked}
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
                    {...commonProps}
                  />
                )}
              </InputMask>
            </Grid>

            <Grid item xs={3}>
              <TextField
                variant="outlined"
                label="Email *"
                fullWidth
                value={formik.values.email}
                name="email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                {...commonProps}
              />
            </Grid>

            <Grid item xs={3}>
              <TextField
                variant="outlined"
                label="Email NFe *"
                fullWidth
                value={formik.values.emailNfe}
                name="emailNfe"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.emailNfe && Boolean(formik.errors.emailNfe)
                }
                helperText={formik.touched.emailNfe && formik.errors.emailNfe}
                {...commonProps}
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
                disabled={locked}
              >
                {() => (
                  <TextField
                    variant="outlined"
                    label="Cep *"
                    fullWidth
                    name="cep"
                    error={formik.touched.cep && Boolean(formik.errors.cep)}
                    helperText={formik.touched.cep && formik.errors.cep}
                    {...commonProps}
                  />
                )}
              </InputMask>
            </Grid>
            <Grid item xs={3}>
              <TextField
                variant="outlined"
                label="Rua *"
                fullWidth
                value={formik.values.rua}
                name="rua"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.rua && Boolean(formik.errors.rua)}
                helperText={formik.touched.rua && formik.errors.rua}
                {...commonProps}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                variant="outlined"
                label="Número *"
                fullWidth
                value={formik.values.numero}
                name="numero"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.numero && Boolean(formik.errors.numero)}
                helperText={formik.touched.numero && formik.errors.numero}
                {...commonProps}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                variant="outlined"
                label="Cidade *"
                fullWidth
                value={formik.values.cidade}
                name="cidade"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.cidade && Boolean(formik.errors.cidade)}
                helperText={formik.touched.cidade && formik.errors.cidade}
                {...commonProps}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                variant="outlined"
                label="Bairro *"
                fullWidth
                value={formik.values.bairro}
                name="bairro"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.bairro && Boolean(formik.errors.bairro)}
                helperText={formik.touched.bairro && formik.errors.bairro}
                {...commonProps}
              />
            </Grid>
            <Grid item xs={3}>
              <FormControl variant="outlined" fullWidth>
                <InputLabel>Estado *</InputLabel>
                <Select
                  className={"input-select"}
                  label="Estado *"
                  name="estado"
                  value={formik.values.estado}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.estado && Boolean(formik.errors.estado)}
                  {...commonProps}
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
                disabled={locked}
              >
                {() => (
                  <TextField
                    variant="outlined"
                    label="Telefone *"
                    fullWidth
                    name="telefone"
                    error={
                      formik.touched.telefone && Boolean(formik.errors.telefone)
                    }
                    helperText={
                      formik.touched.telefone && formik.errors.telefone
                    }
                    {...commonProps}
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
                disabled={locked}
              >
                {() => (
                  <TextField
                    variant="outlined"
                    label="Celular / WhatsApp *"
                    fullWidth
                    name="celular"
                    error={
                      formik.touched.celular && Boolean(formik.errors.celular)
                    }
                    helperText={formik.touched.celular && formik.errors.celular}
                    {...commonProps}
                  />
                )}
              </InputMask>
            </Grid>
            <Grid item xs={3}>
              <TextField
                variant="outlined"
                label="Código do Municipio *"
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
                {...commonProps}
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
            <AssignmentIcon />
            <h3>Padrões</h3>
          </div>
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <TextField
                variant="outlined"
                label="Número Ultima NFe *"
                fullWidth
                value={formik.values.nNF}
                name="nNF"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.nNF && Boolean(formik.errors.nNF)}
                helperText={formik.touched.nNF && formik.errors.nNF}
                {...commonProps}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                variant="outlined"
                label="Série *"
                fullWidth
                value={formik.values.serie}
                name="serie"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.serie && Boolean(formik.errors.serie)}
                helperText={formik.touched.serie && formik.errors.serie}
                {...commonProps}
              />
            </Grid>
            <Grid item xs={3}>
              <FormControl variant="outlined" fullWidth name="ambienteNfe">
                <InputLabel>Ambiente NFe *</InputLabel>
                <Select
                  className={"input-select"}
                  label="Ambiente NFe *"
                  name="ambienteNfe"
                  value={formik.values.ambienteNfe}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.ambienteNfe &&
                    Boolean(formik.errors.ambienteNfe)
                  }
                  {...commonProps}
                >
                  <MenuItem value={1}>Produção</MenuItem>
                  <MenuItem value={2}>Homologação (teste)</MenuItem>
                </Select>
                {formik.touched.ambienteNfe &&
                Boolean(formik.errors.ambienteNfe) ? (
                  <FormHelperText>{formik.errors.ambienteNfe}</FormHelperText>
                ) : (
                  ""
                )}
              </FormControl>
            </Grid>
            <Grid item xs={3}>
              <TextField
                variant="outlined"
                label="Aliquota *"
                type={"number"}
                fullWidth
                value={formik.values.aliquota}
                name="aliquota"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                inputProps={{
                  step: "any"
                }}
                error={
                  formik.touched.aliquota && Boolean(formik.errors.aliquota)
                }
                helperText={formik.touched.aliquota && formik.errors.aliquota}
              />
            </Grid>
            <Grid item xs={3}>
              <FormControl variant="outlined" fullWidth>
                <InputLabel>Qtde casas decimais (valor) *</InputLabel>
                <Select
                  className={"input-select"}
                  label="Qtde casas decimais (valor) *"
                  name="quantidadeCasasDecimaisValor"
                  value={formik.values.quantidadeCasasDecimaisValor}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.quantidadeCasasDecimaisValor &&
                    Boolean(formik.errors.quantidadeCasasDecimaisValor)
                  }
                  {...commonProps}
                >
                  <MenuItem value={2}>2</MenuItem>
                  <MenuItem value={4}>4</MenuItem>
                </Select>
                {formik.touched.quantidadeCasasDecimaisValor &&
                Boolean(formik.errors.quantidadeCasasDecimaisValor) ? (
                  <FormHelperText>
                    {formik.errors.quantidadeCasasDecimaisValor}
                  </FormHelperText>
                ) : (
                  ""
                )}
              </FormControl>
            </Grid>
            <Grid item xs={3}>
              <FormControl variant="outlined" fullWidth>
                <InputLabel>Qtde casas decimais (estoque) *</InputLabel>
                <Select
                  className={"input-select"}
                  label="Qtde casas decimais (estoque) *"
                  name="quantidadeCasasDecimaisQuantidade"
                  value={formik.values.quantidadeCasasDecimaisQuantidade}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.quantidadeCasasDecimaisQuantidade &&
                    Boolean(formik.errors.quantidadeCasasDecimaisQuantidade)
                  }
                  {...commonProps}
                >
                  <MenuItem value={2}>2</MenuItem>
                  <MenuItem value={4}>4</MenuItem>
                </Select>
                {formik.touched.quantidadeCasasDecimaisQuantidade &&
                Boolean(formik.errors.quantidadeCasasDecimaisQuantidade) ? (
                  <FormHelperText>
                    {formik.errors.quantidadeCasasDecimaisQuantidade}
                  </FormHelperText>
                ) : (
                  ""
                )}
              </FormControl>
            </Grid>
            <Grid item xs={3}>
              <TextField
                variant="outlined"
                label="Registros por página *"
                type={"number"}
                fullWidth
                value={formik.values.registrosPorPagina}
                name="registrosPorPagina"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.registrosPorPagina &&
                  Boolean(formik.errors.registrosPorPagina)
                }
                helperText={
                  formik.touched.registrosPorPagina &&
                  formik.errors.registrosPorPagina
                }
                {...commonProps}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                variant="outlined"
                label="Senha Certificado Digital"
                type={"text"}
                fullWidth
                value={formik.values.senhaCertificadoDigital}
                name="senhaCertificadoDigital"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.senhaCertificadoDigital &&
                  Boolean(formik.errors.senhaCertificadoDigital)
                }
                helperText={
                  formik.touched.senhaCertificadoDigital &&
                  formik.errors.senhaCertificadoDigital
                }
                {...commonProps}
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
            <AssignmentIcon />
            <h3>Proxy</h3>
          </div>
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <TextField
                variant="outlined"
                label="IP"
                fullWidth
                value={formik.values.proxyIp}
                name="proxyIp"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.proxyIp && Boolean(formik.errors.proxyIp)}
                helperText={formik.touched.proxyIp && formik.errors.proxyIp}
                {...commonProps}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                variant="outlined"
                label="Porta"
                fullWidth
                value={formik.values.proxyPort}
                name="proxyPort"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.proxyPort && Boolean(formik.errors.proxyPort)
                }
                helperText={formik.touched.proxyPort && formik.errors.proxyPort}
                {...commonProps}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                variant="outlined"
                label="Usuário"
                type={"text"}
                fullWidth
                value={formik.values.proxyUser}
                name="proxyUser"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.proxyUser && Boolean(formik.errors.proxyUser)
                }
                helperText={formik.touched.proxyUser && formik.errors.proxyUser}
                {...commonProps}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                variant="outlined"
                label="Senha"
                type={"text"}
                fullWidth
                value={formik.values.proxyPass}
                name="proxyPass"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.proxyPass && Boolean(formik.errors.proxyPass)
                }
                helperText={formik.touched.proxyPass && formik.errors.proxyPass}
                {...commonProps}
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
            <AssignmentIcon />
            <h3>SMTP (email)</h3>
          </div>
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <TextField
                variant="outlined"
                label="Servidor"
                fullWidth
                value={formik.values.servidorSmtp}
                name="servidorSmtp"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.servidorSmtp &&
                  Boolean(formik.errors.servidorSmtp)
                }
                helperText={
                  formik.touched.servidorSmtp && formik.errors.servidorSmtp
                }
                {...commonProps}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                variant="outlined"
                label="Porta"
                fullWidth
                value={formik.values.portaSmtp}
                name="portaSmtp"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.portaSmtp && Boolean(formik.errors.portaSmtp)
                }
                helperText={formik.touched.portaSmtp && formik.errors.portaSmtp}
                {...commonProps}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                variant="outlined"
                label="Usuário"
                type={"text"}
                fullWidth
                value={formik.values.usuarioSmtp}
                name="usuarioSmtp"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.usuarioSmtp &&
                  Boolean(formik.errors.usuarioSmtp)
                }
                helperText={
                  formik.touched.usuarioSmtp && formik.errors.usuarioSmtp
                }
                {...commonProps}
              />
            </Grid>
            <Grid item xs={2}>
              <TextField
                variant="outlined"
                label="Senha"
                type={"text"}
                fullWidth
                value={formik.values.senhaSmtp}
                name="senhaSmtp"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.senhaSmtp && Boolean(formik.errors.senhaSmtp)
                }
                helperText={formik.touched.senhaSmtp && formik.errors.senhaSmtp}
                {...commonProps}
              />
            </Grid>
            <Grid item xs={1}>
              <FormControl variant="outlined" fullWidth>
                <InputLabel>Encriptação *</InputLabel>
                <Select
                  className={"input-select"}
                  label="Encriptação *"
                  name="encryptionSmtp"
                  value={formik.values.encryptionSmtp}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.encryptionSmtp &&
                    Boolean(formik.errors.encryptionSmtp)
                  }
                  {...commonProps}
                >
                  <MenuItem value={'tls'}>TLS</MenuItem>
                  <MenuItem value={'ssl'}>SSL</MenuItem>
                </Select>
                {formik.touched.encryptionSmtp &&
                Boolean(formik.errors.encryptionSmtp) ? (
                  <FormHelperText>
                    {formik.errors.encryptionSmtp}
                  </FormHelperText>
                ) : (
                  ""
                )}
              </FormControl>
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
            <AssignmentIcon />
            <h3>Anexos</h3>
          </div>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <h4>Logo da empresa</h4>
              <div style={locked ? { pointerEvents: 'none', opacity: 0.6 } : {}}>
                <DragAndDrop state={[logo, setLogo]} listFiles></DragAndDrop>
              </div>
              {locked && (
                <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
                  Campos bloqueados — desbloqueie para alterar anexos.
                </div>
              )}
            </Grid>
            <Grid item xs={6}>
              <h4>Cerfificado Digital (A1)</h4>
              <div style={locked ? { pointerEvents: 'none', opacity: 0.6 } : {}}>
                <DragAndDrop
                  state={[certificadoDigital, setCertificadoDigital]}
                  listFiles
                ></DragAndDrop>
              </div>
              {locked && (
                <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
                  Campos bloqueados — desbloqueie para alterar anexos.
                </div>
              )}
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
                onClick={() => history.push("/configuracoes")}
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

export default EditarConfiguracaoPage;
