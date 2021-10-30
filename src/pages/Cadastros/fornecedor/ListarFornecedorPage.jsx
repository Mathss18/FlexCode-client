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


function ListarFornecedorPage() {
    const classes = useStyles();
    const history = useHistory();
    const [fornecedores, setFornecedores] = useState([]);
    const columns = [
      {
        name: 'Nome',
        options: rowConfig
      },
      {
        name: 'Tipo',
        options: rowConfig
      },
      {
        name: 'Telefone',
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
    
    var isLoading = false;
    const data = [];

    function handleOnClickShowButton(event, id) {
        history.push("/fornecedor/mostrar/"+id)
    }

    function handleOnClickEditButton(event, id) {
        history.push("/fornecedor/editar/"+id)
    }



    useEffect(() => {
        if(!isLoading) 
            config.textLabels.body.noMatch = "Nenhum resultado encontrado."

        api.get('/fornecedores')
            .then((response) => {
                response.data['data'].forEach(element => {
                    if(element['tipoFornecedor'] === "pf"){
                        element['tipoFornecedor'] = "Pessoa Física"
                    }
                    else if(element['tipoFornecedor'] === "pj"){
                        element['tipoFornecedor'] = "Pessoa Jurídica"
                    }
                    var array = [
                        element['nome'],
                        element['tipoFornecedor'],
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
                setFornecedores(data)
                isLoading = false;

            })
    }, [isLoading]);

    return (
        <>
            <TopBar />
            <SideMenu>
                {fornecedores.map((fornecedor, index) => (
                    <h4 key={index} >{fornecedor.nome}</h4>
                ))}
                <Button onClick={() => history.push("/fornecedor/novo")} variant="outlined" startIcon={<AddIcon />} className={'btn btn-primary btn-spacing'}>Adicionar</Button>
                <MUIDataTable
                    title={"Lista de Fornecedors"}
                    data={fornecedores}
                    columns={columns}
                    options={config}
className={'table-background'}
                />
            </SideMenu>

        </>
    );
}

export default ListarFornecedorPage;