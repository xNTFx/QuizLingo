import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useGetDeckByIdQuery } from "../API/Redux/reduxQueryFetch";

export default function ModeSelectionMenu() {
  const {
    state: { mode },
  } = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, error, isLoading } = useGetDeckByIdQuery(Number(id));

  if (isLoading) return <div>Loading...</div>;
  if (error) console.error(error);
  if (!data) return null;

  const { deck_name, new: newWords, review } = data[0];

  const renderButton = (
    count: string | undefined | number,
    text: string[],
    color: string,
    path: string
  ) => {
    const bgColorClass = color === "blue" ? "bg-blue-700" : "bg-green-700";
    const hoverColorClass =
      color === "blue" ? "hover:bg-blue-500" : "hover:bg-green-500";

    return (
      <div className="flex flex-col items-center justify-center gap-1">
        <button
          onClick={
            count !== "0" ? () => navigate(`${path}/${mode}`) : undefined
          }
          className={`${
            count === "0" ? "cursor-default brightness-[20%]" : hoverColorClass
          } flex w-28 flex-col items-center justify-center rounded-md ${bgColorClass} p-2`}
        >
          {text.map((line: string) => (
            <span key={line}>{line}</span>
          ))}
        </button>
        <p className="font-extrabold">
          {count !== "0" ? count : `No new ${text[1].toLowerCase()}`}
        </p>
      </div>
    );
  };

  return (
    <main className="flex h-[calc(100vh-3rem)] items-center justify-center bg-[#1F1F1F] text-white">
      <div className="flex h-5/6 items-start justify-center">
        <div className="flex w-[30rem] max-w-[70vw] flex-col items-center justify-start gap-2 overflow-auto rounded-md bg-[#2C2C2C] p-10">
          <h1 className="max-w-[100%] overflow-auto font-bold">{deck_name}</h1>
          <div className="flex flex-row items-center justify-center gap-5">
            {renderButton(
              newWords,
              ["Learn New", "Words"],
              "blue",
              "new-words"
            )}
            {renderButton(review, ["Learn", "Reviews"], "green", "new-reviews")}
          </div>
        </div>
      </div>
    </main>
  );
}
