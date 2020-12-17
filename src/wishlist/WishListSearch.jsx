import React from "react";
import _ from "lodash";
import { Input } from "../common/component/Input";

export class WishListSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
    };

    this.publishSearchUpdate = _.throttle(
      this.immediatelyBroadcastSearchUpdate,
      400,
      {
        leading: false,
        trailing: true,
      }
    );
  }

  componentWillUnmount() {
    this.publishSearchUpdate.cancel();
  }

  handleSearchUpdate = (search) => {
    this.setState({ search }, this.publishSearchUpdate);
  };

  immediatelyBroadcastSearchUpdate = () => {
    const { search } = this.state;
    const { onChange } = this.props;
    onChange(search);
  };

  render() {
    const { search } = this.state;
    const { className, style } = this.props;
    return (
      <div
        className={`${className ? className : ""} block w-full`}
        style={style}
      >
        <Input value={search} onChange={this.handleSearchUpdate} />
      </div>
    );
  }
}
