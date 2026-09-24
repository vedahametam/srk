/**
 * Every hand-picked image on the designed pages lives here. A slot without
 * `src` renders an ornamental placeholder labelled with what belongs there.
 *
 * To fill a slot: put the file in /public/images/ and set
 *   src: "/images/<file>.jpg"
 * or point at a WordPress upload, e.g. "/wp-content/uploads/2024/01/photo.jpg".
 */
export type ImageSlot = {
  src?: string;
  alt: string;
  /** What should go here, shown on the placeholder. */
  label: string;
  width?: number;
  height?: number;
};

export const images = {
  masterPortrait: {
    alt: "Sri Ramakrishna seated in samadhi",
    label: "Portrait of Sri Ramakrishna (seated, 1881)",
  },
  masterStanding: {
    alt: "Sri Ramakrishna standing in samadhi",
    label: "Sri Ramakrishna in samadhi (standing, 1879)",
  },
  holyMother: {
    alt: "Sri Sarada Devi, the Holy Mother",
    label: "Portrait of Sri Sarada Devi",
  },
  vivekananda: {
    alt: "Swami Vivekananda",
    label: "Portrait of Swami Vivekananda",
  },
  kamarpukur: {
    alt: "Birthplace of Sri Ramakrishna at Kamarpukur",
    label: "Kamarpukur — birthplace temple",
  },
  dakshineswar: {
    alt: "Dakshineswar Kali temple on the Ganga",
    label: "Dakshineswar Kali temple from the Ganga",
  },
  masterRoom: {
    alt: "Sri Ramakrishna's room at Dakshineswar",
    label: "The Master’s room at Dakshineswar",
  },
  panchavati: {
    alt: "The Panchavati grove at Dakshineswar",
    label: "Panchavati grove, Dakshineswar",
  },
  cossipore: {
    alt: "Cossipore garden house",
    label: "Cossipore Udyanbati",
  },
  belurMath: {
    alt: "Belur Math on the banks of the Ganga",
    label: "Belur Math at dusk",
  },
  motherKali: {
    alt: "Mother Bhavatarini at Dakshineswar",
    label: "Mother Bhavatarini (Kali), Dakshineswar",
  },
} satisfies Record<string, ImageSlot>;
