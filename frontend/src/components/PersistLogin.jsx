import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";

// Hook qui permet d'obtenir un nouveau accessToken via le refresh token
import useRefreshToken from "../hooks/useRefreshToken";

// Hook qui contient les infos d’auth (user, token, roles…)
import useAuth from "../hooks/useAuth";

// Hook qui lit/écrit dans localStorage
import useLocalStorage from "../hooks/useLocalStorage";

const PersistLogin = () => {
  // état pour afficher "Loading..." pendant qu’on vérifie le token
  const [isLoading, setIsLoading] = useState(true);

  // fonction pour rafraîchir le token
  const refresh = useRefreshToken();

  // accéder à l'objet auth (accessToken, roles…)
  const { auth } = useAuth();

  // lire la valeur "persist" (Trust this device) depuis localStorage
  // persist = true → l’utilisateur veut rester connecté
  const [persist] = useLocalStorage("persist", false);

  useEffect(() => {
    let isMounted = true;
    // évite d'essayer de modifier l'état si le composant est démonté

    // fonction qui demande un nouveau accessToken
    const verifyRefreshToken = async () => {
      try {
        await refresh(); // tente de rafraîchir le token
      } catch (err) {
        console.error(err); // problème serveur ou token expiré
      } finally {
        // si le composant est encore monté → arrêter le "loading"
        isMounted && setIsLoading(false);
      }
    };

    /* 
            Condition importante :
            - Si on n’a PAS de accessToken en mémoire (auth.accessToken = undefined)
            - ET que l’utilisateur veut persister sa session (persist = true)

            → Alors on tente de rafraîchir le token
        */
    if (!auth?.accessToken && persist) {
      verifyRefreshToken(); // rafraîchir token
    } else {
      setIsLoading(false); // sinon pas besoin → arrêter loading
    }

    // cleanup : empêche setState si le composant se démonte
    return () => (isMounted = false);
  }, []); // ne s’exécute qu’une seule fois au montage du composant

  // juste pour débug (on peut retirer plus tard)
  useEffect(() => {
    console.log(`isLoading: ${isLoading}`);
    console.log(`aT: ${JSON.stringify(auth?.accessToken)}`);
    console.log(`persist: ${persist}`);
  }, [isLoading]);

  return (
    <>
      {/* 
                Si persist = false → on ne tente jamais de rafraîchir la session
                donc on affiche directement <Outlet />
            */}
      {!persist ? (
        <Outlet />
      ) : // Si persist = true :
      // on affiche "Loading..." tant que le refreshToken n’a pas fini
      isLoading ? (
        <p>Loading...</p>
      ) : (
        <Outlet />
      )}
    </>
  );
};

export default PersistLogin;
