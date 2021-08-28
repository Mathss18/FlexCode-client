import React from 'react';

import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Home from '../src/pages/Home';
import ListarClientePage from './pages/cliente/ListarClientePage';
import CadastrarClientePage from './pages/cliente/CadastrarClientePage';
import EditarClientePage from './pages/cliente/EditarClientePage';
import MostrarClientePage from './pages/cliente/MostrarClientePage';

import ListarTransportadoraPage from './pages/transportadora/ListarTransportadoraPage';
import CadastrarTransportadoraPage from './pages/transportadora/CadastrarTransportadoraPage';
import MostrarTransportadoraPage from './pages/transportadora/MostrarTransportadoraPage';
import EditarTransportadoraPage from './pages/transportadora/EditarTransportadoraPage';

import ListarFornecedorPage from './pages/fornecedor/ListarFornecedorPage';
import CadastrarFornecedorPage from './pages/fornecedor/CadastrarFornecedorPage';
import MostrarFornecedorPage from './pages/fornecedor/MostrarFornecedorPage';
import EditarFornecedorPage from './pages/fornecedor/EditarFornecedorPage';

import ListarFuncionarioPage from './pages/funcionario/ListarFuncionarioPage';
import CadastrarFuncionarioPage from './pages/funcionario/CadastrarFuncionarioPage';
import MostrarFuncionarioPage from './pages/funcionario/MostrarFuncionarioPage';
import EditarFuncionarioPage from './pages/funcionario/EditarFuncionarioPage';

export default function Routes() {

    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component={Home}></Route>
                
                
                <Route path="/clientes" exact component={ListarClientePage}></Route>
                <Route path="/cliente/novo" exact component={CadastrarClientePage}></Route>
                <Route path="/cliente/mostrar/:id" exact component={MostrarClientePage}></Route>
                <Route path="/cliente/editar/:id" exact component={EditarClientePage}></Route>

                <Route path="/transportadoras" exact component={ListarTransportadoraPage}></Route>
                <Route path="/transportadora/novo" exact component={CadastrarTransportadoraPage}></Route>
                <Route path="/transportadora/mostrar/:id" exact  component={MostrarTransportadoraPage}></Route>
                <Route path="/transportadora/editar/:id" exact component={EditarTransportadoraPage}></Route>

                <Route path="/fornecedores" exact component={ListarFornecedorPage}></Route>
                <Route path="/fornecedor/novo" exact component={CadastrarFornecedorPage}></Route>
                <Route path="/fornecedor/mostrar/:id" exact  component={MostrarFornecedorPage}></Route>
                <Route path="/fornecedor/editar/:id" exact component={EditarFornecedorPage}></Route>

                <Route path="/funcionarios" exact component={ListarFuncionarioPage}></Route>
                <Route path="/funcionario/novo" exact component={CadastrarFuncionarioPage}></Route>
                <Route path="/funcionario/mostrar/:id" exact  component={MostrarFuncionarioPage}></Route>
                <Route path="/funcionario/editar/:id" exact component={EditarFuncionarioPage}></Route>

                <Route path="*" component={() => <h1>Page not found</h1>} />
                
            </Switch>
        </BrowserRouter>
    )
}