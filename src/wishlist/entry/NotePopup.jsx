import { EmptyButton } from "../../common/component/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { TextArea } from "../../common/component/TextArea";

export function NotePopup(props) {
  const { closePopOver, isEditable, note, onNoteChanged } = props;
  return (
    <div className="block w-full h-full overflow-hidden p-2">
      <div className="flex flex-col w-full h-full overflow-hidden">
        <CloseRow closePopOver={closePopOver} />
        <div className="block overflow-hidden w-full flex-auto">
          <Contents
            note={note}
            isEditable={isEditable}
            onNoteChanged={onNoteChanged}
          />
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
  const { note, onNoteChanged, isEditable } = props;
  return (
    <div className="block h-full w-full overflow-hidden">
      <div className="text-2xl">Notes</div>
      <TextArea
        value={note}
        onChange={onNoteChanged}
        readOnly={!isEditable}
        className="overflow-hidden w-full"
      />
    </div>
  );
}
