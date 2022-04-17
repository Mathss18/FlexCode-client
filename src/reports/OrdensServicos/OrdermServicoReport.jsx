import "./ordemServico.css";
import logo from "./img.jpg";
import { useEffect, useState } from "react";
import moment from "moment";
import { Fab } from "@material-ui/core";
import PrintIcon from "@mui/icons-material/Print";
import { QRCodeSVG } from "qrcode.react";

export default function OrdermServicoReport(texto) {
  const [dados, setDados] = useState(null);
  const [totalProdutos, setTotalProdutos] = useState({
    quantidade: 0,
    valor: 0,
  });
  const [totalServicos, setTotalServicos] = useState({
    quantidade: 0,
    valor: 0,
  });

  useEffect(() => {
    const reportData = localStorage.getItem("ordemServicoReport");
    setDados(JSON.parse(atob(reportData)));
  }, []);

  useEffect(() => {
    if (!dados) return;
    const quantidadeProdutos = dados?.produtos.reduce(
      (acc, element) => acc + element.pivot.quantidade,
      0
    );
    const valorTotalProdutos = dados?.produtos.reduce(
      (acc, element) => acc + element.pivot.total,
      0
    );

    const quantidadeServicos = dados?.servicos.reduce(
      (acc, element) => acc + element.pivot.quantidade,
      0
    );
    const valorTotalServicos = dados?.servicos.reduce(
      (acc, element) => acc + element.pivot.total,
      0
    );

    setTotalProdutos({
      quantidade: quantidadeProdutos,
      valor: valorTotalProdutos,
    });

    setTotalServicos({
      quantidade: quantidadeServicos,
      valor: valorTotalServicos,
    });
  }, [dados]);

  function print() {
    window.print("Ordem Serviço - " + dados?.numero);
    window.close();
  }

  return (
    <>
      <div className="containerReport">
        <div className="containerHeader">
          <img src={logo} alt="logo" className="containerImg" />
          <div className="headerLeft" style={{ display: "flex", gap: 10 }}>
            <div>
              <h3>Flex Mol Industria e Comercio de Molas</h3>
              <p>
                <b>CNPJ:</b> 43.206.158/0001-25
              </p>
              <p>
                <b>Rua:</b> Rua Bofete, 79
              </p>
              <p>
                <b>Cidade:</b> Piracicaba
              </p>
              <p>
                <b>Bairro:</b> Jardim São Jorge
              </p>
            </div>
            <div>
              <h4>&nbsp;</h4>
              <p>
                <b>Telefone:</b> (19) 34353705
              </p>
              <p>
                <b>Celular:</b> (19) 983136930
              </p>
              <p>
                <b>Email:</b> flexmol@flexmol.com.br
              </p>
            </div>
          </div>

          <div className="headerRight">
            <p>
              {"Ordem de serviço nº: " +
                dados?.numero.toString().padStart(6, "0")}
            </p>
            <p>
              {"Data de abertura: " +
                moment(dados?.dataEntrada).format("DD/MM/YYYY")}
            </p>
            <QRCodeSVG value="https://google.com/"/>
          </div>
        </div>

        <div className="containerBody">
          <div className="containerTable">
            <h4 className="title">DADOS DO CLIENTE</h4>
            <table cellspacing="0" className="tableCliente">
              <tr>
                <th>CLIENTE:</th>
                <td>{dados?.cliente?.nome}</td>
                <th>CPF/CNPJ:</th>
                <td>{dados?.cliente?.cpfCnpj}</td>
              </tr>

              <tr>
                <th>ENDEREÇO:</th>
                <td>{dados?.cliente?.rua + ", " + dados?.cliente?.numero}</td>
                <th>CEP:</th>
                <td>{dados?.cliente?.cep}</td>
              </tr>

              <tr>
                <th>CIDADE:</th>
                <td>{dados?.cliente?.cidade}</td>
                <th>ESTADO:</th>
                <td>{dados?.cliente?.estado}</td>
              </tr>

              <tr>
                <th>TELEFONE:</th>
                <td>{dados?.cliente?.telefone}</td>
                <th>E-MAIL:</th>
                <td>{dados?.cliente?.email}</td>
              </tr>
            </table>
          </div>

          {dados?.produtos.length > 0 && (
            <div className="containerTable">
              <h4>INFORMAÇÕES DO PRODUTO</h4>
              <table cellspacing="0" className="tableProdutos">
                <tr>
                  <th>ITEM</th>
                  <th>NOME</th>
                  <th>OBS</th>
                  <th>QTD</th>
                  <th>VR UNIT</th>
                  <th>SUBTOTAL</th>
                </tr>
                {dados?.produtos?.map((produto, index) => {
                  return (
                    <tr key={index}>
                      <td width={"7%"}>{index + 1}</td>
                      <td>{produto?.nome}</td>
                      <td>{produto?.pivot.observacao}</td>
                      <td>{produto?.pivot.quantidade}</td>
                      <td>
                        {produto?.pivot.preco
                          .toFixed(2)
                          .toLocaleString("pt-br", {
                            minimumFractionDigits: 2,
                          })}
                      </td>
                      <td>
                        {produto?.pivot.total
                          .toFixed(2)
                          .toLocaleString("pt-br", {
                            minimumFractionDigits: 2,
                          })}
                      </td>
                    </tr>
                  );
                })}
                <tr>
                  <th>TOTAL</th>
                  <td></td>
                  <td></td>
                  <td>
                    <b>{totalProdutos?.quantidade}</b>
                  </td>
                  <td></td>
                  <td>
                    <b>
                      {totalProdutos?.valor
                        .toFixed(2)
                        .toLocaleString("pt-br", { minimumFractionDigits: 2 })}
                    </b>
                  </td>
                </tr>
              </table>
            </div>
          )}

          {dados?.servicos.length > 0 && (
            <div className="containerTable">
              <h4>SERVIÇOS</h4>
              <table cellspacing="0" className="tableServicos">
                <tr>
                  <th>ITEM</th>
                  <th>NOME</th>
                  <th>OBS</th>
                  <th>QTD</th>
                  <th>VR UNIT</th>
                  <th>SUBTOTAL</th>
                </tr>

                {dados?.servicos?.map((servico, index) => {
                  return (
                    <tr key={index}>
                      <td width={"7%"}>{index + 1}</td>
                      <td>{servico?.nome}</td>
                      <td>{servico?.pivot.observacao}</td>
                      <td>{servico?.pivot.quantidade}</td>
                      <td>
                        {servico?.pivot.preco
                          .toFixed(2)
                          .toLocaleString("pt-br", {
                            minimumFractionDigits: 2,
                          })}
                      </td>
                      <td>
                        {servico?.pivot.total
                          .toFixed(2)
                          .toLocaleString("pt-br", {
                            minimumFractionDigits: 2,
                          })}
                      </td>
                    </tr>
                  );
                })}

                <tr>
                  <th>TOTAL</th>
                  <td></td>
                  <td></td>
                  <td>
                    <b>{totalServicos?.quantidade}</b>
                  </td>
                  <td></td>
                  <td>
                    <b>
                      {totalServicos?.valor
                        .toFixed(2)
                        .toLocaleString("pt-br", { minimumFractionDigits: 2 })}
                    </b>
                  </td>
                </tr>
              </table>
            </div>
          )}

          <div className="containerTable">
            <h4>DADOS DO PAGAMENTO</h4>
            <table cellspacing="0" className="tablePagamento">
              <tr>
                <th>FRETE</th>
                <th>OUTROS CUSTOS</th>
                <th>DESCONTO</th>
                <th>TOTAL FINAL</th>
              </tr>

              <tr>
                <td>
                  {dados?.frete
                    .toFixed(2)
                    .toLocaleString("pt-br", { minimumFractionDigits: 2 })}
                </td>
                <td>
                  {dados?.outros
                    .toFixed(2)
                    .toLocaleString("pt-br", { minimumFractionDigits: 2 })}
                </td>
                <td>
                  {dados?.desconto
                    .toFixed(2)
                    .toLocaleString("pt-br", { minimumFractionDigits: 2 })}
                </td>
                <td style={{ color: "red" }}>
                  <b>
                    {dados?.total
                      .toFixed(2)
                      .toLocaleString("pt-br", { minimumFractionDigits: 2 })}
                  </b>
                </td>
              </tr>
            </table>
          </div>

          <div className="containerTable">
            <table cellspacing="0" className="tableObs">
              <h4>OBSERVAÇÕES</h4>

              <tr>
                <td>{dados?.observacao}</td>
              </tr>
            </table>
          </div>

          <div className="assinaturas">
            <div className="assCliente">
              <div className="linha"></div>
              <p>Assinatura do Cliente</p>
            </div>

            <div className="assResponsavel">
              <div className="linha"></div>
              <p>Assinatura do Responsável</p>
            </div>
          </div>
        </div>

        <div className="containerFooter">
          <small>Impresso por Sistema ERP - Matheus Filho (19) 98136930</small>
        </div>
      </div>

      <Fab
        onClick={print}
        className="not-printable"
        variant="extended"
        style={{
          margin: 10,
          top: "auto",
          right: 20,
          bottom: 20,
          left: "auto",
          position: "fixed",
        }}
      >
        <PrintIcon sx={{ mr: 1 }} />
        Imprimir
      </Fab>
    </>
  );
}
