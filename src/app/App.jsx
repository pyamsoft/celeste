import React from "react";
import { User } from "../user/User";
import { Logger } from "../common/util/logger";
import { stopListening } from "../common/util/listener";
import { AppView } from "./AppView";
import { ACNHInteractor } from "../acnh/ACNHInteractor";
import { ACNHFish } from "../acnh/ACNHFish";
import { ACNHBug } from "../acnh/ACNHBug";
import { ACNHSea } from "../acnh/ACNHSea";
import { ACNHFossil } from "../acnh/ACNHFossil";
import { ACNHHouseware } from "../acnh/ACNHHouseware";
import { ACNHWallmount } from "../acnh/ACNHWallmount";
import { AppInteractor } from "./AppInteractor";

const logger = Logger.tag("App");

export class App extends React.Component {
  constructor(props) {
    super(props);

    // All of the AC items
    const acnh = {};
    acnh[ACNHFish.TYPE] = {};
    acnh[ACNHBug.TYPE] = {};
    acnh[ACNHSea.TYPE] = {};
    acnh[ACNHFossil.TYPE] = {};
    acnh[ACNHHouseware.TYPE] = {};
    acnh[ACNHWallmount.TYPE] = {};

    this.state = {
      user: User.UNDEFINED,
      acnh,
    };

    this.authListener = null;
    this.userListener = null;

    AppInteractor.startSession();
  }

  componentDidMount() {
    this.watchSession();
    this.loadACNH(ACNHFish.TYPE, ACNHInteractor.getAllFish);
    this.loadACNH(ACNHSea.TYPE, ACNHInteractor.getAllSea);
    this.loadACNH(ACNHBug.TYPE, ACNHInteractor.getAllBug);
    this.loadACNH(ACNHFossil.TYPE, ACNHInteractor.getAllFossil);
    this.loadACNH(ACNHHouseware.TYPE, ACNHInteractor.getAllHouse);
    this.loadACNH(ACNHWallmount.TYPE, ACNHInteractor.getAllWall);
  }

  componentWillUnmount() {
    if (stopListening(this.authListener)) {
      this.authListener = null;
    }

    this.stopUserListener();

    ACNHInteractor.clearAll();
  }

  stopUserListener = () => {
    if (stopListening(this.userListener)) {
      this.userListener = null;
    }
  };

  watchSession = () => {
    this.authListener = AppInteractor.watchAuth({
      onAuthChanged: (auth) => {
        this.stopUserListener();
        if (auth.id) {
          this.userListener = AppInteractor.watchUser({
            authUID: auth.id,
            onUserChanged: async (partial) => {
              logger.d("Got partial user: ", partial);
              const user = await AppInteractor.startSessionForUser({
                auth,
                user: partial,
              });
              this.setState({ user });
            },
          });
        } else {
          logger.d("Auth is bad, stop user listener");
          this.setState({ user: User.NOT_LOGGED_IN });
        }
      },
    });
  };

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
        acnh[key] = {};
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
