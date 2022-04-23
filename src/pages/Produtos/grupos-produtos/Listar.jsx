import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import api from "../../../services/api";
import MUIDataTable from "mui-datatables";
import { config, rowConfig } from "../../../config/tablesConfig";
import { Button } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import SearchIcon from "@material-ui/icons/Search";
import Chip from "@mui/material/Chip";
import { useFullScreenLoader } from "../../../context/FullScreenLoaderContext";

function ListarGruposDeProdutos() {
  const history = useHistory();
  const [grupos, setGrupos] = useState([]);
  const fullScreenLoader = useFullScreenLoader();
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
      name: "Porcentagem de Lucro",
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
    history.push("/grupos-produtos/mostrar/" + id);
  }

  function handleOnClickEditButton(event, id) {
    history.push("/grupos-produtos/editar/" + id);
  }

  useEffect(() => {
    fullScreenLoader.setLoading(true);
    api
      .get("/grupos-produtos")
      .then((response) => {
        response.data["data"].forEach((element) => {
          var array = [
            element["nome"],
            response.data["data"].filter(
              (item) => item.id === element.grupoPai
            )[0]?.nome || "",
            element["porcentagem_lucro"].map((item) => {
              return (
                <Chip
                  className="table-tag"
                  label={item.descricao + " " + item.porcentagem + "%"}
                  color="primary"
                  variant="outlined"
                />
              );
            }),
            new Date(element["created_at"]).toLocaleString(),
            <>
              {/* <SearchIcon
                className={"btn-lista"}
                onClick={(event) =>
                  handleOnClickShowButton(event, element["id"])
                }
              /> */}
              <EditIcon
                className={"btn-lista"}
                onClick={(event) =>
                  handleOnClickEditButton(event, element["id"])
                }
              />
            </>,
          ];
          data.push(array);
        });

        setGrupos(data);
      })
      .finally(() => {
        fullScreenLoader.setLoading(false);
      });
  }, []);

  return (
    <>
      <Button
        onClick={() => history.push("/grupos-produtos/novo")}
        variant="outlined"
        startIcon={<AddIcon />}
        className={"btn btn-primary btn-spacing"}
      >
        Adicionar
      </Button>
      <MUIDataTable
        title={"Lista de Grupos de Produtos"}
        data={grupos}
        columns={columns}
        options={config}
        className={"table-background"}
      />
    </>
  );
}

export default ListarGruposDeProdutos;
