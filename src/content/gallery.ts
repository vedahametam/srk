/**
 * Photographs shown on the Gallery page (/gallery-2/), from the WordPress
 * media library. Paths are relative to the WordPress origin.
 */
export type GalleryPhoto = { src: string; alt: string; width: number; height: number };

const belur = (file: string, alt: string) => ({
  src: `/wp-content/uploads/2019/09/${file}.jpg`,
  alt,
  width: 1024,
  height: 683,
});

export const galleryPhotos: GalleryPhoto[] = [
  { src: "/wp-content/uploads/2019/08/rkp.jpg", alt: "Sri Ramakrishna shrine, Belur Math", width: 1280, height: 1024 },
  { src: "/wp-content/uploads/2019/09/kamarpukur-min.jpg", alt: "Kamarpukur, the birthplace", width: 1098, height: 823 },
  { src: "/wp-content/uploads/2019/10/dakshineswar.jpg", alt: "Dakshineswar Kali temple", width: 1024, height: 768 },
  { src: "/wp-content/uploads/2018/01/cossipore.jpg", alt: "Cossipore Garden House", width: 800, height: 600 },
  { src: "/wp-content/uploads/2019/07/belur-math.jpg", alt: "Sri Ramakrishna temple, Belur Math", width: 1920, height: 1440 },
  { src: "/wp-content/uploads/2019/09/Sri-Ramakrishna-.jpg", alt: "Sri Ramakrishna, decorated for worship", width: 1024, height: 580 },
  { src: "/wp-content/uploads/2019/09/Alambazar_Math.jpg", alt: "The disciples at Alambazar Math", width: 598, height: 417 },
  ...["", "1", "2", "3", "4", "5", "6", "7"].map((n) => belur(`rkp-belur-math${n}`, "Sri Ramakrishna, Belur Math")),
  ...["", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14"].map((n) => belur(`belur-math${n}`, "Belur Math")),
];
