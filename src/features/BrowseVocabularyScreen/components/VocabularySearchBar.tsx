import { TextField, ThemeProvider, createTheme } from "@mui/material";

type Props = {
  inputSearchValue: string;
  handleSearchInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

export default function VocabularySearchBar({
  inputSearchValue,
  handleSearchInputChange,
}: Props) {
  return (
    <div className="w-[90%]">
      <ThemeProvider theme={darkTheme}>
        <TextField
          label="Search vocabulary"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            handleSearchInputChange(event);
          }}
          value={inputSearchValue}
          className="w-[100%] rounded-lg bg-black"
          inputProps={{
            style: { color: "white" },
          }}
        />
      </ThemeProvider>
    </div>
  );
}
