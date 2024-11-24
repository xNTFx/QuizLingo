import { useNavigate } from "react-router-dom";

export default function NoDecksScreen() {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen flex-col items-center gap-2 bg-[#1F1F1F] pt-10 text-xl">
      <p>No decks available, please create a deck</p>
      <button
        onClick={() => navigate("/")}
        className="rounded-lg bg-blue-700 p-1 hover:opacity-80"
      >
        Go back to decks
      </button>
    </div>
  );
}
