import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import api from "../../../services/api";

import MUIDataTable from "mui-datatables";

import TopBar from "../../../components/TopBar";
import SideMenu from "../../../components/SideMenu";
import { config, rowConfig } from "../../../config/tablesConfig";
import { Button } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import SearchIcon from "@material-ui/icons/Search";

function ListarProdutos() {
  const history = useHistory();
  const [grupos, setGrupos] = useState([]);
  const columns = [
    {
      name: "Nome",
      options: rowConfig,
    },
    {
      name: "Cadastrado em",
      options: rowConfig,
    },
    {
      name: "Ações",
      options: rowConfig,
    },
  ];

  const data = [];

  function handleOnClickShowButton(event, id) {
    history.push("/produto/mostrar/" + id);
  }

  function handleOnClickEditButton(event, id) {
    history.push("/produto/editar/" + id);
  }

  useEffect(() => {
    api.get("/produtos").then((response) => {
      if (response != undefined) {
        response.data["data"].forEach((element) => {
          var array = [
            element["nome"],
            new Date(element["created_at"]).toLocaleString(),
            <>
              <SearchIcon className={"btn-lista"} onClick={(event) => handleOnClickShowButton(event, element["id"])} />
              <EditIcon className={"btn-lista"} onClick={(event) => handleOnClickEditButton(event, element["id"])} />
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
        <Button onClick={() => history.push("/produto/novo")} variant="outlined" startIcon={<AddIcon />} className={"btn btn-primary btn-spacing"}>
          Adicionar
        </Button>
        <MUIDataTable title={"Lista de Produtos"} data={grupos} columns={columns} options={config} className={"table-background"} />
      </SideMenu>
    </>
  );
}

export default ListarProdutos;
