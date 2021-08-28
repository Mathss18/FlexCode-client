import { useEffect, useState } from "react";
import SideMenu from "../../components/SideMenu";
import TopBar from "../../components/TopBar";
import MUIDataTable from "mui-datatables";
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from "react-router-dom";
import api from '../../services/api';
import language from '../../config/tableTranslation';
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


function ListarClientePage() {
    const classes = useStyles();
    const history = useHistory();
    const [clientes, setClientes] = useState([]);
    const columns = ["Nome", "Tipo", "Telefone", "Celular", "Email", "Contato", "Ações"];
    const data = [];

    function handleOnClickShowButton(event, id) {
        history.push("/cliente/mostrar/"+id)
    }

    function handleOnClickEditButton(event, id) {
        history.push("/cliente/editar/"+id)
    }



    useEffect(() => {
        api.get('/clientes')
            .then((response) => {
                response.data['data'].forEach(element => {
                    if(element['tipoCliente'] === "pf"){
                        element['tipoCliente'] = "Pessoa Física"
                    }
                    else if(element['tipoCliente'] === "pj"){
                        element['tipoCliente'] = "Pessoa Jurídica"
                    }
                    var array = [
                        element['nome'],
                        element['tipoCliente'],
                        element['telefone'],
                        element['celular'],
                        element['email'],
                        element['contato'],
                        <>
                            <SearchIcon className={classes.optionsButtons} onClick={(event) => handleOnClickShowButton(event, element['id'])} />
                            <EditIcon className={classes.optionsButtons} onClick={(event) => handleOnClickEditButton(event, element['id'])} />
                        </>
                        ]
                    data.push(array);

                });
                console.log(data);
                setClientes(data)

            })
    }, []);

    return (
        <>
            <TopBar />
            <SideMenu>
                {clientes.map((cliente, index) => (
                    <h4 key={index} >{cliente.nome}</h4>
                ))}
                <Button onClick={() => history.push("/cliente/novo")} variant="outlined" startIcon={<AddIcon />} className={classes.saveButton}>Adicionar</Button>
                <MUIDataTable
                    title={"Lista de Clientes"}
                    data={clientes}
                    columns={columns}
                    options={language}
                />
            </SideMenu>

        </>
    );
}

export default ListarClientePage;