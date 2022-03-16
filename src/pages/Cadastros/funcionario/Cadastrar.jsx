import { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, TextField, Select, MenuItem, FormControl, InputLabel, Divider, Button, CardMedia } from '@material-ui/core';
import { useHistory } from "react-router-dom";
import api from '../../../services/api';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import AssignmentIcon from '@material-ui/icons/Assignment';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import MouseIcon from '@material-ui/icons/Mouse';
import FormHelperText from '@mui/material/FormHelperText';
import buscarCep from '../../../services/buscarCep';
import { infoAlert, successAlert } from '../../../utils/alert';
import { funcionarioValidation } from "../../../validators/validationSchema";
import { useFormik } from "formik";
import { useFullScreenLoader } from '../../../context/FullScreenLoaderContext';



const useStyles = makeStyles((theme) => ({
  image: {
    border: "2px solid black",
    borderRadius: '10px',
    height: "200px",
    maxWidth: "500px",
  },
}));

const initialValues = {
  situacao: '',
  nome: '',
  cpf: '',
  rg: '',
  dataNascimento: '',
  sexo: '',
  grupo: '',
  grupo_id: '',
  email: '',
  senha: '',
  comissao: '',
  foto: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
  rua: '',
  cidade: '',
  numero: '',
  cep: '',
  bairro: '',
  estado: '',
  telefone: '',
  celular: '',
  emailPessoal: '',
}



function CadastrarFuncionarioPage() {
  const [grupos, setGrupos] = useState([]);
  const classes = useStyles();
  const history = useHistory();
  const fullScreenLoader = useFullScreenLoader();
  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: (event) => { handleOnSubmit(event) },
    validationSchema: funcionarioValidation,
  })

  useEffect(() => {
    api.get('/grupos')
      .then((response) => {
        setGrupos(response.data['data']);
      })

  }, []);

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
    console.log(values);
    fullScreenLoader.setLoading(true);
    api.post('/funcionarios', values)
      .then((response) => {
        successAlert("Sucesso", "Funcionatio Cadastrado", () =>
          history.push("/funcionarios")
        );
      })
      .catch((error) => {
        infoAlert("Atenção", error.response.data.message);
      })
      .finally(() => {
        fullScreenLoader.setLoading(false);
      });

  }

  function handleCapture(event) {
    console.log(event.target.files[0]);
    const fileReader = new FileReader();
    fileReader.readAsDataURL(event.target.files[0]);
    fileReader.onload = (e) => {
      if (fileReader.readyState === 2) {
        console.log(e);
        formik.setValues((values) => { return { ...values, 'foto': e.target.result } });
      }
    };
  };

  return (
    <>
      <div>
        <Divider />
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', }}>
          <AssignmentIcon />
          <h3>Dados Pessoais</h3>
        </div>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>

            <Grid item xs={3}>
              <FormControl variant="outlined" fullWidth className={classes.input} name="grupo">
                <InputLabel>Grupo</InputLabel>
                <Select className={'input-select'}
                  label="Grupo" name="grupo_id"
                  value={formik.values.grupo_id}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.grupo_id && Boolean(formik.errors.grupo_id)}
                >
                  {grupos.map((grupo) => {
                    return (
                      <MenuItem key={grupo.id} value={grupo.id}>{grupo.nome}</MenuItem>
                    )
                  })}
                </Select>
                {formik.touched.grupo_id && Boolean(formik.errors.grupo_id)
                  ? <FormHelperText>{formik.errors.grupo_id}</FormHelperText>
                  : ''
                }
              </FormControl>
            </Grid>

            <Grid item xs={3}>
              <FormControl variant="outlined" fullWidth className={classes.input} name="situacao">
                <InputLabel>Situação</InputLabel>
                <Select
                  className={'input-select'}
                  label="Situação"
                  name="situacao"
                  value={formik.values.situacao}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.situacao && Boolean(formik.errors.situacao)}>
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
              <FormControl variant="outlined" fullWidth className={classes.input} name="sexo">
                <InputLabel>Sexo</InputLabel>
                <Select
                  className={'input-select'}
                  label="Sexo"
                  name="sexo"
                  value={formik.values.sexo}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.sexo && Boolean(formik.errors.sexo)}>
                  <MenuItem value={"masculino"}>Masculino</MenuItem>
                  <MenuItem value={"feminino"}>Feminino</MenuItem>
                  <MenuItem value={"outro"}>Outro</MenuItem>
                </Select>
                {formik.touched.sexo && Boolean(formik.errors.sexo)
                  ? <FormHelperText>{formik.errors.sexo}</FormHelperText>
                  : ''
                }
              </FormControl>
            </Grid>

            <Grid item xs={3}>
              <TextField
                variant="outlined"
                fullWidth label="RG"
                className={classes.input}
                name="rg"
                value={formik.values.rg}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.rg && Boolean(formik.errors.rg)}
                helperText={formik.touched.rg && formik.errors.rg}
              />
            </Grid>

            <Grid item xs={3}>
              <TextField
                variant="outlined"
                label="Nome Completo"
                fullWidth
                className={classes.input}
                name="nome"
                value={formik.values.nome}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.nome && Boolean(formik.errors.nome)}
                helperText={formik.touched.nome && formik.errors.nome}
              />
            </Grid>

            <Grid item xs={3}>
              <TextField
                variant="outlined"
                label="CPF"
                fullWidth
                className={classes.input}
                name="cpf"
                value={formik.values.cpf}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.cpf && Boolean(formik.errors.cpf)}
                helperText={formik.touched.cpf && formik.errors.cpf}
              />
            </Grid>

            <Grid item xs={3}>
              <TextField variant="outlined"
                onFocus={
                  (e) => {
                    e.currentTarget.type = "date";
                    e.currentTarget.focus();
                  }
                }
                label="Data de Nascimento"
                fullWidth
                className={classes.input}
                name="dataNascimento"
                value={formik.values.dataNascimento}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.dataNascimento && Boolean(formik.errors.dataNascimento)}
                helperText={formik.touched.dataNascimento && formik.errors.dataNascimento}
              />
            </Grid>

            <Grid item xs={3}>
              <TextField
                inputProps={{ step: "0.01" }}
                type="number"
                step="0.01"
                variant="outlined"
                label="Comissão (%)"
                fullWidth className={classes.input}
                name="comissao"
                value={formik.values.comissao}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.comissao && Boolean(formik.errors.comissao)}
                helperText={formik.touched.comissao && formik.errors.comissao}
              />
            </Grid>

            <Grid item xs={3}>
              <TextField
                variant="outlined"
                label="Email Pessoal"
                fullWidth className={classes.input}
                name="emailPessoal"
                value={formik.values.emailPessoal}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.emailPessoal && Boolean(formik.errors.emailPessoal)}
                helperText={formik.touched.emailPessoal && formik.errors.emailPessoal}
              />
            </Grid>

          </Grid>
          <br />
          <Divider />
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', }}>
            <LocationOnIcon />
            <h3>Endereço</h3>
          </div>
          <Grid container spacing={2}>

            <Grid item xs={3}>
              <TextField
                variant="outlined"
                label="CEP"
                fullWidth
                className={classes.input}
                name="cep"
                value={formik.values.cep}
                onChange={formik.handleChange}
                onBlur={handleCepChange}
                error={formik.touched.cep && Boolean(formik.errors.cep)}
                helperText={formik.touched.cep && formik.errors.cep}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField variant="outlined"
                label="Rua"
                fullWidth
                className={classes.input}
                name="rua"
                value={formik.values.rua}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.rua && Boolean(formik.errors.rua)}
                helperText={formik.touched.rua && formik.errors.rua}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField variant="outlined"
                label="Número"
                fullWidth
                className={classes.input}
                name="numero"
                value={formik.values.numero}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.numero && Boolean(formik.errors.numero)}
                helperText={formik.touched.numero && formik.errors.numero}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField variant="outlined"
                label="Cidade"
                fullWidth
                className={classes.input}
                name="cidade"
                value={formik.values.cidade}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.cidade && Boolean(formik.errors.cidade)}
                helperText={formik.touched.cidade && formik.errors.cidade}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField variant="outlined"
                label="Bairro"
                fullWidth
                className={classes.input}
                name="bairro"
                value={formik.values.bairro}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.bairro && Boolean(formik.errors.bairro)}
                helperText={formik.touched.bairro && formik.errors.bairro}
              />
            </Grid>
            <Grid item xs={3}>
              <FormControl variant="outlined" fullWidth className={classes.input} >
                <InputLabel>Estado</InputLabel>
                <Select
                  className={'input-select'}
                  label="Estado"
                  name="estado"
                  value={formik.values.estado}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.estado && Boolean(formik.errors.estado)} >
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
              <TextField variant="outlined"
                label="Telefone"
                fullWidth
                className={classes.input}
                name="telefone"
                value={formik.values.telefone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.telefone && Boolean(formik.errors.telefone)}
                helperText={formik.touched.telefone && formik.errors.telefone}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField variant="outlined"
                label="Celular"
                fullWidth
                className={classes.input}
                name="celular"
                value={formik.values.celular}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.celular && Boolean(formik.errors.celular)}
                helperText={formik.touched.celular && formik.errors.celular}
              />
            </Grid>
          </Grid>
          <br />
          <Divider />
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', }}>
            <MouseIcon />
            <h3>Criar Usuario</h3>
          </div>
          <Grid container spacing={2}>

            <Grid item xs={3}>
              <TextField
                variant="outlined"
                label="Email"
                fullWidth
                className={classes.input}
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />

            </Grid>
            <Grid item xs={3}>
              <TextField
                variant="outlined"
                label="Senha"
                fullWidth
                className={classes.input}
                name="senha"
                value={formik.values.senha}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.senha && Boolean(formik.errors.senha)}
                helperText={formik.touched.senha && formik.errors.senha}
              />
            </Grid>
            <Grid item xs={6}>
              <p>* Essas serão as informações para o funcionario acessar o sistema</p>
            </Grid>
          </Grid>


          <br />
          <Divider />
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', }}>
            <PhotoCamera />
            <h3>Imagem</h3>
          </div>

          <Grid container spacing={2}>
            <Grid item>
              <CardMedia
                className={classes.image}
                component="img"
                alt="Imagem Funcionario"
                image={formik.values.foto}
                title="Imagem Funcionario" />
            </Grid>
          </Grid>
          <Grid container spacing={0}>

            <Grid item>
              <Button variant="contained" component="label" startIcon={<PhotoCamera />} className={'btn btn-primary btn-spacing'}>Carregar Imagem
                <input
                  name="foto"
                  hidden
                  accept="image/*"
                  className={classes.input}
                  type="file"
                  onChange={handleCapture}
                />
              </Button>

            </Grid>
          </Grid>


          <Grid container spacing={0}>
            <Grid item>
              <Button type="submit" variant="outlined" startIcon={<CheckIcon />} className={'btn btn-primary btn-spacing'}>Salvar</Button>
            </Grid>
            <Grid item>
              <Button onClick={() => history.push("/funcionarios")} variant="outlined" startIcon={<CloseIcon />} className={'btn btn-error btn-spacing'}>Cancelar</Button>
            </Grid>
          </Grid>
        </form>

      </div>

    </>
  );
}

export default CadastrarFuncionarioPage