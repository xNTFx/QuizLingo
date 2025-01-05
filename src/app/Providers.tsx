import { store } from "../API/Redux/ReduxProvider";
import { Provider } from "react-redux";
import { HashRouter } from "react-router-dom";

const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <HashRouter>
      <Provider store={store}>{children}</Provider>
    </HashRouter>
  );
};

export default AppProviders;
