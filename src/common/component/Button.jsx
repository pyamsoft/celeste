import React from "react";

const defaultClassNames = "btn cursor-pointer focus:outline-none";

export function EmptyButton(props) {
  const { id, className, style, onClick, children, disabled, ...rest } = props;
  return (
    <button
      {...rest}
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
      {...rest}
      className={`border-2 rounded-lg ${className ? className : ""}`}
    >
      {children}
    </EmptyButton>
  );
}

export function SuccessButton(props) {
  const { className, children, ...rest } = props;
  return (
    <Button
      {...rest}
      className={`bg-green-300 border-green-400 text-gray-200 hover:bg-green-200 hover:border-green-300 hover:text-white ${
        className ? className : ""
      }`}
    >
      {children}
    </Button>
  );
}

export function CancelButton(props) {
  const { className, children, ...rest } = props;
  return (
    <Button
      {...rest}
      className={`bg-red-300 border-red-400 text-gray-200 hover:bg-red-200 hover:border-red-300 hover:text-white ${
        className ? className : ""
      }`}
    >
      {children}
    </Button>
  );
}
