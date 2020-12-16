import React from "react";

const defaultClassNames =
  "textarea rounded-full px-3 py-2 border-2 border-black border-opacity-50 focus:outline-none";

export class TextArea extends React.Component {
  handleChange = ($event) => {
    const { onChange } = this.props;
    const { target } = $event;
    if (onChange) {
      onChange(target?.value ?? "");
    }
  };

  render() {
    const { id, className, readOnly, style, value, disabled, placeholder } = this.props;
    return (
      <textarea
        id={id}
        className={`${className ? className : ""} ${defaultClassNames}`}
        style={style}
        readOnly={readOnly}
        disabled={disabled}
        placeholder={placeholder}
        onChange={this.handleChange}
        value={value}
      />
    );
  }
}
