import useLocalStorage from "./useLocalStorage";

// -----------------------------------------------------
// Hook useToggle
// Permet de gérer une valeur booléenne (true/false),
// tout en la sauvegardant automatiquement dans localStorage
// -----------------------------------------------------
const useToggle = (key, initValue) => {
  // On utilise useLocalStorage au lieu de useState
  // → la valeur est stockée dans localStorage
  // value = valeur actuelle (true ou false)
  // setValue = fonction pour la modifier
  const [value, setValue] = useLocalStorage(key, initValue);

  // -------------------------------------------------
  // Fonction toggle()
  // - Si on donne un boolean → elle fixe directement value à ce boolean
  // - Si on donne rien → elle inverse la valeur (true → false, false → true)
  // -------------------------------------------------
  const toggle = (value) => {
    setValue((prev) => {
      // Si "value" est un boolean → on le met tel quel
      return typeof value === "boolean"
        ? value // ex : toggle(true) → value = true
        : !prev; // sinon on inverse : toggle() → value devient !prev
    });
  };

  // On retourne la valeur actuelle + la fonction toggle
  return [value, toggle];
};

export default useToggle;

/**
 * Hook useToggle()
 * -----------------
 * ➤ Permet de gérer n'importe quelle valeur booléenne (true/false)
 * ➤ Sauvegarde automatiquement la valeur dans localStorage
 * ➤ Reste mémorisée même après refresh ou fermeture du navigateur
 *
 * Exemples d'utilisation :
 * - "Remember me" / "Trust this device"
 * - Mode sombre (dark mode)
 * - Ouvrir/fermer un menu
 * - Afficher/cacher un popup
 * - Show/Hide password
 *
 * Fonctionnement :
 * - toggle() sans argument → inverse la valeur (true → false)
 * - toggle(true/false) → force directement la valeur
 *
 * Pourquoi c’est utile ?
 * - Réutilisable dans n'importe quel projet
 * - Simplifie le code (évite de réécrire useState + useEffect)
 * - Gère automatiquement la persistance dans localStorage
 */
