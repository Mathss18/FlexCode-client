import { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import { useHistory } from "react-router-dom";
import api from "../../../services/api";
import { config, rowConfig } from "../../../config/tablesConfig";
import { Button, Chip, Tooltip } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import SearchIcon from "@material-ui/icons/Search";
import { useFullScreenLoader } from "../../../context/FullScreenLoaderContext";
import { useNotaFiscalContext } from "../../../context/NotaFiscalContext";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";

function ListarNotasFiscaisPage() {
  const history = useHistory();
  const [clientes, setClientes] = useState([]);
  const fullScreenLoader = useFullScreenLoader();
  const notaFiscalContext = useNotaFiscalContext();
  const columns = [
    {
      name: "Número",
      options: rowConfig,
    },
    {
      name: "Tipo",
      options: rowConfig,
    },
    {
      name: "Venda",
      options: rowConfig,
    },
    {
      name: "Chave",
      options: rowConfig,
    },
    {
      name: "Favorecido",
      options: rowConfig,
    },
    {
      name: "Valor",
      options: rowConfig,
    },
    {
      name: "Situação",
      options: rowConfig,
    },
    {
      name: "Ações",
      options: rowConfig,
    },
  ];

  useEffect(() => {
    notaFiscalContext.formik.resetForm(); // Reseta o formik
  }, []);

  const data = [];

  function handleOnClickShowButton(event, id) {
    history.push("/clientes/mostrar/" + id);
  }

  function handleOnClickEditButton(event, id) {
    history.push("/notas-fiscais/editar/" + id);
  }

  useEffect(() => {
    fullScreenLoader.setLoading(true);
    api
      .get("/notas-fiscais")
      .then((response) => {
        response.data["data"].forEach((element) => {
          var array = [
            element["nNF"],
            element["tpNF"] == 1 ? "Entrada" : "Saída",
            element["venda_id"] ? (
              <Tooltip title="Visualizar venda">
                <a
                  href={`./vendas/editar/${element["venda_id"]}`}
                  target="_blank"
                >
                  <LocalAtmIcon />
                </a>
              </Tooltip>
            ) : (
              <></>
            ),
            element["chaveNF"],
            element["favorecido_nome"],
            `R$: ` + element["totalProdutos"],
            <Chip
              className="table-tag"
              label={element["situacao"]}
              color={element["situacao"] === "Autorizada" ? "primary" : "error"}
              size="small"
              style={{
                width: "90px",
                backgroundColor:
                  element["situacao"] === "Cancelada" ? "#c55959" : "",
              }}
            />,
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
        console.log(data);
        setClientes(data);
      })
      .finally(() => {
        fullScreenLoader.setLoading(false);
      });
  }, []);

  return (
    <>
      <Button
        onClick={() => history.push("/notas-fiscais/novo")}
        variant="outlined"
        startIcon={<AddIcon />}
        className={"btn btn-primary btn-spacing"}
      >
        Adicionar
      </Button>
      <MUIDataTable
        title={"Lista de Notas Físcais"}
        data={clientes}
        columns={columns}
        options={config}
        className={"table-background"}
      />
    </>
  );
}

export default ListarNotasFiscaisPage;
