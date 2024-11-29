import "./App.scss";
import Home from "./Routes/Home/Home";
import Results, { loader as resultsLoader } from "./Routes/Results/Results";
import Details, { loader as detailsLoader } from "./Routes/Details/Details";
import Profile, { loader as profileLoader } from "./Routes/Profile/Profile";
import Login from "./Routes/Login/Login";
import ProfileUpdate from "./Routes/ProfileUpdate/ProfileUpdate";
import NewPost from "./Routes/NewPost/NewPost";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./layout/Root/Root";
import Guard from "./layout/Guard/Guard";
import { Toaster } from "react-hot-toast";
import Loader from "./components/Loader/Loader";
import AuthContextProvider from "./context/Auth.context";
import { LoaderContextProvider } from "./context/Loader.context";
import SocketContextProvider from "./context/Socket.context";
import SessionExpiredModal from "./components/SessionExpiredModal/SessionExpiredModal";
import { SessionExpiredModalContextProvider } from "./context/Modal.context";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
import RouteErrorPage from "./Routes/ErrorPage/RouteErrorPage/RouteErrorPage";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      errorElement: <RouteErrorPage />,
      children: [
        { path: "/", element: <Home /> },
        {
          path: "/posts",
          element: <Results />,
          loader: resultsLoader,
          errorElement: <RouteErrorPage />,
        },
        {
          path: "/posts/:id",
          element: <Details />,
          loader: detailsLoader,
          errorElement: <RouteErrorPage />,
        },
        { path: "/authen", element: <Login /> },
      ],
    },
    {
      path: "/",
      element: <Guard />,
      children: [
        {
          path: "/profile",
          element: <Profile />,
          loader: profileLoader,
          errorElement: <RouteErrorPage />,
        },
        { path: "/profile/update", element: <ProfileUpdate /> },
        { path: "posts/add", element: <NewPost /> },
      ],
    },
  ]);
  return (
    <ErrorBoundary>
      <AuthContextProvider>
        <SocketContextProvider>
          <SessionExpiredModalContextProvider>
            <LoaderContextProvider>
              <Loader />
              <SessionExpiredModal />
              <Toaster position="top-center" reverseOrder={false} />
              <RouterProvider router={router} />
            </LoaderContextProvider>
          </SessionExpiredModalContextProvider>
        </SocketContextProvider>
      </AuthContextProvider>
    </ErrorBoundary>
  );
}

export default App;
