// Importation de useNavigate depuis react-router-dom
// useNavigate permet de naviguer programatiquement vers une autre route
import { useNavigate } from "react-router-dom";

// Composant Unauthorized : page affichée quand l'utilisateur n'a pas accès à la page
const Unauthorized = () => {
  // Hook pour naviguer programatiquement
  const navigate = useNavigate();

  // Fonction pour revenir à la page précédente
  const goBack = () => navigate(-1); // -1 = une page en arrière dans l'historique

  return (
    <section>
      {/* Titre principal */}
      <h1>Unauthorized</h1>
      <br />

      {/* Message expliquant l'accès refusé */}
      <p>You do not have access to the requested page.</p>

      {/* Bouton pour revenir à la page précédente */}
      <div className="flexGrow">
        <button onClick={goBack}>Go Back</button>
      </div>
    </section>
  );
};

// Exportation du composant pour l'utiliser dans App.jsx
export default Unauthorized;

// 🔹 Cette page est utilisée par RequireAuth lorsque l'utilisateur est connecté mais n'a pas le rôle requis
// 🔹 goBack() utilise navigate(-1) pour revenir à la page précédente
// 🔹 La classe "flexGrow" est probablement utilisée pour le style CSS
// 🔹 Utile pour indiquer clairement à l'utilisateur qu'il n'a pas les droits d'accès
