const colorClasses: Record<string, string> = {
  yellow: "bg-yellow-500",
  blue: "bg-blue-500",
  red: "bg-red-500",
  green: "bg-green-500",
  purple: "bg-purple-500",
  pink: "bg-pink-500",
};

export default function DeckImage({
  randomBg,
}: {
  randomBg: string | undefined;
}) {
  function defaultDeckImage(randomBg: string | undefined) {
    const tailwindColor =
      randomBg && colorClasses[randomBg]
        ? colorClasses[randomBg]
        : "bg-blue-500";
    return (
      <div
        className={`flex items-center justify-center text-5xl rounded w-[64px] h-[64px] ${tailwindColor}`}
      >
        D
      </div>
    );
  }

  return (
    <div className="w-[64px] h-[64px] rounded">
      {defaultDeckImage(randomBg)}
    </div>
  );
}
