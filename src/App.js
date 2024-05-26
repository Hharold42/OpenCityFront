import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Events from "./components/Events/Events";
import Community from "./components/Community/Community";
import MyInfo from "./components/MyInfo";
import Register from "./components/Register";
import Footer from "./components/Footer";
import Login from "./components/Login";
import CreateEvent from "./components/Events/CreateEvent";
import ChangeEvent from "./components/Events/ChangeEvent";
import CreateCommunity from "./components/Community/CreateCommunity";
import ChangeEmail from "./components/ChangeEmail";
import ChangePassword from "./components/ChangePassword";
import ChangeCommunity from "./components/Community/ChangeCommunity";
import UserEvents from "./components/Events/UserEvents";
import UserCommunities from "./components/Community/UserCommunities";
import AdmUsers from "./components/AdmUsers";

function App() {
  return (
    // <Router>
    <div className="flex flex-col min-h-screen bg-[#1A1C28] text-white">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="*" element={<Navigate to="/events" />} />

          <Route path="/events" element={<Events />}></Route>
          <Route path="/events/create" element={<CreateEvent />} />
          <Route path="/events/user" element={<UserEvents />} />
          <Route path="/events/change/:id" element={<ChangeEvent />} />

          <Route path="/community" element={<Community />} />
          <Route path="/community/create" element={<CreateCommunity />} />
          <Route path="/community/user" element={<UserCommunities />} />
          <Route path="/community/change/:id" element={<ChangeCommunity />} />

          <Route path="/changeemail" element={<ChangeEmail />} />
          <Route path="/changepass" element={<ChangePassword />} />
          <Route path="/myinfo" element={<MyInfo />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/adm/users" element={<AdmUsers />} />
        </Routes>
      </main>
      <Footer />
    </div>
    // </Router>
  );
}

export default App;
