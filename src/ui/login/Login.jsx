import React from "react";
import { AuthInteractor } from "../../domain/auth/AuthInteractor";
import { Logger } from "../../util/logger";

const logger = Logger.tag("Login");

export class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  login = async () => {
    const email = "pyam.soft@gmail.com";
    const result = await AuthInteractor.login({ email });
    if (result) {
      logger.d("Sent sign in email to: ", email);
    } else {
      logger.w("Could not send sign in email to: ", email);
    }
  };

  render() {
    return <div onClick={this.login}>Login</div>;
  }
}
