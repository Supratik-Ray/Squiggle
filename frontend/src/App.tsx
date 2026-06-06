import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import DrawingRoom from "./pages/DrawingRoom";
import { Toaster } from "react-hot-toast";
import { SocketProvider } from "./contexts/socket/SocketProvider";
import Protected from "./guards/Protected";
import Guest from "./guards/Guest";

function App() {
  return (
    <SocketProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route
            path="/dashboard"
            element={
              <Protected>
                <Dashboard />
              </Protected>
            }
          />
          <Route
            path="/auth/login"
            element={
              <Guest>
                <Login />
              </Guest>
            }
          />
          <Route
            path="/auth/signup"
            element={
              <Guest>
                <Signup />
              </Guest>
            }
          />
          <Route
            path="/drawing-board/:roomId"
            element={
              <Protected>
                <DrawingRoom />
              </Protected>
            }
          />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </SocketProvider>
  );
}

export default App;
