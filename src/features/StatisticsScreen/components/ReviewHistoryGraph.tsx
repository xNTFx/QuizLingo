import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface ReviewHistoryGraphProps {
  reviewHistoryData: Array<{
    reviewNumber: number;
    easeFactor: number;
    quality: number;
    reviewDate: string;
  }>;
  graphFilter: {
    filterId: number;
    filterName: string;
  };
}

export function ReviewHistoryGraph({
  reviewHistoryData,
  graphFilter,
}: ReviewHistoryGraphProps) {
  return (
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
            domain={[
              graphFilter.filterId === 1 ? 1.3 : 0,
              graphFilter.filterId === 1
                ? Math.max(...reviewHistoryData.map((d) => d.easeFactor))
                : 5,
            ]}
          />
          <Tooltip
            content={({ payload }) => {
              if (payload && payload.length) {
                const { easeFactor, quality, reviewDate } = payload[0].payload;
                return (
                  <div className="rounded-md p-1 backdrop-blur-md">
                    <p>Ease Factor: {easeFactor.toFixed(1)}</p>
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
            dataKey={graphFilter.filterId === 1 ? "easeFactor" : "quality"}
            stroke="#82ca9d"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
