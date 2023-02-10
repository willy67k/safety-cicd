import { HashRouter } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import AuthGaurd from "./components/auth/AuthGuard";
import Account from "./pages/Account";
import Home from "./pages/Home";

function App() {
  return (
    <div className="App">
      <p>routerIn</p>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/account" element={<AuthGaurd />}>
            <Route index element={<Account />} />
          </Route>
        </Routes>
        <p>routerOut</p>
      </HashRouter>
    </div>
  );
}

export default App;
