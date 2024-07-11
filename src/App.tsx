import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import "./App.css";
import { Login } from "./pages/Login/Login";
import Chat from "./pages/chat/chat";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path={"/"} element={<Navigate to={"/login"} replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
