import React from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { Login } from "../login/Login";
import { Routes } from "./Routes";
import { User } from "../../domain/user/User";
import { SignUp } from "../signup/SignUp";

export function Router(props) {
  const { user } = props;
  return (
    <BrowserRouter>
      <Switch>
        <AppRoute path={Routes.LOGIN} user={user}>
          <Login {...props} />
        </AppRoute>
        <AppRoute path={Routes.SIGN_UP} user={user}>
          <SignUp {...props} />
        </AppRoute>
        <DefaultRoute />
      </Switch>
    </BrowserRouter>
  );
}

function KickOut() {
  return <Redirect to={Routes.LOGIN} />;
}

function DefaultRoute() {
  return (
    <Route path={Routes.NO_MATCH}>
      <KickOut />
    </Route>
  );
}

function AppLoading() {
  return <div>Loading...</div>;
}

function AppRoute(props) {
  const { user, path, children } = props;
  if (user === User.UNDEFINED) {
    return <AppLoading />;
  }

  return <Route path={path}>{children}</Route>;
}

function ProtectedAppRoute(props) {
  const { user, path, children } = props;

  if (user === User.UNDEFINED) {
    return <AppLoading />;
  }

  if (user === User.NOT_LOGGED_IN) {
    return <KickOut />;
  }

  return <Route path={path}>{children}</Route>;
}
