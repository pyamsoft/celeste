import React from "react";
import { User } from "../../domain/user/User";
import { AuthInteractor } from "../../domain/auth/AuthInteractor";
import { Logger } from "../../util/logger";
import { stopListening } from "../../util/listener";
import { AppView } from "./AppView";
import { ACNHInteractor } from "../../domain/acnh/ACNHInteractor";

const logger = Logger.tag("App");

export class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: User.UNDEFINED,

      acnh: {
        fish: [],
        sea: [],
        bug: [],
        fossil: [],
        house: [],
        wall: [],
      },
    };

    this.authListener = null;

    AuthInteractor.processLogin();
  }

  componentDidMount() {
    this.authListener = AuthInteractor.listenForAuthChanges({
      onAuthChanged: (user) => {
        logger.d("User updated: ", user);
        this.setState({ user });
      },
    });

    this.loadACNH("fish", ACNHInteractor.getAllFish);
    this.loadACNH("sea", ACNHInteractor.getAllSea);
    this.loadACNH("bug", ACNHInteractor.getAllBug);
    this.loadACNH("fossil", ACNHInteractor.getAllFossil);
    this.loadACNH("house", ACNHInteractor.getAllHouse);
    this.loadACNH("wall", ACNHInteractor.getAllWall);
  }

  componentWillUnmount() {
    if (stopListening(this.authListener)) {
      this.authListener = null;
    }

    ACNHInteractor.clearAll();
  }

  loadACNH = (key, endpoint) => {
    endpoint()
      .then((result) => {
        logger.d("Loaded all", key, result);
        const { acnh } = this.state;
        acnh[key] = result;
        this.setState({ acnh });
      })
      .catch((error) => {
        logger.e(error, "Failed to load", key);
        const { acnh } = this.state;
        acnh[key] = [];
        this.setState({ acnh });
      });
  };

  render() {
    const { user, acnh } = this.state;
    return (
      <React.StrictMode>
        <AppView user={user} acnh={acnh} />
      </React.StrictMode>
    );
  }
}
