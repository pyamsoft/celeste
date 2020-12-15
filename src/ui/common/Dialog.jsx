import React from "react";
import Modal from "react-modal";
import _ from "lodash";
import { fitToWindowHeight, fitToWindowWidth } from "../../util/window";

const {
  outline,
  padding,
  borderRadius,
  ...DEFAULT_CONTENT_STYLE
} = Modal.defaultStyles.content;
const DEFAULT_OVERLAY_STYLE = Modal.defaultStyles.overlay;
const CUSTOM_STYLE = {
  top: "50%",
  left: "50%",
  right: "auto",
  bottom: "auto",
  marginRight: "-50%",
  transform: "translate(-50%, -50%)",
};

const defaultClassNames = "block overflow-hidden shadow-2xl p-4 rounded-3xl";

export class Dialog extends React.Component {
  constructor(props) {
    super(props);
    this.resizeCallback = _.throttle(() => {
      this.forceUpdate();
      const { onResize } = this.props;
      if (onResize) {
        onResize();
      }
    }, 200);
  }

  componentDidMount() {
    window.addEventListener("resize", this.resizeCallback);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.resizeCallback);
  }

  closeDialog = () => {
    const { onClose } = this.props;
    onClose();
  };

  getParent = () => {
    const { appElement } = this.props;
    return document.querySelector(!!appElement ? appElement : "#root");
  };

  render() {
    const {
      style,
      children,
      overlayClassName,
      className,
      ...rest
    } = this.props;

    // Size the modal in the middle of the screen and fit to content
    let overlay = { zIndex: 1000 };

    // Apply default styles even when class overrides
    if (!!overlayClassName) {
      overlay = { ...DEFAULT_OVERLAY_STYLE, ...overlay };
    }

    let content = {
      ...DEFAULT_CONTENT_STYLE,
      ...CUSTOM_STYLE,
      maxWidth: fitToWindowWidth(),
      maxHeight: fitToWindowHeight(),
    };

    if (!!style && !!style.overlay) {
      overlay = {
        ...overlay,
        ...style.overlay,
      };
    }

    if (!!style && !!style.content) {
      content = { ...content, ...style.content };
    }

    const modalStyle = { overlay, content };

    return (
      <Modal
        {...rest}
        isOpen={true}
        parentSelector={this.getParent}
        onRequestClose={this.closeDialog}
        style={modalStyle}
        overlayClassName={`${
          overlayClassName ? overlayClassName : ""
        } focus:outline-none`}
        className={`${defaultClassNames} ${
          className ? className : ""
        } focus:outline-none`}
      >
        <div className="flex flex-column w-full h-full">{children}</div>
      </Modal>
    );
  }
}

Modal.setAppElement(document.getElementById("root"));
