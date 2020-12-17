import React from "react";
import { fitToWindowWidth, remToPx, watchResize } from "../common/util/window";
import { stopListening } from "../common/util/listener";
import { WishListCategories } from "./WishListCategories";
import { WishListEntry } from "./entry/WishListEntry";
import { areEqual, FixedSizeGrid, FixedSizeList } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import memoize from "memoize-one";

const createSeriesData = memoize(
  (
    category,
    onItemAdded,
    onItemRemoved,
    onNoteChanged,
    isEditable,
    renderables
  ) => ({
    category,
    onItemAdded,
    onItemRemoved,
    onNoteChanged,
    isEditable,
    renderables,
  })
);

const createItemData = memoize(
  (
    itemCount,
    onItemAdded,
    onItemRemoved,
    onNoteChanged,
    isEditable,
    renderables
  ) => ({
    itemCount,
    onItemAdded,
    onItemRemoved,
    onNoteChanged,
    isEditable,
    renderables,
  })
);

const IDEAL_ITEM_SIZE = remToPx(12);

function calculatePossibleItemCount() {
  const maxPossibleWidth = fitToWindowWidth();
  return Math.floor(maxPossibleWidth / IDEAL_ITEM_SIZE);
}

export class WishListEntries extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      itemCount: calculatePossibleItemCount(),
    };

    this.resizeCallback = null;
  }

  componentDidMount() {
    this.resizeCallback = watchResize(() => {
      this.setState({ itemCount: calculatePossibleItemCount() });
    });
  }

  componentWillUnmount() {
    if (stopListening(this.resizeCallback)) {
      this.resizeCallback = null;
    }
  }

  getSearchPriority = (name) => {
    if (!name) {
      return 0;
    }
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
          return this.getSearchPriority(item.name) > 0;
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

  generateRenderables = (isRenderSeries) => {
    const { acnh, category } = this.props;
    const categoryItems = acnh[category] || {};

    if (isRenderSeries) {
      const result = {};
      const seriesList = Object.keys(categoryItems);
      for (const series of seriesList) {
        const renderable = categoryItems[series]
          .filter(this.filterVisibleItems)
          .sort(this.sortItems)
          .map(this.mapToWishing);
        if (renderable.length > 0) {
          result[series] = renderable;
        }
      }
      return result;
    } else {
      return Object.values(categoryItems)
        .filter(this.filterVisibleItems)
        .sort(this.sortItems)
        .map(this.mapToWishing);
    }
  };

  render() {
    const {
      className,
      style,
      category,
      onItemAdded,
      onItemRemoved,
      onNoteChanged,
      isEditable,
    } = this.props;
    const { itemCount } = this.state;
    const isRenderSeries = WishListCategories.hasSeries(category);
    const renderables = this.generateRenderables(isRenderSeries);

    const itemData = isRenderSeries
      ? createSeriesData(
          category,
          onItemAdded,
          onItemRemoved,
          onNoteChanged,
          isEditable,
          renderables
        )
      : createItemData(
          itemCount,
          onItemAdded,
          onItemRemoved,
          onNoteChanged,
          isEditable,
          renderables
        );

    return (
      <div
        className={`${
          className ? className : ""
        } block w-full overflow-hidden h-full popover-boundary`}
        style={style}
      >
        {isRenderSeries ? (
          <div className="block overflow-x-hidden overflow-y-auto h-full">
            <AutoSizer>
              {({ height, width }) => (
                <FixedSizeList
                  height={height}
                  width={width}
                  itemSize={IDEAL_ITEM_SIZE}
                  itemCount={Object.keys(renderables).length}
                  itemData={itemData}
                >
                  {RenderSeries}
                </FixedSizeList>
              )}
            </AutoSizer>
          </div>
        ) : (
          <div className="flex flex-row flex-wrap overflow-x-hidden overflow-y-auto h-full">
            <AutoSizer>
              {({ height, width }) => (
                <FixedSizeGrid
                  height={height}
                  width={width}
                  rowCount={Math.ceil(renderables.length / itemCount)}
                  rowHeight={IDEAL_ITEM_SIZE}
                  columnCount={itemCount}
                  columnWidth={IDEAL_ITEM_SIZE}
                  itemData={itemData}
                >
                  {RenderRow}
                </FixedSizeGrid>
              )}
            </AutoSizer>
          </div>
        )}
      </div>
    );
  }
}

const RenderSeries = React.memo((props) => {
  const {
    index,
    style,
    data: {
      category,
      onItemAdded,
      onItemRemoved,
      onNoteChanged,
      isEditable,
      renderables,
    },
  } = props;
  const seriesList = Object.keys(renderables);
  const series = seriesList[index];

  return (
    <div
      key={`${category}-${series}`}
      style={style}
      className="flex flex-row flex-nowrap overflow-x-auto"
    >
      {renderables[series].map((entry) => (
        <RenderEntry
          key={entry.item.id}
          category={category}
          onItemAdded={onItemAdded}
          onItemRemoved={onItemRemoved}
          onNoteChanged={onNoteChanged}
          isEditable={isEditable}
          series={series}
          entry={entry}
        />
      ))}
    </div>
  );
}, areEqual);

const RenderRow = React.memo((props) => {
  const {
    style,
    rowIndex,
    columnIndex,
    data: {
      onItemAdded,
      onItemRemoved,
      onNoteChanged,
      isEditable,
      itemCount,
      renderables,
    },
  } = props;
  const index = rowIndex * itemCount + columnIndex;
  const entry = renderables[index];
  return (
    <div key={entry ? entry.item.id : index} style={style}>
      {entry ? (
        <RenderEntry
          onItemAdded={onItemAdded}
          onItemRemoved={onItemRemoved}
          onNoteChanged={onNoteChanged}
          isEditable={isEditable}
          entry={entry}
        />
      ) : null}
    </div>
  );
}, areEqual);

const RenderEntry = React.memo((props) => {
  const {
    onItemAdded,
    onItemRemoved,
    onNoteChanged,
    isEditable,
    entry,
  } = props;
  const { item, ...rest } = entry;
  return (
    <WishListEntry
      {...rest}
      key={item.id}
      item={item}
      onAdd={onItemAdded}
      onRemove={onItemRemoved}
      onNoteChanged={onNoteChanged}
      isEditable={isEditable}
      size={IDEAL_ITEM_SIZE}
    />
  );
}, areEqual);
