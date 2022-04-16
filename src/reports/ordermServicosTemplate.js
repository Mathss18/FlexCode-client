import instagramLogo from "../assets/instagramLogo.png";
import "./ordemServico.css";
import logo from "./img.jpg";

export default function OrdermServicosTemplate(texto) {
  return (
    <div class="container">
      <div class="containerHeader">
        <img src={logo} alt="logo" class="containerImg" />
        <div class="headerLeft">
          <h3>Flex Code</h3>
          <p>CNPJ: 43.206.158/0001-25</p>
        </div>

        <div class="headerRight">
          <p>Ordem de serviço nº 000094</p>
          <p>Data de abertura: 03/04/2022</p>
        </div>
      </div>

      <div class="containerBody">
        <div class="containerTable">
          <h4 class="title">DADOS DO CLIENTE</h4>
          <table cellspacing="0" class="tableCliente">
            <tr>
              <th>CLIENTE:</th>
              <td>Allanda Soares</td>
              <th>CPF/CNPJ:</th>
              <td>43.947.288/0001-19</td>
            </tr>

            <tr>
              <th>ENDEREÇO:</th>
              <td>Av professora Maria da Paz</td>
              <th>CEP:</th>
              <td>38082230</td>
            </tr>

            <tr>
              <th>CIDADE:</th>
              <td>Uberaba</td>
              <th>ESTADO:</th>
              <td>MG</td>
            </tr>

            <tr>
              <th>TELEFONE:</th>
              <td>(34) 9 91489357</td>
              <th>E-MAIL:</th>
              <td>allandasoares7@gmail.com</td>
            </tr>
          </table>
        </div>

        <div class="containerTable">
          <h4>INFORMAÇÕES DO PRODUTO</h4>
          <table cellspacing="0" class="tableProdutos">
            <tr>
              <th>ITEM</th>
              <th>NOME</th>
              <th>UND.</th>
              <th>QTD.</th>
              <th>VR. UNIT.</th>
              <th>SUBTOTAL</th>
            </tr>

            <tr>
              <td>1</td>
              <td>Mola</td>
              <td>UN</td>
              <td>1</td>
              <td>2,50</td>
              <td>2,50</td>
            </tr>

            <tr>
              <td>2</td>
              <td>Mola com brilho</td>
              <td>UN</td>
              <td>3</td>
              <td>3,50</td>
              <td>10,50</td>
            </tr>

            <tr>
              <th>TOTAL</th>
              <td></td>
              <td></td>
              <th>4</th>
              <td></td>
              <th>13,00</th>
            </tr>
          </table>
        </div>

        <div class="containerTable">
          <h4>SERVIÇOS</h4>
          <table cellspacing="0" class="tableServicos">
            <tr>
              <th>ITEM</th>
              <th>NOME</th>
              <th>UND.</th>
              <th>QTD.</th>
              <th>VR. UNIT.</th>
              <th>SUBTOTAL</th>
            </tr>

            <tr>
              <td>1</td>
              <td>Sol</td>
              <td>UN</td>
              <td>1</td>
              <td>2,50</td>
              <td>2,50</td>
            </tr>

            <tr>
              <th>TOTAL</th>
              <td></td>
              <td></td>
              <th>1</th>
              <td></td>
              <th>2,50</th>
            </tr>
          </table>
        </div>

        <div class="containerTable">
          <h4>DADOS DO PAGAMENTO</h4>
          <table cellspacing="0" class="tablePagamento">
            <tr>
              <th>FRETE</th>
              <th>OUTROS CUSTOS</th>
              <th>DESCONTO</th>
              <th>TOTAL.</th>
            </tr>

            <tr>
              <td>10,00</td>
              <td>2,00</td>
              <td>0,00</td>
              <td>12,00</td>
            </tr>
          </table>
        </div>

        <div class="containerTable">
          <table cellspacing="0" class="tableObs">
            <h4>OBSERVAÇÕES</h4>

            <tr>
              <td>
                Subscribe to PRO for $4.99/month to access the full video with
                22 chapters! You also unlock powerful features, such as
                W3Schools ad-free and website hosting, and you can cancel the
                subscription at any time.
              </td>
            </tr>
          </table>
        </div>

        <div class="assinaturas">
          <div class="assCliente">
            <div class="linha"></div>
            <p>Assinatura do Cliente</p>
          </div>

          <div class="assResponsavel">
            <div class="linha"></div>
            <p>Assinatura do Responsável</p>
          </div>
        </div>
      </div>

      <div class="containerFooter">
        <small>Impresso por Sistema ERP - Matheus Filho (19) 98136930</small>
      </div>
    </div>
  );
}
