import { useState } from 'react';
import SideMenu from "../../../components/SideMenu";
import TopBar from "../../../components/TopBar";
import { makeStyles } from '@material-ui/core/styles';
import { Grid, TextField, Select, MenuItem, FormControl, InputLabel, Divider, Button } from '@material-ui/core';
import { useHistory } from "react-router-dom";
import api from '../../../services/api';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import AssignmentIcon from '@material-ui/icons/Assignment';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import buscarCep from '../../../services/buscarCep';




const initialValues = {
    tipoTransportadora: '',
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


function CadastrarTransportadoraPage() {
    const history = useHistory();
    const [values, setValues] = useState(initialValues);

    function handleCepChange() {
        const cep = values.cep;
        const validacep = /^[0-9]{8}$/;
        if(validacep.test(cep.replace(/\D/g, ''))) {
            buscarCep(values.cep.replace(/\D/g, '')).then(response => {
                setValues({
                    ...values,
                    rua: response.logradouro,
                    estado: response.uf,
                    bairro: response.bairro,
                    cidade: response.localidade,
                    codigoMunicipio: response.ibge
                })
            });
        }else {
            alert('CEP Inválido');
        }
    }

    function handleOnChange(event) {
        const { name, value } = event.target;
        // const name = event.target.name;
        // const value = event.target.value;
        setValues({ ...values, [name]: value });
    }

    function handleOnSubmit(event) {
        event.preventDefault();
        console.log(values);
        api.post('/transportadora', values)
        .then(response => console.log(response));
    }

    return (
        <>
            <TopBar />

            <SideMenu>
                <div>
                    <Divider />
                    <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', }}>
                        <AssignmentIcon />
                        <h3>Dados Pessoais</h3>
                    </div>
                    <form onSubmit={handleOnSubmit}>
                        <Grid container spacing={2}>

                            <Grid item xs={3}>
                                <FormControl variant="outlined" fullWidth required  name="tipoTransportadora">
                                    <InputLabel>Tipo de Transportadora</InputLabel>
                                    <Select className={'input-select'} label="Tipo de Transportadora" name="tipoTransportadora" value={values.tipoTransportadora} onChange={handleOnChange}>
                                        <MenuItem value={"pf"}>Pessoa Física</MenuItem>
                                        <MenuItem value={"pj"}>Pessoa Jurídica</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={3}>
                                <FormControl variant="outlined" fullWidth required  name="situacao">
                                    <InputLabel>Situação</InputLabel>
                                    <Select className={'input-select'} label="Situação" value='' name="situacao" value={values.situacao} onChange={handleOnChange}>
                                        <MenuItem value={1}>Ativo</MenuItem>
                                        <MenuItem value={0}>Inativo</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={3}>
                                <FormControl variant="outlined" fullWidth required  name="tipoContribuinte">
                                    <InputLabel>Tipo de contribuinte</InputLabel>
                                    <Select className={'input-select'} label="Tipo de contribuinte" name="tipoContribuinte" value={values.tipoContribuinte} onChange={handleOnChange}>
                                        <MenuItem value={1}>Contribuinte ICMS</MenuItem>
                                        <MenuItem value={2}>Contribuinte ISENTO</MenuItem>
                                        <MenuItem value={9}>Não Contribuinte</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={3}>
                                <TextField variant="outlined" fullWidth label="Inscrição Estadual" helperText="Digite ISENTO caso não haja Inscrição Estadual"  value={values.inscricaoEstadual} name="inscricaoEstadual" onChange={handleOnChange} />
                            </Grid>

                            <Grid item xs={3}>
                                <TextField variant="outlined" label="Nome/Razão social" fullWidth  value={values.nome} name="nome" onChange={handleOnChange} />
                            </Grid>

                            <Grid item xs={3}>
                                <TextField variant="outlined" label="CPF/CNPJ" fullWidth  value={values.cpfCnpj} name="cpfCnpj" onChange={handleOnChange} />
                            </Grid>

                            <Grid item xs={3}>
                                <TextField variant="outlined" label="Email" fullWidth  value={values.email} name="email" onChange={handleOnChange} />
                            </Grid>

                            <Grid item xs={3}>
                                <TextField variant="outlined" label="Contato" fullWidth  value={values.contato} name="contato" onChange={handleOnChange} />
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
                                <TextField variant="outlined" label="CEP" fullWidth  value={values.cep} name="cep" onBlur={handleCepChange} onChange={handleOnChange} />

                            </Grid>
                            <Grid item xs={3}>
                                <TextField variant="outlined" label="Rua" fullWidth  value={values.rua} name="rua" onChange={handleOnChange} />

                            </Grid>
                            <Grid item xs={3}>
                                <TextField variant="outlined" label="Número" fullWidth  value={values.numero} name="numero" onChange={handleOnChange} />
                            </Grid>
                            <Grid item xs={3}>
                                <TextField variant="outlined" label="Cidade" fullWidth  value={values.cidade} name="cidade" onChange={handleOnChange} />
                            </Grid>
                            <Grid item xs={3}>
                                <TextField variant="outlined" label="Bairro" fullWidth  value={values.bairro} name="bairro" onChange={handleOnChange} />
                            </Grid>
                            <Grid item xs={3}>
                                <FormControl variant="outlined" fullWidth required  >
                                    <InputLabel>Estado</InputLabel>
                                    <Select className={'input-select'} label="Estado" name="estado" value={values.estado} onChange={handleOnChange} >
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
                                <TextField variant="outlined" label="Telefone" fullWidth  value={values.telefone} name="telefone" onChange={handleOnChange} />
                            </Grid>
                            <Grid item xs={3}>
                                <TextField variant="outlined" label="Celular" fullWidth  value={values.celular} name="celular" onChange={handleOnChange} />
                            </Grid>
                            <Grid item xs={3}>
                                <TextField variant="outlined" label="Código do Municipio" fullWidth  value={values.codigoMunicipio} name="codigoMunicipio" onChange={handleOnChange} />
                            </Grid>

                        </Grid>

                        <Grid container spacing={0}>
                            <Grid item>
                                <Button type="submit" variant="outlined" startIcon={<CheckIcon />} className={'btn btn-primary btn-spacing'}>Salvar</Button>
                            </Grid>
                            <Grid item>
                                <Button onClick={() => history.push("/transportadoras")} variant="outlined" startIcon={<CloseIcon />} className={'btn btn-error btn-spacing'}>Cancelar</Button>
                            </Grid>
                        </Grid>
                    </form>

                </div>
            </SideMenu>
        </>
    );
}

export default CadastrarTransportadoraPage