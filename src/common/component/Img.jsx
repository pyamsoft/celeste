import React from "react";
import { stopListening } from "../util/listener";
import styled from "styled-components";
import ThumbNail from "../../images/thumb.jpg";
import _ from "lodash";

export class Img extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
    };

    this.observer = null;
    this.ref = null;
  }

  setRef = (ref) => {
    this.ref = ref;
  };

  handleVisible = () => {
    this.setState({ isVisible: true });
  };

  componentDidMount() {
    this.registerIntersectionObserver();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    this.registerIntersectionObserver();
  }

  componentWillUnmount() {
    if (stopListening(this.observer)) {
      this.observer = null;
    }
  }

  registerIntersectionObserver = () => {
    const { isVisible } = this.state;
    if (isVisible) {
      return;
    }

    if (this.observer) {
      return;
    }

    const ref = this.ref;
    if (!ref) {
      return;
    }

    const observer = new IntersectionObserver(
      ([{ isIntersecting }], observerElement) => {
        if (isIntersecting) {
          this.handleVisible();
          observerElement.unobserve(ref);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px",
      }
    );

    observer.observe(ref);
    this.observer = function stopObserving() {
      observer.unobserve(ref);
    };
  };

  render() {
    const { id, onClick, src, alt, height, width, thumb } = this.props;
    const { isVisible } = this.state;
    const ratio = (height / width) * 100;
    return (
      <div id={id} onClick={onClick}>
        <div
          ref={this.setRef}
          className="overflow-hidden relative bg-gray-100 bg-opacity-10"
          style={{ paddingBottom: `${ratio}%` }}
        >
          {isVisible && (
            <LoadInImage
              className="image absolute inset-0 m-auto"
              src={src}
              thumb={thumb}
              alt={alt}
            />
          )}
        </div>
      </div>
    );
  }
}

const BlurredThumbnail = styled.img`
  filter: blur(20px);
  transition: visibility 0ms ease 400ms;
`;

class LoadInImage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showThumbnail: false,
      isLoaded: false,
    };

    this.flickerTimer = _.debounce(() => {
      const { isLoaded } = this.state;
      if (!isLoaded) {
        this.setState({ showThumbnail: true });
      }
    }, 200);
  }

  componentDidMount() {
    this.flickerTimer();
  }

  componentWillUnmount() {
    this.flickerTimer.cancel();
  }

  handleLoaded = () => {
    this.setState({ isLoaded: true });
  };

  render() {
    const { src, alt, className, thumb } = this.props;
    const { showThumbnail, isLoaded } = this.state;
    return (
      <React.Fragment>
        {showThumbnail && (
          <BlurredThumbnail
            className={`${className} ${
              isLoaded ? "invisible" : "visible"
            } transform scale-110`}
            alt={alt}
            src={thumb || ThumbNail}
          />
        )}
        <img
          onLoad={this.handleLoaded}
          className={`${className} ${isLoaded ? "opacity-100" : "opacity-0"}`}
          alt={alt}
          src={src}
        />
      </React.Fragment>
    );
  }
}
