import React from "react";
import { LoginInteractor } from "./LoginInteractor";
import { Logger } from "../common/util/logger";
import { LoginFields } from "./LoginFields";

const logger = Logger.tag("LoginDelegate");

export class LoginDelegate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      loggingIn: false,
    };
  }

  handleEmailChanged = (email) => {
    this.setState({ email: email.trim() });
  };

  handleLogin = () => {
    const { loggingIn } = this.state;
    if (loggingIn) {
      return;
    }

    this.setState({ loggingIn: true }, async () => {
      const { email } = this.state;

      // Stop login after done
      const payload = { loggingIn: false };

      try {
        await LoginInteractor.login({ email });
        logger.d("Sent sign in email to: ", email);
        payload.email = "";
      } catch (e) {
        logger.e(e, "Error sending sign in email");
      } finally {
        this.setState(payload);
      }
    });
  };

  render() {
    const { children } = this.props;
    const { email, loggingIn } = this.state;
    return (
      <React.Fragment>
        <LoginFields
          loggingIn={loggingIn}
          email={email}
          onEmailChanged={this.handleEmailChanged}
          onLogin={this.handleLogin}
        />
        {children}
      </React.Fragment>
    );
  }
}
