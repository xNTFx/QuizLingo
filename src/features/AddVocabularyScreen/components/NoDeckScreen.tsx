import { useNavigate } from "react-router-dom";

export default function NoDeckScreen({
  navigate,
}: {
  navigate: ReturnType<typeof useNavigate>;
}) {
  return (
    <div className="flex h-[calc(100vh-3rem)] items-center justify-center bg-[#1F1F1F] font-bold text-white">
      <div className="flex h-2/5 flex-col items-center justify-center gap-3">
        <h1 className="text-3xl">
          You cannot add a vocabulary when there is no deck
        </h1>
        <button
          onClick={() => navigate("/")}
          className="rounded-xl bg-[#382bf0] p-2 font-extrabold hover:bg-[#5e43f3]"
        >
          Go back to decks
        </button>
      </div>
    </div>
  );
}
