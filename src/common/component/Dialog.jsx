import React from "react";
import Modal from "react-modal";
import {
  fitToWindowHeight,
  fitToWindowWidth,
  watchResize,
} from "../util/window";
import { stopListening } from "../util/listener";

const {
  outline,
  padding,
  borderRadius,
  ...DEFAULT_CONTENT_STYLE
} = Modal.defaultStyles.content;
const { ...DEFAULT_OVERLAY_STYLE } = Modal.defaultStyles.overlay;

const CUSTOM_CONTENT_STYLE = {
  ...DEFAULT_CONTENT_STYLE,
  zIndex: 10,
  top: "50%",
  left: "50%",
  right: "auto",
  bottom: "auto",
  marginRight: "-50%",
  transform: "translate(-50%, -50%)",
};

const CUSTOM_OVERLAY_STYLE = {
  ...DEFAULT_OVERLAY_STYLE,
  zIndex: 20,
  background: `rgba(0, 0, 0, 0.2)`,
};

const defaultClassNames = "block overflow-hidden shadow-2xl p-4 rounded-3xl";

export class Dialog extends React.Component {
  constructor(props) {
    super(props);
    this.resizeCallback = null;
  }

  componentDidMount() {
    this.resizeCallback = watchResize(() => {
      this.forceUpdate();
      const { onResize } = this.props;
      if (onResize) {
        onResize();
      }
    });
  }

  componentWillUnmount() {
    if (stopListening(this.resizeCallback)) {
      this.resizeCallback = null;
    }
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
    const { style, children, className, ...rest } = this.props;

    let overlay = CUSTOM_OVERLAY_STYLE;
    if (!!style && !!style.overlay) {
      overlay = {
        ...overlay,
        ...style.overlay,
      };
    }

    let content = {
      ...CUSTOM_CONTENT_STYLE,
      maxWidth: fitToWindowWidth(),
      maxHeight: fitToWindowHeight(),
    };
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
        overlayClassName="focus:outline-none"
        className={`${defaultClassNames} ${
          className ? className : ""
        } focus:outline-none`}
      >
        <div className="block w-full h-full overflow-hidden">{children}</div>
      </Modal>
    );
  }
}

Modal.setAppElement(document.getElementById("root"));
