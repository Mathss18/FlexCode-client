import "./compra.css";
import logo from "./img.jpg";
import { useEffect, useState } from "react";
import { Fab } from "@material-ui/core";
import PrintIcon from "@mui/icons-material/Print";

export default function CompraReport() {
  const [dados, setDados] = useState(null);
  const [totalProdutos, setTotalProdutos] = useState({
    quantidade: 0,
    valor: 0,
  });

  const empresaConfig = JSON.parse(localStorage.getItem("config"));

  useEffect(() => {
    const reportData = localStorage.getItem("compraReport");
    console.log(JSON.parse(atob(reportData)));
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


    setTotalProdutos({
      quantidade: quantidadeProdutos,
      valor: valorTotalProdutos,
    });

  }, [dados]);

  function print() {
    window.print("Compra - " + dados?.numero);
    // window.close();
  }

  return (
    <>
      <div className="containerReport">
        <div className="containerHeader">
          <img src={logo} alt="logo" className="containerImg" />
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
              {"Compra nº: " +
                dados?.numero.toString().padStart(6, "0")}
            </p>
          </div>
        </div>

        <div className="containerBody">
          <div className="containerTable">
            <h4 className="title">DADOS DO FORNECEDOR</h4>
            <table cellspacing="0" className="tableFornecedor">
              <tr className="trCompra">
                <th className="thCompra">FORNECEDOR:</th>
                <td className="tdCompra">{dados?.fornecedor?.nome}</td>
                <th className="thCompra">CPF/CNPJ:</th>
                <td className="tdCompra">{dados?.fornecedor?.cpfCnpj}</td>
              </tr>

              <tr className="trCompra">
                <th className="thCompra">ENDEREÇO:</th>
                <td className="tdCompra">{dados?.fornecedor?.rua ?? '' + ", " + dados?.fornecedor?.numero ?? ''}</td>
                <th className="thCompra">CEP:</th>
                <td className="tdCompra">{dados?.fornecedor?.cep}</td>
              </tr>

              <tr className="trCompra">
                <th className="thCompra">CIDADE:</th>
                <td className="tdCompra">{dados?.fornecedor?.cidade}</td>
                <th className="thCompra">ESTADO:</th>
                <td className="tdCompra">{dados?.fornecedor?.estado}</td>
              </tr>

              <tr className="trCompra">
                <th className="thCompra">TELEFONE:</th>
                <td className="tdCompra">{dados?.fornecedor?.telefone}</td>
                <th className="thCompra">E-MAIL:</th>
                <td className="tdCompra">{dados?.fornecedor?.email}</td>
              </tr>
            </table>
          </div>

          {dados?.produtos?.length > 0 && (
            <div className="containerTable">
              <h4>INFORMAÇÕES DO PRODUTO</h4>
              <table cellspacing="0" className="tableProdutos">
                <tr className="trCompra">
                  <th className="thCompra">ITEM</th>
                  <th className="thCompra">NOME</th>
                  <th className="thCompra">OBS</th>
                  <th className="thCompra">QTD</th>
                  <th className="thCompra">VR UNIT</th>
                  <th className="thCompra">SUBTOTAL</th>
                </tr>
                {dados?.produtos?.map((produto, index) => {
                  return (
                    <tr className="trCompra" key={index}>
                      <td className="tdCompra" width={"7%"}>{index + 1}</td>
                      <td className="tdCompra">{produto?.nome}</td>
                      <td className="tdCompra">{produto?.pivot.observacao}</td>
                      <td className="tdCompra">{produto?.pivot.quantidade}</td>
                      <td className="tdCompra">
                        {produto?.pivot.preco
                         .toFixed (empresaConfig.quantidadeCasasDecimaisValor)
                          .toLocaleString("pt-br", {
                            minimumFractionDigits: empresaConfig.quantidadeCasasDecimaisValor,
                          })}
                      </td>
                      <td className="tdCompra">
                        {produto?.pivot.total
                          .toFixed(empresaConfig.quantidadeCasasDecimaisValor)
                          .toLocaleString("pt-br", {
                            minimumFractionDigits: empresaConfig.quantidadeCasasDecimaisValor,
                          })}
                      </td>
                    </tr>
                  );
                })}
                <tr className="trCompra">
                  <th className="thCompra">TOTAL</th>
                  <td className="tdCompra"></td>
                  <td className="tdCompra"></td>
                  <td className="tdCompra">
                    <b>{totalProdutos?.quantidade}</b>
                  </td>
                  <td className="tdCompra"></td>
                  <td className="tdCompra">
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

          <div className="containerTable">
            <h4>DADOS DO PAGAMENTO</h4>
            <table cellspacing="0" className="tablePagamento">
              <tr className="trCompra">
                <th className="thCompra">FRETE</th>
                <th className="thCompra">IMPOSTOS</th>
                <th className="thCompra">DESCONTO</th>
                <th className="thCompra">TOTAL FINAL</th>
              </tr>

              <tr className="trCompra">
                <td className="tdCompra">
                  {dados?.frete
                    ?.toFixed(empresaConfig.quantidadeCasasDecimaisValor)
                    ?.toLocaleString("pt-br", { minimumFractionDigits: empresaConfig.quantidadeCasasDecimaisValor })}
                </td>
                <td className="tdCompra">
                  {dados?.impostos
                    ?.toFixed(empresaConfig.quantidadeCasasDecimaisValor)
                    ?.toLocaleString("pt-br", { minimumFractionDigits: empresaConfig.quantidadeCasasDecimaisValor })}
                </td>
                <td className="tdCompra">
                  {dados?.desconto
                    .toFixed(empresaConfig.quantidadeCasasDecimaisValor)
                    .toLocaleString("pt-br", { minimumFractionDigits: empresaConfig.quantidadeCasasDecimaisValor })}
                </td>
                <td className="tdCompra" style={{ color: "red" }}>
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

              <tr className="trCompra">
                <td className="tdCompra">{dados?.observacao}</td>
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
