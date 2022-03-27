import React, { useEffect } from "react";

import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
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

import ListarProdutos from "../pages/Produtos/gerenciar-produtos/Listar";
import CadastrarProdutos from "../pages/Produtos/gerenciar-produtos/Cadastrar";
import EditarProdutos from "../pages/Produtos/gerenciar-produtos/Editar";

import ListarServicos from "../pages/Servicos/gerenciar-servicos/Listar";
import CadastrarServicos from "../pages/Servicos/gerenciar-servicos/Cadastrar";
import EditarServicos from "../pages/Servicos/gerenciar-servicos/Editar";

import PrivateRoutes from "./PrivateRoutes";
import TopBar from "../components/TopBar";
import SideMenu from "../components/SideMenu";
import Chat from "../pages/Chat/Chat";
import Ajuda from "../pages/Ajuda/Ajuda"
import CadastrarOrdemServicoPage from "../pages/OrdensServicos/Cadastrar";
import ListarPorcentagensLucros from "../pages/Produtos/porcentagens-lucros/Listar";
import CadastrarPorcentagensLucros from "../pages/Produtos/porcentagens-lucros/Cadastrar";

export default function Routes() {
  return (
    <BrowserRouter>
      <Switch>

        <Route exact path="/">
          <Redirect to="/home" />
        </Route>

        <Route path="/login" exact component={LoginPage}></Route>

        <PrivateRoutes>
          <TopBar />
          <SideMenu>
            <Route path="/home" exact component={Home}></Route>

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

            <Route path="/produtos" exact component={ListarProdutos}></Route>
            <Route path="/produtos/novo" exact component={CadastrarProdutos}></Route>
            <Route path="/produtos/editar/:id" exact component={EditarProdutos} ></Route>

            <Route path="/servicos" exact component={ListarServicos}></Route>
            <Route path="/servicos/novo" exact component={CadastrarServicos}></Route>
            <Route path="/servicos/editar/:id" exact component={EditarServicos} ></Route>

            {/* <Route path="/ordens-servicos" exact component={ListarServicos}></Route> */}
            <Route path="/ordens-servicos/novo" exact component={CadastrarOrdemServicoPage}></Route>
            {/* <Route path="/ordens-servicos/editar/:id" exact component={EditarServicos} ></Route> */}

            <Route path="/chat" exact component={Chat}></Route>

            <Route path="/ajuda" exact component={Ajuda} ></Route>

          </SideMenu>

        </PrivateRoutes>

        <Route path="*" component={() => <h1>Page not found</h1>} />



      </Switch>
    </BrowserRouter>
  );
}
