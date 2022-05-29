import React from "react";

import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import Home from "../pages/Home";
import LoginPage from "../pages/Login/LoginPage";

import ListarClientePage from "../pages/Cadastros/cliente/Listar";
import CadastrarClientePage from "../pages/Cadastros/cliente/Cadastrar";
import EditarClientePage from "../pages/Cadastros/cliente/Editar";
import MostrarClientePage from "../pages/Cadastros/cliente/Mostrar";

import ListarTransportadoraPage from "../pages/Cadastros/transportadora/Listar";
import CadastrarTransportadoraPage from "../pages/Cadastros/transportadora/Cadastrar";
import EditarTransportadoraPage from "../pages/Cadastros/transportadora/Editar";
import MostrarTransportadoraPage from "../pages/Cadastros/transportadora/Mostrar";

import ListarFornecedorPage from "../pages/Cadastros/fornecedor/Listar";
import CadastrarFornecedorPage from "../pages/Cadastros/fornecedor/Cadastrar";
import EditarFornecedorPage from "../pages/Cadastros/fornecedor/Editar";
import MostrarFornecedorPage from "../pages/Cadastros/fornecedor/Mostrar";

import ListarFuncionarioPage from "../pages/Cadastros/funcionario/Listar";
import CadastrarFuncionarioPage from "../pages/Cadastros/funcionario/Cadastrar";
import EditarFuncionarioPage from "../pages/Cadastros/funcionario/Editar";
import MostrarFuncionarioPage from "../pages/Cadastros/funcionario/Mostrar";

import ListarGrupoPage from "../pages/Cadastros/grupo/Listar";
import CadastrarGrupoPage from "../pages/Cadastros/grupo/Cadastrar";
import EditarGrupoPage from "../pages/Cadastros/grupo/Editar";

import ListarGruposDeProdutos from "../pages/Produtos/grupos-produtos/Listar";
import CadastrarGrupoDeProdutos from "../pages/Produtos/grupos-produtos/Cadastrar";
import EditarGrupoDeProdutos from "../pages/Produtos/grupos-produtos/Editar";

import ListarUnidadesDeProdutos from "../pages/Produtos/unidades-produtos/Listar";
import CadastrarUnidadeDeProdutos from "../pages/Produtos/unidades-produtos/Cadastrar";
import EditarUnidadeDeProdutos from "../pages/Produtos/unidades-produtos/Editar";

import ListarGradesDeVariacoes from "../pages/Produtos/grades-variacoes/Listar";
import CadastrarGradesDeVariacoes from "../pages/Produtos/grades-variacoes/Cadastrar";
import EditarGradesDeVariacoes from "../pages/Produtos/grades-variacoes/Editar";

import ListarPorcentagensLucros from "../pages/Produtos/porcentagens-lucros/Listar";
import CadastrarPorcentagensLucros from "../pages/Produtos/porcentagens-lucros/Cadastrar";
import EditarPorcentagensLucros from "../pages/Produtos/porcentagens-lucros/Editar";

import ListarProdutos from "../pages/Produtos/gerenciar-produtos/Listar";
import CadastrarProdutos from "../pages/Produtos/gerenciar-produtos/Cadastrar";
import EditarProdutos from "../pages/Produtos/gerenciar-produtos/Editar";

import ListarServicos from "../pages/Servicos/gerenciar-servicos/Listar";
import CadastrarServicos from "../pages/Servicos/gerenciar-servicos/Cadastrar";
import EditarServicos from "../pages/Servicos/gerenciar-servicos/Editar";

import ListarOrdensServicos from "../pages/Financeiro/ordens-servicos/Listar";
import CadastrarOrdensServicoPage from "../pages/Financeiro/ordens-servicos/Cadastrar";
import EditarOrdensServicoPage from "../pages/Financeiro/ordens-servicos/Editar";
import ListarOrdensServicosFuncionariosPage from "../pages/Financeiro/ordens-servicos/OrdensServicosFuncionarios/Listar";
import ListarOrdensServicosAcompanhamento from "../pages/Financeiro/ordens-servicos/OrdensServicosAcompanhamento/Listar";
import OrdermServicoReport from "../reports/OrdensServicos/OrdermServicoReport";

import ListarOrcamentosPage from "../pages/Financeiro/orcamentos/Listar";
import CadastrarOrcamentosPage from "../pages/Financeiro/orcamentos/Cadastrar";
import EditarOrcamentosPage from "../pages/Financeiro/orcamentos/Editar";

import ListarCompras from "../pages/Financeiro/compras/Listar";
import CadastrarComprasPage from "../pages/Financeiro/compras/Cadastrar";
import EditarComprasPage from "../pages/Financeiro/compras/Editar";

import PrivateRoutes from "./PrivateRoutes";
import TopBar from "../components/TopBar";
import SideMenu from "../components/SideMenu";
import Chat from "../pages/Chat/Chat";
import Ajuda from "../pages/Ajuda/Ajuda"
import ThemeSelector from "../components/ThemeSelector";
import OrcamentoReport from "../reports/Orcamentos/OrcamentoReport";
import CadastrarFormasPagamentosPage from "../pages/Financeiro/formas-pagamentos/Cadastrar";
import ListarFormasPagamentosPage from "../pages/Financeiro/formas-pagamentos/Listar";
import EditarFormasPagamentosPage from "../pages/Financeiro/formas-pagamentos/Editar";
import ListarContasBancariasPage from "../pages/Financeiro/contas-bancarias/Listar";
import CadastrarContasBancariasPage from "../pages/Financeiro/contas-bancarias/Cadastrar";
import EditarContasBancariasPage from "../pages/Financeiro/contas-bancarias/Editar";
import CadastrarVendasPage from "../pages/Financeiro/vendas/Cadastrar";
import ListarVendas from "../pages/Financeiro/vendas/Listar";
import EditarVendasPage from "../pages/Financeiro/vendas/Editar";
import ListarEstoques from "../pages/Estoque/Listar";
import MovimentacoesPage from "../pages/Estoque/Movimentacoes";
import CalendarioPage from "../pages/Financeiro/money/Calendario";
import ListarExtratos from "../pages/Financeiro/extratos/Litsar";
import ListarNotasFiscaisPage from "../pages/NotasFiscais/nfe/Listar";
import CadastrarNotasFiscais from "../pages/NotasFiscais/nfe/Cadastrar";
import ListarConfiguracoesPage from "../pages/Configuracao/Listar";
import CadastrarConfiguracaoPage from "../pages/Configuracao/Cadastrar";
import EditarConfiguracaoPage from "../pages/Configuracao/Editar";
import EditarNotasFiscaisPage from "../pages/NotasFiscais/nfe/Editar";
import ListarRelatorios from "../pages/Relatorios/Listar"
import RendimentosVsDespesas from "../pages/Relatorios/RendimentosVsDespesas";
import PatrimonioAoLongoDoTempo from "../pages/Relatorios/PatrimonioAoLongoDoTempo";


export default function Routes({themeSetter}) {
  return (
    <Router>
      <Switch>

        <Route exact path="/">
          <Redirect to="/home" />
        </Route>

        {/*======== Rotas sem TopBar e SideMenu ========*/}
        <Route path="/login" exact component={LoginPage}></Route>
        <Route path="/ordens-servicos-acompanhamento/:encrypted" exact component={ListarOrdensServicosAcompanhamento}></Route>
        <Route path="/ordens-servicos/relatorio" exact component={OrdermServicoReport}></Route>
        <Route path="/orcamentos/relatorio" exact component={OrcamentoReport}></Route>


        <PrivateRoutes>
          <TopBar />
          <SideMenu>
            <Route path="/money" exact component={CalendarioPage}></Route>
            <Route path="/home" exact component={Home}></Route>
            <Route path="/trocar-tema" exact component={()=>{return <ThemeSelector setter={themeSetter} />}}></Route>

            <Route path="/clientes" exact component={ListarClientePage}></Route>
            <Route path="/clientes/novo" exact component={CadastrarClientePage}></Route>
            <Route path="/clientes/mostrar/:id" exact component={MostrarClientePage}></Route>
            <Route path="/clientes/editar/:id" exact component={EditarClientePage}></Route>

            <Route path="/transportadoras" exact component={ListarTransportadoraPage}></Route>
            <Route path="/transportadoras/novo" exactc component={CadastrarTransportadoraPage}></Route>
            <Route path="/transportadoras/mostrar/:id" exact component={MostrarTransportadoraPage}></Route>
            <Route path="/transportadoras/editar/:id" exact component={EditarTransportadoraPage}></Route>

            <Route path="/fornecedores" exact component={ListarFornecedorPage}></Route>
            <Route path="/fornecedores/novo" exact component={CadastrarFornecedorPage}></Route>
            <Route path="/fornecedores/mostrar/:id" exact component={MostrarFornecedorPage}></Route>
            <Route path="/fornecedores/editar/:id" exact component={EditarFornecedorPage}></Route>

            <Route path="/funcionarios" exact component={ListarFuncionarioPage}></Route>
            <Route path="/funcionarios/novo" exact component={CadastrarFuncionarioPage}></Route>
            <Route path="/funcionarios/mostrar/:id" exact component={MostrarFuncionarioPage}></Route>
            <Route path="/funcionarios/editar/:id" exact component={EditarFuncionarioPage}></Route>

            <Route path="/grupos" exact component={ListarGrupoPage}></Route>
            <Route path="/grupos/novo" exact component={CadastrarGrupoPage}></Route>
            <Route path="/grupos/editar/:id" exact component={EditarGrupoPage}></Route>

            <Route path="/grupos-produtos" exact component={ListarGruposDeProdutos}></Route>
            <Route path="/grupos-produtos/novo" exact component={CadastrarGrupoDeProdutos}></Route>
            <Route path="/grupos-produtos/editar/:id" exact component={EditarGrupoDeProdutos}></Route>

            <Route path="/unidades-produtos" exact component={ListarUnidadesDeProdutos}></Route>
            <Route path="/unidades-produtos/novo" exact component={CadastrarUnidadeDeProdutos}></Route>
            <Route path="/unidades-produtos/editar/:id" exact component={EditarUnidadeDeProdutos}></Route>

            <Route path="/grades-variacoes" exact component={ListarGradesDeVariacoes}></Route>
            <Route path="/grades-variacoes/novo" exact component={CadastrarGradesDeVariacoes}></Route>
            <Route path="/grades-variacoes/editar/:id" exact component={EditarGradesDeVariacoes}></Route>

            <Route path="/porcentagens-lucros" exact component={ListarPorcentagensLucros}></Route>
            <Route path="/porcentagens-lucros/novo" exact component={CadastrarPorcentagensLucros}></Route>
            <Route path="/porcentagens-lucros/editar/:id" exact component={EditarPorcentagensLucros}></Route>

            <Route path="/produtos" exact component={ListarProdutos}></Route>
            <Route path="/produtos/novo" exact component={CadastrarProdutos}></Route>
            <Route path="/produtos/editar/:id" exact component={EditarProdutos} ></Route>

            <Route path="/servicos" exact component={ListarServicos}></Route>
            <Route path="/servicos/novo" exact component={CadastrarServicos}></Route>
            <Route path="/servicos/editar/:id" exact component={EditarServicos} ></Route>

            <Route path="/ordens-servicos" exact component={ListarOrdensServicos}></Route>
            <Route path="/ordens-servicos/novo" exact component={CadastrarOrdensServicoPage}></Route>
            <Route path="/ordens-servicos/editar/:id" exact component={EditarOrdensServicoPage} ></Route>

            <Route path="/ordens-servicos-funcionarios/:idUsuario" exact component={ListarOrdensServicosFuncionariosPage} ></Route>
          
            <Route path="/orcamentos" exact component={ListarOrcamentosPage}></Route>
            <Route path="/orcamentos/novo" exact component={CadastrarOrcamentosPage}></Route>
            <Route path="/orcamentos/editar/:id" exact component={EditarOrcamentosPage} ></Route>

            <Route path="/compras" exact component={ListarCompras}></Route>
            <Route path="/compras/novo" exact component={CadastrarComprasPage}></Route>
            <Route path="/compras/editar/:id" exact component={EditarComprasPage} ></Route>

            <Route path="/formas-pagamentos" exact component={ListarFormasPagamentosPage}></Route>
            <Route path="/formas-pagamentos/novo" exact component={CadastrarFormasPagamentosPage}></Route>
            <Route path="/formas-pagamentos/editar/:id" exact component={EditarFormasPagamentosPage} ></Route>
            
            <Route path="/contas-bancarias" exact component={ListarContasBancariasPage}></Route>
            <Route path="/contas-bancarias/novo" exact component={CadastrarContasBancariasPage}></Route>
            <Route path="/contas-bancarias/editar/:id" exact component={EditarContasBancariasPage} ></Route>

            <Route path="/vendas" exact component={ListarVendas}></Route>
            <Route path="/vendas/novo" exact component={CadastrarVendasPage}></Route>
            <Route path="/vendas/editar/:id" exact component={EditarVendasPage} ></Route>

            <Route path="/estoques" exact component={ListarEstoques}></Route>
            <Route path="/estoques/movimentacoes/:id" exact component={MovimentacoesPage}></Route>

            <Route path="/extratos/:id" exact component={ListarExtratos}></Route>
           
            <Route path="/notas-fiscais" exact component={ListarNotasFiscaisPage}></Route>
            <Route path="/notas-fiscais/novo" exact component={CadastrarNotasFiscais}></Route>
            <Route path="/notas-fiscais/editar/:id" exact component={EditarNotasFiscaisPage}></Route>

            <Route path="/configuracoes" exact component={ListarConfiguracoesPage}></Route>
            <Route path="/configuracoes/novo" exact component={CadastrarConfiguracaoPage}></Route>
            <Route path="/configuracoes/editar/:id" exact component={EditarConfiguracaoPage}></Route>

            <Route path="/relatorios" exact component={ListarRelatorios}></Route>
            <Route path="/relatorios/rendimentosVsDespesas" exact component={RendimentosVsDespesas}></Route>
            <Route path="/relatorios/patrimonioAoLongoDoTempo" exact component={PatrimonioAoLongoDoTempo}></Route>

            <Route path="/chat" exact component={Chat}></Route>

            <Route path="/ajuda" exact component={Ajuda} ></Route>

          </SideMenu>

        </PrivateRoutes>

        <Route path="*" component={() => <h1>Page not found</h1>} />



      </Switch>
    </Router>
  );
}
