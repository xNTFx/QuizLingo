import { debounce } from "lodash";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import { useGetDecksWithLimitQuery } from "../API/Redux/reduxQueryFetch";

import DeckRows from "../features/HomeScreen/components/DeckRows";
import useSwalPopupBoxes from "../hooks/useSwalPopupBoxes";

export default function HomeScreen() {
  const itemHeight = 35;

  const updatedLimit = Math.ceil(window.innerHeight / itemHeight) + 1;

  const [limit, setLimit] = useState(updatedLimit);

  const { createDeckFunction } = useSwalPopupBoxes();

  const { data, isLoading } = useGetDecksWithLimitQuery({
    limit: limit,
    offset: 0,
  });

  useEffect(() => {
    const handleResize = debounce(() => {
      setLimit(Math.ceil(window.innerHeight / itemHeight) + 1);
    }, 100);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!data) {
    return;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <main className="flex h-[calc(100vh-3rem)] select-none flex-col items-center bg-[#1F1F1F]">
      <div
        id="scrollableDiv"
        className="mt-10 box-border flex max-h-[80%] flex-col gap-2 overflow-auto rounded-lg bg-[#2C2C2C] p-4 text-white shadow-md"
      >
        <InfiniteScroll
          dataLength={data.length}
          next={() => {
            setLimit((prev) => (prev += 30));
          }}
          hasMore={data.length === limit}
          loader={<p>...Loading</p>}
          scrollableTarget="scrollableDiv"
        >
          <DeckRows data={data} />
        </InfiniteScroll>
      </div>
      <div className="p-4 text-white">
        <button
          onClick={createDeckFunction}
          className="rounded-xl bg-[#382bf0] p-2 w-40 font-extrabold hover:bg-[#5e43f3]"
        >
          Create Deck
        </button>
      </div>
    </main>
  );
}
