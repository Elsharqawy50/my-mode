import logo from "./logo.svg";
import "./App.css";
import { QueryClient, QueryClientProvider } from "react-query";
import TableWithReactQuery from "./TableWithReactQuery";
import { ReactQueryDevtools } from "react-query/devtools";
import "bootstrap/dist/css/bootstrap.min.css";
import TableWithLocalStorage from "./TableWithLocalStorage";
import TableWithReactQueryFirebase from "./TableWithReactQueryFirebase";
import TableWithSwrFirebase from "./TableWithSwrFirebase";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TableWithSwrFirebase />
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App;
