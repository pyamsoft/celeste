import React from "react";

const defaultClassNames =
  "input border-2 rounded-full px-3 py-2 border-black border-opacity-50 focus:outline-none";

export class Input extends React.Component {
  handleChange = ($event) => {
    const { onChange } = this.props;
    const { target } = $event;
    if (onChange) {
      onChange(target?.value ?? "");
    }
  };

  handleKeyDown = ($event) => {
    const { onKeyDown } = this.props;
    const { key } = $event;

    if (onKeyDown) {
      onKeyDown(key);
    }
  };

  handleKeyUp = ($event) => {
    const { onSubmit, onKeyUp } = this.props;
    const { key } = $event;

    if (onKeyUp) {
      onKeyUp(key);
    }

    if (key === "Enter") {
      if (onSubmit) {
        onSubmit();
      }
    }
  };

  render() {
    const { id, className, style, value, disabled, placeholder } = this.props;
    return (
      <input
        id={id}
        className={`${className ? className : ""} ${defaultClassNames}`}
        style={style}
        disabled={disabled}
        placeholder={placeholder}
        onChange={this.handleChange}
        onKeyDown={this.handleKeyDown}
        onKeyUp={this.handleKeyUp}
        value={value}
      />
    );
  }
}
