import { useEffect, useRef, useState } from "react";
import MUIDataTable from "mui-datatables";
import { useHistory } from "react-router-dom";
import { Button, Tooltip } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import BalanceIcon from "@mui/icons-material/Balance";
import LinearScaleIcon from "@mui/icons-material/LinearScale";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { config, rowConfig } from "../../../config/tablesConfig";
import { useFullScreenLoader } from "../../../context/FullScreenLoaderContext";
import api from "../../../services/api";
import moment from "moment";
import { Chip } from "@mui/material";
import { confirmAlert, errorAlert } from "../../../utils/alert";
import toast from "react-hot-toast";
import { useNotaFiscalContext } from "../../../context/NotaFiscalContext";

function ListarVendas() {
  const history = useHistory();
  const [vendas, setVendas] = useState([]);
  const ordensServicos = useRef([]);
  const { setLoading } = useFullScreenLoader();
  const notaFiscalContext = useNotaFiscalContext();
  const empresaConfig = JSON.parse(localStorage.getItem("config"));
  const [total, setTotal] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState(searchText);

  const columns = [
    {
      name: "Número Venda",
      options: rowConfig,
    },
    {
      name: "Número OF",
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
      name: "Valor da venda",
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

  // ------- Utility functions ------
  function alreadyHasVendaLinked(id) {
    return !!ordensServicos.current.find((item) => item.venda_id === id);
  }

  function getLikeVendaLinked(id) {
    return ordensServicos.current.find((item) => item.venda_id === id);
  }

  // ------- Handlers -----------
  function handleOnClickPdfButton(event, item) {
    const BASE_URL = window.location.origin;
    const dataEncoded = btoa(JSON.stringify(item));
    localStorage.setItem("vendaReport", dataEncoded);
    window.open(`${BASE_URL}/vendas/relatorio`, "_blank");
  }

  function handleOnClickOSButton(event, item) {
    if (alreadyHasVendaLinked(item.id)) {
      confirmAlert(
        "Atenção!",
        "Essa venda já gerou uma OF, deseja continuar mesmo assim?",
        () => {
          criarOS(item);
        }
      );
    } else {
      confirmAlert("Atenção!", "Deseja mesmo criar uma OF?", () => {
        criarOS(item);
      });
    }
  }

  function criarOS(item) {
    api
      .get("/ordens-servicos-proximo")
      .then((response) => {
        const params = {
          numero: response.data["data"],
          venda_id: item.id,
          cliente_id: { label: item.cliente.nome, value: item.cliente.id },
          produtos: item.produtos.map((prod, index) => ({
            id: index,
            produto_id: prod.id,
            quantidade: prod.pivot.quantidade,
            preco: prod.pivot.preco,
            total: prod.pivot.total,
            observacao: prod.pivot.observacao,
          })),
          servicos: item.servicos.map((srv, index) => ({
            id: index,
            servico_id: srv.id,
            quantidade: srv.pivot.quantidade,
            preco: srv.pivot.preco,
            total: srv.pivot.total,
            observacao: srv.pivot.observacao,
          })),
          situacao: 0,
          dataEntrada: item.dataEntrada,
          horaEntrada: new Date().toLocaleTimeString(),
          dataSaida: item.dataEntrada,
          horaSaida: new Date().toLocaleTimeString(),
          frete: item.frete,
          outros: item.impostos,
          desconto: item.desconto,
          total: item.total,
          observacao: item.observacao,
          observacaoInterna: item.observacaoInterna,
        };

        api
          .post("/ordens-servicos", params)
          .then((res) => {
            history.push("/ordens-servicos/editar/" + res.data["data"].id);
          })
          .catch((error) => {
            errorAlert("Erro ao criar OF", error?.response?.data?.message);
          });
      })
      .catch(() => {
        toast.error("Erro ao buscar próximo número de ordem de serviço");
      });
  }

  function handleOnClickNfeButton(event, element) {
    if (element.situacao === "Aberta" || element.situacao === "Cancelada") {
      errorAlert(
        "Só é possivel emitir NFe com a situação da venda Realizada ou Parcial"
      );
      return;
    }
    confirmAlert("Atenção!", "Realmente deseja gerar a nota fiscal?", () => {
      criarNfe(element);
    });
  }

  function criarNfe(item) {
    const params = {
      venda_id: item.id,
      tpNF: 1,
      finNFe: 1,
      natOp: [],
      refNFe: null,
      clienteFornecedor_id: {
        label: item.cliente.nome,
        value: item.cliente.id,
        tipo: "clientes",
      },
      indFinal: 1,
      indPres: "2",
      transportadora_id: item?.transportadora?.id
        ? { label: item?.transportadora?.nome, value: item?.transportadora?.id }
        : null,
      modFrete: 2,
      frete: item.frete,
      produtos: item.produtos
        .filter((prod) => item.situacao !== "Parcial" || !prod.pivot.observacao)
        .map((prod, index) => ({
          id: index,
          produto_id: prod.id,
          nome: prod.nome,
          cfop: prod.cfop,
          quantidade: prod.pivot.quantidade,
          preco: prod.pivot.preco,
          total: prod.pivot.total,
        })),
      parcelas: item.parcelas.map((p, index) => ({
        id: index,
        dataVencimento: p.dataVencimento,
        valorParcela: p.valorParcela,
        forma_pagamento_id: p.forma_pagamento.id,
        nome: p.forma_pagamento.nome,
      })),
      totalProdutos: 0,
      forma_pagamento_id: {
        label: item.forma_pagamento.nome,
        value: item.forma_pagamento.id,
      },
      quantidadeParcelas: item.quantidadeParcelas,
      intervaloParcelas: item.intervaloParcelas,
      tipoFormaPagamento: item.tipoFormaPagamento,
      dataPrimeiraParcela: item.dataPrimeiraParcela,
      esp: "",
      qVol: "",
      desconto: 0,
      pesoB: "",
      pesoL: "",
      unidadePadrao: "",
      infCpl: "",
      totalFinal: item.total,
      qtdeMaximaParcelas: item.forma_pagamento.numeroMaximoParcelas,
    };

    notaFiscalContext.formik.setValues(params);
    history.push("/notas-fiscais/novo");
  }

  function handleOnClickEditButton(event, id) {
    history.push("/vendas/editar/" + id);
  }

  // Debounce effect for search text
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchText]);

  // Fetch vendas with pagination
  const fetchVendas = async () => {
    setLoading(true);

    try {
      // 1) load ordens-servicos first
      const responseOs = await api.get("/ordens-servicos");
      ordensServicos.current = responseOs.data["data"];

      // 2) then load vendas with pagination
      const params = {
        itemsPerPage: itemsPerPage,
        currentPage: currentPage,
        searchText: debouncedSearchText,
      };

      const responseVendas = await api.get("/vendas-mini", { params });
      const data = [];

      responseVendas.data["data"].data.forEach((element) => {
          // Convert numeric situacao into string
          if (element.situacao === 0) {
            element.situacao = "Aberta";
          } else if (element.situacao === 1) {
            element.situacao = "Realizada";
          } else if (element.situacao === 2) {
            element.situacao = "Cancelada";
          } else if (element.situacao === 3) {
            element.situacao = "Parcial";
          }

          data.push([
            element.numero,
            <Chip
              key={`of-chip-${element.id}`}
              className="table-tag"
              label={getLikeVendaLinked(element.id)?.numero ?? "----"}
              style={{
                backgroundColor: getLikeVendaLinked(element.id)?.numero
                  ? "#1976d2"
                  : "#000",
              }}
              onClick={() => {
                if (getLikeVendaLinked(element.id)?.numero) {
                  window.open(
                    "/ordens-servicos/editar/" +
                      getLikeVendaLinked(element.id).numero,
                    "_blank"
                  );
                }
              }}
              size="small"
            />,
            element.cliente.nome,
            <Chip
              key={`situacao-${element.id}`}
              className="table-tag"
              label={element.situacao}
              color={
                element.situacao === "Aberta"
                  ? "primary"
                  : element.situacao === "Realizada"
                  ? "secondary"
                  : element.situacao === "Cancelada"
                  ? "error"
                  : "warning"
              }
              size="small"
              style={{
                width: "90px",
                backgroundColor:
                  element.situacao === "Cancelada" ? "#c55959" : "",
              }}
            />,
            `R$: ${element.total.toFixed(
              empresaConfig.quantidadeCasasDecimaisValor
            )}`,
            moment(element.dataEntrada).format("DD/MM/YYYY"),
            <>
              <Tooltip title="Baixar PDF" arrow>
                <PictureAsPdfIcon
                  className="btn btn-lista"
                  onClick={(event) => handleOnClickPdfButton(event, element)}
                />
              </Tooltip>
              <Tooltip title="Gerar OF" arrow>
                <LinearScaleIcon
                  style={{
                    backgroundColor: alreadyHasVendaLinked(element.id)
                      ? "#c55959"
                      : "#2e7d32",
                  }}
                  className="btn btn-lista"
                  onClick={(event) => handleOnClickOSButton(event, element)}
                />
              </Tooltip>
              <Tooltip title="Gerar NF-e" arrow>
                <BalanceIcon
                  className="btn btn-lista"
                  onClick={(event) => handleOnClickNfeButton(event, element)}
                />
              </Tooltip>
              <EditIcon
                className="btn btn-lista"
                onClick={(event) => handleOnClickEditButton(event, element.id)}
              />
            </>,
          ]);
        });

        setVendas(data);
        setTotal(responseVendas.data.data.totalItems);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchVendas();
  }, [currentPage, itemsPerPage, debouncedSearchText]);

  // Configure table options with server-side pagination
  const tableConfig = {
    ...config,
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

  // ---------- Render ----------
  return (
    <>
      <Button
        onClick={() => history.push("/vendas/novo")}
        variant="outlined"
        startIcon={<AddIcon />}
        className="btn btn-primary btn-spacing"
      >
        Adicionar
      </Button>
      <MUIDataTable
        title="Lista de Vendas"
        data={vendas}
        columns={columns}
        options={tableConfig}
        className="table-background"
      />
    </>
  );
}

export default ListarVendas;
