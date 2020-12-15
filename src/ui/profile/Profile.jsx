import React from "react";
import { Logger } from "../../util/logger";

const logger = Logger.tag("Profile");

export class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { user } = this.props;
    return <div>Hello {user.displayName}</div>;
  }
}
