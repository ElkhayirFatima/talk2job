// Importation des hooks et composants nécessaires depuis react-router-dom
// useLocation : permet de récupérer l'URL actuelle
// Navigate : permet de rediriger l'utilisateur vers une autre route
// Outlet : affiche les pages enfants si l'utilisateur a accès
import { useLocation, Navigate, Outlet } from "react-router-dom";

// Importation du hook personnalisé pour accéder au contexte d'authentification
import useAuth from "../hooks/useAuth";

// Composant RequireAuth : middleware pour protéger les routes selon les rôles
// allowedRoles : tableau des rôles autorisés à accéder à la route

import { jwtDecode } from "jwt-decode";

const RequireAuth = ({ allowedRoles }) => {
  // On récupère l'objet auth depuis le contexte
  // auth contient : auth.user et auth.roles
  const { auth } = useAuth();

  // useLocation permet de garder en mémoire la page actuelle
  // utile pour rediriger l'utilisateur après login
  const location = useLocation();

  // La logique de protection des routes :
  // 1️⃣ Si l'utilisateur a un rôle autorisé → on affiche la page via <Outlet />
  // 2️⃣ Sinon, s'il est connecté mais pas autorisé → redirigé vers /unauthorized
  // 3️⃣ Sinon (pas connecté) → redirigé vers /login

  const decoded = auth?.accessToken ? jwtDecode(auth.accessToken) : undefined;

  // .NET JWT uses full URI claim types for role
  const roleClaim =
    decoded?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
  // roleClaim can be a string or an array — normalize to array
  const roles = roleClaim
    ? Array.isArray(roleClaim)
      ? roleClaim
      : [roleClaim]
    : [];

  // Ici on vérifie si l'utilisateur a un des rôles autorisés pour accéder à la page
  // allowedRoles = les rôles définis dans la route (ex: ["Admin"])
  // roles.find() : cherche un rôle du user qui existe dans allowedRoles
  return roles?.find((role) => allowedRoles?.includes(role)) ? ( // Vérifie si un rôle correspond
    <Outlet /> // accès autorisé → afficher la page enfant
  ) : auth?.user ? (
    <Navigate to="/unauthorized" state={{ from: location }} replace /> // connecté mais pas autorisé
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  ); // pas connecté
};

export default RequireAuth;

// 🔹 auth = informations de l'utilisateur (user + rôles)
// 🔹 allowedRoles = rôles autorisés à accéder à cette route
// 🔹 Outlet = la page enfant protégée
// 🔹 Navigate = redirection selon le statut de l'utilisateur

// 🔹 Fonctionnement :
// Si l'utilisateur a le rôle requis → affiche la page
// Sinon s'il est connecté → page "Unauthorized"
// Sinon → page "Login"
