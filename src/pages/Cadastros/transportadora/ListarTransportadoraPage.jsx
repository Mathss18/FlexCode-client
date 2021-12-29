import { useEffect, useState } from "react";
import SideMenu from "../../../components/SideMenu";
import TopBar from "../../../components/TopBar";
import MUIDataTable from "mui-datatables";
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from "react-router-dom";
import api from '../../../services/api';
import { config, rowConfig } from '../../../config/tablesConfig';
import { Button } from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles((theme) => ({
    optionsButtons: {
        border: '1px solid #3f51b5',
        borderRadius: '6px',
        boxShadow: "2px 2px #757575",
        backgroundColor: theme.palette.primary.main,
        color: '#fff',
        marginRight: theme.spacing(1),
        padding: 2,
        fontSize: '28px',
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: theme.palette.secondary.main,
        },
    },
    saveButton: {
        marginBottom: theme.spacing(2),
        backgroundColor: theme.palette.primary.main,
        color: '#fff',
        marginTop: theme.spacing(2),
        marginRight: theme.spacing(2),
        '&:hover': {
            backgroundColor: '#fff',
            color: theme.palette.primary.main,
        },
    },
}));


function ListarTransportadoraPage() {
    const classes = useStyles();
    const history = useHistory();
    const [transportadoras, setTransportadoras] = useState([]);
    const columns = [
      {
        name: 'Nome',
        options: rowConfig
      },
      {
        name: 'Grupo',
        options: rowConfig
      },
      {
        name: 'Ativo',
        options: rowConfig
      },
      {
        name: 'Celular',
        options: rowConfig
      },
      {
        name: 'Email',
        options: rowConfig
      },
      {
        name: 'Contato',
        options: rowConfig
      },
      {
        name: 'Ações',
        options: rowConfig
      },
    ];
    const data = [];

    function handleOnClickShowButton(event, id) {
        history.push("/transportadora/mostrar/"+id)
    }

    function handleOnClickEditButton(event, id) {
        history.push("/transportadora/editar/"+id)
    }



    useEffect(() => {

        api.get('/transportadoras')
            .then((response) => {
                response.data['data'].forEach(element => {
                    if(element['tipoTransportadora'] === "pf"){
                        element['tipoTransportadora'] = "Pessoa Física"
                    }
                    else if(element['tipoTransportadora'] === "pj"){
                        element['tipoTransportadora'] = "Pessoa Jurídica"
                    }
                    var array = [
                        element['nome'],
                        element['tipoTransportadora'],
                        element['telefone'],
                        element['celular'],
                        element['email'],
                        element['contato'],
                        <>
                            <SearchIcon className={'btn-lista'} onClick={(event) => handleOnClickShowButton(event, element['id'])} />
                            <EditIcon className={'btn-lista'} onClick={(event) => handleOnClickEditButton(event, element['id'])} />
                        </>
                        ]
                    data.push(array);

                });
                setTransportadoras(data)

            })
    }, []);

    return (
        <>
            <TopBar />
            <SideMenu>
                {transportadoras.map((transportador, index) => (
                    <h4 key={index} >{transportador.nome}</h4>
                ))}
                <Button onClick={() => history.push("/transportadora/novo")} variant="outlined" startIcon={<AddIcon />} className={'btn btn-primary btn-spacing'}>Adicionar</Button>
                <MUIDataTable
                    title={"Lista de Transportadoras"}
                    data={transportadoras}
                    columns={columns}
                    options={config}
className={'table-background'}
                />
            </SideMenu>

        </>
    );
}

export default ListarTransportadoraPage;