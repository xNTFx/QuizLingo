import { AiOutlineTranslation } from "react-icons/ai";
import { TbCards } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

export default function ModeSelection() {
  const navigate = useNavigate();

  const modes = [
    {
      label: "Flashcards",
      icon: <TbCards className="size-8" />,
      color: "bg-blue-800 hover:bg-blue-600",
      mode: "flashcard",
    },
    {
      label: "Translation",
      icon: <AiOutlineTranslation className="size-8" />,
      color: "bg-green-600 hover:bg-green-400",
      mode: "translation",
    },
  ];

  return (
    <main className="flex h-[calc(100vh-3rem)] select-none flex-col items-center justify-start pt-10 bg-[#1F1F1F]">
      <div className="w-[60%] rounded-lg bg-[#2C2C2C] p-5 text-white shadow-lg">
        <h1 className="text-2xl font-extrabold text-center mb-5">Modes</h1>
        <div className="grid grid-cols-2 gap-3">
          {modes.map(({ label, icon, color, mode }) => (
            <button
              key={label}
              onClick={() => navigate(mode)}
              className={`flex h-24 flex-col items-center justify-center overflow-hidden rounded-lg p-2 font-extrabold ${color}`}
            >
              <p>{label}</p>
              {icon}
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
