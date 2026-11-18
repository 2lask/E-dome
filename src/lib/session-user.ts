/* La personne connectée, forme CLIENT-SAFE (sans `server-only`).

   Permet de passer le résultat de `getCurrentUser()` (serveur) du layout vers
   l'app cliente via les props / le contexte, sans importer le module serveur
   dans du code client. `getCurrentUser()` renvoie exactement cette forme. */
export interface SessionUser {
  id: string;
  email: string | null;
  firstName: string;
  lastName: string;
  avatar: string | null;
  city: string | null;
  country: string;
  bio: string | null;
  roles: string[];
  activeRole: string;
  trades: string[];
  interests: string[];
}
