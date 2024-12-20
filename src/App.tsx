import { Provider } from "react-redux";
import { HashRouter, Outlet, Route, Routes } from "react-router-dom";

import { store } from "./API/Redux/ReduxProvider";
import Navbar from "./features/Navbar/Navbar";
import AddVocabularyScreen from "./screens/AddVocabularyScreen";
import BrowseVocabularyScreen from "./screens/BrowseVocabularyScreen";
import FlashCardsScreen from "./screens/FlashCardsScreen";
import HomeScreen from "./screens/HomeScreen";
import ModeSelection from "./screens/ModeSelectionScreen";
import StatisticsScreen from "./screens/StatisticsScreen";
import TranslationScreen from "./screens/TranslationScreen";

function App() {
  return (
    <HashRouter>
      <Provider store={store}>
        <Routes>
          <Route path="/" element={<Navbar />}>
            <Route index element={<HomeScreen />} />
            <Route path=":id" element={<Outlet />}>
              <Route path="add-vocabulary" element={<AddVocabularyScreen />} />
              <Route
                path="browse-vocabulary"
                element={<BrowseVocabularyScreen />}
              />
              <Route path="statistics" element={<StatisticsScreen />} />
              <Route path="mode-selection/:type" element={<Outlet />}>
                <Route index element={<ModeSelection />} />
                <Route path="flashcard" element={<FlashCardsScreen />} />
                <Route
                  path="translation"
                  element={<TranslationScreen />}
                ></Route>
              </Route>
            </Route>
          </Route>
        </Routes>
      </Provider>
    </HashRouter>
  );
}

export default App;
