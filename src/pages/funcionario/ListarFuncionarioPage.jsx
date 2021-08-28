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


function ListarFuncionarioPage() {
    const classes = useStyles();
    const history = useHistory();
    const [funcionarios, setFuncionarios] = useState([]);
    const [grupos, setGrupos] = useState([]);
    const columns = ["Nome", "Grupo", "Ativo", "Celular", "Email", "Ações"];
    const data = [];

    function handleOnClickShowButton(event, id) {
        history.push("/funcionario/mostrar/" + id)
    }

    function handleOnClickEditButton(event, id) {
        history.push("/funcionario/editar/" + id)
    }



    useEffect(() => {
        
        api.get('/funcionarios')
            .then((response) => {
                response.data['data'].forEach(element => {
                    if (element['situacao'] === 1) {
                        element['ativo'] = "Sim"
                    }
                    else if (element['situacao'] === 0) {
                        element['ativo'] = "Não"
                    }

                    var array = [
                        element['nome'],
                        element['grupo']['nome'],
                        element['ativo'],
                        element['celular'],
                        element['email'],
                        <>
                            <SearchIcon className={classes.optionsButtons} onClick={(event) => handleOnClickShowButton(event, element['id'])} />
                            <EditIcon className={classes.optionsButtons} onClick={(event) => handleOnClickEditButton(event, element['id'])} />
                        </>
                    ]
                    data.push(array);

                });

                setFuncionarios(data)

            })
    }, []);

    return (
        <>
            <TopBar />
            <SideMenu>
                {funcionarios.map((funcionario, index) => (
                    <h4 key={index} >{funcionario.nome}</h4>
                ))}
                <Button onClick={() => history.push("/funcionario/novo")} variant="outlined" startIcon={<AddIcon />} className={classes.saveButton}>Adicionar</Button>
                <MUIDataTable
                    title={"Lista de Funcionario"}
                    data={funcionarios}
                    columns={columns}
                    options={language}
                />
            </SideMenu>

        </>
    );
}

export default ListarFuncionarioPage;