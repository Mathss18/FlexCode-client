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
  const [total, setTotal] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState(searchText);

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

  const config = {
    textLabels: {
      body: {
        noMatch: "Nenhum resultado encontrado.",
        toolTip: "Filtrar",
        columnHeaderTooltip: (column) => `Filtrar por ${column.label}`,
      },
      pagination: {
        next: "Próxima",
        previous: "Anterior",
        rowsPerPage: "Linhas por página",
        displayRows: "de",
      },
      toolbar: {
        search: "Procurar",
        downloadCsv: "Exportar para planilha",
        print: "Imprimir",
        viewColumns: "Ver Colunas",
        filterTable: "Filtrar Tabela",
      },
      filter: {
        all: "Todos",
        title: "Filtros",
        reset: "Limpar",
      },
      viewColumns: {
        title: "Mostrar Colunas",
        titleAria: "Mostrar/Esconder Colunas",
      },
      selectedRows: {
        text: "linha(s) selecionadas",
        delete: "Deletar",
        deleteAria: "Deletar linhas selecionadas",
      },
    },
    downloadOptions: {
      filename: "dados.csv",
      separator: ",",
    },
    setRowProps: (row, dataIndex, rowIndex) => {
      var classRow = "";
      if (rowIndex % 2 === 0) {
        classRow = "row row-par";
      } else {
        classRow = "row row-impar";
      }
      return {
        className: classRow,
      };
    },
    onCellClick: (colData, cellMeta) => {
      //console.log(cellMeta);
    },
    onRowsDelete: (rowsDeleted) => {
      console.log(rowsDeleted);
    },
    rowsPerPageOptions: [5, 10, 15, 20],
    selectableRowsHideCheckboxes: true,
    filter: true,
    filterType: "dropdown",
    responsive: "vertical",
    serverSide: true,
    count: total,
    rowsPerPage: itemsPerPage,
    onTableChange: (action, tableState) => {
      console.log(action, tableState);
      switch (action) {
        case "changePage":
          setCurrentPage(tableState.page + 1);
          break;
        case "changeRowsPerPage":
          setItemsPerPage(tableState.rowsPerPage);
          setCurrentPage(1);
          break;
        case "search":
          setSearchText(tableState.searchText);
          setCurrentPage(1);
          break;
        default:
          console.log("action not handled.");
      }
    },
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchText]);

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

  const fetchNotasFiscais = () => {
    fullScreenLoader.setLoading(true);
    const params = {
      itemsPerPage: itemsPerPage,
      currentPage: currentPage,
      searchText: debouncedSearchText,
    };

    api
      .get("/notas-fiscais-mini", { params })
      .then((response) => {
        const fetchedData = response.data["data"].data.map((element) => {
          return [
            element["nNF"],
            element["tpNF"] == 1 ? "Entrada" : "Saída",
            element["venda_id"],
            element["chaveNF"],
            element["favorecido_nome"],
            `R$: ` + element["totalFinal"],
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
              <EditIcon
                className={"btn btn-lista"}
                onClick={(event) =>
                  handleOnClickEditButton(event, element["id"])
                }
              />
            </>,
          ];
        });
        console.log(fetchedData);
        setClientes(fetchedData);
        setTotal(response.data.data.totalItems);
      })
      .catch((error) =>
        console.error("There was an error fetching the notas fiscais", error)
      )
      .finally(() => {
        fullScreenLoader.setLoading(false);
      });
  };

  useEffect(() => {
    fetchNotasFiscais();
  }, [currentPage, itemsPerPage, debouncedSearchText]);

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
