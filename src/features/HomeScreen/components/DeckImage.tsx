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
        className={`flex h-[64px] w-[64px] items-center justify-center rounded text-5xl ${tailwindColor}`}
      >
        D
      </div>
    );
  }

  return (
    <div className="h-[64px] w-[64px] rounded">
      {defaultDeckImage(randomBg)}
    </div>
  );
}
