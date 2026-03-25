import {BrowserRouter, Link, Route, Routes} from "react-router-dom";
import Home from "@/Home.tsx";
import LoginPage from "@/page/login-page.tsx";
import DashboardPage from "./page/dashboard-page";

export function App() {
  return (

      <BrowserRouter>
 <nav>
        <Link to="/">Home</Link> |{" "}
        <Link to="/login">login</Link> |{" "}
        <Link to="/dashboard">Dashboard</Link>
      </nav>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
      </BrowserRouter>
  )
}

export default App
