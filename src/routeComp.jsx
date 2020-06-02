import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const PublicRoute = ({ component: Component, restricted, isLogin, ...rest }) => {
    return (
        <Route {...rest} render={props => (
            isLogin && restricted ?
                <Redirect to="/" />
                : <Component {...props} />
        )} />
    );
};
const PrivateRoute = ({ component: Component, isLogin, ...rest }) => {
    return (
        <Route {...rest} render={props => (
            isLogin ?
                <Component {...props} />
                : <Redirect to="/beforelogin" />
        )} />
    );
};
export { PublicRoute, PrivateRoute }