import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import ProtectedRoute from "@components/ProtectedRoute";
import Home from "./todo/Home";
import Detail from "./todo/Detail";
import OnBoarding from "./OnBoarding";
import Camera from "./todo/Camera";
import CreateTask from "./todo/CreateTask";
import Success from "./todo/Success";
import MyPage from "./user/MyPage";
import MyPageEdit from "./user/MyPageEdit";
import PasswordChange from "./user/PasswordChange";
import Archive from "./user/Archive";
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
        {/* Public Routes */}
        <Route path="/onboarding" element={<OnBoarding />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/signup" element={<Signup />} />
        <Route path="/auth/email-verification" element={<EmailVerification />} />
        <Route path="/auth/verification-complete" element={<VerificationComplete />} />
        <Route path="/auth/find-password" element={<FindPassword />} />
        <Route path="/auth/email-reset-password" element={<EmailResetPassword />} />
        <Route path="/auth/reset-password" element={<ResetPassword />} />
        
        {/* Protected Routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        <Route path="/detail" element={
          <ProtectedRoute>
            <Detail />
          </ProtectedRoute>
        } />
        <Route path="/camera/:mode?" element={
          <ProtectedRoute>
            <Camera />
          </ProtectedRoute>
        } />
        <Route path="/create-task" element={
          <ProtectedRoute>
            <CreateTask />
          </ProtectedRoute>
        } />
        <Route path="/success" element={
          <ProtectedRoute>
            <Success />
          </ProtectedRoute>
        } />

        {/* User Routes */}
        <Route path="/mypage" element={
          <ProtectedRoute>
            <MyPage />
          </ProtectedRoute>
        } />
        <Route path="/mypage/edit" element={
          <ProtectedRoute>
            <MyPageEdit />
          </ProtectedRoute>
        } />
        <Route path="/mypage/password-change" element={
          <ProtectedRoute>
            <PasswordChange />
          </ProtectedRoute>
        } />
        <Route path="/mypage/archive" element={
          <ProtectedRoute>
            <Archive />
          </ProtectedRoute>
        } />
        
        {/* Friendship Routes */}
        <Route path="/friendship/add" element={
          <ProtectedRoute>
            <AddFriend />
          </ProtectedRoute>
        } />
        <Route path="/friendship/list" element={
          <ProtectedRoute>
            <FriendList />
          </ProtectedRoute>
        } />
        <Route path="/friendship/request" element={
          <ProtectedRoute>
            <FriendRequest />
          </ProtectedRoute>
        } />
      </>
    )
  );

  return <RouterProvider router={router} />;
};

export default Router;
