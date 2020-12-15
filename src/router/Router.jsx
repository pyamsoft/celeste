import React from "react";
import {
  BrowserRouter,
  Redirect,
  Route,
  Switch,
  withRouter,
} from "react-router-dom";
import { Login } from "../login/Login";
import { Routes } from "./Routes";
import { User } from "../user/User";
import { Profile } from "../profile/Profile";
import { Title } from "../common/component/Title";
import { WishListPage } from "../wishlist/WishListPage";

export function Router(props) {
  const { user } = props;
  return (
    <BrowserRouter>
      <Switch>
        <UnauthenticatedAppRoute path={Routes.LOGIN} user={user}>
          <Login {...props} />
        </UnauthenticatedAppRoute>

        <AuthenticatedAppRoute path={Routes.PROFILE} user={user}>
          <Profile {...props} />
        </AuthenticatedAppRoute>

        <AppRoute path={Routes.WISHLIST} user={user}>
          <WishListPage {...props} />
        </AppRoute>

        <DefaultRoute {...props} />
      </Switch>
    </BrowserRouter>
  );
}

export function registerRoute(Component) {
  return withRouter(Component);
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
  return <Title>Loading...</Title>;
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
