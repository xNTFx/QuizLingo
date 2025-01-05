import AppProviders from "./Providers";
import AppRoutes from "./Routes";

const App = () => {
  return (
    <AppProviders>
      <AppRoutes />
    </AppProviders>
  );
};

export default App;
