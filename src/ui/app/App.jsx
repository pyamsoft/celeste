import React from "react";
import { User } from "../../domain/user/User";
import { AuthInteractor } from "../../domain/auth/AuthInteractor";
import { Logger } from "../../util/logger";
import { stopListening } from "../../util/listener";
import { AppView } from "./AppView";

const logger = Logger.tag("App");

export class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: User.UNDEFINED,
    };

    this.authListener = null;

    AuthInteractor.processLogin();
  }

  componentDidMount() {
    this.authListener = AuthInteractor.listenForAuthChanges((user) => {
      logger.d("User updated: ", user);
      this.setState({ user });
    });
  }

  componentWillUnmount() {
    if (stopListening(this.authListener)) {
      this.authListener = null;
    }
  }

  render() {
    const { user } = this.state;
    return (
      <React.StrictMode>
        <AppView user={user} />
      </React.StrictMode>
    );
  }
}
