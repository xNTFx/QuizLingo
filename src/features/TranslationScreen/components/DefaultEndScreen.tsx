import { useNavigate } from "react-router-dom";

export default function DefaultEndScreen({
  answerType,
}: {
  answerType: {
    correct: number;
    wrong: number;
  };
}) {
  const navigate = useNavigate();
  return (
    <article className="flex h-5/6 items-start justify-center">
      <div className="flex max-w-[70vw] flex-col items-center justify-start gap-5 overflow-auto rounded-md bg-[#2C2C2C] p-10 text-white">
        <h2 className="text-3xl text-green-500">You completed the session!</h2>
        <div className="flex flex-row gap-5">
          <p>
            <span className="text-green-600">Correct: </span>
            {answerType.correct}
          </p>
          <p>
            <span className="text-red-600">Wrong: </span>
            {answerType.wrong}
          </p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="rounded-md bg-[#382bf0] p-2 hover:bg-[#5e43f3]"
        >
          Go back to menu
        </button>
      </div>
    </article>
  );
}
