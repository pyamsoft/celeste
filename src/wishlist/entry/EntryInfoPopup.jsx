import { EmptyButton } from "../../common/component/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import React from "react";

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
      <div className="text-2xl">{item.name}</div>
      <div className="flex flex-row flex-nowrap">
        <div>Price:</div>
        <div className="ml-auto text-green-500">{item.price}</div>
      </div>
    </div>
  );
}
