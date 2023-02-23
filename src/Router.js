import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/index";
import Tag from "./pages/tag";
import Address from "./pages/address";
import Article from "./pages/article";
import Profile from "./pages/profile";
import Write from "./pages/write";

export default createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/:p",
    element: <Profile />,
  },
  {
    path: "/a/:naddr",
    element: <Address />,
  },
  {
    path: "/:p/:d",
    element: <Article />,
  },
  {
    path: "/t/:t",
    element: <Tag />,
  },
  {
    path: "write",
    element: <Write />,
  },
]);
