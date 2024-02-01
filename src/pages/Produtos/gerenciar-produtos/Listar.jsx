import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import api from "../../../services/api";
import MUIDataTable from "mui-datatables";
import { rowConfig } from "../../../config/tablesConfig";
import { Button } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import { useFullScreenLoader } from "../../../context/FullScreenLoaderContext";
import { useProdutoContext } from "../../../context/GerenciarProdutosContext";
import { Chip } from "@mui/material";

function ListarProdutos() {
  const history = useHistory();
  const [grupos, setGrupos] = useState([]);
  const fullScreenLoader = useFullScreenLoader();
  const produtoContext = useProdutoContext();
  const empresaConfig = JSON.parse(localStorage.getItem("config"));
  const [total, setTotal] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState(searchText);

  const columns = [
    {
      name: "ID",
      options: rowConfig,
    },
    {
      name: "Nome",
      options: rowConfig,
    },
    {
      name: "Código Interno",
      options: rowConfig,
    },
    {
      name: "Grupo",
      options: rowConfig,
    },
    {
      name: "Custo Final",
      options: rowConfig,
    },
    {
      name: "Estoque",
      options: rowConfig,
    },
    {
      name: "Cliente",
      options: rowConfig,
    },
    {
      name: "Fornecedores",
      options: rowConfig,
    },
    {
      name: "Atualizado em",
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
        noMatch: "Nenhum resultado encontrado.", //<CircularProgress />,
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
      if (row[2] === "entrada" || row[2] === "saida") {
        if (row[2] === "entrada") {
          classRow = "row row-entrada";
        } else {
          classRow = "row row-saida";
        }
      } else {
        if (rowIndex % 2 === 0) {
          classRow = "row row-par";
        } else {
          classRow = "row row-impar";
        }
      }
      return {
        className: classRow,
      };
    },
    setCellProps: (value) => {
      console.log(value);
      return {
        style: {
          border: "2px solid blue",
        },
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
          setCurrentPage(1); // Reset to first page with new rowsPerPage
          break;
        case "search":
          setSearchText(tableState.searchText);
          setCurrentPage(1); // Reset to first page with new search text
          break;
        default:
          console.log("action not handled.");
      }
    },
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 500); // Delay in ms

    return () => {
      clearTimeout(handler);
    };
  }, [searchText]);

  function handleOnClickEditButton(event, id) {
    history.push("/produtos/editar/" + id);
  }

  const fetchProdutos = () => {
    fullScreenLoader.setLoading(true);
    const params = {
      itemsPerPage: itemsPerPage,
      currentPage: currentPage,
      searchText: debouncedSearchText,
    };

    api
      .get("/produtos-mini2", { params })
      .then((response) => {
        console.log(response.data.data);
        const fetchedData = response.data.data.data.map((element) => {
          var qtdFornecedores = element?.fornecedores?.length - 1;
          return [
            element["id"],
            element["nome"],
            element["codigoInterno"],
            element["grupo_produto"]["nome"],
            `R$: ${element["custoFinal"].toFixed(
              empresaConfig.quantidadeCasasDecimaisValor
            )}`,
            `${element["quantidadeAtual"]} ${
              element["unidade_produto"]?.sigla ?? ""
            }`,
            element?.cliente?.nome,

            // element["fornecedores"].map((item,index)=>{
            //   if(element["fornecedores"].length > 3){
            //     let string = '';
            //     if(index < 3){
            //       string += item["nome"] + ', ';
            //       if(index === 2){
            //         string += '... + ' + (element["fornecedores"].length - 3) + ' fornecedores';
            //       }
            //       return string;
            //     }
            //   }
            //   else{
            //     return item["nome"] + ', ';
            //   }
            // }),

            element?.fornecedores?.length === 0 ? null : (
              <>
                <Chip
                  label={element?.fornecedores[0]?.nome}
                  style={{ background: "#585858" }}
                />
                {qtdFornecedores === 0 ? null : (
                  <Chip
                    label={"+" + qtdFornecedores}
                    style={{ background: "#585858", marginLeft: 2 }}
                  />
                )}
              </>
            ),

            new Date(element["updated_at"]).toLocaleString(),
            <>
              {/* <SearchIcon className={"btn-lista"} onClick={(event) => handleOnClickShowButton(event, element["id"])} /> */}
              <EditIcon
                className={"btn-lista"}
                onClick={(event) =>
                  handleOnClickEditButton(event, element["id"])
                }
              />
            </>,
          ];
        });
        console.log(fetchedData);
        setGrupos(fetchedData);
        setTotal(response.data.data.totalItems); // Assuming the API returns totalItems
      })
      .catch((error) =>
        console.error("There was an error fetching the products", error)
      )
      .finally(() => fullScreenLoader.setLoading(false));
  };

  useEffect(() => {
    fetchProdutos();
  }, [currentPage, itemsPerPage, debouncedSearchText]);

  useEffect(() => {
    produtoContext.formik.resetForm(); // Reseta o formik
  }, []);

  return (
    <>
      <Button
        onClick={() => history.push("/produtos/novo")}
        variant="outlined"
        startIcon={<AddIcon />}
        className={"btn btn-primary btn-spacing"}
      >
        Adicionar
      </Button>
      <MUIDataTable
        title={"Lista de Produtos"}
        data={grupos}
        columns={columns}
        options={config}
        className={"table-background"}
      />
    </>
  );
}

export default ListarProdutos;
