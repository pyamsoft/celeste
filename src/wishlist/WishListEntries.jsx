import React from "react";
import { fitToWindowWidth, remToPx, watchResize } from "../common/util/window";
import { stopListening } from "../common/util/listener";
import { WishListCategories } from "./WishListCategories";
import { WishListEntry } from "./entry/WishListEntry";

const IDEAL_ITEM_SIZE = remToPx(12);

function calculatePossibleItemSize() {
  const maxPossibleWidth = fitToWindowWidth();

  let count = 1;
  while (IDEAL_ITEM_SIZE * count <= maxPossibleWidth) {
    ++count;
  }

  return Math.floor(maxPossibleWidth / count);
}

export class WishListEntries extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      itemSize: calculatePossibleItemSize(),
    };

    this.resizeCallback = null;
  }

  componentDidMount() {
    this.resizeCallback = watchResize(() => {
      this.setState({ itemSize: calculatePossibleItemSize() });
    });
  }

  componentWillUnmount() {
    if (stopListening(this.resizeCallback)) {
      this.resizeCallback = null;
    }
  }

  getSearchPriority = (name) => {
    const { search } = this.props;
    const cleanSearch = search.trim().toLowerCase();
    const cleanName = name.trim().toLowerCase();

    if (cleanName === cleanSearch) {
      return 1;
    }

    if (cleanName.startsWith(cleanSearch)) {
      return 2;
    }

    if (cleanName.endsWith(cleanSearch)) {
      return 3;
    }

    if (cleanName.indexOf(cleanSearch) >= 0) {
      return 4;
    }

    return 0;
  };

  filterVisibleItems = (item) => {
    const { search, items, isEditable, category } = this.props;
    const noSearch = !search || !search.trim();
    if (isEditable) {
      if (noSearch) {
        return true;
      } else {
        return this.getSearchPriority(item.name) > 0;
      }
    }

    return items.find((i) => {
      const filtered =
        i.id === item.id && category === i.type && i.series === item.series;
      if (!filtered) {
        return false;
      } else {
        if (noSearch) {
          return true;
        } else {
          return this.getSearchPriority(i.name) > 0;
        }
      }
    });
  };

  sortItems = (i1, i2) => {
    const { search } = this.props;
    const noSearch = !search || !search.trim();
    if (noSearch) {
      // Do not change the sort order
      return 0;
    }

    const p1 = this.getSearchPriority(i1.name);
    const p2 = this.getSearchPriority(i2.name);
    if (p1 <= 0 && p2 <= 0) {
      return 0;
    }

    if (p1 > 0 && p2 <= 0) {
      return -1;
    }

    if (p2 > 0 && p1 <= 0) {
      return 1;
    }

    if (p1 < p2) {
      return -1;
    } else if (p1 > p2) {
      return 1;
    } else {
      return 0;
    }
  };

  mapToWishing = (item) => {
    const { isEditable, items, category } = this.props;
    const isWishing = items.find(
      (i) => i.id === item.id && category === i.type && i.series === item.series
    );

    return {
      item,
      count: isWishing?.count || 0,
      isWishing: isEditable ? isWishing?.count > 0 : false,
      note: isWishing?.note || "",
      giftedBy: isWishing?.giftedBy || {},
    };
  };

  render() {
    const {
      className,
      style,
      acnh,
      category,
      onItemAdded,
      onItemRemoved,
      onNoteChanged,
      isEditable,
    } = this.props;
    const { itemSize } = this.state;
    const categoryItems = acnh[category] || {};
    return (
      <div
        className={`${
          className ? className : ""
        } block w-full overflow-hidden h-full popover-boundary`}
        style={style}
      >
        {WishListCategories.hasSeries(category) ? (
          <div className="block w-full overflow-x-hidden overflow-y-auto h-full">
            {Object.keys(categoryItems).map((series) => (
              <div
                key={series}
                className="flex flex-row flex-nowrap overflow-x-auto"
              >
                {categoryItems[series]
                  .filter(this.filterVisibleItems)
                  .sort(this.sortItems)
                  .map(this.mapToWishing)
                  .map(({ item, ...rest }) => (
                    <WishListEntry
                      {...rest}
                      key={`${category}-${series}-${item.id}`}
                      item={item}
                      onAdd={onItemAdded}
                      onRemove={onItemRemoved}
                      onNoteChanged={onNoteChanged}
                      size={itemSize}
                      isEditable={isEditable}
                    />
                  ))}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-row flex-wrap overflow-x-hidden overflow-y-auto h-full">
            {Object.values(categoryItems)
              .filter(this.filterVisibleItems)
              .sort(this.sortItems)
              .map(this.mapToWishing)
              .map(({ item, ...rest }) => (
                <WishListEntry
                  {...rest}
                  key={`${category}-${item.id}`}
                  item={item}
                  onAdd={onItemAdded}
                  onRemove={onItemRemoved}
                  onNoteChanged={onNoteChanged}
                  size={itemSize}
                  isEditable={isEditable}
                />
              ))}
          </div>
        )}
      </div>
    );
  }
}
