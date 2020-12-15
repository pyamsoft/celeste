import React from "react";
import { User } from "../../domain/user/User";
import { AuthInteractor } from "../../domain/auth/AuthInteractor";
import { Logger } from "../../util/logger";
import { stopListening } from "../../util/listener";
import { AppView } from "./AppView";
import { ACNHInteractor } from "../../domain/acnh/ACNHInteractor";
import { ACNHFish } from "../../domain/acnh/ACNHFish";
import { ACNHBug } from "../../domain/acnh/ACNHBug";
import { ACNHSea } from "../../domain/acnh/ACNHSea";
import { ACNHFossil } from "../../domain/acnh/ACNHFossil";
import { ACNHHouseware } from "../../domain/acnh/ACNHHouseware";
import { ACNHWallmount } from "../../domain/acnh/ACNHWallmount";
import { Img } from "../common/Img";

const logger = Logger.tag("App");

export class App extends React.Component {
  constructor(props) {
    super(props);

    // All of the AC items
    const acnh = {};
    acnh[ACNHFish.TYPE] = [];
    acnh[ACNHBug.TYPE] = [];
    acnh[ACNHSea.TYPE] = [];
    acnh[ACNHFossil.TYPE] = [];
    acnh[ACNHHouseware.TYPE] = [];
    acnh[ACNHWallmount.TYPE] = [];

    this.state = {
      user: User.UNDEFINED,
      acnh,
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
        <ImagePreload acnh={acnh} />
      </React.StrictMode>
    );
  }
}

function ImagePreload(props) {
  const { acnh } = props;
  return (
    <div>
      {Object.keys(acnh).map((key) =>
        acnh[key]
          .flatMap((item) => item)
          .map((item) => (
            <Img
              key={`${key}-${item.id}`}
              src={item.image}
              preload={true}
              alt={item.name}
            />
          ))
      )}
    </div>
  );
}
