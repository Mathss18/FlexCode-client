import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import api from "../../services/api";
import MUIDataTable from "mui-datatables";
import { config, rowConfig } from "../../config/tablesConfig";
import { Tooltip } from "@material-ui/core";
import { addDays } from "date-fns";
import { useFullScreenLoader } from "../../context/FullScreenLoaderContext";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';

function ListarEstoques() {
  const history = useHistory();
  const [produtos, setProdutos] = useState([]);
  const fullScreenLoader = useFullScreenLoader();
  const columns = [
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
      name: "Valor Custo",
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
    history.push("/estoques/movimentacoes/" + id);
    // history.push({
    //   pathname: "/estoques/movimentacoes/" + id,
    //   search:
    //     "?startDate=" +
    //     moment().format("YYYY-MM-DD") +
    //     "&endDate=" +
    //     moment().add(7,'days').format("YYYY-MM-DD"),
    // });
  }

  function handleOnClickEditButton(event, id) {
    history.push("/produtos/editar/" + id);
  }

  useEffect(() => {
    fullScreenLoader.setLoading(true);
    api
      .get("/estoques")
      .then((response) => {
        response.data["data"].forEach((element) => {
          var array = [
            element.produto.nome,
            element.produto.codigoInterno,
            element.produto.grupo_produto.nome,
            `R$: ${element.produto["valorCusto"].toFixed(2)}`,
            `${element["quantidade"]} ${
              element.produto.unidade_produto?.sigla ?? ""
            }`,
            element.produto?.cliente?.nome,
            element.produto["fornecedores"].map((item, index) => {
              if (element.produto["fornecedores"].length > 3) {
                let string = "";
                if (index < 3) {
                  string += item["nome"] + ", ";
                  if (index === 2) {
                    string +=
                      "... + " +
                      (element["fornecedores"].length - 3) +
                      " fornecedores";
                  }
                  return string;
                }
              } else {
                return item["nome"] + ", ";
              }
            }),
            new Date(element["created_at"]).toLocaleString(),
            <>
              <Tooltip title={"Movimentações"} arrow>
                <CompareArrowsIcon
                  className={"btn btn-lista"}
                  onClick={(event) =>
                    handleOnClickShowButton(event, element["id"])
                  }
                />
              </Tooltip>
              <Tooltip title={"Ajuste Manual"} arrow>
                <AutoFixHighIcon
                  className={"btn btn-lista"}
                  onClick={(event) =>{}}
                />
              </Tooltip>
            </>,
          ];
          data.push(array);
        });

        setProdutos(data);
      })
      .finally(() => {
        fullScreenLoader.setLoading(false);
      });
  }, []);

  return (
    <>
      {/* <Button onClick={() => history.push("/produtos/novo")} variant="outlined" startIcon={<AddIcon />} className={"btn btn-primary btn-spacing"}>
        Adicionar
      </Button> */}
      <MUIDataTable
        title={"Lista de Produtos em estoque"}
        data={produtos}
        columns={columns}
        options={config}
        className={"table-background"}
      />
    </>
  );
}

export default ListarEstoques;
