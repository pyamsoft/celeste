import React from "react";
import { Text } from "../../common/component/Text";

export function EntryTop(props) {
  const { item } = props;
  return (
    <div className="block absolute z-10 top-0 left-0 right-0">
      <EntryName item={item} />
    </div>
  );
}

function EntryName(props) {
  const { item } = props;
  return (
    <div className="flex flex-row flex-nowrap w-full">
      <div className="mx-auto mt-3">
        <Text className="px-2">{item.name}</Text>
      </div>
    </div>
  );
}
