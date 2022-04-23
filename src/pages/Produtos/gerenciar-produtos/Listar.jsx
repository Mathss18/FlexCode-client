import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import api from "../../../services/api";
import MUIDataTable from "mui-datatables";
import { config, rowConfig } from "../../../config/tablesConfig";
import { Button } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import SearchIcon from "@material-ui/icons/Search";
import { useFullScreenLoader } from "../../../context/FullScreenLoaderContext";

function ListarProdutos() {
  const history = useHistory();
  const [grupos, setGrupos] = useState([]);
  const fullScreenLoader = useFullScreenLoader();
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
    history.push("/produtos/mostrar/" + id);
  }

  function handleOnClickEditButton(event, id) {
    history.push("/produtos/editar/" + id);
  }

  useEffect(() => {
    fullScreenLoader.setLoading(true);
    api.get("/produtos")
    .then((response) => {
      if (response != undefined) {
        response.data["data"].forEach((element) => {
          var array = [
            element["nome"],
            new Date(element["created_at"]).toLocaleString(),
            <>
              {/* <SearchIcon className={"btn-lista"} onClick={(event) => handleOnClickShowButton(event, element["id"])} /> */}
              <EditIcon className={"btn-lista"} onClick={(event) => handleOnClickEditButton(event, element["id"])} />
            </>,
          ];
          data.push(array);
        });

        setGrupos(data);
      }
    })
    .finally(() => {
      fullScreenLoader.setLoading(false);
    })
  }, []);

  return (
    <>
      <Button onClick={() => history.push("/produtos/novo")} variant="outlined" startIcon={<AddIcon />} className={"btn btn-primary btn-spacing"}>
        Adicionar
      </Button>
      <MUIDataTable title={"Lista de Produtos"} data={grupos} columns={columns} options={config} className={"table-background"} />
    </>
  );
}

export default ListarProdutos;
