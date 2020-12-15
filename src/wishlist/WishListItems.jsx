import React from "react";
import { Text } from "../common/component/Text";
import { Img } from "../common/component/Img";
import { ACNHHouseware } from "../acnh/ACNHHouseware";
import { ACNHWallmount } from "../acnh/ACNHWallmount";

function isMultiSeriesCategory(category) {
  return category === ACNHHouseware.TYPE || category === ACNHWallmount.TYPE;
}

export function WishListItems(props) {
  const { className, style, acnh, category, onItemClicked, items } = props;
  const series = acnh[category] || [];
  return (
    <div
      className={`${
        className ? className : ""
      } block w-full overflow-hidden h-full`}
      style={style}
    >
      {isMultiSeriesCategory(category) ? (
        <div className="block w-full overflow-x-hidden overflow-y-auto h-full">
          {series.map((variants, index) => (
            <div
              key={index}
              className="flex flex-row flex-nowrap overflow-x-auto"
            >
              {variants.map((item, i) => (
                <WishListItem
                  key={`${category}-${index}-${i}-${item.id}`}
                  item={item}
                  onClick={onItemClicked}
                  items={items}
                />
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-row flex-wrap overflow-x-hidden overflow-y-auto h-full">
          {series.map((item) => (
            <WishListItem
              key={`${category}-${item.id}`}
              item={item}
              onClick={onItemClicked}
              items={items}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const ITEM_SIZE = "8rem"; // w-32 h-32
const ITEM_STYLE = {
  width: ITEM_SIZE,
  minWidth: ITEM_SIZE,
  maxWidth: ITEM_SIZE,

  height: ITEM_SIZE,
  minHeight: ITEM_SIZE,
  maxHeight: ITEM_SIZE,
};

class WishListItem extends React.Component {
  handleClick = () => {
    const { item, onClick } = this.props;
    onClick(item);
  };

  render() {
    const { item } = this.props;
    return (
      <div
        className="p-1 cursor-point"
        onClick={this.handleClick}
        style={ITEM_STYLE}
      >
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
