import MUIDataTable from "mui-datatables";
import { useEffect, useState } from "react";
import { config, rowConfig } from "../../../config/tablesConfig";
import api from "../../../services/api";
import EditIcon from "@material-ui/icons/Edit";
import SearchIcon from "@material-ui/icons/Search";
import { useHistory } from "react-router-dom";
import { Button, Tooltip } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import ListAltIcon from "@mui/icons-material/ListAlt";
import { useFullScreenLoader } from "../../../context/FullScreenLoaderContext";

function ListarContasBancariasPage() {
  const columns = [
    {
      name: "Nome",
      options: rowConfig,
    },
    {
      name: "Saldo",
      options: rowConfig,
    },
    {
      name: "Ações",
      options: rowConfig,
    },
  ];

  const data = [];

  const [contasBancarias, setContasBancarias] = useState([]);
  const history = useHistory();
  const fullScreenLoader = useFullScreenLoader();

  function handleOnClickExtratoButton(event, id) {
    history.push("/extratos/" + id);
  }

  function handleOnClickEditButton(event, id) {
    history.push("/contas-bancarias/editar/" + id);
  }

  useEffect(() => {
    fullScreenLoader.setLoading(true);

    api
      .get("/contas-bancarias")
      .then((response) => {
        if (response != undefined) {
          response.data["data"].forEach((element) => {
            var array = [
              element["nome"],
              `R$: ${element["saldo"].toFixed(2)}`,
              <>
                <EditIcon
                  className={"btn-lista"}
                  onClick={(event) =>
                    handleOnClickEditButton(event, element["id"])
                  }
                />
                <Tooltip title="Visualizar extrato" arrow>
                  <ListAltIcon
                    className={"btn-lista"}
                    onClick={(event) =>
                      handleOnClickExtratoButton(event, element["id"])
                    }
                  />
                </Tooltip>
              </>,
            ];
            data.push(array);
          });

          setContasBancarias(data);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        fullScreenLoader.setLoading(false);
      });
  }, []);

  return (
    <>
      <Button
        onClick={() => history.push("/contas-bancarias/novo")}
        variant="outlined"
        startIcon={<AddIcon />}
        className={"btn btn-primary btn-spacing"}
      >
        Adicionar
      </Button>

      <MUIDataTable
        title={"Lista de contas bancárias"}
        data={contasBancarias}
        columns={columns}
        options={config}
        className={"table-background"}
      ></MUIDataTable>
    </>
  );
}

export default ListarContasBancariasPage;
