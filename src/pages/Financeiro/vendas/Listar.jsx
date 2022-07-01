import { useEffect, useRef, useState } from "react";
import MUIDataTable from "mui-datatables";
import { useHistory } from "react-router-dom";
import { Button, Tooltip } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import BalanceIcon from "@mui/icons-material/Balance";
import LinearScaleIcon from "@mui/icons-material/LinearScale";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
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
  const fullScreenLoader = useFullScreenLoader();
  const notaFiscalContext = useNotaFiscalContext();
  const empresaConfig = JSON.parse(localStorage.getItem("config"));
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

  const data = [];

  function handleOnClickShowButton(event, id) {
    history.push("/clientes/mostrar/" + id);
  }

  function handleOnClickNfeButton(event, element) {
    console.log(element);
    if (element.situacao !== "Realizada") {
      errorAlert("Só é possivel emitir NFe com a venda Realizada");
      return;
    }
    confirmAlert(
      "Atenção!",
      "Realmente deseja gerar a nota fiscal?",
      () => {
        criarNfe(element);
      },
      () => {
        // negado
      }
    );
  }

  function handleOnClickEditButton(event, id) {
    history.push("/vendas/editar/" + id);
  }

  function handleOnClickPdfButton(event, item) {
    const BASE_URL = window.location.origin;
    const data = btoa(JSON.stringify(item));
    localStorage.setItem("vendaReport", data);

    window.open(`${BASE_URL}/vendas/relatorio`, "_blank");
  }

  function alreadyHasVendaLinked(id) {
    if (ordensServicos.current.find((item) => item.venda_id === id)) {
      return true;
    } else {
      return false;
    }
  }

  async function handleOnClickOSButton(event, item) {
    if (alreadyHasVendaLinked(item["id"])) {
      confirmAlert(
        "Atenção!",
        "Essa venda já gerou uma OS, deseja continuar mesmo assim?",
        () => {
          criarOS(item);
        },
        () => {
          // negado
        }
      );
    } else {
      confirmAlert(
        "Atenção!",
        "Deseja mesmo criar uma OS?",
        () => {
          criarOS(item);
        },
        () => {
          // negado
        }
      );
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
          outros: item.impostos,
          desconto: item.desconto,
          total: item.total,
          observacao: item.observacao,
          observacaoInterna: item.observacaoInterna,
        };

        api
          .post("/ordens-servicos", params)
          .then((response) => {
            console.log(response.data["data"]);
            history.push("/ordens-servicos/editar/" + response.data["data"].id);
          })
          .catch((error) => {
            errorAlert("Erro ao criar OS", error?.response?.data?.message);
          });
      })
      .catch((error) => {
        toast.error("Erro ao buscar próximo número de ordem de serviço");
      });
  }

  function criarNfe(item) {
    const params = {
      venda_id: item.id,
      tpNF: 1,
      finNFe: 1,
      natOp: [],
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
      produtos: item.produtos.map((item, index) => {
        return {
          id: index,
          produto_id: item.id,
          nome: item.nome,
          cfop: item.cfop,
          quantidade: item.pivot.quantidade,
          preco: item.pivot.preco,
          total: item.pivot.total,
        };
      }),
      parcelas: item.parcelas.map((item, index) => {
        return {
          id: index,
          dataVencimento: item.dataVencimento,
          valorParcela: item.valorParcela,
          forma_pagamento_id: item.forma_pagamento.id,
          nome: item.forma_pagamento.nome,
        };
      }),
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

  useEffect(() => {
    fullScreenLoader.setLoading(true);
    api
      .get("/vendas")
      .then((response) => {
        response.data["data"].forEach((element) => {
          if (element["situacao"] === 0) {
            element["situacao"] = "Aberta";
          } else if (element["situacao"] === 1) {
            element["situacao"] = "Realizada";
          } else if (element["situacao"] === 2) {
            element["situacao"] = "Cancelada";
          }
          var array = [
            element["numero"],
            element["cliente"]["nome"],
            <Chip
              className="table-tag"
              label={element["situacao"]}
              color={
                element["situacao"] === "Aberta"
                  ? "primary"
                  : element["situacao"] === "Realizada"
                  ? "secondary"
                  : "error"
              }
              size="small"
              style={{
                width: "90px",
                backgroundColor:
                  element["situacao"] === "Cancelada" ? "#c55959" : "",
              }}
            />,
            `R$: ${element["total"].toFixed(
              empresaConfig.quantidadeCasasDecimaisValor
            )}`,
            moment(element["dataEntrada"]).format("DD/MM/YYYY"),
            <>
              <Tooltip title={"Baixar PDF"} arrow>
                <PictureAsPdfIcon
                  className={"btn btn-lista"}
                  onClick={(event) => handleOnClickPdfButton(event, element)}
                />
              </Tooltip>
              <Tooltip title={"Gerar OS"} arrow>
                <LinearScaleIcon
                  className={"btn btn-lista"}
                  onClick={(event) => handleOnClickOSButton(event, element)}
                />
              </Tooltip>
              <Tooltip title={"Gerar NF- e"} arrow>
                <BalanceIcon
                  className={"btn btn-lista"}
                  onClick={(event) => handleOnClickNfeButton(event, element)}
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
        setVendas(data);
      })
      .finally(() => {
        fullScreenLoader.setLoading(false);
      });
  }, []);

  useEffect(() => {
    fullScreenLoader.setLoading(true);
    api
      .get("/ordens-servicos")
      .then((response) => {
        ordensServicos.current = response.data["data"];
      })
      .finally(() => {
        fullScreenLoader.setLoading(false);
      });
  }, []);

  return (
    <>
      <Button
        onClick={() => history.push("/vendas/novo")}
        variant="outlined"
        startIcon={<AddIcon />}
        className={"btn btn-primary btn-spacing"}
      >
        Adicionar
      </Button>
      <MUIDataTable
        title={"Lista de Vendas"}
        data={vendas}
        columns={columns}
        options={config}
        className={"table-background"}
      />
    </>
  );
}

export default ListarVendas;
