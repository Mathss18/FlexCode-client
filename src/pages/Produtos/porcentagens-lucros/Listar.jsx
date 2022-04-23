import MUIDataTable from "mui-datatables";
import { useEffect, useState } from "react";
import { config, rowConfig } from "../../../config/tablesConfig";
import api from "../../../services/api";
import EditIcon from "@material-ui/icons/Edit";
import SearchIcon from "@material-ui/icons/Search";
import { useHistory } from "react-router-dom";
import { Button } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { useFullScreenLoader } from "../../../context/FullScreenLoaderContext";

const columns = [
  {
    name: "Descrição",
    options: rowConfig,
  },
  {
    name: "Porcentagem",
    options: rowConfig,
  },
  {
    name: "Ações",
    options: rowConfig,
  },
];

const data = [];

function ListarPorcentagensLucros() {
  const [porcentagensLucros, setPorcentagensLucros] = useState([]);
  const history = useHistory();
  const fullScreenLoader = useFullScreenLoader();

  function handleOnClickShowButton(event, id) {
    history.push("/porcentagens-lucros/mostrar/" + id);
  }

  function handleOnClickEditButton(event, id) {
    history.push("/porcentagens-lucros/editar/" + id);
  }

  useEffect(() => {
    fullScreenLoader.setLoading(true);

    api
      .get("/porcentagens-lucros")
      .then((response) => {
        if (response != undefined) {
          response.data["data"].forEach((element) => {
            var array = [
              element["descricao"],
              element["porcentagem"],
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

          setPorcentagensLucros(data);
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
        onClick={() => history.push("/porcentagens-lucros/novo")}
        variant="outlined"
        startIcon={<AddIcon />}
        className={"btn btn-primary btn-spacing"}
      >
        Adicionar
      </Button>

      <MUIDataTable
        title={"Lista de porcentagens de lucros"}
        data={porcentagensLucros}
        columns={columns}
        options={config}
        className={"table-background"}
      ></MUIDataTable>
    </>
  );
}

export default ListarPorcentagensLucros;
