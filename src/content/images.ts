/**
 * Every hand-picked image on the designed pages lives here. A slot without
 * `src` renders an ornamental placeholder labelled with what belongs there.
 *
 * Files in /public/images/ were taken from the WordPress media library.
 * To fill or replace a slot: put the file in /public/images/ and set
 *   src: "/images/<file>.jpg"
 */
export type ImageSlot = {
  src?: string;
  alt: string;
  /** What should go here, shown on the placeholder. */
  label: string;
  /** CSS object-position, to keep faces in frame when cropped. */
  position?: string;
  /** "contain" shows the whole image, for scanned portraits with captions printed on them. */
  fit?: "cover" | "contain";
};

export const images = {
  masterShrine: {
    src: "/images/master-shrine-glow.jpg",
    alt: "Marble image of Sri Ramakrishna at Belur Math, garlanded and glowing",
    label: "Sri Ramakrishna shrine",
  },
  masterSeated: {
    src: "/images/master-seated.jpg",
    alt: "Sri Ramakrishna seated in samadhi, 1881 photograph",
    label: "Portrait of Sri Ramakrishna (seated, 1881)",
    position: "50% 30%",
  },
  masterStanding: {
    src: "/images/master-samadhi-standing.jpg",
    alt: "Sri Ramakrishna standing in ecstasy among devotees at Keshab Chandra Sen's house, 1879",
    label: "Sri Ramakrishna in samadhi (standing, 1879)",
  },
  masterPainting: {
    src: "/images/master-painting.jpg",
    alt: "Painting of Sri Ramakrishna seated in meditation",
    label: "Painting of Sri Ramakrishna",
    position: "50% 25%",
  },
  holyMother: {
    src: "/images/holy-mother.jpg",
    alt: "Sri Sarada Devi, the Holy Mother",
    label: "Portrait of Sri Sarada Devi (higher resolution wanted)",
    fit: "contain",
  },
  vivekananda: {
    alt: "Swami Vivekananda",
    label: "Portrait of Swami Vivekananda",
  },
  disciples: {
    src: "/images/alambazar-disciples.jpg",
    alt: "The monastic disciples of Sri Ramakrishna at Alambazar Math",
    label: "Disciples at Alambazar Math",
  },
  kamarpukur: {
    src: "/images/kamarpukur.jpg",
    alt: "Birthplace temple of Sri Ramakrishna at Kamarpukur",
    label: "Kamarpukur — birthplace temple",
  },
  dakshineswar: {
    src: "/images/dakshineswar-ganga.jpg",
    alt: "Dakshineswar Kali temple seen across the water",
    label: "Dakshineswar Kali temple",
  },
  dakshineswarTemple: {
    src: "/images/dakshineswar-temple.jpg",
    alt: "The Bhavatarini temple courtyard at Dakshineswar",
    label: "Bhavatarini temple, Dakshineswar",
  },
  masterRoom: {
    src: "/images/master-room.jpg",
    alt: "Sri Ramakrishna's room at Dakshineswar",
    label: "The Master’s room at Dakshineswar",
  },
  panchavati: {
    alt: "The Panchavati grove at Dakshineswar",
    label: "Panchavati grove, Dakshineswar",
  },
  cossipore: {
    src: "/images/cossipore.jpg",
    alt: "Cossipore Udyanbati, the garden house of the Master's last days",
    label: "Cossipore Udyanbati",
  },
  belurMath: {
    src: "/images/belur-math.jpg",
    alt: "Sri Ramakrishna temple at Belur Math",
    label: "Belur Math",
  },
  belurShrine: {
    src: "/images/belur-math-shrine.jpg",
    alt: "The shrine of Sri Ramakrishna at Belur Math",
    label: "Shrine at Belur Math",
  },
} satisfies Record<string, ImageSlot>;
