import React from "react";
import { Title } from "../common/component/Title";
import { Input } from "../common/component/Input";
import _ from "lodash";

export class WishListTitle extends React.Component {
  constructor(props) {
    super(props);
    const { name } = props;
    this.state = {
      name,
    };

    this.publishNameChange = _.debounce(this.immediatelyUpdateName, 60);
  }

  componentWillUnmount() {
    this.publishNameChange.cancel();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { isEditable } = this.props;
    if (!isEditable) {
      // Replace the name with the props if we cannot edit this name
      const { name } = this.state;
      const { name: newName } = this.props;
      if (newName !== name) {
        this.setState({ name: newName });
      }
    }
  }

  immediatelyUpdateName = () => {
    const { onNameChanged } = this.props;
    const { name } = this.state;
    onNameChanged(name);
  };

  handleNameChanged = (name) => {
    this.setState({ name }, this.publishNameChange);
  };

  render() {
    const { className, style, isEditable } = this.props;
    const { name } = this.state;
    return isEditable ? (
      <Input
        className={`${className ? className : ""} text-2xl`}
        style={style}
        value={name}
        onChange={this.handleNameChanged}
      />
    ) : (
      <Title className={`${className ? className : ""}`} style={style}>
        {name}
      </Title>
    );
  }
}
