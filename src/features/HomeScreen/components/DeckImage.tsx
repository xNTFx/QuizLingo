const colorClasses: Record<string, string> = {
  yellow: "bg-yellow-500",
  blue: "bg-blue-500",
  red: "bg-red-500",
  green: "bg-green-500",
  purple: "bg-purple-500",
  pink: "bg-pink-500",
};

export default function DeckImage({ deckImg }: { deckImg: string | undefined }) {
  function defaultDeckImage(deckImg: string | undefined) {
    const tailwindColor =
      deckImg && colorClasses[deckImg] ? colorClasses[deckImg] : "bg-blue-500";

    return (
      <div
        className={`flex h-[64px] w-[64px] items-center justify-center rounded text-5xl ${tailwindColor}`}
      >
        D
      </div>
    );
  }

  function isValidImageSrc(src: string) {
    const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"];
    const extension = src.split(".").pop()?.toLowerCase();
    return extension ? imageExtensions.includes(extension) : false;
  }

  if (deckImg && isValidImageSrc(deckImg)) {
    return (
      <img
        src={deckImg}
        alt="deck image"
        className="h-[64px] w-[64px] rounded object-cover"
      />
    );
  }

  return (
    <div className="h-[64px] w-[64px] rounded">{defaultDeckImage(deckImg)}</div>
  );
}
