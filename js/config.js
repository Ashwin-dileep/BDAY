/**
 * ====================================================================
 * THE ARCHIVE - BIRTHDAY TRIBUTE CONFIGURATION
 * Clean, mature, and editorial. Customize any text, dates, and photos.
 * ====================================================================
 */

const DEFAULT_CONFIG = {
  // Details
  friendName: "Nanduuttaaaaaaaaa",
  friendInitials: "N",
  birthdayDate: "November 13",
  senderName: "RootFolder",
  entryPrefix: "HAPPY BIRTHDAYYYY",

  // Theme: "dark-editorial" (Onyx & Champagne) or "warm-linen" (Minimalist Ivory & Charcoal)
  theme: "dark-editorial",

  // The Written Note (Grounded, heartfelt, authentic — no cheesy clichés)
  letter: {
    sectionNum: "",
    sectionTitle: "Inna pidicho",
    salutation: "Nanduuttaaaaaaaaa,",
    paragraphs: [
      "OOoOoOoOYyyEYYEYYEEYEY Haapppppyyyyyyy birthdayyyyy kuutaaahhhhhhhhhhhh😗😗♥️♥️🫶🫶....prayayi varuaaaa ninkkkkk, ankne 20 varshathil 5 years nammal spendii onichhhhh litrellay speaking 1508 days nammal onichh spendiii😉😉 like it dosntfeel alottt but yahh 5 yearss...oru day polum mindi mathiyayi kedanattilaa ne ene oodich vittate olu pannii aknee mindan pirthyekich topic onum venda nthelum parnj keyrikolum randum kooodee...njn edakk edakkkk paryum ne adipoli koch anenn but ath chumma moodil parynth alla uk how i am njn elarodum compnya but specifically ninte eduth mthram ithrom oru atchment kanich niknel ne adipoliii ayondaa..enik oru nanm manam nokaling ila ninte eduth oro karyngl paryumboo oru chammalum ila athrom comfortble aanu ninte eduth and i loveee hearing u, ne edak bore adikunn paryum but naaah more than speaking njn hearing persona ipo ne oru day motham vilich iruthi mindiyalum njn nine kekumm...i love the fact u update me about ur life each and every sec like last day aneel polum net illanttt u called me areekan ayitt like aa oru efffffoortt kanumbo thane uk alinj povumm...onulllaa as a person as a girl enik nine mthra blind ayit trust cheyan patuluuu and njn adipoli ayond keep me😗...birthdayk vann kananon ind but amma vidula alel oru poli polikarnnnn..rn eeth moodil aano it dosnt matter ninte koodee just mindiya thanne njn nalla kick ayiii irunolummmm ankne entertain cheyth iruthanum care cheyth irikanum venam aa oru kazhiv nink ath nalapole ind and njn nalaple mothalakunud😗🫶😂..enik onnneee paryan oluu ponn mole ne enik ipo my best person aanu and always ankne thanne irunonmm..ne njn njn ne orthonm ath🫶😂...rootfolderinu always aa care oke koduknm sneham kittand valarna kocha ichiri adhikam kodutho kozpola😗😗ne edak pedpich vidunund ene njn pavayond onum parayarila but njn toksic aatoo😂😂and yah i do miss u thala ilatha samayth😂ifykyk.APOOO HAPPPPYYY 20s KUTTAPPPPIIIIIIIIIIIII BE HAPPPY BE SAFEEEE EPOZHUM AA CHIRI KOND ELAREM CHIRIPIKKKK ADICH POLIKK NINTE DAY AANU♥️🫶♥️🫶."
    ],
    closing: "Shalyam cheythond",
    signature: "RootFolder"
  },

  // Visual Archive (Photo Lookbook) - Clean frames, in user-specified order
  photos: [
    { url: "images/gallery-01.jpg?v=10", aspectRatio: "893 / 1024" },
    { url: "images/gallery-02.jpg?v=10", aspectRatio: "618 / 1024" },
    { url: "images/gallery-03.jpg?v=10", aspectRatio: "670 / 1024" },
    { url: "images/gallery-04.jpg?v=10", aspectRatio: "788 / 1024" },
    { url: "images/gallery-05.jpg?v=10", aspectRatio: "784 / 1024" },
    { url: "images/gallery-06.jpg?v=10", aspectRatio: "1024 / 765" },
    { url: "images/gallery-07.jpg?v=10", aspectRatio: "1024 / 550" },
    { url: "images/gallery-08.jpg?v=10", aspectRatio: "1024 / 754" },
    { url: "images/gallery-09.jpg?v=10", aspectRatio: "804 / 1024" },
    { url: "images/gallery-10.jpg?v=10", aspectRatio: "1024 / 662" }
  ]
};

const STORAGE_KEY = "bday_site_config_v10";

function getSiteConfig() {
  const keysToRemove = [
    "bday_site_config",
    "bday_site_config_v1",
    "bday_site_config_v2",
    "bday_site_config_v3",
    "bday_site_config_v4",
    "bday_site_config_v5",
    "bday_site_config_v6",
    "bday_site_config_v7",
    "bday_site_config_v8",
    "bday_site_config_v9"
  ];
  keysToRemove.forEach(k => {
    try { localStorage.removeItem(k); } catch (e) { }
  });

  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      return {
        ...DEFAULT_CONFIG,
        ...parsed,
        photos: (parsed.customUploaded && Array.isArray(parsed.photos) && parsed.photos.length)
          ? parsed.photos
          : DEFAULT_CONFIG.photos
      };
    } catch (e) {
      console.warn("Error reading custom config:", e);
    }
  }
  return DEFAULT_CONFIG;
}

function saveSiteConfig(cfg) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
  } catch (e) {
    console.warn("Could not save site config:", e);
  }
}
