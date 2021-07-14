import React from 'react';

import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Home from '../src/pages/Home';
import CadastroClientePage from '../src/pages/cliente/CadastroClientePage';

export default function Routes() {

    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component={Home}></Route>
                <Route path="/cliente/novo" exact component={CadastroClientePage}></Route>
                <Route path="*" component={() => <h1>Page not found</h1>} />
            </Switch>
        </BrowserRouter>
    )
}