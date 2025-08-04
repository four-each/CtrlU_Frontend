import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Home from "./Home";
import Detail from "./Detail";
import OnBoarding from "./OnBoarding";
import Camera from "./Camera";
import CreateTask from "./CreateTask";
import Success from "./Success";

const Router = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<Home />} />
        <Route path="/onboarding" element={<OnBoarding />} />
        <Route path="/detail" element={<Detail />} />
        <Route path="/camera/:mode?" element={<Camera />} />
        <Route path="/create-task" element={<CreateTask />} />
        <Route path="/success" element={<Success />} />
      </>
    )
  );

  return <RouterProvider router={router} />;
};

export default Router;
