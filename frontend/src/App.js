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
// import Register from './pages/Register/Register';
// import Login from './pages/Login/Login';

function App() {
  return (
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


{/* <Route
          path="/"
          element={
            <GuestRoute
              Component={Home}
              isAuth={isAuth}
              user={user}
            />
          }
        ></Route>
        <Route
          path="/authenticate"
          element={
            <GuestRoute
              Component={Authenticate}
              isAuth={isAuth}
              user={user}
            />
          }
        ></Route>

        <Route
          path="/activate"
          element={
            <SemiProtectedRoute
              Component={<Activate />}
              isAuth={isAuth}
              user={user}
            />
          }
        ></Route>

        {/* <Route
          path="/rooms"
          element={
            <ProtectedRoute
              Component={<Rooms />}
              isAuth={isAuth}
              user={user}
            />
          }
        ></Route> */}
        // <Route
        //   path="/rooms"
        //   element={
        //     <Rooms/>
        //   }
        // ></Route> */}
