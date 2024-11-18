import { useNavigate } from "react-router-dom";

export default function NoVocabularyScreen() {
  const navigate = useNavigate();

  return (
    <article className="flex h-[calc(100vh-3rem)] items-center justify-center bg-[#1F1F1F] font-bold text-white">
      <div className="flex h-2/5 flex-col items-center justify-center gap-3">
        <h2 className="text-3xl">No vocabulary to learn</h2>
        <button
          onClick={() => navigate("/")}
          className="rounded-xl bg-[#382bf0] p-2 font-extrabold hover:bg-[#5e43f3]"
        >
          Go back to decks
        </button>
      </div>
    </article>
  );
}
