import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import api from "../../../services/api";
import MUIDataTable from "mui-datatables";
import { config, rowConfig } from "../../../config/tablesConfig";
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import SearchIcon from "@material-ui/icons/Search";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

function ListarUnidadesDeProdutos() {
  const history = useHistory();
  const [grupos, setGrupos] = useState([]);
  const columns = [
    {
      name: "Nome",
      options: rowConfig,
    },
    {
      name: "Sigla",
      options: rowConfig,
    },
    {
      name: "Padrão",
      options: rowConfig,
    },
    {
      name: 'Ações',
      options: rowConfig
    },
  ];

  const data = [];

  function handleOnClickShowButton(event, id) {
    history.push("/unidade-produto/mostrar/" + id);
  }

  function handleOnClickEditButton(event, id) {
    history.push("/unidade-produto/editar/" + id);
  }

  useEffect(() => {
    api.get("/unidades-produtos").then((response) => {
      console.log(response);
      if (response != undefined) {
        response.data["data"].forEach((element) => {
          var array = [
            element["nome"],
            element["sigla"],
            element["padrao"] == 1 ? <CheckIcon/> : <CloseIcon/>,
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
      {grupos.map((grupo, index) => (
        <h4 key={index}>{grupo.nome}</h4>
      ))}
      <Button onClick={() => history.push("/unidade-produto/novo")} variant="outlined" startIcon={<AddIcon />} className={'btn btn-primary btn-spacing'}>
        Adicionar
      </Button>
      <MUIDataTable title={"Lista de Unidades de Produtos"} data={grupos} columns={columns} options={config}
        className={'table-background'} />
    </>
  );
}

export default ListarUnidadesDeProdutos;
