// Importation de Link depuis react-router-dom
// Link permet de naviguer vers une autre page sans recharger le navigateur
import { Link } from "react-router-dom";
import Users from "./Users";

// Composant Admin : page réservée aux utilisateurs ayant le rôle Admin
const Admin = () => {
  return (
    <section>
      {/* Titre principal de la page */}
      <h1>Admins Page</h1>
      <br />
      <Users />
      <br />
      {/* Bouton / lien pour revenir à la page d'accueil */}
      <div className="flexGrow">
        <Link to="/">Home</Link>
      </div>
    </section>
  );
};

// Exportation du composant pour pouvoir l'utiliser dans App.jsx
export default Admin;
