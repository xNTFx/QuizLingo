import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import CalendarHeatmap, { TooltipDataAttrs } from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { Tooltip } from "react-tooltip";

import { useGetReviewAndNewCountPerDateQuery } from "../../../API/Redux/reduxQueryFetch";
import "../styles/HeatMapStatisticsStyle.css";

type DataEntry = { date: string; count: number };
type ViewType = "new" | "review" | "combined";

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

const fillMissingDates = (
  data: DataEntry[],
  startDate: Date,
  endDate: Date,
): DataEntry[] => {
  const filledData: DataEntry[] = [];
  const dateSet = new Set(data.map((entry) => entry.date));

  let currentDate = new Date(startDate);
  const extendedEndDate = new Date(endDate);
  extendedEndDate.setDate(extendedEndDate.getDate() + 1);

  while (currentDate <= extendedEndDate) {
    const dateString = currentDate.toISOString().split("T")[0];
    if (dateSet.has(dateString)) {
      const existingEntry = data.find((entry) => entry.date === dateString);
      if (existingEntry) {
        filledData.push(existingEntry);
      }
    } else {
      filledData.push({ date: dateString, count: 0 });
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return filledData;
};

function getUniqueYearsFromDates(dates: string[] | undefined) {
  if (!dates?.length) return [];
  const yearsArr = dates.map((d) => d.split("-")[0]);
  return [...new Set(yearsArr)];
}

function processData(data: any[], viewType: ViewType): DataEntry[] {
  return data.map((entry) => ({
    date: entry.review_date,
    count:
      viewType === "new"
        ? entry.new_count
        : viewType === "review"
          ? entry.review_count
          : entry.new_count + entry.review_count,
  }));
}

export default function HeatMapStatistics() {
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [viewType, setViewType] = useState<ViewType>("combined");

  const { data, isLoading } = useGetReviewAndNewCountPerDateQuery({});

  const dates = data?.map((d) => d.review_date);
  const years = getUniqueYearsFromDates(dates);

  useEffect(() => {
    if (years.length && !selectedYear) {
      const maxYear = Math.max(...years.map(Number));
      setSelectedYear(maxYear.toString());
    }
  }, [years, selectedYear]);

  if ((data?.length === 0 && isLoading) || !selectedYear) {
    return null;
  }

  const startDate = new Date(Number(selectedYear) - 1, 11, 31);
  const endDate = new Date(`${selectedYear}-12-31`);

  const processedData = processData(data || [], viewType);
  const filledValues = fillMissingDates(processedData, startDate, endDate);

  return (
    <div className="flex flex-col gap-4 p-10">
      <h1 className="text-center text-xl font-bold">Heat Map</h1>
      <div className="mb-4 flex gap-4">
        <ThemeProvider theme={darkTheme}>
          {years.length > 1 && (
            <FormControl className="w-1/2">
              <InputLabel id="year-select-label">Year</InputLabel>
              <Select
                labelId="year-select-label"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                {years
                  .sort()
                  .reverse()
                  .map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          )}
          <FormControl className="w-1/2">
            <InputLabel id="view-select-label">View Type</InputLabel>
            <Select
              labelId="view-select-label"
              value={viewType}
              onChange={(e) => setViewType(e.target.value as ViewType)}
            >
              <MenuItem value="combined">All</MenuItem>
              <MenuItem value="new">New</MenuItem>
              <MenuItem value="review">Reviewed</MenuItem>
            </Select>
          </FormControl>
        </ThemeProvider>
      </div>
      <CalendarHeatmap
        startDate={startDate}
        endDate={endDate}
        values={filledValues}
        classForValue={(value) => {
          if (!value || value.count === 0) {
            return "color-empty";
          }
          return `color-github-${Math.min(value.count, 4)}`;
        }}
        tooltipDataAttrs={(value): TooltipDataAttrs => {
          if (!value?.date) {
            return {
              "data-tooltip-id": "heatmap-tooltip",
              "data-tooltip-html":
                "<div><strong>No data available</strong></div>",
            } as TooltipDataAttrs;
          }

          const matchingData = data?.find((d) => d.review_date === value.date);
          return {
            "data-tooltip-id": "heatmap-tooltip",
            "data-tooltip-html": `
              <div style="text-align: left;">
                <div><strong>Date:</strong> ${value.date}</div>
                <div><strong>New:</strong> ${
                  matchingData?.new_count || 0
                }</div>
                <div><strong>Reviewed:</strong> ${
                  matchingData?.review_count || 0
                }</div>
                <div><strong>Total:</strong> ${
                  Number(matchingData?.new_count || 0) +
                  Number(matchingData?.review_count || 0)
                }</div>
              </div>
            `,
          } as TooltipDataAttrs;
        }}
        showWeekdayLabels={true}
      />
      <Tooltip id="heatmap-tooltip" />
    </div>
  );
}
