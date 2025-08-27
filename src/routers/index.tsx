import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Home from "./todo/Home";
import Detail from "./todo/Detail";
import OnBoarding from "./OnBoarding";
import Camera from "./todo/Camera";
import CreateTask from "./todo/CreateTask";
import Success from "./todo/Success";
import MyPage from "./user/MyPage";
import MyPageEdit from "./user/MyPageEdit";
import PasswordChange from "./user/PasswordChange";
import AddFriend from "./friendship/AddFriend";
import FriendList from "./friendship/FriendList";
import FriendRequest from "./friendship/FriendRequest";
import { Login, Signup, EmailVerification, VerificationComplete } from "./auth";
import FindPassword from "./auth/FindPassword";
import EmailResetPassword from "./auth/EmailResetPassword";
import ResetPassword from "./auth/ResetPassword";

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

        {/* User Routes */}
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/mypage/edit" element={<MyPageEdit />} />
        <Route path="/mypage/password-change" element={<PasswordChange />} />
        
        {/* Friendship Routes */}
        <Route path="/friendship/add" element={<AddFriend />} />
        <Route path="/friendship/list" element={<FriendList />} />
        <Route path="/friendship/request" element={<FriendRequest />} />
        
        {/* Auth Routes */}
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/signup" element={<Signup />} />
        <Route path="/auth/email-verification" element={<EmailVerification />} />
        <Route path="/auth/verification-complete" element={<VerificationComplete />} />
        <Route path="/auth/find-password" element={<FindPassword />} />
        <Route path="/auth/email-reset-password" element={<EmailResetPassword />} />
        <Route path="/auth/reset-password" element={<ResetPassword />} />
      </>
    )
  );

  return <RouterProvider router={router} />;
};

export default Router;
