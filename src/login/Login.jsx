import React from "react";
import { LoginDelegate } from "./LoginDelegate";
import { GiantHeader } from "../common/component/GiantHeader";
import { APP_NAME } from "../common/util/constants";
import { Text } from "../common/component/Text";

export class Login extends React.Component {
  render() {
    return (
      <div className="w-full h-full overflow-x-hidden overflow-y-auto">
        <div className="w-full mb-12 mt-56">
          <GiantHeader className="mb-3 mx-auto text-center text-white">
            {APP_NAME}
          </GiantHeader>
          <Text className="mx-auto text-center text-white">
            A collaborative wishlist for Animal Crossing: New Horizons
          </Text>
        </div>
        <div className="w-full">
          <LoginDelegate />
        </div>
      </div>
    );
  }
}
