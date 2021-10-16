import React, { useState, useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';

function PrivateRoutes ({ Component, ...rest }) {
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
       setToken(localStorage.getItem('token'));

    }, []);

    if (token == null) {
        return <Redirect to="/login" />
    }

    return (
        <Route
            {...rest}
            render={() =>
                <Component {...rest} />
            }
        />
    )
}

export default PrivateRoutes;