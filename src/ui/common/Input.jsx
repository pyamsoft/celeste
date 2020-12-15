import React from "react";

const defaultClassNames =
  "input border-2 rounded-full px-3 py-2 border-black border-opacity-50";

export class Input extends React.Component {
  handleChange = (event) => {
    const { onChange } = this.props;
    onChange(event?.target?.value ?? "");
  };

  render() {
    const { className, style, value, disabled, placeholder } = this.props;
    return (
      <input
        className={`${className ? className : ""} ${defaultClassNames}`}
        style={style}
        disabled={disabled}
        placeholder={placeholder}
        onChange={this.handleChange}
        value={value}
      />
    );
  }
}
