import React from "react";

const defaultClassNames = "btn cursor-pointer focus:outline-none";

export function EmptyButton(props) {
  const { id, className, style, onClick, children, disabled } = props;
  return (
    <button
      id={id}
      className={`${className ? className : ""} ${defaultClassNames}`}
      style={style}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export function Button(props) {
  const { className, children, ...rest } = props;
  return (
    <EmptyButton
      className={`border-2 rounded-lg px-3 py-2 ${className ? className : ""}`}
      {...rest}
    >
      {children}
    </EmptyButton>
  );
}

export function SuccessButton(props) {
  const { className, children, ...rest } = props;
  return (
    <Button
      className={`bg-green-300 border-green-400 text-gray-200 hover:bg-green-200 hover:border-green-300 hover:text-white ${
        className ? className : ""
      }`}
      {...rest}
    >
      {children}
    </Button>
  );
}

export function CancelButton(props) {
  const { className, children, ...rest } = props;
  return (
    <Button
      className={`bg-red-300 border-red-400 text-gray-200 hover:bg-red-200 hover:border-red-300 hover:text-white ${
        className ? className : ""
      }`}
      {...rest}
    >
      {children}
    </Button>
  );
}
