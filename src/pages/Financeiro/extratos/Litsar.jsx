import { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useFullScreenLoader } from "../../../context/FullScreenLoaderContext";
import EditIcon from "@material-ui/icons/Edit";
import api from "../../../services/api";
import MUIDataTable from "mui-datatables";
import { config, rowConfig } from "../../../config/tablesConfig";
import moment from "moment";

function ListarExtratos() {
  const { id } = useParams();
  const history = useHistory();
  const fullScreenLoader = useFullScreenLoader();
  const [transacoes, setTransacoes] = useState([]);
  const [contaBancaria, setContaBancaria] = useState([]);
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
    // {
    //   name: "Ações",
    //   options: rowConfig,
    // },
  ];

  useEffect(() => {
    fullScreenLoader.setLoading(true);
    api
      .get("transacoes/contas-bancarias/" + id)
      .then((response) => {
        setContaBancaria(response.data["data"][0].conta_bancaria);
        var saldoParaCalculo = response.data["data"][0].conta_bancaria.saldo;
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
                }
                else if(element["venda_id"]) {
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
            // <>
            //   <EditIcon className={"btn-lista"} onClick={(event) => {}} />
            // </>,
          ];
          data.push(array);
        });
        data.push([
          "-",
          new Date(
            response.data["data"][0].conta_bancaria["created_at"]
          ).toLocaleString(),
          "[SISTEMA] SALDO INICIAL",
          <b style={{ color: "#007f45" }}>
            R$:{" "}
            {response.data["data"][0].conta_bancaria.saldoInicial.toFixed(2)}
          </b>,
          "R$: " +
            response.data["data"][0].conta_bancaria.saldoInicial.toFixed(2),
          "",
        ]);

        setTransacoes(data);
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
