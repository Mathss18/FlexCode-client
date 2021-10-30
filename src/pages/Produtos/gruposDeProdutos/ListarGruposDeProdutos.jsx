import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import api from "../../../services/api";

import MUIDataTable from "mui-datatables";

import TopBar from "../../../components/TopBar";
import SideMenu from "../../../components/SideMenu";
import { config, rowConfig } from "../../../config/tablesConfig";
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import SearchIcon from "@material-ui/icons/Search";

const useStyles = makeStyles((theme) => ({
  optionsButtons: {
    border: "1px solid #3f51b5",
    borderRadius: "6px",
    boxShadow: "2px 2px #757575",
    backgroundColor: theme.palette.primary.main,
    color: "#fff",
    marginRight: theme.spacing(1),
    padding: 2,
    fontSize: "28px",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: theme.palette.secondary.main,
    },
  },
  saveButton: {
    marginBottom: theme.spacing(2),
    backgroundColor: theme.palette.primary.main,
    color: "#fff",
    marginTop: theme.spacing(2),
    marginRight: theme.spacing(2),
    "&:hover": {
      backgroundColor: "#fff",
      color: theme.palette.primary.main,
    },
  },
}));

function ListarGruposDeProdutos() {
  const classes = useStyles();
  const history = useHistory();
  const [grupos, setGrupos] = useState([]);
  const columns = [
    {
      name: "Nome",
      options: rowConfig,
    },
    {
      name: "Grupo Pai",
      options: rowConfig,
    },
    {
      name: "Cadastrado em",
      options: rowConfig,
    },
    {
      name: "Ações",
      options: rowConfig,
    }
  ];

  const data = [];

  function handleOnClickShowButton(event, id) {
    history.push("/grupo-produto/mostrar/" + id);
  }

  function handleOnClickEditButton(event, id) {
    history.push("/grupo-produto/editar/" + id);
  }

  useEffect(() => {
    api.get("/grupos-produtos").then((response) => {
      if (response != undefined) {
        response.data["data"].forEach((element) => {
          var array = [
            element["nome"],
            element["grupoPai"],
            new Date(element["created_at"]).toLocaleString(),
            <>
              <SearchIcon className={'btn-lista'} onClick={(event) => handleOnClickShowButton(event, element["id"])} />
              <EditIcon className={'btn-lista'} onClick={(event) => handleOnClickEditButton(event, element["id"])} />
            </>,
          ];
          data.push(array);
        });

        setGrupos(data);
      }
    });
  }, []);

  return (
    <>
      <TopBar />
      <SideMenu>
        {grupos.map((grupo, index) => (
          <h4 key={index}>{grupo.nome}</h4>
        ))}
        <Button onClick={() => history.push("/grupo-produto/novo")} variant="outlined" startIcon={<AddIcon />} className={'btn btn-primary btn-spacing'}>
          Adicionar
        </Button>
        <MUIDataTable title={"Lista de Grupos de Produtos"} data={grupos} columns={columns} options={config}
className={'table-background'}/>
      </SideMenu>
    </>
  );
}

export default ListarGruposDeProdutos;
