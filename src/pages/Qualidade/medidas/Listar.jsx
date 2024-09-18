import { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import { useHistory } from "react-router-dom";
import api from "../../../services/api";
import { config, rowConfig } from "../../../config/tablesConfig";
import { Button } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import SearchIcon from "@material-ui/icons/Search";
import { useFullScreenLoader } from "../../../context/FullScreenLoaderContext";

function ListarMedidaPage() {
  const history = useHistory();
  const [medidas, setMedidas] = useState([]);
  const fullScreenLoader = useFullScreenLoader();
  const columns = [
    {
      name: "OF",
      options: rowConfig,
    },
    {
      name: "Código",
      options: rowConfig,
    },
    {
      name: "Tipo de Mola",
      options: rowConfig,
    },
    {
      name: "Cliente",
      options: rowConfig,
    },
    {
      name: "Quantidade",
      options: rowConfig,
    },
    {
      name: "Data",
      options: rowConfig,
    },
    {
      name: "Ações",
      options: rowConfig,
    },
  ];

  const data = [];

  function handleOnClickShowButton(event, id) {
    history.push("/medidas/mostrar/" + id);
  }

  function handleOnClickEditButton(event, id) {
    history.push("/medidas/editar/" + id);
  }

  useEffect(() => {
    fullScreenLoader.setLoading(true);
    api
      .get("/medidas")
      .then((response) => {
        response.data["data"].forEach((element) => {
          var array = [
            element["ordem_servico"].numero,
            element["codigo"],
            element["tipo"],
            element["ordem_servico"].cliente.nome,
            element["quantidade"],
            new Date(element["created_at"]).toLocaleString(),
            <>
              {/* <SearchIcon className={'btn btn-lista'} onClick={(event) => handleOnClickShowButton(event, element['id'])} /> */}
              <EditIcon
                className={"btn btn-lista"}
                onClick={(event) =>
                  handleOnClickEditButton(event, element["id"])
                }
              />
            </>,
          ];
          data.push(array);
        });
        setMedidas(data);
      })
      .finally(() => {
        fullScreenLoader.setLoading(false);
      });
  }, []);

  return (
    <>
      <Button
        onClick={() => history.push("/medidas/novo")}
        variant="outlined"
        startIcon={<AddIcon />}
        className={"btn btn-primary btn-spacing"}
      >
        Adicionar
      </Button>
      <MUIDataTable
        title={"Lista de Medidas"}
        data={medidas}
        columns={columns}
        options={config}
        className={"table-background"}
      />
    </>
  );
}

export default ListarMedidaPage;

