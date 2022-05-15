import { useEffect, useRef, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useFullScreenLoader } from "../../../context/FullScreenLoaderContext";
import EditIcon from "@material-ui/icons/Edit";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import api from "../../../services/api";
import MUIDataTable from "mui-datatables";
import { config, rowConfig } from "../../../config/tablesConfig";
import moment from "moment";
import ModalTransacao from "../money/ModalTransacao";
import { errorAlert } from "../../../utils/alert";
import { Button } from "@material-ui/core";

function ListarExtratos() {
  const { id } = useParams();
  const history = useHistory();
  const fullScreenLoader = useFullScreenLoader();
  const [transacoes, setTransacoes] = useState([]);
  const [contaBancaria, setContaBancaria] = useState(null);

  const [clientes, setClientes] = useState([]);
  const [fornecedores, setFornecedores] = useState([]);
  const [transportadoras, setTransportadoras] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  const [contasBancarias, setContasBancarias] = useState([]);
  const [editTransacao, setEditTransacao] = useState(null);
  const [modalTransacaoOpen, setModalTransacaoOpen] = useState(false);
  const tipoTrans = useRef("");
  const dataSelecionada = useRef("");

  const data = [];
  const columns = [
    {
      name: "Data (Money)",
      options: rowConfig,
    },
    {
      name: "Data Registrado",
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
      name: "Saldo",
      options: rowConfig,
    },
    {
      name: "Ações",
      options: rowConfig,
    },
  ];

  useEffect(() => {
    loadTransacoes();
  }, []);

  useEffect(() => {
    let url1 = "/clientes";
    let url2 = "/fornecedores";
    let url3 = "/funcionarios";
    let url4 = "/contas-bancarias";
    let url5 = "/transportadoras";

    const req1 = api.get(url1);
    const req2 = api.get(url2);
    const req3 = api.get(url3);
    const req4 = api.get(url4);
    const req5 = api.get(url5);

    Promise.all([req1, req2, req3, req4, req5])
      .then(function ([resp1, resp2, resp3, resp4, resp5]) {
        var array = [];
        resp1.data["data"].forEach((cliente) => {
          if (cliente.situacao === 1) {
            array.push({ label: cliente.nome, value: cliente.id });
          }
        });
        setClientes(array);

        array = [];
        resp2.data["data"].forEach((fornecedor) => {
          if (fornecedor.situacao === 1) {
            array.push({ label: fornecedor.nome, value: fornecedor.id });
          }
        });
        setFornecedores(array);

        array = [];
        resp3.data["data"].forEach((funcionario) => {
          if (funcionario.situacao === 1) {
            array.push({ label: funcionario.nome, value: funcionario.id });
          }
        });
        setFuncionarios(array);

        array = [];
        resp4.data["data"].forEach((contaBancaria) => {
          array.push({ label: contaBancaria.nome, value: contaBancaria.id });
        });
        setContasBancarias(array);

        array = [];
        resp5.data["data"].forEach((transportadora) => {
          if (transportadora.situacao === 1) {
            array.push({
              label: transportadora.nome,
              value: transportadora.id,
            });
          }
        });
        setTransportadoras(array);
      })
      .catch((errors) => {
        errorAlert(
          "Erro ao carregar informações da tela!",
          "tente novamente mais tarde"
        );
      });
  }, []);

  function loadTransacoes() {
    fullScreenLoader.setLoading(true);
    api
      .get("transacoes/contas-bancarias/" + id)
      .then((response) => {
        setContaBancaria(response.data["data"][0]?.conta_bancaria);
        var saldoParaCalculo = response.data["data"][0]?.conta_bancaria.saldo;
        response.data["data"].forEach((element, index) => {
          if (index !== 0) {
            if (element.tipo === "rendimento")
              saldoParaCalculo =
                saldoParaCalculo - response.data["data"][index - 1].valor;
            else
              saldoParaCalculo =
                saldoParaCalculo - response.data["data"][index - 1].valor;
          }
          if (index + 1 === response.data["data"].length) {
            if (element.tipo === "rendimento") {
              saldoParaCalculo =
                response.data["data"][0].conta_bancaria.saldoInicial +
                element["valor"];
            } else {
              saldoParaCalculo =
                response.data["data"][0].conta_bancaria.saldoInicial -
                element["valor"];
            }
          }
          var array = [
            moment(element["data"]).format("DD/MM/YYYY"),
            new Date(element["dataTransacaoRegistrada"]).toLocaleString(),
            element["favorecido_nome"],
            <b
              onClick={() => {
                if (element["compra_id"]) {
                  history.push("/compras/editar/" + element["compra_id"]);
                } else if (element["venda_id"]) {
                  history.push("/vendas/editar/" + element["venda_id"]);
                }
              }}
              style={{
                color: element.tipo === "rendimento" ? "#007f45" : "#c62b2b",
                cursor: "pointer",
              }}
            >{`R$: ${
              element.tipo === "rendimento"
                ? element["valor"].toFixed(2)
                : (element["valor"] * -1).toFixed(2)
            }`}</b>,
            `R$: ${saldoParaCalculo.toFixed(2)}`,
            <>
              <EditIcon
                className={"btn-lista"}
                onClick={(event) => {
                  tipoTrans.current = element.tipo;
                  setEditTransacao({
                    ...element,
                    favorecido_id: {
                      label: element.favorecido_nome,
                      value: element.favorecido_id,
                    },
                  });
                  setModalTransacaoOpen(true);
                }}
              />
            </>,
          ];
          data.push(array);
        });
        if(response.data["data"][0]?.conta_bancaria){
          data.push([
            "-",
            new Date(
              response.data["data"][0]?.conta_bancaria["created_at"]
            ).toLocaleString(),
            "[SISTEMA] SALDO INICIAL",
            <b style={{ color: "#007f45" }}>
              R$:{" "}
              {response.data["data"][0]?.conta_bancaria.saldoInicial.toFixed(2)}
            </b>,
            "R$: " +
              response.data["data"][0]?.conta_bancaria.saldoInicial.toFixed(2),
            "",
          ]);
        }
        

        setTransacoes(data);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        fullScreenLoader.setLoading(false);
      });
  }

  return (
    <>
      <ModalTransacao
        open={modalTransacaoOpen}
        setOpen={setModalTransacaoOpen}
        clientes={clientes}
        fornecedores={fornecedores}
        transportadoras={transportadoras}
        funcionarios={funcionarios}
        tipoTransacao={tipoTrans}
        dataSelecionada={dataSelecionada.current}
        contasBancarias={contasBancarias}
        editTransacao={editTransacao}
        contaBancariaSelecionada={contaBancaria != null ? contaBancaria : null}
        renderTransicoes={() => {
          loadTransacoes();
        }}
      />
      <Button
        onClick={() => {
          setEditTransacao(null);
          tipoTrans.current = "rendimento";
          dataSelecionada.current = moment().format("YYYY-MM-DD");
          setModalTransacaoOpen(true);
        }}
        variant="outlined"
        startIcon={<ArrowCircleUpIcon />}
        className={"btn btn-primary btn-spacing"}
        >
        Novo Rendimento
      </Button>
      <Button
        onClick={() => {
          setEditTransacao(null);
          tipoTrans.current = "despesa";
          dataSelecionada.current = moment().format("YYYY-MM-DD");
          setModalTransacaoOpen(true);
        }}
        variant="outlined"
        startIcon={<ArrowCircleDownIcon />}
        className={"btn btn-error btn-spacing"}
      >
        Nova Despesa
      </Button>
      <MUIDataTable
        style={{ boxShadow: "none" }}
        title={(() => {
          return (
            <>
              <h2 className="dialogTitle">{`Extrato ${
                contaBancaria?.nome ?? ""
              }`}</h2>
              <h4 className="dialogTitle">
                {`Saldo: R$: ${contaBancaria?.saldo?.toFixed(2) ?? ""}`}
              </h4>
            </>
          );
        })()}
        data={transacoes}
        columns={columns}
        options={config}
        className={"table-background"}
      />
    </>
  );
}

export default ListarExtratos;
