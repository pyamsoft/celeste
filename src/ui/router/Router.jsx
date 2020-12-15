import React from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { Login } from "../login/Login";
import { Routes } from "./Routes";
import { User } from "../../domain/user/User";
import { SignUp } from "../signup/SignUp";
import { Profile } from "../profile/Profile";

export function Router(props) {
  const { user } = props;
  return (
    <BrowserRouter>
      <Switch>
        <UnauthenticatedAppRoute path={Routes.LOGIN} user={user}>
          <Login {...props} />
        </UnauthenticatedAppRoute>

        <UnauthenticatedAppRoute path={Routes.SIGN_UP} user={user}>
          <SignUp {...props} />
        </UnauthenticatedAppRoute>

        <AuthenticatedAppRoute path={Routes.PROFILE} user={user}>
          <Profile {...props} />
        </AuthenticatedAppRoute>

        <DefaultRoute {...props} />
      </Switch>
    </BrowserRouter>
  );
}

function KickOut() {
  return <Redirect to={Routes.LOGIN} />;
}

function SignedIn() {
  return <Redirect to={Routes.PROFILE} />;
}

function DefaultRoute(props) {
  const { user } = props;
  if (user === User.UNDEFINED) {
    return <AppLoading />;
  }

  return (
    <Route path={Routes.NO_MATCH}>
      {user === User.NOT_LOGGED_IN ? <KickOut /> : <SignedIn />}
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

function AuthenticatedAppRoute(props) {
  const { user, path, children } = props;

  if (user === User.NOT_LOGGED_IN) {
    return <KickOut />;
  }

  return (
    <AppRoute user={user} path={path}>
      {children}
    </AppRoute>
  );
}

function UnauthenticatedAppRoute(props) {
  const { user, path, children } = props;

  if (user !== User.NOT_LOGGED_IN && user !== User.UNDEFINED) {
    return <SignedIn />;
  }

  return (
    <AppRoute user={user} path={path}>
      {children}
    </AppRoute>
  );
}
