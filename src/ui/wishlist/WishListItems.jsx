import React from "react";
import { Text } from "../common/Text";
import { Img } from "../common/Img";

export function WishListItems(props) {
  const { className, style, acnh, category, onItemClicked, items } = props;
  return (
    <div
      className={`${
        className ? className : ""
      } block w-full overflow-hidden h-full`}
      style={style}
    >
      <div className="flex flex-row flex-wrap overflow-x-hidden overflow-y-auto h-full">
        {(acnh[category] || []).map((item) => (
          <WishListItem
            key={`${category}-${item.id}`}
            item={item}
            onClick={onItemClicked}
            items={items}
          />
        ))}
      </div>
    </div>
  );
}

class WishListItem extends React.Component {
  handleClick = () => {
    const { item, onClick } = this.props;
    onClick(item);
  };

  render() {
    const { item } = this.props;
    return (
      <div className="h-32 w-32 p-1 cursor-point" onClick={this.handleClick}>
        <div className="relative w-full h-full hover:text-opacity-100 text-opacity-0 text-black">
          <Img
            src={item.image}
            className="absolute inset-0 z-0"
            alt={item.name}
          />
          <Text className="flex flex-row absolute z-10 bottom-0 left-0 right-0">
            <div className="mx-auto">{item.name}</div>
          </Text>
        </div>
      </div>
    );
  }
}
