import { debounce } from "lodash";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import { useGetDecksWithLimitQuery } from "../API/Redux/reduxQueryFetch";
import ChangeImageBox from "../features/HomeScreen/components/ChangeImageBox";
import DeckRows from "../features/HomeScreen/components/DeckRows";
import useSwalPopupBoxes from "../hooks/useSwalPopupBoxes";

export default function HomeScreen() {
  const itemHeight = 120;

  const updatedLimit = Math.ceil((window.innerHeight * 0.8) / itemHeight) + 1;

  const [limit, setLimit] = useState(updatedLimit);
  const [isChangeImageBoxOpen, setIsChangeImageBoxOpen] = useState(false);
  const [selectedDeckId, useSelectedDeckId] = useState<number | null>(null);

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
      {isChangeImageBoxOpen ? (
        <ChangeImageBox setIsChangeImageBoxOpen={setIsChangeImageBoxOpen} selectedDeckId={selectedDeckId}/>
      ) : null}
      {data.length > 0 ? (
        <>
          <div
            id="scrollableDiv"
            className="mt-10 box-border flex max-h-[80vh] flex-col gap-2 overflow-auto rounded-lg p-4 text-white shadow-md"
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
              <div className="flex flex-col gap-4">
                <DeckRows
                  data={data}
                  setIsChangeImageBoxOpen={setIsChangeImageBoxOpen}
                  useSelectedDeckId={useSelectedDeckId}
                />
              </div>
            </InfiniteScroll>
          </div>
        </>
      ) : (
        <div className="mt-10">
          <h2 className="text-xl">Please, create a deck</h2>
        </div>
      )}
      <div className="p-4 text-white">
        <button
          onClick={createDeckFunction}
          className="w-40 rounded-xl bg-[#382bf0] p-2 font-extrabold hover:bg-[#5e43f3]"
        >
          Create Deck
        </button>
      </div>
    </main>
  );
}
