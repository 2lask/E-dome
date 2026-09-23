

export interface ComposerEvent {
  id: string;
  titre: string;
  date: string;
  lieu: string;
  thumbnail: string;
  eventType: string;
  spotsRemaining?: number;
  prix?: number;
}

export const EVENTS_AVAILABLE: ComposerEvent[] = [
  {
    id: "e1",
    titre: "Salon de l'immobilier Suisse 2026",
    date: "2026-05-15",
    lieu: "Palexpo, Genève",
    thumbnail: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop",
    eventType: "Conférence",
    spotsRemaining: 127,
    prix: 45,
  },
  {
    id: "e2",
    titre: "Webinaire : Optimiser son rendement locatif",
    date: "2026-04-20",
    lieu: "En ligne",
    thumbnail: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=400&h=300&fit=crop",
    eventType: "Webinaire",
    spotsRemaining: 84,
    prix: 0,
  },
  {
    id: "e3",
    titre: "Atelier : Home staging pratique",
    date: "2026-04-10",
    lieu: "Lausanne, Centre Flon",
    thumbnail: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
    eventType: "Atelier",
    spotsRemaining: 8,
    prix: 89,
  },
  {
    id: "e4",
    titre: "Networking investisseurs romands",
    date: "2026-04-05",
    lieu: "Hôtel Royal, Montreux",
    thumbnail: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=300&fit=crop",
    eventType: "Networking",
    spotsRemaining: 22,
    prix: 35,
  },
];

