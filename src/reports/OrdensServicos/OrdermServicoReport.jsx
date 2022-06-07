import "./ordemServico.css";
import { useEffect, useState } from "react";
import moment from "moment";
import { Fab } from "@material-ui/core";
import PrintIcon from "@mui/icons-material/Print";
import { QRCodeSVG } from "qrcode.react";
import { encrypt } from "../../utils/crypto";

export default function OrdermServicoReport(texto) {
  const BASE_URL = window.location.origin;
  const [dados, setDados] = useState(null);
  const [encrypted, setEncrypted] = useState(null);
  const [totalProdutos, setTotalProdutos] = useState({
    quantidade: 0,
    valor: 0,
  });
  const [totalServicos, setTotalServicos] = useState({
    quantidade: 0,
    valor: 0,
  });
  const empresaConfig = JSON.parse(localStorage.getItem("config"));

  useEffect(() => {
    const reportData = localStorage.getItem("ordemServicoReport");
    setDados(JSON.parse(atob(reportData)));
  }, []);

  useEffect(() => {
    if (!dados) return;
    setEncrypted(encrypt(dados.id.toString()));

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
    // window.close();
  }

  return (
    <>
      <div className="containerReport">
        <div className="containerHeader">
          <img src={empresaConfig.logo} alt="logo" className="containerImg" />
          <div className="headerLeft" style={{ display: "flex", gap: 10 }}>
            <div>
              <h3>{empresaConfig?.nome}</h3>
              <p>
                <b>CNPJ:</b> {empresaConfig?.cpfCnpj}
              </p>
              <p>
                <b>Rua:</b> {empresaConfig?.rua +", "+empresaConfig?.numero}
              </p>
              <p>
                <b>Cidade:</b> {empresaConfig?.cidade}
              </p>
              <p>
                <b>Bairro:</b> {empresaConfig?.bairro}
              </p>
            </div>
            <div>
              <h4>&nbsp;</h4>
              <p>
                <b>Telefone:</b> {empresaConfig?.telefone}
              </p>
              <p>
                <b>Celular:</b> (19) {empresaConfig?.celular}
              </p>
              <p>
                <b>Email:</b> {empresaConfig?.email}
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
            <QRCodeSVG
              value={`${BASE_URL}/ordens-servicos-acompanhamento/${encrypted}`}
            />
          </div>
        </div>

        <div className="containerBody">
          <div className="containerTable">
            <h4 className="title">DADOS DO CLIENTE</h4>
            <table cellspacing="0" className="tableCliente">
              <tr className="trOrdemServico">
                <th className="thOrdemServico">CLIENTE:</th>
                <td className="tdOrdemServico">{dados?.cliente?.nome}</td>
                <th className="thOrdemServico">CPF/CNPJ:</th>
                <td className="tdOrdemServico">{dados?.cliente?.cpfCnpj}</td>
              </tr>

              <tr className="trOrdemServico">
                <th className="thOrdemServico">ENDEREÇO:</th>
                <td className="tdOrdemServico">{dados?.cliente?.rua ?? '' + ", " + dados?.cliente?.numero ?? ''}</td>
                <th className="thOrdemServico">CEP:</th>
                <td className="tdOrdemServico">{dados?.cliente?.cep}</td>
              </tr>

              <tr className="trOrdemServico">
                <th className="thOrdemServico">CIDADE:</th>
                <td className="tdOrdemServico">{dados?.cliente?.cidade}</td>
                <th className="thOrdemServico">ESTADO:</th>
                <td className="tdOrdemServico">{dados?.cliente?.estado}</td>
              </tr>

              <tr className="trOrdemServico">
                <th className="thOrdemServico">TELEFONE:</th>
                <td className="tdOrdemServico">{dados?.cliente?.telefone}</td>
                <th className="thOrdemServico">E-MAIL:</th>
                <td className="tdOrdemServico">{dados?.cliente?.email}</td>
              </tr>
            </table>
          </div>

          {dados?.produtos.length > 0 && (
            <div className="containerTable">
              <h4>INFORMAÇÕES DO PRODUTO</h4>
              <table cellspacing="0" className="tableProdutos">
                <tr className="trOrdemServico">
                  <th className="thOrdemServico">ITEM</th>
                  <th className="thOrdemServico">NOME</th>
                  <th className="thOrdemServico">OBS</th>
                  <th className="thOrdemServico">QTD</th>
                  <th className="thOrdemServico">VR UNIT</th>
                  <th className="thOrdemServico">SUBTOTAL</th>
                </tr>
                {dados?.produtos?.map((produto, index) => {
                  return (
                    <tr className="trOrdemServico" key={index}>
                      <td className="tdOrdemServico" width={"7%"}>{index + 1}</td>
                      <td className="tdOrdemServico">{produto?.codigoInterno +' • '+produto?.nome}</td>
                      <td className="tdOrdemServico">{produto?.pivot.observacao}</td>
                      <td className="tdOrdemServico">{produto?.pivot.quantidade}</td>
                      <td className="tdOrdemServico">
                        {produto?.pivot.preco
                          .toFixed(empresaConfig.quantidadeCasasDecimaisValor)
                          .toLocaleString("pt-br", {
                            minimumFractionDigits: empresaConfig.quantidadeCasasDecimaisValor,
                          })}
                      </td>
                      <td className="tdOrdemServico">
                        {produto?.pivot.total
                          .toFixed(empresaConfig.quantidadeCasasDecimaisValor)
                          .toLocaleString("pt-br", {
                            minimumFractionDigits: empresaConfig.quantidadeCasasDecimaisValor,
                          })}
                      </td>
                    </tr>
                  );
                })}
                <tr className="trOrdemServico">
                  <th className="thOrdemServico">TOTAL</th>
                  <td className="tdOrdemServico"></td>
                  <td className="tdOrdemServico"></td>
                  <td className="tdOrdemServico">
                    <b>{totalProdutos?.quantidade}</b>
                  </td>
                  <td className="tdOrdemServico"></td>
                  <td className="tdOrdemServico">
                    <b>
                      {totalProdutos?.valor
                        .toFixed(empresaConfig.quantidadeCasasDecimaisValor)
                        .toLocaleString("pt-br", { minimumFractionDigits: empresaConfig.quantidadeCasasDecimaisValor })}
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
                <tr className="trOrdemServico">
                  <th className="thOrdemServico">ITEM</th>
                  <th className="thOrdemServico">NOME</th>
                  <th className="thOrdemServico">OBS</th>
                  <th className="thOrdemServico">QTD</th>
                  <th className="thOrdemServico">VR UNIT</th>
                  <th className="thOrdemServico">SUBTOTAL</th>
                </tr>

                {dados?.servicos?.map((servico, index) => {
                  return (
                    <tr className="trOrdemServico" key={index}>
                      <td className="tdOrdemServico" width={"7%"}>{index + 1}</td>
                      <td className="tdOrdemServico">{servico?.codigoInterno +' • '+servico?.nome}</td>
                      <td className="tdOrdemServico">{servico?.pivot.observacao}</td>
                      <td className="tdOrdemServico">{servico?.pivot.quantidade}</td>
                      <td className="tdOrdemServico">
                        {servico?.pivot.preco
                          .toFixed(empresaConfig.quantidadeCasasDecimaisValor)
                          .toLocaleString("pt-br", {
                            minimumFractionDigits: empresaConfig.quantidadeCasasDecimaisValor,
                          })}
                      </td>
                      <td className="tdOrdemServico">
                        {servico?.pivot.total
                          .toFixed(empresaConfig.quantidadeCasasDecimaisValor)
                          .toLocaleString("pt-br", {
                            minimumFractionDigits: empresaConfig.quantidadeCasasDecimaisValor,
                          })}
                      </td>
                    </tr>
                  );
                })}

                <tr className="trOrdemServico">
                  <th className="thOrdemServico">TOTAL</th>
                  <td className="tdOrdemServico"></td>
                  <td className="tdOrdemServico"></td>
                  <td className="tdOrdemServico">
                    <b>{totalServicos?.quantidade}</b>
                  </td>
                  <td className="tdOrdemServico"></td>
                  <td className="tdOrdemServico">
                    <b>
                      {totalServicos?.valor
                        .toFixed(empresaConfig.quantidadeCasasDecimaisValor)
                        .toLocaleString("pt-br", { minimumFractionDigits: empresaConfig.quantidadeCasasDecimaisValor })}
                    </b>
                  </td>
                </tr>
              </table>
            </div>
          )}

          <div className="containerTable">
            <h4>DADOS DO PAGAMENTO</h4>
            <table cellspacing="0" className="tablePagamento">
              <tr className="trOrdemServico">
                <th className="thOrdemServico">FRETE</th>
                <th className="thOrdemServico">OUTROS CUSTOS</th>
                <th className="thOrdemServico">DESCONTO</th>
                <th className="thOrdemServico">TOTAL FINAL</th>
              </tr>

              <tr className="trOrdemServico">
                <td className="tdOrdemServico">
                  {dados?.frete
                    .toFixed(empresaConfig.quantidadeCasasDecimaisValor)
                    .toLocaleString("pt-br", { minimumFractionDigits: empresaConfig.quantidadeCasasDecimaisValor })}
                </td>
                <td className="tdOrdemServico">
                  {dados?.outros
                    .toFixed(empresaConfig.quantidadeCasasDecimaisValor)
                    .toLocaleString("pt-br", { minimumFractionDigits: empresaConfig.quantidadeCasasDecimaisValor })}
                </td>
                <td className="tdOrdemServico">
                  {dados?.desconto
                    .toFixed(empresaConfig.quantidadeCasasDecimaisValor)
                    .toLocaleString("pt-br", { minimumFractionDigits: empresaConfig.quantidadeCasasDecimaisValor })}
                </td>
                <td className="tdOrdemServico" style={{ color: "red" }}>
                  <b>
                    {dados?.total
                      .toFixed(empresaConfig.quantidadeCasasDecimaisValor)
                      .toLocaleString("pt-br", { minimumFractionDigits: empresaConfig.quantidadeCasasDecimaisValor })}
                  </b>
                </td>
              </tr>
            </table>
          </div>

          <div className="containerTable">
            <table cellspacing="0" className="tableObs">
              <h4>OBSERVAÇÕES</h4>

              <tr className="trOrdemServico">
                <td className="tdOrdemServico">{dados?.observacao}</td>
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
          right: 0,
          bottom: 0,
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
