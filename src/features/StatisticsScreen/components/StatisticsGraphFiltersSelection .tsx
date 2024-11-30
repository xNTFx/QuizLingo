import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import React from "react";

interface GraphFilterType {
  filterId: number;
  filterName: string;
}

interface StatisticsGraphFiltersSelectionProps {
  graphFilter: GraphFilterType;
  setGraphFilter: React.Dispatch<React.SetStateAction<GraphFilterType>>;
}

export function StatisticsGraphFiltersSelection({
  graphFilter,
  setGraphFilter,
}: StatisticsGraphFiltersSelectionProps) {
  const darkTheme = createTheme({
    components: {
      MuiList: {
        styleOverrides: {
          root: {
            backgroundColor: "black",
          },
        },
      },
    },
    palette: {
      mode: "dark",
    },
  });

  const filters = [
    { filterId: 1, filterName: "Ease Factor" },
    { filterId: 2, filterName: "Quality" },
  ];

  return (
    <ThemeProvider theme={darkTheme}>
      <FormControl fullWidth>
        <InputLabel>Graph Filter</InputLabel>
        <Select
          value={graphFilter.filterName}
          label="Filter"
          onChange={(event) => {
            const selectedFilter = filters.find(
              (filter) => filter.filterName === event.target.value,
            );
            if (selectedFilter) {
              setGraphFilter(selectedFilter);
            }
          }}
        >
          {filters?.map((filter) => (
            <MenuItem key={filter.filterId} value={filter.filterName}>
              {filter.filterName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </ThemeProvider>
  );
}
