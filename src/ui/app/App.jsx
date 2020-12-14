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

    this.watchUserListener = null;
  }

  componentDidMount() {
    this.watchUserListener = AuthInteractor.listenForAuthChanges((user) => {
      logger.d("User updated: ", user);
      this.setState({ user });
    });
  }

  componentWillUnmount() {
    if (stopListening(this.watchUserListener)) {
      this.watchUserListener = null;
    }
  }

  render() {
    const { user } = this.state;
    return <AppView user={user} />;
  }
}
