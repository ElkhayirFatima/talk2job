// Users.jsx
// Composant React pour afficher la liste des utilisateurs
// Utilise JWT Access Token pour sécuriser la requête
// Annule proprement les requêtes HTTP si le composant se démonte

import { useState, useEffect } from "react"; // Hooks React pour gérer le state et les effets de bord
import useAxiosPrivate from "../hooks/useAxiosPrivate"; // Axios personnalisé avec access token et refresh token
import { useNavigate, useLocation } from "react-router-dom"; // Pour la navigation programmatique et récupérer la location actuelle

const Users = () => {
  // -------------------------------
  // STATE
  // -------------------------------
  const [users, setUsers] = useState(); // Stocke la liste des users en mémoire (state React)

  // -------------------------------
  // HOOKS
  // -------------------------------
  const axiosPrivate = useAxiosPrivate(); // Axios privé configuré pour envoyer access token et gérer refresh
  const navigate = useNavigate(); // Hook pour rediriger vers /login si token invalide
  const location = useLocation(); // Hook pour récupérer la page actuelle (pour revenir après login)

  // -------------------------------
  // EFFET : fetch des users au montage
  // -------------------------------
  useEffect(() => {
    let isMounted = true; // Flag pour éviter de modifier le state après démontage
    const controller = new AbortController(); // Objet natif pour annuler une requête HTTP si besoin

    // Fonction asynchrone pour récupérer les users depuis le backend
    const getUsers = async () => {
      try {
        // Requête GET sécurisée vers le backend (/users)
        // 'signal' permet d'annuler la requête si controller.abort() est appelé
        const response = await axiosPrivate.get("/users", {
          signal: controller.signal,
        });

        const userNames = response?.data?.map((user) => user.username);

        console.log(userNames); // Debug : affichage des users récupérés

        // Si le composant est toujours monté, on met à jour le state
        isMounted && setUsers(userNames);
      } catch (err) {
        console.error(err); // Affiche l'erreur dans la console

        // Si erreur (ex: access token expiré et refresh token invalide)
        // on redirige l'utilisateur vers /login
        navigate("/login", { state: { from: location }, replace: true });
      }
    };

    // Appel de la fonction pour récupérer les users
    getUsers();

    // Fonction de nettoyage (cleanup) quand le composant se démonte
    return () => {
      isMounted = false; // Empêche les setState après démontage
      controller.abort(); // Annule la requête HTTP en cours pour éviter les fuites mémoire
    };
  }, []); // Tableau vide → useEffect s'exécute une seule fois au montage

  // -------------------------------
  // RENDU DU COMPOSANT
  // -------------------------------
  return (
    <article>
      <h2>Users List</h2>
      {
        users?.length ? ( // Vérifie si la liste existe et contient des éléments
          <ul>
            {/* Affiche chaque username */}
            {users.map((user, i) => (
              <li key={i}>{user}</li>
            ))}
          </ul>
        ) : (
          <p>No users to display</p>
        ) // Message si aucun user
      }
    </article>
  );
};

// Export du composant pour l'utiliser ailleurs dans l'application
export default Users;
