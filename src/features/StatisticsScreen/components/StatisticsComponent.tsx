import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useGetReviewsHistoryQuery } from "../../../API/Redux/reduxQueryFetch";
import LoadingDivComponent from "../../../components/LoadingComponents/LoadingDivComponent";
import { VocabularyType } from "../../../types/APITypes";

interface GraphFilterType {
  filterId: number;
  filterName: string;
}

interface StatisticsGraphFiltersSelectionProps {
  graphFilter: GraphFilterType;
  setGraphFilter: React.Dispatch<React.SetStateAction<GraphFilterType>>;
}

function StatisticsGraphFiltersSelection({
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
    <div>
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
    </div>
  );
}

export default function StatisticsComponent({
  vocabularyName,
  selectedVocabulary,
}: {
  vocabularyName: {
    frontWord: string | undefined;
    backWord: string | undefined;
  };
  selectedVocabulary?: VocabularyType | undefined | null;
}) {
  const [graphFilter, setGraphFilter] = useState<GraphFilterType>({
    filterId: 1,
    filterName: "Ease Factor",
  });

  const { data, isLoading } = useGetReviewsHistoryQuery({
    vocabularyId: selectedVocabulary?.vocabulary_id,
  });

  if (!data && isLoading) {
    return <LoadingDivComponent />;
  }

  if (!data || data?.length === 0) {
    return (
      <div>
        <h1>No review history for this vocabulary</h1>
      </div>
    );
  }

  const currentReviewHistory = data[data.length - 1];

  const reviewHistoryData = data.map((review, index) => ({
    reviewNumber: index + 1,
    easeFactor: review.ease_factor,
    quality: review.quality,
    reviewDate: review.review_date,
  }));

  return (
    <div className="flex flex-col items-center justify-center overflow-auto pt-12">
      <div className="w-11/12 overflow-auto rounded-md bg-[#2C2C2C] p-4">
        <div className="flex flex-row gap-2">
          <h2 className="text-xl">Selected Vocabulary: </h2>
          <div className="flex flex-row items-center justify-center gap-1 text-xl">
            <p>{vocabularyName.frontWord}</p>
            <p>|</p>
            <p>{vocabularyName.backWord}</p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div>
            <h2 className="flex items-center justify-center text-xl">
              Current values:
            </h2>
          </div>
          <div className="flex flex-row items-center justify-center gap-4">
            <p className="flex flex-col items-center justify-center">
              <span>Ease Factor: </span>
              <span>{currentReviewHistory.ease_factor}</span>
            </p>
            <p className="flex flex-col items-center justify-center">
              <span>Quality: </span>
              {currentReviewHistory.quality}
            </p>
            <p className="flex flex-col items-center justify-center">
              <span>Date: </span>
              {currentReviewHistory.review_date}
            </p>
          </div>
        </div>
      </div>

      {data.length > 1 ? (
        <div className="mt-8 flex w-11/12 flex-col gap-4 rounded-md bg-[#2C2C2C] p-4">
          <h2 className="text-xl">Review History Graph</h2>
          <div>
            <StatisticsGraphFiltersSelection
              graphFilter={graphFilter}
              setGraphFilter={setGraphFilter}
            />
          </div>
          <div className="select-none">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={reviewHistoryData}>
                <CartesianGrid stroke="white" strokeDasharray="5 5" />
                <XAxis
                  dataKey="reviewNumber"
                  label={{
                    value: "Review Number",
                    position: "insideBottomRight",
                    offset: -5,
                    fill: "white",
                  }}
                  stroke="white"
                />
                <YAxis
                  label={{
                    value: graphFilter.filterName,
                    angle: -90,
                    position: "insideLeft",
                    fill: "white",
                  }}
                  stroke="white"
                  domain={[graphFilter.filterId === 1 ? 1.3 : 0, "dataMax"]}
                />
                <Tooltip
                  content={({ payload }) => {
                    if (payload && payload.length) {
                      const { easeFactor, quality, reviewDate } =
                        payload[0].payload;
                      return (
                        <div className="rounded-md p-1 backdrop-blur-md">
                          <p>Ease Factor: {easeFactor}</p>
                          <p>Quality: {quality}</p>
                          <p>Date: {reviewDate}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line
                  type="monotone"
                  dataKey={
                    graphFilter.filterId === 1 ? "easeFactor" : "quality"
                  }
                  stroke="#82ca9d"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="mt-4">
          To see Review History Graph you need to have at least 2 Review
          Histories
        </div>
      )}
    </div>
  );
}
