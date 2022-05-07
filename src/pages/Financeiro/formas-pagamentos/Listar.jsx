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



function ListarFormasPagamentosPage() {
  const columns = [
    {
      name: "Nome",
      options: rowConfig,
    },
    {
      name: "Número Máximo de Parcelas",
      options: rowConfig,
    },
    {
      name: "Intervalo de Parcelas",
      options: rowConfig,
    },
    {
      name: "Banco",
      options: rowConfig,
    },
    {
      name: "Ações",
      options: rowConfig,
    },
  ];

  const data = [];
  
  const [formasPagamentos, setFormasPagamento] = useState([]);
  const history = useHistory();
  const fullScreenLoader = useFullScreenLoader();

  function handleOnClickShowButton(event, id) {
    history.push("/formas-pagamentos/mostrar/" + id);
  }

  function handleOnClickEditButton(event, id) {
    history.push("/formas-pagamentos/editar/" + id);
  }

  useEffect(() => {
    fullScreenLoader.setLoading(true);

    api
      .get("/formas-pagamentos")
      .then((response) => {
        if (response != undefined) {
          response.data["data"].forEach((element) => {
            var array = [
              element["nome"],
              element["numeroMaximoParcelas"],
              element["intervaloParcelas"],
              element["conta_bancaria"]["nome"],
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

          setFormasPagamento(data);
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
        onClick={() => history.push("/formas-pagamentos/novo")}
        variant="outlined"
        startIcon={<AddIcon />}
        className={"btn btn-primary btn-spacing"}
      >
        Adicionar
      </Button>

      <MUIDataTable
        title={"Lista de formas de pagamentos"}
        data={formasPagamentos}
        columns={columns}
        options={config}
        className={"table-background"}
      ></MUIDataTable>
    </>
  );
}

export default ListarFormasPagamentosPage;
