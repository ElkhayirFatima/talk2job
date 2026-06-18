// On importe notre instance Axios privée (axiosPrivate)
// qui a already baseURL, Content-Type et withCredentials = true
import { axiosPrivate } from "../api/axios";

// useEffect pour installer / retirer les intercepteurs
import { useEffect } from "react";

// Hook qui permet d'obtenir un nouveau accessToken quand il expire
import useRefreshToken from "./useRefreshToken";

// Hook qui donne accès à l’état d’authentification (auth, setAuth)
import useAuth from "./useAuth";

// Hook personnalisé qui configure automatiquement axiosPrivate
const useAxiosPrivate = () => {
  // Fonction refresh() pour récupérer un nouveau access token via /refresh
  const refresh = useRefreshToken();

  // On récupère auth = { accessToken, user, roles, ... }
  const { auth } = useAuth();

  useEffect(() => {
    // ------------------------------ //
    //   1) INTERCEPTOR DES REQUÊTES  //
    // ------------------------------ //

    // requestIntercept = identifiant de l’intercepteur (pour pouvoir l’enlever plus tard)
    const requestIntercept = axiosPrivate.interceptors.request.use(
      // Fonction exécutée AVANT chaque requête
      (config) => {
        // Si la requête n'a pas déjà un header Authorization
        if (!config.headers["Authorization"]) {
          // On ajoute automatiquement : Authorization: Bearer <token>
          config.headers["Authorization"] = `Bearer ${auth?.accessToken}`;
        }

        // Toujours retourner la config
        return config;
      },

      // Fonction en cas d’erreur AVANT envoi
      (error) => Promise.reject(error),
    );

    // -------------------------------- //
    //   2) INTERCEPTOR DES RÉPONSES    //
    // -------------------------------- //

    const responseIntercept = axiosPrivate.interceptors.response.use(
      // Si la réponse est OK → on la retourne
      (response) => response,

      // Gestion des erreurs → souvent token expiré
      async (error) => {
        // On récupère la requête originale envoyée par Axios
        const prevRequest = error?.config;

        // Si le serveur répond "403 Forbidden" ET
        // qu’on n’a pas encore essayé de rafraîchir le token
        if (error?.response?.status === 401 && !prevRequest?.sent) {
          // On marque la requête comme "déjà réessayée"
          prevRequest.sent = true;

          // On récupère un nouveau accessToken
          const newAccessToken = await refresh();

          // On met à jour le header Authorization
          prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

          // On renvoie *la même requête* mais avec le nouveau token
          return axiosPrivate(prevRequest);
        }

        // Si ce n’est pas 403 → On renvoie simplement l'erreur
        return Promise.reject(error);
      },
    );

    // -------------------------------------------------- //
    //  3) CLEANUP : retirer les intercepteurs au démontage
    // -------------------------------------------------- //

    return () => {
      // On enlève l’intercepteur des requêtes
      axiosPrivate.interceptors.request.eject(requestIntercept);

      // On enlève l’intercepteur des réponses
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [auth, refresh]);
  // useEffect se relance si auth.accessToken change (nouveau token)
  // ou si la fonction refresh() change

  // On retourne l’instance axios qui a :
  // - les bons intercepteurs
  // - le bon accessToken automatiquement
  return axiosPrivate;
};

// On exporte notre hook
export default useAxiosPrivate;

/*

Ajoute automatiquement le accessToken dans toutes les requêtes

Renvoie un nouveau token si l’ancien expire (403)

Relance la requête automatiquement avec le nouveau token

Nettoie les intercepteurs pour éviter les doublons

*/
