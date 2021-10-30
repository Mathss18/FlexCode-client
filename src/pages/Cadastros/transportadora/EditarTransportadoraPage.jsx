import { useEffect, useState } from "react";
import { useParams, useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import SideMenu from "../../../components/SideMenu";
import TopBar from "../../../components/TopBar";
import { Grid, TextField, Select, MenuItem, FormControl, InputLabel, Divider, Button } from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import AssignmentIcon from '@material-ui/icons/Assignment';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import api from '../../../services/api';
import Swal from 'sweetalert2';


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

function EditarTransportadoraPage() {
    const history = useHistory();
    const [values, setValues] = useState(initialValues);
    const { id } = useParams();

    useEffect(() => {
        api.get('/transportadora/' + id)
            .then((response) => {
                setValues(response.data['data']);
            })

    }, []);

    function handleOnChange(event) {
        const { name, value } = event.target;
        setValues({ ...values, [name]: value });
    }

    function handleOnSubmit(event) {
        event.preventDefault();
        api.put('/transportadora/' + id, values)
            .then((response) => {
                console.log(response);
                Swal.fire({
                    title: 'Atualizado com sucesso!',
                    html: 'Redirecionando...',
                    position: 'top-end',
                    icon: 'success',
                    timer: 1800,
                    timerProgressBar: true,
                }).then((result) => {
                    if (result.dismiss === Swal.DismissReason.timer) {
                        history.push("/transportadoras")
                    }
                })
            })
            .catch((error) => {
                console.log(error.response.request.responseText);
                Swal.fire({
                    title: 'Erro ao atualizar!',
                    html: error.response.data.message,
                    position: 'top-end',
                    icon: 'error',
                    timer: 10000,
                    timerProgressBar: true,
                }).then((result) => {
                    if (result.dismiss === Swal.DismissReason.timer) {
                        //history.push("/transportadoras")
                    }
                })
            })
    }

    function handleDelete() {
        Swal.fire({
            title: 'Tem certeza?',
            text: "Isso será irreversivel!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3f51b5',
            cancelButtonColor: '#f44336',
            confirmButtonText: 'Sim, excluir!'
        }).then((result) => {
            if (result.isConfirmed) {
                api.delete("/transportadora/" + id)
                    .then((result) => {
                        Swal.fire(
                            'Excluido!',
                            'Transportadora excluido com sucesso.',
                            'success'
                        )
                        history.push("/transportadoras")
                    })
                    .catch((error) => {
                        console.log(error.response.request.responseText);
                        Swal.fire({
                            title: 'Erro ao excluir!',
                            html: error.response.data.message,
                            position: 'top-end',
                            icon: 'error',
                            timer: 10000,
                            timerProgressBar: true,
                        }).then((result) => {
                            if (result.dismiss === Swal.DismissReason.timer) {
                                //history.push("/transportadoras")
                            }
                        })
                    })

            }

        })
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
                                        <MenuItem value={"pf"}>Pessia Física</MenuItem>
                                        <MenuItem value={"pj"}>Pessia Jurídica</MenuItem>
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
                                <TextField variant="outlined" label="CEP" fullWidth  value={values.cep} name="cep" onChange={handleOnChange} />

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
                                <Button variant="outlined" startIcon={<DeleteForeverIcon />} className={'btn btn-error btn-spacing'} onClick={handleDelete} >Excluir</Button>
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

export default EditarTransportadoraPage;