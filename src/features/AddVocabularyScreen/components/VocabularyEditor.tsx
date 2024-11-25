import { Editor } from "@tiptap/core";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";

import { EditorInputValuesType } from "../../../types/TypeScriptTypes";
import EditorButtonList from "./TipTap/EditorButtonList";
import EditorTipTap from "./TipTap/EditorTipTap";

export default function VocabularyEditor({
  hiddenInputs,
  setHiddenInputs,
  inputNames,
  editorInputValues,
  setActiveEditor,
  handleEditorUpdate,
  editorsList,
  activeEditor,
}: {
  hiddenInputs: number[];
  setHiddenInputs: React.Dispatch<React.SetStateAction<number[]>>;
  inputNames: string[];
  editorInputValues: EditorInputValuesType;
  setActiveEditor: React.Dispatch<React.SetStateAction<Editor | null>>;
  handleEditorUpdate: (editor: Editor) => void;
  editorsList: Editor[];
  activeEditor: Editor | null;
}) {
  const hiddenInputsFunction = (inputId: number) => {
    if (inputId === 0 || inputId === 1) return;
    setHiddenInputs((prev) =>
      prev.some((input) => input === inputId)
        ? prev.filter((input) => input !== inputId)
        : [...prev, inputId],
    );
  };

  return (
    <div className="relative flex h-[75vh] flex-col items-center overflow-auto rounded-lg bg-[#2C2C2C] text-white max-md:w-10/12">
      <div className="sticky top-0 z-50 w-full">
        <EditorButtonList
          editorsList={editorsList}
          activeEditor={activeEditor ? activeEditor : editorsList[0]}
        />
      </div>
      <div className="w-full">
        {inputNames.map((item, index) => (
          <div key={index} className="px-6 py-2">
            <button
              onClick={() => hiddenInputsFunction(index)}
              className="mb-1 flex flex-row items-center gap-1"
              style={{
                cursor: index === 0 || index === 1 ? "default" : "pointer",
              }}
            >
              {index === 0 || index === 1 ? null : hiddenInputs.includes(
                  index,
                ) ? (
                <FaAngleUp />
              ) : (
                <FaAngleDown />
              )}
              <p>{item}</p>
            </button>
            <div
              style={{
                display: hiddenInputs.includes(index) ? "none" : "initial",
              }}
              className="flex flex-row"
            >
              <div className="w-full">
                <EditorTipTap
                  index={index}
                  setActiveEditor={setActiveEditor}
                  onEditorUpdate={handleEditorUpdate}
                  initialValue={editorInputValues[index].toString()}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
