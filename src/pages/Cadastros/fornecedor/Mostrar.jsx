import { useEffect, useState } from "react";
import { useParams, useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import SideMenu from "../../../components/SideMenu";
import { Grid, TextField, Select, MenuItem, FormControl, InputLabel, Divider, Button } from '@material-ui/core';
import PrintIcon from '@material-ui/icons/Print';
import CloseIcon from '@material-ui/icons/Close';
import AssignmentIcon from '@material-ui/icons/Assignment';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import api from '../../../services/api';


const initialValues = {
  tipoFornecedor: '',
  situacao: '',
  tipoContribuinte: '',
  inscricaoEstadual: '',
  nome: '',
  cpfCnpj: '',
  email: '',
  contato: '',
  rua: '',
  cidade: '',
  numero: '',
  cep: '',
  bairro: '',
  estado: '',
  telefone: '',
  celular: '',
  codigoMunicipio: '',


}

function MostrarFornecedorPage() {
  const history = useHistory();
  const [values, setValues] = useState(initialValues);
  const { id } = useParams();

  useEffect(() => {
    api.get('/fornecedor/' + id)
      .then((response) => {
        setValues(response.data['data']);
      })

  }, []);

  return (
    <>
      <div>
        <Divider />
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', }}>
          <AssignmentIcon />
          <h3>Dados Pessoais</h3>
        </div>
        <Grid container spacing={2}>

          <Grid item xs={3}>
            <FormControl variant="outlined" fullWidth required name="tipoFornecedor">
              <InputLabel>Tipo de Fornecedor</InputLabel>
              <Select className={'input-select'} label="Tipo de Fornecedor" name="tipoFornecedor" value={values.tipoFornecedor} disabled>
                <MenuItem value={"pf"}>Pessia Física</MenuItem>
                <MenuItem value={"pj"}>Pessia Juridica</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={3}>
            <FormControl variant="outlined" fullWidth required name="situacao">
              <InputLabel>Situação</InputLabel>
              <Select className={'input-select'} label="Situação" value='' name="situacao" value={values.situacao} disabled>
                <MenuItem value={1}>Ativo</MenuItem>
                <MenuItem value={0}>Inativo</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={3}>
            <FormControl variant="outlined" fullWidth required name="tipoContribuinte">
              <InputLabel>Tipo de contribuinte</InputLabel>
              <Select className={'input-select'} label="Tipo de contribuinte" name="tipoContribuinte" value={values.tipoContribuinte} disabled>
                <MenuItem value={1}>Contribuinte ICMS</MenuItem>
                <MenuItem value={2}>Contribuinte ISENTO</MenuItem>
                <MenuItem value={9}>Não Contribuinte</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={3}>
            <TextField variant="outlined" fullWidth label="Inscrição Estadual" helperText="Digite ISENTO caso não haja Inscrição Estadual" value={values.inscricaoEstadual} name="inscricaoEstadual" disabled />
          </Grid>

          <Grid item xs={3}>
            <TextField variant="outlined" label="Nome/Razão social" fullWidth value={values.nome} name="nome" disabled />
          </Grid>

          <Grid item xs={3}>
            <TextField variant="outlined" label="CPF/CNPJ" fullWidth value={values.cpfCnpj} name="cpfCnpj" disabled />
          </Grid>

          <Grid item xs={3}>
            <TextField variant="outlined" label="Email" fullWidth value={values.email} name="email" disabled />
          </Grid>

          <Grid item xs={3}>
            <TextField variant="outlined" label="Contato" fullWidth value={values.contato} name="contato" disabled />
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
            <TextField variant="outlined" label="CEP" fullWidth value={values.cep} name="cep" disabled />

          </Grid>
          <Grid item xs={3}>
            <TextField variant="outlined" label="Rua" fullWidth value={values.rua} name="rua" disabled />

          </Grid>
          <Grid item xs={3}>
            <TextField variant="outlined" label="Número" fullWidth value={values.numero} name="numero" disabled />
          </Grid>
          <Grid item xs={3}>
            <TextField variant="outlined" label="Cidade" fullWidth value={values.cidade} name="cidade" disabled />
          </Grid>
          <Grid item xs={3}>
            <TextField variant="outlined" label="Bairro" fullWidth value={values.bairro} name="bairro" disabled />
          </Grid>
          <Grid item xs={3}>
            <FormControl variant="outlined" fullWidth required >
              <InputLabel>Estado</InputLabel>
              <Select className={'input-select'} label="Estado" name="estado" value={values.estado} disabled >
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
            </FormControl>
          </Grid>
          <Grid item xs={3}>
            <TextField variant="outlined" label="Telefone" fullWidth value={values.telefone} name="telefone" disabled />
          </Grid>
          <Grid item xs={3}>
            <TextField variant="outlined" label="Celular" fullWidth value={values.celular} name="celular" disabled />
          </Grid>
          <Grid item xs={3}>
            <TextField variant="outlined" label="Código do Municipio" fullWidth value={values.codigoMunicipio} name="codigoMunicipio" disabled />
          </Grid>

        </Grid>

        <Grid container spacing={0}>
          <Grid item>
            <Button onClick={() => history.push("/fornecedores")} variant="outlined" startIcon={<PrintIcon />} className={'btn btn-primary btn-spacing'}>Imprimir</Button>
          </Grid>
          <Grid item>
            <Button onClick={() => history.push("/fornecedores")} variant="outlined" startIcon={<CloseIcon />} className={'btn btn-error btn-spacing'}>Cancelar</Button>
          </Grid>
        </Grid>
      </div>

    </>
  );
}

export default MostrarFornecedorPage;