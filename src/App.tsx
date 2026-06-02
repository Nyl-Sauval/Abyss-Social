import {Route, Routes} from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Account/Profile";
import Layout from './components/layout/Layout.tsx';
import Login from "./pages/Login";
import Register from "./pages/Register";
import {PostForm} from "./pages/form/PostForm.tsx";
import NotFound from "./pages/NotFound.tsx";
import {PostDetail} from "./pages/post/PostDetail.tsx";
import EditProfile from "./pages/Account/EditProfile.tsx";
import UserSearchResults from "./pages/Account/UserSearchResults.tsx";
import PostSearchResults from "./pages/post/PostSearchResults.tsx";
import UserProfile from "./pages/user/UserProfile.tsx";

function App() {
  return (
    <>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/me" element={<Profile />} />
          <Route path="/users/search" element={<UserSearchResults />} />
          <Route path="/posts/search" element={<PostSearchResults />} />
          <Route path="/profile/edit" element={<EditProfile />} />
          <Route path="/users/:id" element={<UserProfile />} />
          <Route path="/post/create" element={<PostForm />} />
          <Route path="/post/:id" element={<PostDetail/>}/>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </>
  );
}

export default App;
