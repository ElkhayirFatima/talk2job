import { Routes, Route } from "react-router-dom";
// Layout général de l’application
import Layout from "./components/Layout.jsx";
//Public pages
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Unauthorized from "./pages/Unauthorized.jsx";
import OAuthCallback from "./pages/OAuthCallback.jsx";
//Protected pages
import { Dashboard } from "./pages/Dashboard";
import Upload from "./pages/Upload";
import Admin from "./pages/Admin"; // Dashboard sub-views
import DashboardOverview from "./components/dashboard/DashboardOverview";
import CVUpload from "./components/dashboard/CVUpload";
import JobMatchingFeed from "./components/dashboard/JobMatchingFeed";
import InterviewSession from "./components/dashboard/InterviewSession";
import InterviewFeedbackReport from "./components/dashboard/InterviewFeedbackReport";
// Middleware d'autorisation(Auth Logic)
import RequireAuth from "./components/RequireAuth";
import PersistLogin from "./components/PersistLogin";
//Roles
import { ROLES } from "./components/Roles";

function App() {
  return (
    <Routes>
      {/*
       🌍 Layout (Header + Footer)
        Route principale :
        - path="/" : racine du site
        - element={<Layout />} : Layout est le "gabarit" général (header, footer, etc.)
          Toutes les routes définies À L’INTÉRIEUR utiliseront ce layout.
      */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        {/* ----- Routes publiques (pas besoin d’être connecté) ----- */}
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="unauthorized" element={<Unauthorized />} />
        <Route path="oauth-callback" element={<OAuthCallback />} />

        {/* ----- Routes protégées (nécessitent un rôle, via RequireAuth) ----- */}

        {/*
          Cette section protège la page Home.
          Seuls les utilisateurs ayant le rôle ROLES.User peuvent y accéder.
          RequireAuth vérifie le rôle et décide si on affiche la page ou non.
        */}
        {/* 🔁 PERSIST LOGIN */}
        <Route element={<PersistLogin />}>
          {/* 👤 FREE + PRO USERS */}
          <Route
            element={<RequireAuth allowedRoles={[ROLES.User, ROLES.Admin]} />}
          >
            <Route path="dashboard" element={<Dashboard />}>
              <Route index element={<DashboardOverview />} />
              <Route path="upload" element={<CVUpload />} />
              <Route path="jobs" element={<JobMatchingFeed />} />
              <Route path="interview" element={<InterviewSession />} />
              <Route path="feedback" element={<InterviewFeedbackReport />} />
            </Route>
          </Route>
          {/* 📤 UPLOAD → PRO ONLY */}
          <Route
            element={<RequireAuth allowedRoles={[ROLES.User, ROLES.Admin]} />}
          >
            <Route path="upload" element={<Upload />} />
          </Route>
          {/* 🛡️ ADMIN */}
          <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
            <Route path="admin" element={<Admin />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
