import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
} from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/authContext";
import { DarkModeContext } from "./context/darkModeContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Import layouts and components
// User
import Navbar from "./user/components/navbar/Navbar";
import LeftBar from "./user/components/leftBar/LeftBar";
import RightBar from "./user/components/rightBar/RightBar";
import UserHome from "./user/home/Home";
import UserProfile from "./user/profile/Profile";
import UserMap from "./user/map/Map";

// Owner
import OwnerHome from "./owner/home/Home";
import OwnerProfile from "./owner/profile/Profile";
import OwnerShopEvent from "./owner/shopevent/ShopEvent";
import OwnerLeftBar from "./owner/components/leftBar/Leftbar";
import OwnerShopListings from "./owner/shoplistings/Shoplistings";
import OwnerShopDetails from "./owner/components/shopdetails/ShopDetails";
import OwnerNavBar from "./owner/components/navbar/Navbar";
import OwnerRightBar from "./owner/components/rightBar/Rightbar";
import OwnerMap from "./owner/map/Map";
import OwnerCreateShopListing from "./owner/components/createShopListing/CreateShoplisting";
import OwnerUpdateShopListing from "./owner/components/updateShopListing/UpdateShoplistingForm";

// Expert
import ExpertHome from "./expert/home/Home";
import ExpertProfile from "./expert/profile/Profile";
import ExpertLeftBar from "./expert/components/leftBar/Leftbar";
import ExpertEditPost from "./expert/components/editPost/ExpertEditPost";
import ExpertNavBar from "./expert/components/navbar/Navbar";

// Auth
import Login from "./auth/login/Login";
import Register from "./auth/register/Register";

function App() {
  // Query Client Setup for React Query
  const queryClient = new QueryClient();

  const { darkMode } = useContext(DarkModeContext);

  // Layouts based on roles
  const UserLayout = () => (
    <QueryClientProvider client={queryClient}>
      <div className={`theme-${darkMode ? "dark" : "light"}`}>
        <Navbar />
        <div style={{ display: "flex" }}>
          <LeftBar />
          <div style={{ flex: 6 }}>
            <Outlet />
          </div>
          <RightBar />
        </div>
      </div>
    </QueryClientProvider>
  );

  const OwnerLayout = () => (
    <QueryClientProvider client={queryClient}>
      <div className={`theme-${darkMode ? "dark" : "light"}`}>
        <OwnerNavBar />
        <div style={{ display: "flex" }}>
          <OwnerLeftBar />
          <div style={{ flex: 6 }}>
            <Outlet />
          </div>
        </div>
      </div>
    </QueryClientProvider>
  );

  const ExpertLayout = () => (
    <QueryClientProvider client={queryClient}>
      <div className={`theme-${darkMode ? "dark" : "light"}`}>
        <ExpertNavBar />
        <div style={{ display: "flex" }}>
          <ExpertLeftBar />
          <div style={{ flex: 6 }}>
            <Outlet />
          </div>
          <RightBar />
        </div>
      </div>
    </QueryClientProvider>
  );

  // Protected Route
  const ProtectedRoute = ({ children, type }) => {
    const { currentUser } = useContext(AuthContext);

    // Redirect if not authenticated or role doesn't match
    if (!currentUser) {
      return <Navigate to="/" />;
    }
    const role = currentUser.type;
    if (role !== type) {
      if (role === "regular") {
        return <Navigate to="/user" />;
      } else if (role === "owner") {
        return <Navigate to="/owner" />;
      } else if (role === "expert") {
        return <Navigate to="/expert" />;
      }
    }

    return children;
  };

// Router Configuration
const router = createBrowserRouter([
  {
    path: "/user",
    element: (
      <ProtectedRoute type='regular'>
        <UserLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "/user", element: <UserHome /> },
      { path: "/user/profile/:id", element: <UserProfile /> },
      { path: "/user/map", element: <UserMap /> },
    ],
  },
  {
    path: "/owner",
    element: (
      <ProtectedRoute type='owner'>
        <OwnerLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "/owner", element: <OwnerHome /> },
      { path: "/owner/profile/:id", element: <OwnerProfile /> },
      { path: "/owner/shoplisting", element: <OwnerShopListings /> },
      { path: "/owner/shoplisting/:id/*", element: <OwnerShopDetails />},
      { path: "/owner/shoplisting/create", element: <OwnerCreateShopListing />},
      { path: "/owner/shoplisting/update/:shopId", element: <OwnerUpdateShopListing /> },
      { path: "/owner/map", element: <OwnerMap /> },
      { path: "/owner/events", element: <OwnerShopEvent /> },
    ],
  },
  {
    path: "/expert",
    element: (
      <ProtectedRoute type='expert'>
        <ExpertLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "/expert", element: <ExpertHome /> },
      { path: "/expert/profile/:id", element: <ExpertProfile /> },
      { path: "/expert/editpost", element: <ExpertEditPost />},
    ],
  },
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);


  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
