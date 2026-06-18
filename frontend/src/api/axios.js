// On importe Axios, la bibliothèque pour faire des requêtes HTTP
import axios from 'axios';

// Définition de l'URL de base de notre backend
// Toutes les requêtes partiront de cette URL
const BASE_URL = 'http://localhost:5106';

// ----------------------------
// Instance Axios “publique”
// ----------------------------
// Pour toutes les requêtes **publiques**, qui ne nécessitent pas de token
// Exemple : login, register, récupération de données publiques
export default axios.create({
    baseURL: BASE_URL // toutes les requêtes utiliseront cette URL de base
});

// ----------------------------
// Instance Axios “privée”
// ----------------------------
// Pour toutes les requêtes **protégées** nécessitant un accessToken JWT
// Exemple : récupérer la liste des utilisateurs, messages protégés, etc.
export const axiosPrivate = axios.create({
    baseURL: BASE_URL, // URL de base identique
    headers: { 'Content-Type': 'application/json' }, // On envoie des données JSON
    withCredentials: true // Permet d’envoyer automatiquement les cookies (refresh token HttpOnly)
});

// Pourquoi créer deux instances ?
// 1️⃣ Centraliser la configuration Axios (baseURL, headers, cookies…)
// 2️⃣ Séparer les requêtes publiques et protégées pour plus de clarté
// 3️⃣ Réutilisation facile : tous les composants peuvent importer ces instances

// Exemple d’utilisation :
// axios (publique) → login ou register
// const res = await axios.post('/login', { username, password });

// axiosPrivate (protégée) → routes nécessitant JWT
// const res = await axiosPrivate.get('/users');
// axiosPrivate gère automatiquement :
//  - ajout du token Authorization
//  - refresh automatique si token expiré (via useAxiosPrivate)