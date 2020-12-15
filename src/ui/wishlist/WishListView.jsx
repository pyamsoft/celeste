import React from "react";
import { WishListTitle } from "./WishListTitle";
import { WishListTabs } from "./WishListTabs";
import { WishListCategories } from "./WishListCategories";

const defaultClassNames = "wish-list block overflow-hidden";

export class WishListView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      category: WishListCategories.DEFAULT,
    };
  }

  handleTabClicked = (category) => {
    this.setState({ category });
  };

  render() {
    const { className, style, ...rest } = this.props;
    const { acnh, name, items } = rest;
    const { category } = this.state;
    return (
      <div
        className={`${defaultClassNames} ${className ? className : ""}`}
        style={style}
      >
        <WishListTitle name={name} className="mb-3" />
        <WishListTabs
          category={category}
          onTabClicked={this.handleTabClicked}
        />
      </div>
    );
  }
}
