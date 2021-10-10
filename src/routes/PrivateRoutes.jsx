import React, { useState, useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';

function PrivateRoutes ({ Component, ...rest }) {
    console.log(Component);
    console.log(rest)
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
       setToken(localStorage.getItem('token'));

    }, [localStorage.getItem('token')]);
    
    console.log('Token:' + token);

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