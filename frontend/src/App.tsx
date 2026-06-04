import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import DrawingRoom from "./pages/DrawingRoom";
import { Toaster } from "react-hot-toast";
import { SocketProvider } from "./contexts/socket/SocketProvider";

function App() {
  return (
    <SocketProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/signup" element={<Signup />} />
          <Route path="/drawing-board/:roomId" element={<DrawingRoom />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </SocketProvider>
  );
}

export default App;
