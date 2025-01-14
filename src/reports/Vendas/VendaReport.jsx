import "./venda.css";
import { useEffect, useState } from "react";
import { Fab } from "@material-ui/core";
import PrintIcon from "@mui/icons-material/Print";

export default function VendaReport() {
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
    const reportData = localStorage.getItem("vendaReport");
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
    window.print("Venda - " + dados?.numero);
    // window.close();
  }

  // ------------------------------------
  // Cálculo do subtotal e do valor do IPI
  // ------------------------------------
  const subTotal = (totalProdutos?.valor || 0) + (totalServicos?.valor || 0);
  const ipiValue = subTotal * 0.0975; // 9.75%

  return (
    <>
      <div className="containerReport">
        <div className="containerHeader">
          <img src={empresaConfig?.logo} alt="logo" className="containerImg" />
          <div className="headerLeft" style={{ display: "flex", gap: 10 }}>
            <div>
              <h3>{empresaConfig?.nome}</h3>
              <p>
                <b>CNPJ:</b> {empresaConfig?.cpfCnpj}
              </p>
              <p>
                <b>Rua:</b> {empresaConfig?.rua + ", " + empresaConfig?.numero}
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
            <p>{"Venda nº: " + dados?.numero?.toString().padStart(6, "0")}</p>
          </div>
        </div>

        <div className="containerBody">
          <div className="containerTable">
            <h4 className="title">DADOS DO CLIENTE</h4>
            <table cellSpacing="0" className="tableCliente">
              <tbody>
                <tr className="trVenda">
                  <th className="thVenda">CLIENTE:</th>
                  <td className="tdVenda">{dados?.cliente?.nome}</td>
                  <th className="thVenda">CPF/CNPJ:</th>
                  <td className="tdVenda">{dados?.cliente?.cpfCnpj}</td>
                </tr>

                <tr className="trVenda">
                  <th className="thVenda">ENDEREÇO:</th>
                  <td className="tdVenda">
                    {(dados?.cliente?.rua ?? "") +
                      ", " +
                      (dados?.cliente?.numero ?? "")}
                  </td>
                  <th className="thVenda">CEP:</th>
                  <td className="tdVenda">{dados?.cliente?.cep}</td>
                </tr>

                <tr className="trVenda">
                  <th className="thVenda">CIDADE:</th>
                  <td className="tdVenda">{dados?.cliente?.cidade}</td>
                  <th className="thVenda">ESTADO:</th>
                  <td className="tdVenda">{dados?.cliente?.estado}</td>
                </tr>

                <tr className="trVenda">
                  <th className="thVenda">TELEFONE:</th>
                  <td className="tdVenda">{dados?.cliente?.telefone}</td>
                  <th className="thVenda">E-MAIL:</th>
                  <td className="tdVenda">{dados?.cliente?.email}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {dados?.produtos?.length > 0 && (
            <div className="containerTable">
              <h4>INFORMAÇÕES DO PRODUTO</h4>
              <table cellSpacing="0" className="tableProdutos">
                <thead>
                  <tr className="trVenda">
                    <th className="thVenda">ITEM</th>
                    <th className="thVenda">NOME</th>
                    <th className="thVenda">OBS</th>
                    <th className="thVenda">QTD</th>
                    <th className="thVenda">VR UNIT</th>
                    {/* Se CRT for 3, exibir a coluna de IPI Unit */}
                    {empresaConfig.crt == 3 ? (
                      <th className="thVenda">IPI UNIT</th>
                    ) : null}
                    <th className="thVenda">SUBTOTAL</th>
                  </tr>
                </thead>
                <tbody>
                  {dados?.produtos?.map((produto, index) => {
                    const qtd = produto?.pivot?.quantidade || 0;
                    const vrUnit = produto?.pivot?.preco || 0;
                    const ipiUnit = vrUnit * 0.0975; // 9.75%
                    // Se for CRT 3, soma o IPI ao total
                    const total =
                      empresaConfig.crt == 3
                        ? vrUnit * qtd + ipiUnit * qtd
                        : vrUnit * qtd;

                    return (
                      <tr className="trVenda" key={index}>
                        <td className="tdVenda" width={"7%"}>
                          {index + 1}
                        </td>
                        <td className="tdVenda">
                          {produto?.codigoInterno + " / " + produto?.nome}
                        </td>
                        <td className="tdVenda">
                          {produto?.pivot?.observacao}
                        </td>
                        <td className="tdVenda">{qtd}</td>
                        <td className="tdVenda">
                          {vrUnit
                            .toFixed(empresaConfig.quantidadeCasasDecimaisValor)
                            .toLocaleString("pt-BR", {
                              minimumFractionDigits:
                                empresaConfig.quantidadeCasasDecimaisValor,
                            })}
                        </td>
                        {empresaConfig.crt == 3 ? (
                          <td className="tdVenda">
                            {ipiUnit
                              .toFixed(
                                empresaConfig.quantidadeCasasDecimaisValor
                              )
                              .toLocaleString("pt-BR", {
                                minimumFractionDigits:
                                  empresaConfig.quantidadeCasasDecimaisValor,
                              })}
                          </td>
                        ) : null}
                        <td className="tdVenda">
                          {total
                            .toFixed(empresaConfig.quantidadeCasasDecimaisValor)
                            .toLocaleString("pt-BR", {
                              minimumFractionDigits:
                                empresaConfig.quantidadeCasasDecimaisValor,
                            })}
                        </td>
                      </tr>
                    );
                  })}
                  <tr className="trVenda">
                    <th className="thVenda">TOTAL</th>
                    <td className="tdVenda"></td>
                    <td className="tdVenda"></td>
                    <td className="tdVenda">
                      <b>{totalProdutos?.quantidade}</b>
                    </td>
                    <td className="tdVenda"></td>
                    {empresaConfig.crt == 3 ? (
                      <td className="tdVenda"></td>
                    ) : null}
                    {/* Se CRT = 3, soma IPI no valor total de produtos */}
                    {empresaConfig.crt == 3 ? (
                      <td className="tdVenda">
                        <b>
                          {(
                            totalProdutos?.valor +
                            totalProdutos?.valor * 0.0975
                          )
                            .toFixed(empresaConfig.quantidadeCasasDecimaisValor)
                            .toLocaleString("pt-BR", {
                              minimumFractionDigits:
                                empresaConfig.quantidadeCasasDecimaisValor,
                            })}
                        </b>
                      </td>
                    ) : (
                      <td className="tdVenda">
                        <b>
                          {totalProdutos?.valor
                            .toFixed(empresaConfig.quantidadeCasasDecimaisValor)
                            .toLocaleString("pt-BR", {
                              minimumFractionDigits:
                                empresaConfig.quantidadeCasasDecimaisValor,
                            })}
                        </b>
                      </td>
                    )}
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {dados?.servicos?.length > 0 && (
            <div className="containerTable">
              <h4>SERVIÇOS</h4>
              <table cellSpacing="0" className="tableServicos">
                <thead>
                  <tr className="trVenda">
                    <th className="thVenda">ITEM</th>
                    <th className="thVenda">NOME</th>
                    <th className="thVenda">OBS</th>
                    <th className="thVenda">QTD</th>
                    <th className="thVenda">VR UNIT</th>
                    <th className="thVenda">SUBTOTAL</th>
                  </tr>
                </thead>
                <tbody>
                  {dados?.servicos?.map((servico, index) => {
                    return (
                      <tr className="trVenda" key={index}>
                        <td className="tdVenda" width={"7%"}>
                          {index + 1}
                        </td>
                        <td className="tdVenda">
                          {servico?.codigoInterno + " / " + servico?.nome}
                        </td>
                        <td className="tdVenda">
                          {servico?.pivot?.observacao}
                        </td>
                        <td className="tdVenda">
                          {servico?.pivot?.quantidade}
                        </td>
                        <td className="tdVenda">
                          {servico?.pivot?.preco
                            .toFixed(empresaConfig.quantidadeCasasDecimaisValor)
                            .toLocaleString("pt-BR", {
                              minimumFractionDigits:
                                empresaConfig.quantidadeCasasDecimaisValor,
                            })}
                        </td>
                        <td className="tdVenda">
                          {servico?.pivot?.total
                            .toFixed(empresaConfig.quantidadeCasasDecimaisValor)
                            .toLocaleString("pt-BR", {
                              minimumFractionDigits:
                                empresaConfig.quantidadeCasasDecimaisValor,
                            })}
                        </td>
                      </tr>
                    );
                  })}
                  <tr className="trVenda">
                    <th className="thVenda">TOTAL</th>
                    <td className="tdVenda"></td>
                    <td className="tdVenda"></td>
                    <td className="tdVenda">
                      <b>{totalServicos?.quantidade}</b>
                    </td>
                    <td className="tdVenda"></td>
                    <td className="tdVenda">
                      <b>
                        {totalServicos?.valor
                          .toFixed(empresaConfig.quantidadeCasasDecimaisValor)
                          .toLocaleString("pt-BR", {
                            minimumFractionDigits:
                              empresaConfig.quantidadeCasasDecimaisValor,
                          })}
                      </b>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Tabela de pagamento, agora com coluna de ICMS (18%) e IPI se CRT = 3 */}
          <div className="containerTable">
            <h4>DADOS DO PAGAMENTO</h4>
            <table cellSpacing="0" className="tablePagamento">
              <thead>
                <tr className="trVenda">
                  <th className="thVenda">FRETE</th>
                  {/* Se quiser incluir OUTROS CUSTOS como no Orçamento */}
                  <th className="thVenda">OUTROS CUSTOS</th>
                  {empresaConfig.crt == 3 ? (
                    <th className="thVenda">ICMS</th>
                  ) : null}
                  {empresaConfig.crt == 3 ? (
                    <th className="thVenda">IPI</th>
                  ) : null}
                  <th className="thVenda">DESCONTO</th>
                  <th className="thVenda">TOTAL FINAL</th>
                </tr>
              </thead>
              <tbody>
                <tr className="trVenda">
                  <td className="tdVenda">
                    {dados?.frete
                      ?.toFixed(empresaConfig.quantidadeCasasDecimaisValor)
                      ?.toLocaleString("pt-BR", {
                        minimumFractionDigits:
                          empresaConfig.quantidadeCasasDecimaisValor,
                      })}
                  </td>

                  {/* “OUTROS CUSTOS”: se você não tiver esse campo em “dados”, pode trocar por “impostos” ou remover */}
                  <td className="tdVenda">
                    {(dados?.outros || 0)
                      .toFixed(empresaConfig.quantidadeCasasDecimaisValor)
                      .toLocaleString("pt-BR", {
                        minimumFractionDigits:
                          empresaConfig.quantidadeCasasDecimaisValor,
                      })}
                  </td>

                  {empresaConfig.crt == 3 ? (
                    <td className="tdVenda">18,00%</td>
                  ) : null}

                  {empresaConfig.crt == 3 ? (
                    <td className="tdVenda">
                      {ipiValue
                        .toFixed(empresaConfig.quantidadeCasasDecimaisValor)
                        .toLocaleString("pt-BR", {
                          minimumFractionDigits:
                            empresaConfig.quantidadeCasasDecimaisValor,
                        })}
                    </td>
                  ) : null}

                  <td className="tdVenda">
                    {dados?.desconto
                      ?.toFixed(empresaConfig.quantidadeCasasDecimaisValor)
                      ?.toLocaleString("pt-BR", {
                        minimumFractionDigits:
                          empresaConfig.quantidadeCasasDecimaisValor,
                      })}
                  </td>

                  <td className="tdVenda" style={{ color: "red" }}>
                    <b>
                      {dados?.total
                        ?.toFixed(empresaConfig.quantidadeCasasDecimaisValor)
                        ?.toLocaleString("pt-BR", {
                          minimumFractionDigits:
                            empresaConfig.quantidadeCasasDecimaisValor,
                        })}
                    </b>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="containerTable">
            <table cellSpacing="0" className="tableObs">
              <thead>
                <tr>
                  <th>
                    <h4>OBSERVAÇÕES</h4>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="trVenda">
                  <td className="tdVenda">{dados?.observacao}</td>
                </tr>
              </tbody>
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
          <small>Impresso por Sistema ERP - Matheus Filho (19) 983136930</small>
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
