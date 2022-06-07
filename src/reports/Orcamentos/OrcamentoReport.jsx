import "./orcamento.css";
import { useEffect, useState } from "react";
import { Fab } from "@material-ui/core";
import PrintIcon from "@mui/icons-material/Print";

export default function OrcamentoReport() {
  const [dados, setDados] = useState(null);
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
    const reportData = localStorage.getItem("orcamentoReport");
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
    window.print("Orcamento - " + dados?.numero);
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
              {"Orçamento nº: " +
                dados?.numero.toString().padStart(6, "0")}
            </p>
          </div>
        </div>

        <div className="containerBody">
          <div className="containerTable">
            <h4 className="title">DADOS DO CLIENTE</h4>
            <table cellspacing="0" className="tableCliente">
              <tr className="trOrcamento">
                <th className="thOrcamento">CLIENTE:</th>
                <td className="tdOrcamento">{dados?.cliente?.nome}</td>
                <th className="thOrcamento">CPF/CNPJ:</th>
                <td className="tdOrcamento">{dados?.cliente?.cpfCnpj}</td>
              </tr>

              <tr className="trOrcamento">
                <th className="thOrcamento">ENDEREÇO:</th>
                <td className="tdOrcamento">{dados?.cliente?.rua ?? '' + ", " + dados?.cliente?.numero ?? ''}</td>
                <th className="thOrcamento">CEP:</th>
                <td className="tdOrcamento">{dados?.cliente?.cep}</td>
              </tr>

              <tr className="trOrcamento">
                <th className="thOrcamento">CIDADE:</th>
                <td className="tdOrcamento">{dados?.cliente?.cidade}</td>
                <th className="thOrcamento">ESTADO:</th>
                <td className="tdOrcamento">{dados?.cliente?.estado}</td>
              </tr>

              <tr className="trOrcamento">
                <th className="thOrcamento">TELEFONE:</th>
                <td className="tdOrcamento">{dados?.cliente?.telefone}</td>
                <th className="thOrcamento">E-MAIL:</th>
                <td className="tdOrcamento">{dados?.cliente?.email}</td>
              </tr>
            </table>
          </div>

          {dados?.produtos.length > 0 && (
            <div className="containerTable">
              <h4>INFORMAÇÕES DO PRODUTO</h4>
              <table cellspacing="0" className="tableProdutos">
                <tr className="trOrcamento">
                  <th className="thOrcamento">ITEM</th>
                  <th className="thOrcamento">NOME</th>
                  <th className="thOrcamento">OBS</th>
                  <th className="thOrcamento">QTD</th>
                  <th className="thOrcamento">VR UNIT</th>
                  <th className="thOrcamento">SUBTOTAL</th>
                </tr>
                {dados?.produtos?.map((produto, index) => {
                  return (
                    <tr className="trOrcamento" key={index}>
                      <td className="tdOrcamento" width={"7%"}>{index + 1}</td>
                      <td className="tdOrcamento">{produto?.codigoInterno +' • '+produto?.nome}</td>
                      <td className="tdOrcamento">{produto?.pivot.observacao}</td>
                      <td className="tdOrcamento">{produto?.pivot.quantidade}</td>
                      <td className="tdOrcamento">
                        {produto?.pivot.preco
                         .toFixed (empresaConfig.quantidadeCasasDecimaisValor)
                          .toLocaleString("pt-br", {
                            minimumFractionDigits: empresaConfig.quantidadeCasasDecimaisValor,
                          })}
                      </td>
                      <td className="tdOrcamento">
                        {produto?.pivot.total
                          .toFixed(empresaConfig.quantidadeCasasDecimaisValor)
                          .toLocaleString("pt-br", {
                            minimumFractionDigits: empresaConfig.quantidadeCasasDecimaisValor,
                          })}
                      </td>
                    </tr>
                  );
                })}
                <tr className="trOrcamento">
                  <th className="thOrcamento">TOTAL</th>
                  <td className="tdOrcamento"></td>
                  <td className="tdOrcamento"></td>
                  <td className="tdOrcamento">
                    <b>{totalProdutos?.quantidade}</b>
                  </td>
                  <td className="tdOrcamento"></td>
                  <td className="tdOrcamento">
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
                <tr className="trOrcamento">
                  <th className="thOrcamento">ITEM</th>
                  <th className="thOrcamento">NOME</th>
                  <th className="thOrcamento">OBS</th>
                  <th className="thOrcamento">QTD</th>
                  <th className="thOrcamento">VR UNIT</th>
                  <th className="thOrcamento">SUBTOTAL</th>
                </tr>

                {dados?.servicos?.map((servico, index) => {
                  return (
                    <tr className="trOrcamento" key={index}>
                      <td className="tdOrcamento" width={"7%"}>{index + 1}</td>
                      <td className="tdOrcamento">{servico?.codigoInterno +' • '+servico?.nome}</td>
                      <td className="tdOrcamento">{servico?.pivot.observacao}</td>
                      <td className="tdOrcamento">{servico?.pivot.quantidade}</td>
                      <td className="tdOrcamento">
                        {servico?.pivot.preco
                          .toFixed(empresaConfig.quantidadeCasasDecimaisValor)
                          .toLocaleString("pt-br", {
                            minimumFractionDigits: empresaConfig.quantidadeCasasDecimaisValor,
                          })}
                      </td>
                      <td className="tdOrcamento">
                        {servico?.pivot.total
                          .toFixed(empresaConfig.quantidadeCasasDecimaisValor)
                          .toLocaleString("pt-br", {
                            minimumFractionDigits: empresaConfig.quantidadeCasasDecimaisValor,
                          })}
                      </td>
                    </tr>
                  );
                })}

                <tr className="trOrcamento">
                  <th className="thOrcamento">TOTAL</th>
                  <td className="tdOrcamento"></td>
                  <td className="tdOrcamento"></td>
                  <td className="tdOrcamento">
                    <b>{totalServicos?.quantidade}</b>
                  </td>
                  <td className="tdOrcamento"></td>
                  <td className="tdOrcamento">
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
              <tr className="trOrcamento">
                <th className="thOrcamento">FRETE</th>
                <th className="thOrcamento">OUTROS CUSTOS</th>
                <th className="thOrcamento">DESCONTO</th>
                <th className="thOrcamento">TOTAL FINAL</th>
              </tr>

              <tr className="trOrcamento">
                <td className="tdOrcamento">
                  {dados?.frete
                    .toFixed(empresaConfig.quantidadeCasasDecimaisValor)
                    .toLocaleString("pt-br", { minimumFractionDigits: empresaConfig.quantidadeCasasDecimaisValor })}
                </td>
                <td className="tdOrcamento">
                  {dados?.outros
                    .toFixed(empresaConfig.quantidadeCasasDecimaisValor)
                    .toLocaleString("pt-br", { minimumFractionDigits: empresaConfig.quantidadeCasasDecimaisValor })}
                </td>
                <td className="tdOrcamento">
                  {dados?.desconto
                    .toFixed(empresaConfig.quantidadeCasasDecimaisValor)
                    .toLocaleString("pt-br", { minimumFractionDigits: empresaConfig.quantidadeCasasDecimaisValor })}
                </td>
                <td className="tdOrcamento" style={{ color: "red" }}>
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

              <tr className="trOrcamento">
                <td className="tdOrcamento">{dados?.observacao}</td>
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
