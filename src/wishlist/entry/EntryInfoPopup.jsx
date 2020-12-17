import { EmptyButton } from "../../common/component/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { Title } from "../../common/component/Title";
import { Text } from "../../common/component/Text";

export function EntryInfoPopup(props) {
  const { item, closePopOver } = props;
  return (
    <div className="block w-full h-full overflow-hidden p-3">
      <div className="flex flex-col w-full h-full overflow-hidden">
        <CloseRow closePopOver={closePopOver} />
        <div className="block overflow-hidden w-full flex-auto">
          <Contents item={item} />
        </div>
      </div>
    </div>
  );
}

function CloseRow(props) {
  const { closePopOver } = props;
  return (
    <div className="flex flex-row flex-nowrap px-2">
      <div className="flex-auto" />
      <EmptyButton onClick={closePopOver}>
        <FontAwesomeIcon icon={faTimes} />
      </EmptyButton>
    </div>
  );
}

function Contents(props) {
  const { item } = props;
  return (
    <div className="block h-full w-full overflow-hidden">
      <Title>{item.name}</Title>
      <div className="flex flex-row flex-nowrap">
        <Text>Price:</Text>
        <Text className="ml-auto text-green-500">{item.price}</Text>
      </div>
      <Text className="flex flex-row flex-nowrap mt-5">More coming soon!</Text>
    </div>
  );
}
