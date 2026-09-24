/**
 * Editorial content for the designed pages. Quotes, testimonials, videos and
 * links come from the live site's Elementor home page; review the rest before launch.
 */
import { images, type ImageSlot } from "./images";

export const pranamMantra = {
  devanagari: ["ॐ स्थापकाय च धर्मस्य सर्वधर्मस्वरूपिणे ।", "अवतारवरिष्ठाय रामकृष्णाय ते नमः ॥"],
  transliteration: "Om sthāpakāya ca dharmasya sarvadharma-svarūpiṇe, avatāra-variṣṭhāya rāmakṛṣṇāya te namaḥ",
  meaning:
    "Salutations to Thee, O Ramakrishna — establisher of dharma, embodiment of all religions, greatest among the Avataras.",
  source: "Swami Vivekananda",
};

/** Opening of the live About page (Swami Adiswarananda). */
export const aboutIntro =
  "Sri Ramakrishna, who was born in 1836 and passed away in 1886, represents the very core of the spiritual realizations of the seers and sages of India. His whole life was literally an uninterrupted contemplation of God.";

export type Teaching = { text: string; theme: string };

export const featuredTeaching: Teaching = {
  theme: "Work",
  text: "To work without attachment is to work without the expectation of reward or fear of any punishment in this world or the next. Work so done is a means to the end, and God is the end.",
};

export const teachings: Teaching[] = [
  {
    theme: "Harmony",
    text: "God can be realized through all paths. All religions are true. The important thing is to reach the roof. You can reach it by stone stairs or by wooden stairs or by bamboo steps or by a rope.",
  },
  {
    theme: "Knowledge",
    text: "That knowledge which purifies the mind and heart alone is true Knowledge, all else is only a negation of Knowledge.",
  },
  {
    theme: "Faith",
    text: "You see many stars in the sky at night, but not when the sun rises. Can you therefore say that there are no stars in the heavens during the day? Because you cannot find God in the days of your ignorance, say not that there is no God.",
  },
  {
    theme: "Longing",
    text: "Cry to the Lord with an intensely yearning heart and you will certainly see Him.",
  },
  {
    theme: "The world",
    text: "Live in the world like a maidservant in a rich man’s house. She does all her duties, yet she knows in her heart that her true home is elsewhere.",
  },
  {
    theme: "Grace",
    text: "The winds of grace are always blowing, but you have to raise your sail.",
  },
];

export type Milestone = { year: string; title: string; text: string; image?: ImageSlot; href?: string };

export const milestones: Milestone[] = [
  {
    year: "1836",
    title: "Birth at Kamarpukur",
    text: "Born Gadadhar Chattopadhyay on 18 February in the village of Kamarpukur, Bengal, to Kshudiram and Chandramani Devi.",
    image: images.kamarpukur,
    href: "/2018/01/31/kamarpukur-the-birthplace/",
  },
  {
    year: "1856",
    title: "Priest of Mother Kali",
    text: "Becomes priest of the Bhavatarini temple at Dakshineswar, where his longing for the Divine Mother culminates in her vision.",
    image: images.dakshineswarTemple,
    href: "/2018/01/20/the-first-vision-of-kali/",
  },
  {
    year: "1861–66",
    title: "Twelve years of sadhana",
    text: "Practises Tantra under the Bhairavi Brahmani, Vedanta under Totapuri, and later the paths of Islam and Christianity — finding the same God at the end of each.",
    image: images.masterRoom,
    href: "/category/ebooks/the-great-master/part-ii/",
  },
  {
    year: "1872",
    title: "Worship of the Holy Mother",
    text: "Performs the Shodashi Puja, worshipping Sri Sarada Devi as the Divine Mother herself.",
    image: images.holyMother,
    href: "/2018/02/01/the-holy-mother/",
  },
  {
    year: "1881",
    title: "Narendra arrives",
    text: "The young Narendranath — later Swami Vivekananda — comes to Dakshineswar and asks, “Have you seen God?”",
    image: images.masterStanding,
    href: "/2018/02/01/chapter-3-narendras-antecedents-and-his-first-visit-to-dakshineswar/",
  },
  {
    year: "1886",
    title: "Mahasamadhi at Cossipore",
    text: "On 16 August, at the Cossipore garden house, the Master enters mahasamadhi, leaving his disciples to carry his message to the world.",
    image: images.cossipore,
    href: "/2018/01/20/last-days-at-cossipore/",
  },
];

export const books = [
  {
    title: "The Gospel of Sri Ramakrishna",
    author: "Mahendranath Gupta (‘M.’)",
    text: "The Master’s conversations with his devotees, recorded day by day by ‘M.’ — the Sri Sri Ramakrishna Kathamrita.",
    href: "/category/ebooks/the-gospel-of-sri-ramakrishna/",
    bengali: "শ্রীশ্রীরামকৃষ্ণকথামৃত",
  },
  {
    title: "Sri Ramakrishna, The Great Master",
    author: "Swami Saradananda",
    text: "The authoritative life of the Master by his direct disciple — the Sri Sri Ramakrishna Lilaprasanga.",
    href: "/category/ebooks/the-great-master/",
    bengali: "শ্রীশ্রীরামকৃষ্ণলীলাপ্রসঙ্গ",
  },
];

/** From the live home page. */
export const testimonials = [
  {
    quote: "Ramakrishna’s life enables us to see God face to face. He was a living embodiment of godliness.",
    name: "Mahatma Gandhi",
    href: "/2018/02/01/mohandas-karamchand-gandhi/",
    image: "/wp-content/uploads/2018/02/Portrait_Gandhi.jpg",
  },
  {
    quote: "One of the great rishis of India, who had come to draw our attention to the higher things of life and of the spirit.",
    name: "Jawaharlal Nehru",
    href: "/2018/02/01/jawaharlal-nehru/",
    image: "/wp-content/uploads/2018/02/Jnehru.jpg",
  },
];

/** From the live home page ("Videos" section). */
export const videos = {
  channel: "https://www.youtube.com/user/belurmathorg",
  ids: ["nLpwsaPcr04", "WzbXO8wvks0"],
};

export const belurMath = {
  site: "https://belurmath.org/",
  instagram: "https://www.instagram.com/rkmbelurmath/",
  facebook: "https://www.facebook.com/rkmbelur",
};

export const sacredPlaces = [
  { name: "Kamarpukur", note: "Village of his birth and childhood", image: images.kamarpukur, href: "/2018/01/31/kamarpukur-the-birthplace/" },
  { name: "Dakshineswar", note: "The temple garden of thirty years", image: images.dakshineswar, href: "/2018/01/31/dakshineshwar-kali-temple-place-of-sadhana/" },
  { name: "Cossipore", note: "The garden house of his last days", image: images.cossipore, href: "/2018/01/31/cossipore-garden-house/" },
  { name: "Belur Math", note: "Headquarters of the Order he inspired", image: images.belurMath, href: "https://belurmath.org/" },
];
