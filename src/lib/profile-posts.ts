import type { User, SocialPost } from "./types";
import type { Profile } from "./profile-types";
import { postsByAuthor } from "./demo/posts";

/* Posts affichés dans l'onglet « Publications » d'un profil : les VRAIES
   publications de la personne dans le fil (`demo/posts`), et rien d'autre.

   Ce module fabriquait jadis ses propres publications pour n'importe quel
   profil : un penthouse « vue Mont-Blanc 360° », un programme Minergie à
   Zurich, « 342 personnes accompagnées », 2 456 « j'aime » et des
   commentaires élogieux (« La référence romande. On suit. ») — la même
   galerie pour chacune des seize personnes. Un visiteur qui cliquait sur
   Nikola depuis le fil y trouvait des posts que Nikola n'a jamais écrits.

   Désormais, le profil et le fil disent la même chose : mêmes textes, mêmes
   « j'aime » (des personnes réelles), mêmes commentaires. Une personne qui
   n'a rien publié a un onglet vide, et c'est la vérité. */

/** Convertit un profil en auteur (User) pour ses publications. */
export function profileToAuthor(p: Profile): User {
  return {
    id: p.id,
    firstName: p.firstName,
    lastName: p.lastName,
    email: p.email,
    avatar: p.avatar,
    city: p.location.city,
    country: p.location.country,
    roles: p.roles,
    activeRole: p.roles[0] ?? "particulier",
    trades: p.trades,
    interests: p.interests,
    stats: {
      followers: p.stats.followers,
      following: p.stats.following,
      properties: 0,
      reviews: p.stats.reviewsCount,
      rating: p.stats.rating,
      transactions: 0,
      revenue: 0,
    },
    bio: p.headline,
  };
}

/* L'auteur passé par la page (dérivé du profil, éventuellement édité dans la
   session) remplace celui du fil : nom et avatar suivent le profil affiché. */
function publicationsOf(author: User): SocialPost[] {
  return postsByAuthor(author.id).map((p) => ({ ...p, author }));
}

/** Mes publications (profil de l'utilisateur courant). */
export function getMyPosts(author: User): SocialPost[] {
  return publicationsOf(author);
}

/** Publications d'un profil consulté. */
export function getPublicPosts(author: User): SocialPost[] {
  return publicationsOf(author);
}
