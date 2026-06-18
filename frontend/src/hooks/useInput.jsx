// On importe le hook useLocalStorage
// qui fonctionne comme useState mais sauvegarde automatiquement dans localStorage
import useLocalStorage from "./useLocalStorage";

const useInput = (key, initValue) => {
  // ------------------------------
  // value     → la valeur actuelle (chargée depuis localStorage si elle existe)
  // setValue  → met à jour value + sauvegarde dans localStorage
  // ------------------------------
  const [value, setValue] = useLocalStorage(key, initValue);

  // Fonction pour réinitialiser l'input
  // → remet l'input à sa valeur initiale
  // → met aussi cette valeur dans localStorage
  const reset = () => setValue(initValue);

  // Objet contenant les props pour <input>
  // On peut maintenant faire simplement : <input {...attributeObj} />
  // value      → pour afficher la valeur dans l'input
  // onChange   → pour mettre à jour la valeur quand l'utilisateur tape
  const attributeObj = {
    value,
    onChange: (e) => setValue(e.target.value),
  };

  // On retourne 3 choses :
  // 1) value → la valeur actuelle de l'input
  // 2) reset → fonction pour réinitialiser l'input
  // 3) attributeObj → utilisé pour connecter facilement l'input
  return [value, reset, attributeObj];
};

// On exporte le hook pour l'utiliser dans les composants
export default useInput;
