import { IoMdArrowRoundBack } from "react-icons/io";
import { Outlet, useNavigate, useParams } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const { id } = useParams();
  const deckId = id ? id : 0;

  const navButtons = [
    { label: "Decks", path: "/" },
    { label: "Add", path: `${deckId}/add-vocabulary` },
    { label: "Browse", path: `${deckId}/browse-vocabulary` },
    { label: "Statistics", path: `${deckId}/statistics/review-statistics-graph` },
  ];

  return (
    <>
      <header>
        <nav className="flex h-12 select-none flex-row bg-[#1F1F1F] text-white shadow-md">
          <button
            onClick={() => navigate(-1)}
            className="fixed m-1 flex cursor-pointer flex-col items-center justify-center rounded-lg p-1 hover:bg-gray-700"
          >
            <p className="text-xs font-extrabold">Back</p>
            <IoMdArrowRoundBack className="font-extrabold" />
          </button>
          <div className="flex w-full items-center justify-center">
            <div className="flex h-full items-center gap-1 rounded-b-xl bg-slate-800 p-3">
              {navButtons.map((button, index) => (
                <button
                  key={index}
                  className="w-20 rounded-lg p-2 hover:bg-slate-600"
                  onClick={() => navigate(button.path)}
                >
                  {button.label}
                </button>
              ))}
            </div>
          </div>
        </nav>
      </header>
      <Outlet />
    </>
  );
}
