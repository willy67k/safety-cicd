import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthGaurd from "./components/auth/AuthGuard";
import Account from "./pages/Account";
import Home from "./pages/Home";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/account" element={<AuthGaurd />}>
            <Route index element={<Account />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
