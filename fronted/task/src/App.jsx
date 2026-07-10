import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./Pages/Home.jsx";
import Register from "./Pages/Register.jsx";
import Login from "./Pages/Login.jsx";

import ProjectList from "./Pages/ProjectList.jsx";
import AddProject from "./Pages/AddProject.jsx";
import Updateproject from "./Pages/Updateproject.jsx";

import CreateMember from "./Pages/Createmember.jsx";
import Membershowpage from "./Pages/Membershowpage.jsx";
import Updatemember from "./Pages/Updatemember.jsx";

import Tasklist from "./Pages/Tasklist.jsx";
import Projectdetail from "./Compoment/Projectdetail.jsx";

import AdminProtectedRoutes from "./loyout/Adminprotectedroutes.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/reg" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Admin Protected Routes */}

        <Route
          path="/Membershowpage"
          element={
            <AdminProtectedRoutes>
              <Membershowpage />
            </AdminProtectedRoutes>
          }
        />

   <Route
  path="/tasklist/:projectId"
  element={
    <AdminProtectedRoutes>
      <Tasklist />
    </AdminProtectedRoutes>
  }
/>

        <Route
          path="/projectlist"
          element={
            <AdminProtectedRoutes>
              <ProjectList />
            </AdminProtectedRoutes>
          }
        />

        <Route
          path="/addproject"
          element={
            <AdminProtectedRoutes>
              <AddProject />
            </AdminProtectedRoutes>
          }
        />

        <Route
          path="/createmember"
          element={
            <AdminProtectedRoutes>
              <CreateMember />
            </AdminProtectedRoutes>
          }
        />

        <Route
          path="/update/:id"
          element={
            <AdminProtectedRoutes>
              <Updateproject />
            </AdminProtectedRoutes>
          }
        />

        <Route
          path="/updatemember/:id"
          element={
            <AdminProtectedRoutes>
              <Updatemember />
            </AdminProtectedRoutes>
          }
        />

        <Route
          path="/project/:id"
          element={
            <AdminProtectedRoutes>
              <Projectdetail />
            </AdminProtectedRoutes>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;