import Autocomplete from "@mui/material/Autocomplete";
import { AutocompleteRenderInputParams } from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useEffect, useMemo, useRef, useState } from "react";
import { SketchPicker } from "react-color";
import { FaBold, FaItalic } from "react-icons/fa";
import {
  FaAlignCenter,
  FaAlignJustify,
  FaAlignLeft,
  FaAlignRight,
  FaEraser,
  FaHighlighter,
  FaPaperclip,
  FaStrikethrough,
  FaSubscript,
  FaSuperscript,
  FaUnderline,
} from "react-icons/fa6";
import { GoHorizontalRule } from "react-icons/go";
import { RxText } from "react-icons/rx";

import useIsOpen from "../../../../hooks/useIsMenuOpen";
import { EditorButtonListType } from "../../../../types/TypeScriptTypes";
import { handleFileInsert } from "../../../../utils/handleFileLogic";
import EditorButton from "./EditorButton";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const defaultFontSize = "16";

interface EditorStyle {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  superscript: boolean;
  subscript: boolean;
  strike: boolean;
  textColor: string;
  backgroundColor: string;
  fontType: string;
  fontSize: string;
}

const defaultEditorStyle: EditorStyle = {
  bold: false,
  italic: false,
  underline: false,
  superscript: false,
  subscript: false,
  strike: false,
  textColor: "#ffffff",
  backgroundColor: "#00000000",
  fontType: "",
  fontSize: defaultFontSize,
};

export default function EditorButtonList({
  editorsList,
  activeEditor,
}: EditorButtonListType) {
  const { isOpen, setIsOpen, openRef } = useIsOpen(false);
  const {
    isOpen: isTxColorPickerOpen,
    setIsOpen: setIsTxColorPickerOpen,
    openRef: txColorMenuRef,
  } = useIsOpen(false);
  const {
    isOpen: isBgColorPickerOpen,
    setIsOpen: setIsBgColorPickerOpen,
    openRef: bgColorMenuRef,
  } = useIsOpen(false);

  // Track styles for each editor individually
  const [editorStyles, setEditorStyles] = useState<EditorStyle[]>(() => {
    // Initialize with styles for each editor
    return Array(editorsList?.length || 0).fill(null).map(() => ({
      ...defaultEditorStyle
    }));
  });

  const [tempFontSize, setTempFontSize] = useState(defaultFontSize);

  // Update editor styles when editorsList changes
  useEffect(() => {    
    setEditorStyles(prev => {
      const newStyles = [...prev];
      // Ensure we have enough styles for all editors
      while (newStyles.length < editorsList.length) {
        newStyles.push({ ...defaultEditorStyle });
      }
      // Remove extra styles if editors were removed
      while (newStyles.length > editorsList.length) {
        newStyles.pop();
      }
      return newStyles;
    });
  }, [editorsList]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeEditorIndex = activeEditor ? editorsList.findIndex(editor => editor === activeEditor) : -1;
  const currentStyle = activeEditorIndex >= 0 && editorStyles?.[activeEditorIndex] 
    ? editorStyles[activeEditorIndex] 
    : defaultEditorStyle;

  const numbersList = useMemo(() => {
    const numbers = [];
    for (let i = 1; i < 100; i++) {
      numbers.push(i.toString());
    }
    return numbers;
  }, []);

  const handleInputChange = (
    _event: React.SyntheticEvent<Element, Event>,
    value: string,
    reason: string,
  ) => {
    if (reason === "input") {
      if (/^(?!0)\d*$|^$/.test(value)) {
        setTempFontSize(value);
      }
    }
  };

  const handleOptionSelect = (
    _event: React.SyntheticEvent<Element, Event>,
    value: string | null,
  ) => {
    if (value !== null && activeEditor) {
      const modifiedFontSize = (Number(value) * (1 / 16)).toString();
      activeEditor.commands.setFontSize(modifiedFontSize + "rem");
      
      setEditorStyles(prev => {
        const newStyles = [...prev];
        newStyles[activeEditorIndex] = {
          ...newStyles[activeEditorIndex],
          fontSize: value,
        };
        return newStyles;
      });
      
      setTempFontSize(value);
    }
  };

  function handleOnBlur() {
    if (tempFontSize === "") {
      setTempFontSize(defaultFontSize);
    } else if (activeEditor) {
      setEditorStyles(prev => {
        const newStyles = [...prev];
        newStyles[activeEditorIndex] = {
          ...newStyles[activeEditorIndex],
          fontSize: tempFontSize,
        };
        return newStyles;
      });
    }
  }

  function updateEditorStyle(styleKey: keyof EditorStyle, value: any) {
    if (!activeEditor) return;
    
    setEditorStyles(prev => {
      const newStyles = [...prev];
      newStyles[activeEditorIndex] = {
        ...newStyles[activeEditorIndex],
        [styleKey]: value,
      };
      return newStyles;
    });
  }

  useEffect(() => {
    if (activeEditor) {
      setTempFontSize(currentStyle.fontSize || defaultFontSize);
    }
  }, [activeEditorIndex]);

  if (!editorsList || !activeEditor) return null;

  return (
    <div className="flex flex-row flex-wrap items-center justify-center gap-1 border-b bg-[#2C2C2C] p-1 pt-6">
      <ThemeProvider theme={darkTheme}>
        <Autocomplete
          inputValue={tempFontSize}
          onInputChange={handleInputChange}
          onChange={handleOptionSelect}
          onBlur={handleOnBlur}
          disablePortal
          title="Font size"
          noOptionsText={"none"}
          clearIcon={null}
          id="combo-box-demo"
          filterOptions={
            currentStyle.fontSize !== "" &&
            tempFontSize !== currentStyle.fontSize
              ? undefined
              : (options: string[]) => options
          }
          options={numbersList}
          renderInput={(params: AutocompleteRenderInputParams) => (
            <TextField
              {...params}
              label="px"
              inputProps={{
                ...params.inputProps,
                maxLength: 2,
              }}
            />
          )}
          sx={{
            "& .MuiInputBase-root": {
              p: 0,
              width: 60,
              color: "white",
              backgroundColor: "black",
            },
          }}
        />
      </ThemeProvider>

      <div className="relative flex cursor-pointer rounded" ref={txColorMenuRef}>
        <EditorButton
          onClick={() => setIsTxColorPickerOpen((prev) => !prev)}
          title="Text color"
          style={{ color: currentStyle.textColor }}
        >
          <RxText />
        </EditorButton>

        {isTxColorPickerOpen ? (
          <div className="absolute top-[100%] z-10">
            <div className="rounded bg-white p-2 text-black shadow-lg">
              <SketchPicker
                color={currentStyle.textColor}
                onChangeComplete={(color) => {
                  activeEditor.commands.setColor(color.hex);
                  updateEditorStyle("textColor", color.hex);
                }}
              />
              <button
                onClick={() => {
                  activeEditor.commands.setColor("#ffffff");
                  updateEditorStyle("textColor", "#ffffff");
                }}
                className="mt-2 w-full border bg-gray-300 p-1 text-black hover:bg-gray-400"
              >
                Default Color
              </button>
              <button
                onClick={() => setIsTxColorPickerOpen(false)}
                className="mt-2 w-full bg-gray-300 p-1 text-black hover:bg-gray-400"
              >
                Ok
              </button>
            </div>
          </div>
        ) : null}
      </div>

      <div className="relative flex cursor-pointer rounded" ref={bgColorMenuRef}>
        <EditorButton
          onClick={() => setIsBgColorPickerOpen((prev) => !prev)}
          title="Background color"
          className={`hover:text-blue-400 ${
            currentStyle.backgroundColor === "#00000000" ? "bg-black" : ""
          }`}
          style={{
            backgroundColor:
              currentStyle.backgroundColor !== "#00000000"
                ? currentStyle.backgroundColor
                : undefined,
          }}
        >
          <FaHighlighter />
        </EditorButton>

        {isBgColorPickerOpen ? (
          <div className="absolute top-[100%] z-10">
            <div className="rounded bg-white p-2 text-black shadow-lg">
              <SketchPicker
                color={currentStyle.backgroundColor}
                onChangeComplete={(color) => {
                  activeEditor.commands.setHighlight({ color: color.hex });
                  updateEditorStyle("backgroundColor", color.hex);
                }}
              />
              <button
                onClick={() => {
                  activeEditor.commands.setHighlight({ color: "transparent" });
                  updateEditorStyle("backgroundColor", "transparent");
                }}
                className="mt-2 w-full bg-gray-300 p-1 text-black hover:bg-gray-400"
              >
                Default Color
              </button>
              <button
                onClick={() => setIsBgColorPickerOpen(false)}
                className="mt-2 w-full bg-gray-300 p-1 text-black hover:bg-gray-400"
              >
                Ok
              </button>
            </div>
          </div>
        ) : null}
      </div>

      <div className="relative" ref={openRef}>
        <EditorButton
          title="Alignment"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <FaAlignJustify />
        </EditorButton>
        {isOpen ? (
          <div className="absolute right-[-110%] z-10 flex flex-row rounded-lg bg-black">
            <EditorButton
              title="Left alignment"
              onClick={() => activeEditor.commands.setTextAlign("left")}
              className="border border-solid"
            >
              <FaAlignLeft />
            </EditorButton>
            <EditorButton
              title="Center alignment"
              onClick={() => activeEditor.commands.setTextAlign("center")}
              className="border border-solid"
            >
              <FaAlignCenter />
            </EditorButton>
            <EditorButton
              title="Right alignment"
              onClick={() => activeEditor.commands.setTextAlign("right")}
              className="border border-solid"
            >
              <FaAlignRight />
            </EditorButton>
          </div>
        ) : null}
      </div>

      <EditorButton
        isActive={currentStyle.bold}
        onClick={() => {
          activeEditor.commands.toggleBold();
          updateEditorStyle("bold", !currentStyle.bold);
        }}
        title="Bold text"
      >
        <FaBold />
      </EditorButton>

      <EditorButton
        isActive={currentStyle.underline}
        onClick={() => {
          activeEditor.commands.toggleUnderline();
          updateEditorStyle("underline", !currentStyle.underline);
        }}
        title="Underline text"
      >
        <FaUnderline />
      </EditorButton>

      <EditorButton
        isActive={currentStyle.superscript}
        onClick={() => {
          activeEditor.commands.toggleSuperscript();
          updateEditorStyle("superscript", !currentStyle.superscript);
        }}
        title="Superscript text"
      >
        <FaSuperscript />
      </EditorButton>

      <EditorButton
        isActive={currentStyle.subscript}
        onClick={() => {
          activeEditor.commands.toggleSubscript();
          updateEditorStyle("subscript", !currentStyle.subscript);
        }}
        title="Subscript text"
      >
        <FaSubscript />
      </EditorButton>

      <EditorButton
        isActive={currentStyle.italic}
        onClick={() => {
          activeEditor.commands.toggleItalic();
          updateEditorStyle("italic", !currentStyle.italic);
        }}
        title="Italic text"
      >
        <FaItalic />
      </EditorButton>

      <EditorButton
        isActive={currentStyle.strike}
        onClick={() => {
          activeEditor.commands.toggleStrike();
          updateEditorStyle("strike", !currentStyle.strike);
        }}
        title="Strike text"
      >
        <FaStrikethrough />
      </EditorButton>

      <EditorButton
        onClick={() => activeEditor.commands.setHorizontalRule()}
        title="Horizontal rule"
      >
        <GoHorizontalRule />
      </EditorButton>

      <EditorButton
        onClick={() => {
          activeEditor.commands.unsetAllMarks();
          setEditorStyles(prev => {
            const newStyles = [...prev];
            newStyles[activeEditorIndex] = { ...defaultEditorStyle };
            return newStyles;
          });
        }}
        title="Remove all styles from selected text"
      >
        <FaEraser />
      </EditorButton>

      <input
        type="file"
        id="file-upload"
        ref={fileInputRef}
        onChange={(e) => {
          const file = e.target.files ? e.target.files[0] : null;
          e.target.value = "";
          handleFileInsert(file, activeEditor);
        }}
        accept="image/*"
        className="hidden"
      />
      <EditorButton
        onClick={() => fileInputRef.current?.click()}
        title="Upload image/audio"
      >
        <FaPaperclip />
      </EditorButton>
    </div>
  );
}