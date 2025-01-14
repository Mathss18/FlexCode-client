import { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import { useHistory } from "react-router-dom";
import { Button, Tooltip } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import LinearScaleIcon from "@mui/icons-material/LinearScale";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { config, rowConfig } from "../../../config/tablesConfig";
import { useFullScreenLoader } from "../../../context/FullScreenLoaderContext";
import { confirmAlert, errorAlert } from "../../../utils/alert";
import toast from "react-hot-toast";
import api from "../../../services/api";
import moment from "moment";
import { Chip } from "@mui/material";

function ListarOrcamentos() {
  const history = useHistory();
  const [orcamentos, setOrcamentos] = useState([]);
  const fullScreenLoader = useFullScreenLoader();
  const columns = [
    {
      name: "Número",
      options: rowConfig,
    },
    {
      name: "Cliente",
      options: rowConfig,
    },
    {
      name: "Situacao",
      options: rowConfig,
    },
    {
      name: "Data Entrada",
      options: rowConfig,
    },
    {
      name: "Ações",
      options: rowConfig,
    },
  ];

  const data = [];

  function handleOnClickShowButton(event, id) {
    history.push("/clientes/mostrar/" + id);
  }

  function handleOnClickEditButton(event, id) {
    history.push("/orcamentos/editar/" + id);
  }

  function handleOnClickPdfButton(event, item) {
    const BASE_URL = window.location.origin;
    const data = btoa(JSON.stringify(item));
    localStorage.setItem("orcamentoReport", data);

    window.open(`${BASE_URL}/orcamentos/relatorio`, "_blank");
  }

  function criarVenda(event, item) {
    console.log(item);
    if (item.situacao !== "Aprovado") {
      return errorAlert("Erro ao criar Venda", "Aprove o orçamento para criar uma venda");
    }
    api
      .get("/vendas-proximo")
      .then((response) => {
        const params = {
          numero: response.data["data"],
          orcamento_id: item.id,
          cliente_id: { label: item.cliente.nome, value: item.cliente.id },
          produtos: item.produtos.map((item, index) => {
            return {
              id: index,
              produto_id: item.id,
              quantidade: item.pivot.quantidade,
              preco: item.pivot.preco,
              total: item.pivot.total,
              observacao: item.pivot.observacao,
            };
          }),
          servicos: item.servicos.map((item, index) => {
            return {
              id: index,
              servico_id: item.id,
              quantidade: item.pivot.quantidade,
              preco: item.pivot.preco,
              total: item.pivot.total,
              observacao: item.pivot.observacao,
            };
          }),
          situacao: 0,
          dataEntrada: item.dataEntrada,
          horaEntrada: new Date().toLocaleTimeString(),
          dataSaida: item.dataEntrada,
          horaSaida: new Date().toLocaleTimeString(),
          frete: item.frete,
          outros: item.outros,
          impostos: item.impostos,
          desconto: item.desconto,
          total: item.total,
          observacao: item.observacao,
          observacaoInterna: item.observacaoInterna,
        };

        api
          .post("/vendas", params)
          .then((response) => {
            console.log(response.data["data"]);
            history.push("/vendas/editar/" + response.data["data"].id);
          })
          .catch((error) => {
            console.log(error);
            errorAlert("Erro ao criar Venda", error?.response?.data?.message);
          });
      })
      .catch((error) => {
        console.log(error);
        toast.error("Erro ao buscar próximo número de venda");
      });
  }

  useEffect(() => {
    fullScreenLoader.setLoading(true);
    api
      .get("/orcamentos")
      .then((response) => {
        response.data["data"].forEach((element) => {
          if (element["situacao"] === 0) {
            element["situacao"] = "Aberto";
          } else if (element["situacao"] === 1) {
            element["situacao"] = "Aprovado";
          } else if (element["situacao"] === 2) {
            element["situacao"] = "Reprovado";
          }
          var array = [
            element["numero"],
            element?.cliente?.nome ?? "",
            <Chip
              className="table-tag"
              label={element["situacao"]}
              color={
                element["situacao"] === "Aprovado"
                  ? "primary"
                  : element["situacao"] === "Aberto"
                  ? "secondary"
                  : "error"
              }
              size="small"
              style={{
                width: "90px",
                backgroundColor:
                  element["situacao"] === "Reprovado" ? "#c55959" : "",
              }}
            />,
            moment(element["dataEntrada"]).format("DD/MM/YYYY"),
            <>
              <Tooltip title={"Baixar PDF"} arrow>
                <InsertDriveFileIcon
                  className={"btn btn-lista"}
                  onClick={(event) => handleOnClickPdfButton(event, element)}
                />
              </Tooltip>
              <Tooltip title={"Gerar Venda"} arrow>
                <LinearScaleIcon
                  className={"btn btn-lista"}
                  onClick={(event) => criarVenda(event, element)}
                />
              </Tooltip>
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
        setOrcamentos(data);
      })
      .finally(() => {
        fullScreenLoader.setLoading(false);
      });
  }, []);

  return (
    <>
      <Button
        onClick={() => history.push("/orcamentos/novo")}
        variant="outlined"
        startIcon={<AddIcon />}
        className={"btn btn-primary btn-spacing"}
      >
        Adicionar
      </Button>
      <MUIDataTable
        title={"Lista de Orçamentos"}
        data={orcamentos}
        columns={columns}
        options={config}
        className={"table-background"}
      />
    </>
  );
}

export default ListarOrcamentos;
