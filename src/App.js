import logo from "./logo.svg";
import "./App.css";
import { QueryClient, QueryClientProvider } from "react-query";
import TableWithReactQuery from "./TableWithReactQuery";
import { ReactQueryDevtools } from "react-query/devtools";
import 'bootstrap/dist/css/bootstrap.min.css';
import TableWithLocalStorage from "./TableWithLocalStorage";
import TableWithReactQueryFirebase from "./TableWithReactQueryFirebase";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TableWithReactQueryFirebase />
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App;
