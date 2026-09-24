/**
 * Editorial content for the designed pages. Review the wording and sources
 * before launch; these can later be moved into WordPress (e.g. ACF options).
 */
import { images, type ImageSlot } from "./images";

export const pranamMantra = {
  devanagari: ["ॐ स्थापकाय च धर्मस्य सर्वधर्मस्वरूपिणे ।", "अवतारवरिष्ठाय रामकृष्णाय ते नमः ॥"],
  transliteration: "Om sthāpakāya ca dharmasya sarvadharma-svarūpiṇe, avatāra-variṣṭhāya rāmakṛṣṇāya te namaḥ",
  meaning:
    "Salutations to Thee, O Ramakrishna — establisher of dharma, embodiment of all religions, greatest among the Avataras.",
  source: "Swami Vivekananda",
};

export type Teaching = { text: string; theme: string };

export const teachings: Teaching[] = [
  {
    theme: "Harmony",
    text: "God can be realized through all paths. All religions are true. The important thing is to reach the roof. You can reach it by stone stairs or by wooden stairs or by bamboo steps or by a rope.",
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
    theme: "The Self",
    text: "God is in all men, but all men are not in God; that is the reason why they suffer.",
  },
  {
    theme: "Devotion",
    text: "As a lamp does not burn without oil, so a man cannot live without God.",
  },
  {
    theme: "Grace",
    text: "The winds of grace are always blowing, but you have to raise your sail.",
  },
];

export type Milestone = { year: string; title: string; text: string; image?: ImageSlot };

export const milestones: Milestone[] = [
  {
    year: "1836",
    title: "Birth at Kamarpukur",
    text: "Born Gadadhar Chattopadhyay on 18 February in the village of Kamarpukur, Bengal, to Khudiram and Chandramani Devi.",
    image: images.kamarpukur,
  },
  {
    year: "1856",
    title: "Priest of Mother Kali",
    text: "Becomes priest of the Bhavatarini temple at Dakshineswar, where his longing for the Divine Mother culminates in her vision.",
    image: images.motherKali,
  },
  {
    year: "1861–66",
    title: "Twelve years of sadhana",
    text: "Practises Tantra under the Bhairavi Brahmani, Vedanta under Totapuri, and later the paths of Islam and Christianity — finding the same God at the end of each.",
    image: images.panchavati,
  },
  {
    year: "1872",
    title: "Worship of the Holy Mother",
    text: "Performs the Shodashi Puja, worshipping Sri Sarada Devi as the Divine Mother herself.",
    image: images.holyMother,
  },
  {
    year: "1881",
    title: "Narendra arrives",
    text: "The young Narendranath — later Swami Vivekananda — comes to Dakshineswar and asks, “Have you seen God?”",
    image: images.vivekananda,
  },
  {
    year: "1886",
    title: "Mahasamadhi at Cossipore",
    text: "On 16 August, at the Cossipore garden house, the Master enters mahasamadhi, leaving his disciples to carry his message to the world.",
    image: images.cossipore,
  },
];

export const trinity = [
  {
    name: "Sri Ramakrishna",
    epithet: "Thakur",
    dates: "1836 – 1886",
    text: "The God-intoxicated saint of Dakshineswar whose life was a living harmony of all faiths.",
    href: "/life/",
    image: images.masterPortrait,
  },
  {
    name: "Sri Sarada Devi",
    epithet: "The Holy Mother",
    dates: "1853 – 1920",
    text: "His spiritual consort and first disciple, Mother to all who came to her — “I am the mother of the wicked as I am the mother of the virtuous.”",
    href: "/holy-mother/",
    image: images.holyMother,
  },
  {
    name: "Swami Vivekananda",
    epithet: "Swamiji",
    dates: "1863 – 1902",
    text: "The Master’s foremost disciple, who carried Vedanta to the world and founded the Ramakrishna Math and Mission.",
    href: "/swami-vivekananda/",
    image: images.vivekananda,
  },
];

export const sacredPlaces = [
  { name: "Kamarpukur", note: "Village of his birth and childhood", image: images.kamarpukur },
  { name: "Dakshineswar", note: "The temple garden of thirty years", image: images.dakshineswar },
  { name: "Cossipore", note: "The garden house of his last days", image: images.cossipore },
  { name: "Belur Math", note: "Headquarters of the Order he inspired", image: images.belurMath },
];
