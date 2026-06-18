import { useState, useEffect } from "react";

// -----------------------------------------------------
// Fonction qui récupère la valeur initiale
// soit depuis le localStorage,
// soit depuis initValue,
// soit en exécutant initValue si c’est une fonction.
// -----------------------------------------------------
const getLocalValue = (key, initValue) => {
  // --- Cas SSR (Next.js) ---
  // Sur le serveur, "window" n'existe PAS.
  // Donc localStorage n'existe pas non plus.
  // Pour éviter une erreur, on renvoie simplement la valeur initiale.
  if (typeof window === "undefined") return initValue;

  // --- Vérifier si une valeur existe déjà dans localStorage ---
  const localValue = JSON.parse(localStorage.getItem(key));

  // Si une valeur existe → la renvoyer
  if (localValue) return localValue;

  // --- Cas où initValue est une fonction ---
  // Exemple : initValue = () => calculTrèsLourd()
  // React va appeler initValue() UNE SEULE FOIS (lazy initialization)
  if (initValue instanceof Function) return initValue();

  // Sinon → retourner initValue tel qu’il est
  return initValue;
};

// -----------------------------------------------------
// Hook personnalisé useLocalStorage
// Fonctionne comme useState, mais synchronisé avec localStorage
// -----------------------------------------------------
const useLocalStorage = (key, initValue) => {
  // useState avec initialisation "lazy"
  // c’est-à-dire que getLocalValue ne sera appelé QU'UNE SEULE FOIS
  const [value, setValue] = useState(() => {
    return getLocalValue(key, initValue);
  });

  // A CHAQUE FOIS que value change → on sauvegarde dans localStorage
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  // key dans la dépendance est là au cas où tu changes de clé dynamiquement

  // Retourner la valeur et la fonction qui la met à jour
  return [value, setValue];
};

export default useLocalStorage;

/**
 * Hook useLocalStorage()
 * -----------------------
 * ➤ Remplace useState(), mais avec persistance dans localStorage.
 * ➤ La valeur reste enregistrée même après :
 *      - refresh de la page
 *      - fermeture du navigateur
 *      - redémarrage du PC
 *
 * Comment ça marche ?
 * 1) Au premier rendu :
 *    - Cherche si une valeur existe déjà dans localStorage.
 *    - Si oui → l’utilise.
 *    - Si non :
 *        • utilise la valeur passée en argument (initValue)
 *        • si initValue est une fonction → exécute cette fonction
 *
 * 2) À chaque changement de la valeur :
 *    - Enregistre automatiquement la nouvelle valeur dans localStorage
 *
 * Avantages :
 * - Permet de mémoriser les préférences utilisateur (theme, settings…)
 * - Évite de réécrire du code répétitif (useState + useEffect + localStorage)
 * - Peut être utilisé dans n’importe quel projet React
 *
 * Cas gérés :
 * - Si on utilise Next.js ou du SSR → vérifie d’abord l’existence de "window"
 * - Évite les erreurs "localStorage is not defined" côté serveur
 *
 * Utilisation type :
 * const [value, setValue] = useLocalStorage("nom-cle", valeurInitiale);
 *
 */
