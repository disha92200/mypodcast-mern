import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home/Home";
import Navigation from "./components/Navigation/Navigation";
import Authenticate from "./pages/Authenticate/Authenticate";
import Activate from "./pages/Activate/Activate";
import Rooms from "./pages/Rooms/Rooms";
import GuestRoute from "./components/GuestRoute/GuestRoute";
import SemiProtectedRoute from "./components/SemiProtectedRoute/SemiProtectedRoute"
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import useLoadingWithRefresh from "./hooks/useLoadingWithRefresh";
import Loader from "./components/Loader/Loader";

function App() {
  const {loading}=useLoadingWithRefresh();
  return loading?(
    <Loader message='Loading, please wait ...'/>
  ):
   (
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route element={<GuestRoute />}>
          <Route element={<Home/>} path="/" exact/>
          <Route element={<Authenticate/>} path="/authenticate"/>
        </Route>
        <Route element={<SemiProtectedRoute />}>
          <Route element={<Activate/>} path="/activate"/>
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route element={<Rooms/>} path="/rooms"/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;