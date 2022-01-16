import React, { useEffect } from "react";

import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import Home from "../pages/Home";
import LoginPage from "../pages/Login/LoginPage";
import ListarClientePage from "../pages/Cadastros/cliente/ListarClientePage";
import CadastrarClientePage from "../pages/Cadastros/cliente/CadastrarClientePage";
import EditarClientePage from "../pages/Cadastros/cliente/EditarClientePage";
import MostrarClientePage from "../pages/Cadastros/cliente/MostrarClientePage";

import ListarTransportadoraPage from "../pages/Cadastros/transportadora/ListarTransportadoraPage";
import CadastrarTransportadoraPage from "../pages/Cadastros/transportadora/CadastrarTransportadoraPage";
import MostrarTransportadoraPage from "../pages/Cadastros/transportadora/MostrarTransportadoraPage";
import EditarTransportadoraPage from "../pages/Cadastros/transportadora/EditarTransportadoraPage";

import ListarFornecedorPage from "../pages/Cadastros/fornecedor/ListarFornecedorPage";
import CadastrarFornecedorPage from "../pages/Cadastros/fornecedor/CadastrarFornecedorPage";
import MostrarFornecedorPage from "../pages/Cadastros/fornecedor/MostrarFornecedorPage";
import EditarFornecedorPage from "../pages/Cadastros/fornecedor/EditarFornecedorPage";

import ListarFuncionarioPage from "../pages/Cadastros/funcionario/ListarFuncionarioPage";
import CadastrarFuncionarioPage from "../pages/Cadastros/funcionario/CadastrarFuncionarioPage";
import MostrarFuncionarioPage from "../pages/Cadastros/funcionario/MostrarFuncionarioPage";
import EditarFuncionarioPage from "../pages/Cadastros/funcionario/EditarFuncionarioPage";

import ListarGrupoPage from "../pages/Cadastros/grupo/ListarGrupoPage";
import EditarGrupoPage from "../pages/Cadastros/grupo/EditarGrupoPage";
import CadastrarGrupoPage from "../pages/Cadastros/grupo/CadastrarGrupoPage";

import ListarGruposDeProdutos from "../pages/Produtos/gruposDeProdutos/ListarGruposDeProdutos";
import CadastrarGrupoDeProdutos from "../pages/Produtos/gruposDeProdutos/CadastrarGruposDeProdutos";
import EditarGrupoDeProdutos from "../pages/Produtos/gruposDeProdutos/EditarGruposDeProdutos";

import ListarUnidadesDeProdutos from "../pages/Produtos/unidadesDeProdutos/ListarUnidadesDeProdutos";
import CadastrarUnidadeDeProdutos from "../pages/Produtos/unidadesDeProdutos/CadastrarUnidadesDeProdutos";
import EditarUnidadeDeProdutos from "../pages/Produtos/unidadesDeProdutos/EditarUnidadeDeProdutos";

import ListarGradesDeVariacoes from "../pages/Produtos/gradesDeVariacoes/Listar";
import CadastrarGradesDeVariacoes from "../pages/Produtos/gradesDeVariacoes/Cadastrar";
import EditarGradesDeVariacoes from "../pages/Produtos/gradesDeVariacoes/Editar";

import ListarProdutos from "../pages/Produtos/gerenciarProdutos/Listar";
import CadastrarProdutos from "../pages/Produtos/gerenciarProdutos/Cadastrar";
import EditarProdutos from "../pages/Produtos/gerenciarProdutos/Editar";

import PrivateRoutes from "./PrivateRoutes";
import TopBar from "../components/TopBar";
import SideMenu from "../components/SideMenu";
import ChatBox from "../pages/Chat/ChatBox";
import Chat from "../pages/Chat/Chat";

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
            <Route path="/cliente/novo" exact component={CadastrarClientePage}></Route>
            <Route path="/cliente/mostrar/:id" exact component={MostrarClientePage}></Route>
            <Route path="/cliente/editar/:id" exact component={EditarClientePage}></Route>

            <Route path="/transportadoras" exact component={ListarTransportadoraPage}></Route>
            <Route path="/transportadora/novo" exactc component={CadastrarTransportadoraPage}></Route>
            <Route path="/transportadora/mostrar/:id" exact component={MostrarTransportadoraPage}></Route>
            <Route path="/transportadora/editar/:id" exact component={EditarTransportadoraPage}></Route>

            <Route path="/fornecedores" exact component={ListarFornecedorPage}></Route>
            <Route path="/fornecedor/novo" exact component={CadastrarFornecedorPage}></Route>
            <Route path="/fornecedor/mostrar/:id" exact component={MostrarFornecedorPage}></Route>
            <Route path="/fornecedor/editar/:id" exact component={EditarFornecedorPage}></Route>

            <Route path="/funcionarios" exact component={ListarFuncionarioPage}></Route>
            <Route path="/funcionario/novo" exact component={CadastrarFuncionarioPage}></Route>
            <Route path="/funcionario/mostrar/:id" exact component={MostrarFuncionarioPage}></Route>
            <Route path="/funcionario/editar/:id" exact component={EditarFuncionarioPage}></Route>

            <Route path="/grupos" exact component={ListarGrupoPage}></Route>
            <Route path="/grupo/novo" exact component={CadastrarGrupoPage}></Route>
            <Route path="/grupo/editar/:id" exact component={EditarGrupoPage}></Route>

            <Route path="/grupos-produtos" exact component={ListarGruposDeProdutos}></Route>
            <Route path="/grupo-produto/novo" exact component={CadastrarGrupoDeProdutos}></Route>
            <Route path="/grupo-produto/editar/:id" exact component={EditarGrupoDeProdutos}></Route>

            <Route path="/unidades-produtos" exact component={ListarUnidadesDeProdutos}></Route>
            <Route path="/unidade-produto/novo" exact component={CadastrarUnidadeDeProdutos}></Route>
            <Route path="/unidade-produto/editar/:id" exact component={EditarUnidadeDeProdutos}></Route>

            <Route path="/grades-variacoes" exact component={ListarGradesDeVariacoes}></Route>
            <Route path="/grade-variacao/novo" exact component={CadastrarGradesDeVariacoes}></Route>
            <Route path="/grade-variacao/editar/:id" exact component={EditarGradesDeVariacoes}></Route>

            <Route path="/produtos" exact component={ListarProdutos}></Route>
            <Route path="/produto/novo" exact component={CadastrarProdutos}></Route>
            <Route path="/produto/editar/:id" exact component={EditarProdutos}></Route>

            <Route path="/chat" exact component={Chat}></Route>

          </SideMenu>

        </PrivateRoutes>

        <Route path="*" component={() => <h1>Page not found</h1>} />



      </Switch>
    </BrowserRouter>
  );
}
