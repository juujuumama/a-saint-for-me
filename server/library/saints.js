// Curated, human-reviewable saint library.
// The AI may only recommend saints from this list (enforced by an enum in the
// structured-output schema), so names, dates and patronages always come from here.
// `emblem` drives the symbolic portrait. Portraits are artistic interpretations,
// never presented as likenesses.
//
// Before launch, have each entry reviewed by a theologian / catechist.

export const SAINTS = [
  {
    id: "monica",
    name: "St. Monica",
    years: "c. 331–387",
    feast: "August 27",
    region: "Thagaste, North Africa (present-day Algeria)",
    patronages: ["mothers", "wives", "patience", "parents of children who have left the faith"],
    story:
      "A North African mother who prayed for her son Augustine for many years while he wandered from the faith. She followed him to Milan, never stopped hoping, and lived to see his baptism. Augustine later wrote about her tenderly in his Confessions.",
    themes: ["motherhood", "parenting", "family", "hope", "discouragement", "faith"],
    emblem: { symbols: ["tears", "book"], colors: ["#FF6F61", "#1FC8C0"] },
  },
  {
    id: "gianna",
    name: "St. Gianna Beretta Molla",
    years: "1922–1962",
    feast: "April 28",
    region: "Lombardy, Italy",
    patronages: ["mothers", "physicians", "unborn children", "pregnancy"],
    story:
      "A pediatric doctor, wife and mother of four who loved skiing, music and the mountains. During her fourth pregnancy she chose to protect her unborn daughter's life despite serious risk to her own. She was canonized in 2004, with her husband and children present.",
    themes: ["motherhood", "parenting", "health", "marriage", "work"],
    emblem: { symbols: ["heart", "lily"], colors: ["#FF5FA2", "#FFC9A8"] },
  },
  {
    id: "anne",
    name: "St. Anne",
    years: "1st century BC",
    feast: "July 26",
    region: "Judea",
    patronages: ["grandmothers", "mothers", "women in labor", "families"],
    story:
      "By long tradition, the mother of the Virgin Mary and grandmother of Jesus. Very little is known historically, but devotion to her as a figure of patient, faithful motherhood across generations is ancient in both East and West.",
    themes: ["motherhood", "family", "parenting", "gratitude"],
    emblem: { symbols: ["book", "star"], colors: ["#1FC8C0", "#FF7A1A"] },
  },
  {
    id: "joseph",
    name: "St. Joseph",
    years: "1st century",
    feast: "March 19 (and May 1, St. Joseph the Worker)",
    region: "Nazareth, Galilee",
    patronages: ["fathers", "families", "workers", "a happy death", "the universal Church"],
    story:
      "The quiet carpenter of Nazareth who protected Mary and Jesus. Scripture records no words of his, only faithful actions: trusting God through dreams, taking his family into exile, and working to provide for them. He is invoked for work, provision and protecting the home.",
    themes: ["parenting", "family", "work", "finances", "decisions", "marriage", "fear"],
    emblem: { symbols: ["lily", "tools"], colors: ["#FF7A1A", "#1FC8C0"] },
  },
  {
    id: "zelie_louis",
    name: "Sts. Louis and Zélie Martin",
    years: "1823–1894 and 1831–1877",
    feast: "July 12",
    region: "Alençon, France",
    patronages: ["married couples", "parents", "families facing illness"],
    story:
      "A watchmaker and a lacemaker who ran their own businesses, raised five daughters (including St. Thérèse of Lisieux) and buried four children. Zélie died of breast cancer; Louis later suffered serious illness. They were the first married couple canonized together, in 2015.",
    themes: ["marriage", "parenting", "family", "grief", "health", "work"],
    emblem: { symbols: ["rings", "roses"], colors: ["#FF5FA2", "#1FC8C0"] },
  },
  {
    id: "rita",
    name: "St. Rita of Cascia",
    years: "1381–1457",
    feast: "May 22",
    region: "Umbria, Italy",
    patronages: ["impossible causes", "difficult marriages", "abuse survivors", "widows"],
    story:
      "Married young to a man known for his violent temper, Rita prayed for him and worked for peace in a feuding town. After his murder and her sons' deaths, she entered an Augustinian convent. She is beloved for her perseverance through situations that seemed hopeless.",
    themes: ["marriage", "relationships", "family", "grief", "anger", "discouragement", "hope"],
    emblem: { symbols: ["roses", "thorn"], colors: ["#FF6F61", "#FFC9A8"] },
  },
  {
    id: "thomas_more",
    name: "St. Thomas More",
    years: "1478–1535",
    feast: "June 22",
    region: "London, England",
    patronages: ["lawyers", "statesmen", "adopted children", "large families", "difficult marriages"],
    story:
      "A lawyer, scholar and Lord Chancellor of England, devoted father and witty friend, who refused to act against his conscience when King Henry VIII demanded it. He was executed in 1535, saying he died \"the King's good servant, but God's first.\"",
    themes: ["decisions", "work", "family", "fear", "faith"],
    emblem: { symbols: ["book", "key"], colors: ["#1FC8C0", "#FF7A1A"] },
  },
  {
    id: "bakhita",
    name: "St. Josephine Bakhita",
    years: "c. 1869–1947",
    feast: "February 8",
    region: "Darfur, Sudan; later Schio, Italy",
    patronages: ["survivors of slavery and human trafficking", "Sudan"],
    story:
      "Kidnapped as a child in Darfur and enslaved, she suffered terrible cruelty and forgot even her birth name; \"Bakhita\" (\"fortunate one\") was given by her captors. In Italy she encountered the faith, won her freedom in court, and became a Canossian sister known for her gentleness, deep joy and forgiveness.",
    themes: ["hope", "growth", "fear", "addiction", "faith", "peace", "sadness"],
    emblem: { symbols: ["chains_broken", "star"], colors: ["#1FC8C0", "#FF5FA2"] },
  },
  {
    id: "moses_black",
    name: "St. Moses the Black",
    years: "c. 330–405",
    feast: "August 28",
    region: "Egypt (Desert Fathers of Scetis)",
    patronages: ["nonviolence", "people seeking conversion", "often invoked in addiction recovery"],
    story:
      "An Ethiopian man who led a gang of robbers in Egypt before a dramatic conversion among the monks of the desert. He struggled for years with his past, became a humble and beloved spiritual father, and was known for refusing to judge others. He died a martyr, refusing to take up arms.",
    themes: ["addiction", "growth", "anger", "hope", "faith"],
    emblem: { symbols: ["palm", "chains_broken"], colors: ["#FF7A1A", "#1FC8C0"] },
  },
  {
    id: "matt_talbot",
    name: "Venerable Matt Talbot",
    years: "1856–1925",
    feast: "June 19 (commemoration)",
    region: "Dublin, Ireland",
    patronages: ["people struggling with alcoholism and addiction (popular devotion)"],
    story:
      "A Dublin laborer who began drinking heavily as a boy. At 28 he took a pledge of sobriety and kept it for 41 years through prayer, daily Mass and hard work. Declared Venerable in 1975 — not yet canonized — he is widely asked to intercede for people in recovery.",
    themes: ["addiction", "work", "growth", "discouragement"],
    emblem: { symbols: ["chains_broken", "flame"], colors: ["#1FC8C0", "#FF7A1A"] },
  },
  {
    id: "augustine",
    name: "St. Augustine of Hippo",
    years: "354–430",
    feast: "August 28",
    region: "Thagaste and Hippo, North Africa",
    patronages: ["theologians", "people seeking truth", "those struggling to change"],
    story:
      "A brilliant North African teacher who spent years restless, searching and resisting change before his conversion. As bishop of Hippo he became one of the Church's greatest teachers. His Confessions opens: \"You have made us for yourself, and our heart is restless until it rests in you.\"",
    themes: ["growth", "addiction", "confusion", "faith", "decisions", "inspiration"],
    emblem: { symbols: ["heart", "flame", "book"], colors: ["#FF6F61", "#1FC8C0"] },
  },
  {
    id: "martin_porres",
    name: "St. Martin de Porres",
    years: "1579–1639",
    feast: "November 3",
    region: "Lima, Peru",
    patronages: ["people of mixed race", "racial harmony", "healthcare workers", "the poor"],
    story:
      "Born to a Spanish nobleman and a freed Black woman of Panama, Martin faced prejudice and was first accepted by the Dominicans only as a lay helper. He cared for the sick, the poor and even animals with such tenderness that all of Lima came to love him.",
    themes: ["health", "loneliness", "work", "finances", "peace", "faith"],
    emblem: { symbols: ["broom", "dove"], colors: ["#1FC8C0", "#FFC9A8"] },
  },
  {
    id: "benedict_moor",
    name: "St. Benedict the Moor",
    years: "1526–1589",
    feast: "April 4",
    region: "Sicily, Italy",
    patronages: ["African Americans (popular devotion)", "cooks", "missions"],
    story:
      "Born in Sicily to enslaved Africans, Benedict was freed and lived as a hermit, then as a Franciscan friar. He worked as the community's cook and, though unable to read, was so wise and gentle that he was chosen as guardian of his friary.",
    themes: ["work", "peace", "growth", "loneliness"],
    emblem: { symbols: ["bread", "sun"], colors: ["#FF7A1A", "#FFC9A8"] },
  },
  {
    id: "perpetua_felicity",
    name: "Sts. Perpetua and Felicity",
    years: "died 203",
    feast: "March 7",
    region: "Carthage, North Africa",
    patronages: ["mothers", "expectant mothers", "courage"],
    story:
      "A young noblewoman nursing her infant and her pregnant enslaved companion, martyred together in Carthage. Perpetua's own prison diary survives — one of the earliest writings by a Christian woman — recording her visions, her love for her child and her courage.",
    themes: ["motherhood", "fear", "faith", "relationships"],
    emblem: { symbols: ["palm", "ladder"], colors: ["#FF5FA2", "#FF7A1A"] },
  },
  {
    id: "charles_lwanga",
    name: "St. Charles Lwanga and Companions",
    years: "died 1885–1887",
    feast: "June 3",
    region: "Buganda (present-day Uganda)",
    patronages: ["African Catholic youth", "converts", "courage"],
    story:
      "Young Christian pages at the royal court of Buganda who protected the boys in their care and refused to renounce their faith. Twenty-two Catholics were martyred, many burned at Namugongo, which is now one of Africa's great pilgrimage sites.",
    themes: ["fear", "faith", "inspiration", "growth"],
    emblem: { symbols: ["flame", "palm"], colors: ["#FF7A1A", "#FF5FA2"] },
  },
  {
    id: "katharine_drexel",
    name: "St. Katharine Drexel",
    years: "1858–1955",
    feast: "March 3",
    region: "Philadelphia, USA",
    patronages: ["racial justice", "philanthropists"],
    story:
      "A Philadelphia heiress who gave up a fortune to found the Sisters of the Blessed Sacrament, serving Black and Native American communities. She funded schools and missions across the US, including Xavier University of Louisiana.",
    themes: ["finances", "work", "inspiration", "decisions", "gratitude"],
    emblem: { symbols: ["sun", "book"], colors: ["#FFC9A8", "#1FC8C0"] },
  },
  {
    id: "cajetan",
    name: "St. Cajetan",
    years: "1480–1547",
    feast: "August 7",
    region: "Vicenza and Naples, Italy",
    patronages: ["job seekers", "the unemployed", "gamblers", "good fortune in work"],
    story:
      "A priest who co-founded the Theatines and started charitable pawnshops (monti di pietà) to protect the poor from loan sharks. He trusted Providence completely and is widely invoked, especially in Latin America, by people looking for work.",
    themes: ["work", "finances", "hope", "discouragement"],
    emblem: { symbols: ["wheat", "sun"], colors: ["#FF7A1A", "#1FC8C0"] },
  },
  {
    id: "jude",
    name: "St. Jude Thaddeus",
    years: "1st century",
    feast: "October 28",
    region: "Galilee",
    patronages: ["desperate situations", "lost causes", "hospitals"],
    story:
      "One of the Twelve Apostles. By tradition he preached the Gospel and was martyred. Because his name resembled Judas, he was long overlooked — and so the faithful came to turn to him when they felt they had nowhere else to go.",
    themes: ["hope", "discouragement", "finances", "health", "fear", "overwhelm"],
    emblem: { symbols: ["flame", "medallion"], colors: ["#1FC8C0", "#FF6F61"] },
  },
  {
    id: "dymphna",
    name: "St. Dymphna",
    years: "7th century",
    feast: "May 15",
    region: "Ireland; Geel, Belgium",
    patronages: ["mental health", "anxiety and depression", "caregivers of the mentally ill"],
    story:
      "By tradition an Irish princess who fled to Belgium to escape her father's abuse and was martyred there. In the town of Geel, devotion to her grew into a centuries-old tradition of families welcoming people with mental illness into their homes.",
    themes: ["anxiety", "sadness", "fear", "family", "overwhelm", "health"],
    emblem: { symbols: ["lily", "lamp"], colors: ["#1FC8C0", "#FF5FA2"] },
  },
  {
    id: "padre_pio",
    name: "St. Pio of Pietrelcina (Padre Pio)",
    years: "1887–1968",
    feast: "September 23",
    region: "San Giovanni Rotondo, Italy",
    patronages: ["civil defense volunteers", "adolescents", "stress relief (popular devotion)"],
    story:
      "A Capuchin friar who spent long hours hearing confessions, founded a major hospital and carried physical and spiritual suffering for decades. His well-known counsel: \"Pray, hope, and don't worry.\"",
    themes: ["anxiety", "overwhelm", "health", "fear", "peace"],
    emblem: { symbols: ["rosary", "dove"], colors: ["#FF6F61", "#1FC8C0"] },
  },
  {
    id: "therese",
    name: "St. Thérèse of Lisieux",
    years: "1873–1897",
    feast: "October 1",
    region: "Lisieux, France",
    patronages: ["missions", "florists", "those with illness", "people who feel small"],
    story:
      "A Carmelite nun who died at 24 of tuberculosis, and a Doctor of the Church. Her \"Little Way\" teaches that ordinary moments, offered with love, are holy. In her final months she also experienced a profound darkness of faith, and kept loving anyway.",
    themes: ["growth", "faith", "health", "sadness", "discouragement", "peace", "gratitude"],
    emblem: { symbols: ["roses", "cross"], colors: ["#FF5FA2", "#FFC9A8"] },
  },
  {
    id: "teresa_avila",
    name: "St. Teresa of Ávila",
    years: "1515–1582",
    feast: "October 15",
    region: "Ávila, Spain",
    patronages: ["people with headaches and illness", "those seeking prayer", "Spanish writers"],
    story:
      "A Carmelite reformer, mystic and Doctor of the Church who wrote The Interior Castle. Practical, funny and deeply prayerful, she struggled with illness all her life. Her short prayer begins: \"Let nothing disturb you, let nothing frighten you; all things are passing; God never changes.\"",
    themes: ["anxiety", "peace", "faith", "growth", "health", "confusion"],
    emblem: { symbols: ["heart", "castle"], colors: ["#1FC8C0", "#FF7A1A"] },
  },
  {
    id: "john_cross",
    name: "St. John of the Cross",
    years: "1542–1591",
    feast: "December 14",
    region: "Spain",
    patronages: ["mystics", "contemplatives", "people in spiritual darkness"],
    story:
      "A Carmelite friar and poet, imprisoned by his own order for his reforms, who wrote some of the most beautiful poetry in Spanish in a dark cell. He teaches that the \"dark night\" is not abandonment but a hidden way God draws the soul close.",
    themes: ["sadness", "confusion", "faith", "loneliness", "discouragement"],
    emblem: { symbols: ["moon", "ladder"], colors: ["#1FC8C0", "#FF5FA2"] },
  },
  {
    id: "teresa_calcutta",
    name: "St. Teresa of Calcutta",
    years: "1910–1997",
    feast: "September 5",
    region: "Skopje; Kolkata, India",
    patronages: ["Missionaries of Charity", "those who serve the dying", "World Youth Day"],
    story:
      "Founder of the Missionaries of Charity, who served the poorest of the poor. Her letters revealed that for decades she felt deep spiritual darkness and absence of God — and kept choosing love and service. She shows that faith can be faithful even when it feels empty.",
    themes: ["loneliness", "sadness", "work", "faith", "discouragement"],
    emblem: { symbols: ["lamp", "heart"], colors: ["#1FC8C0", "#FFC9A8"] },
  },
  {
    id: "peregrine",
    name: "St. Peregrine Laziosi",
    years: "c. 1260–1345",
    feast: "May 4 (Servite calendar)",
    region: "Forlì, Italy",
    patronages: ["people with cancer", "serious illness"],
    story:
      "A Servite friar who developed a painful cancerous wound in his leg. Facing amputation, he prayed through the night and, according to tradition, was healed. He is invoked by people facing cancer and serious illness.",
    themes: ["health", "fear", "hope"],
    emblem: { symbols: ["cross", "dove"], colors: ["#FF6F61", "#1FC8C0"] },
  },
  {
    id: "bernadette",
    name: "St. Bernadette Soubirous",
    years: "1844–1879",
    feast: "April 16",
    region: "Lourdes, France",
    patronages: ["the sick", "poverty", "people ridiculed for their faith"],
    story:
      "A poor, often sick miller's daughter to whom the Virgin Mary appeared at Lourdes in 1858. Doubted and questioned, she remained simple and honest. She later became a sister at Nevers and lived with chronic illness, saying her job was to be ill.",
    themes: ["health", "finances", "faith", "loneliness"],
    emblem: { symbols: ["water", "roses"], colors: ["#1FC8C0", "#FFC9A8"] },
  },
  {
    id: "elizabeth_seton",
    name: "St. Elizabeth Ann Seton",
    years: "1774–1821",
    feast: "January 4",
    region: "New York and Maryland, USA",
    patronages: ["widows", "grieving parents", "Catholic schools"],
    story:
      "A New York socialite, wife and mother of five, widowed at 29 after her husband's business failed. Converting to Catholicism, she founded the Sisters of Charity and the first free Catholic school in the US. She also buried two daughters and knew grief intimately.",
    themes: ["grief", "motherhood", "finances", "family", "work", "hope"],
    emblem: { symbols: ["book", "star"], colors: ["#FF7A1A", "#1FC8C0"] },
  },
  {
    id: "ignatius",
    name: "St. Ignatius of Loyola",
    years: "1491–1556",
    feast: "July 31",
    region: "Basque Country, Spain",
    patronages: ["discernment", "soldiers", "retreats", "the Society of Jesus"],
    story:
      "A soldier whose ambitions ended with a cannonball wound. During his recovery he noticed which daydreams left him consoled and which left him empty, and built that insight into the Spiritual Exercises — a method of discernment still used worldwide.",
    themes: ["decisions", "confusion", "growth", "work", "inspiration"],
    emblem: { symbols: ["flame", "book"], colors: ["#FF7A1A", "#FF5FA2"] },
  },
  {
    id: "francis",
    name: "St. Francis of Assisi",
    years: "1181/82–1226",
    feast: "October 4",
    region: "Assisi, Italy",
    patronages: ["ecology", "animals", "peace", "the poor"],
    story:
      "A wealthy merchant's son who gave everything away to live in joyful poverty. He saw all creation as family — Brother Sun, Sister Moon — and composed the Canticle of the Creatures, a song of praise and gratitude, near the end of his life when he was ill and nearly blind.",
    themes: ["gratitude", "peace", "finances", "inspiration", "growth"],
    emblem: { symbols: ["sun", "dove", "moon"], colors: ["#FF7A1A", "#1FC8C0"] },
  },
  {
    id: "mary_magdalene",
    name: "St. Mary Magdalene",
    years: "1st century",
    feast: "July 22",
    region: "Magdala, Galilee",
    patronages: ["converts", "people seeking a new start", "contemplatives"],
    story:
      "A disciple whom Jesus freed from seven demons, who supported his ministry and stayed at the foot of the cross. She was the first witness of the Resurrection and was sent to tell the others, which is why the Church calls her the \"Apostle to the Apostles.\"",
    themes: ["grief", "growth", "addiction", "hope", "inspiration"],
    emblem: { symbols: ["jar", "sun"], colors: ["#FF5FA2", "#FF7A1A"] },
  },
  {
    id: "thomas_apostle",
    name: "St. Thomas the Apostle",
    years: "1st century",
    feast: "July 3",
    region: "Galilee; by tradition, India",
    patronages: ["people who doubt", "architects", "India"],
    story:
      "The apostle who said he would not believe in the Resurrection until he saw the wounds — and then made the great confession, \"My Lord and my God!\" Tradition holds he carried the Gospel as far as India. He is a companion for honest questions.",
    themes: ["confusion", "faith", "decisions", "fear"],
    emblem: { symbols: ["hand", "star"], colors: ["#1FC8C0", "#FF7A1A"] },
  },
  {
    id: "anthony",
    name: "St. Anthony of Padua",
    years: "1195–1231",
    feast: "June 13",
    region: "Lisbon, Portugal; Padua, Italy",
    patronages: ["lost things", "the poor", "travelers"],
    story:
      "A Portuguese Franciscan and powerful preacher, and a Doctor of the Church. \"St. Anthony's Bread\" — alms given to the poor in thanksgiving for prayers answered — continues his love for the hungry.",
    themes: ["finances", "confusion", "hope", "gratitude"],
    emblem: { symbols: ["lily", "bread", "book"], colors: ["#FFC9A8", "#1FC8C0"] },
  },
  {
    id: "faustina",
    name: "St. Faustina Kowalska",
    years: "1905–1938",
    feast: "October 5",
    region: "Kraków, Poland",
    patronages: ["Divine Mercy", "people seeking forgiveness"],
    story:
      "A Polish sister with little formal education who recorded in her Diary the message of Divine Mercy, including the prayer \"Jesus, I trust in You.\" She died of tuberculosis at 33. Her message gave rise to the Divine Mercy Chaplet and Divine Mercy Sunday.",
    themes: ["anxiety", "fear", "hope", "growth", "addiction", "peace"],
    emblem: { symbols: ["rays", "heart"], colors: ["#FF6F61", "#1FC8C0"] },
  },
  {
    id: "kateri",
    name: "St. Kateri Tekakwitha",
    years: "1656–1680",
    feast: "July 14",
    region: "Mohawk homeland (New York); Kahnawake (Quebec)",
    patronages: ["ecology", "Indigenous peoples", "people who are rejected for their faith"],
    story:
      "A Mohawk and Algonquin woman left scarred and partly blind by smallpox, which killed her parents. She embraced the faith despite opposition, prayed among the woods and rivers, and was canonized in 2012 as the first Indigenous saint of North America.",
    themes: ["loneliness", "health", "faith", "peace", "grief"],
    emblem: { symbols: ["lily", "cross"], colors: ["#1FC8C0", "#FF7A1A"] },
  },
  // Angels: shown with wings (saints get halos only). The archangels are honored with the saints.
  {
    id: "michael",
    kind: "angel",
    name: "St. Michael the Archangel",
    years: "Archangel",
    feast: "September 29",
    region: "Named in Daniel, Jude and Revelation",
    patronages: ["protection", "spiritual battle", "police and first responders", "the sick"],
    story:
      "The archangel whose name means \"Who is like God?\" Scripture shows him as the protector of God's people, who casts down the forces of evil. The Church has long prayed to him for protection against harm, fear and temptation.",
    themes: ["fear", "anxiety", "addiction", "family", "overwhelm"],
    emblem: { symbols: ["sword", "scales"], colors: ["#1FC8C0", "#E8364F"] },
  },
  {
    id: "raphael",
    kind: "angel",
    name: "St. Raphael the Archangel",
    years: "Archangel",
    feast: "September 29",
    region: "Named in the Book of Tobit",
    patronages: ["healing", "travelers", "the blind", "finding a spouse"],
    story:
      "His name means \"God heals.\" In the Book of Tobit he travels in disguise with young Tobias, protects him on the road, helps him find his wife Sarah, and brings healing to Tobias's blind father.",
    themes: ["health", "fear", "relationships", "marriage", "decisions", "loneliness"],
    emblem: { symbols: ["fish", "water"], colors: ["#1FC8C0", "#A98BEA"] },
  },
  {
    id: "gabriel",
    kind: "angel",
    name: "St. Gabriel the Archangel",
    years: "Archangel",
    feast: "September 29",
    region: "Named in Daniel and Luke",
    patronages: ["messengers", "communication", "expectant mothers (popular devotion)"],
    story:
      "His name means \"God is my strength.\" Gabriel announced the birth of John the Baptist to Zechariah and brought Mary the news that she would be the Mother of God: \"Do not be afraid.\"",
    themes: ["motherhood", "decisions", "fear", "inspiration", "hope"],
    emblem: { symbols: ["lily", "star"], colors: ["#FF5FA2", "#FFC9A8"] },
  },
  {
    id: "guardian_angel",
    kind: "angel",
    name: "Your Guardian Angel",
    years: "Angel",
    feast: "October 2",
    region: "Matthew 18:10; Psalm 91:11",
    patronages: ["protection", "children", "those who feel alone"],
    story:
      "The Church teaches that every person has an angel to guard and guide them. Jesus speaks of the angels of little ones who always behold the face of the Father. The traditional prayer begins: \"Angel of God, my guardian dear.\"",
    themes: ["fear", "loneliness", "parenting", "anxiety", "family"],
    emblem: { symbols: ["hand", "star"], colors: ["#A98BEA", "#1FC8C0"] },
  },
];

export const SAINT_IDS = SAINTS.map((s) => s.id);
export const saintById = (id) => SAINTS.find((s) => s.id === id);

// Saint of the day: a feast today, else an upcoming feast this week, else a daily companion.
const MONTHS = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
function feastDate(feast, year) {
  const m = String(feast || "").toLowerCase().match(/(january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{1,2})/);
  return m ? new Date(year, MONTHS.indexOf(m[1]), Number(m[2])) : null;
}
export function saintOfDay(now = new Date()) {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let best = null;
  for (const s of SAINTS) {
    let d = feastDate(s.feast, today.getFullYear());
    if (!d) continue;
    if (d < today) d = feastDate(s.feast, today.getFullYear() + 1);
    const days = Math.round((d - today) / 864e5);
    if (!best || days < best.days) best = { saint: s, days };
  }
  if (best && best.days === 0) return { saint: best.saint, label: "Feast day today" };
  if (best && best.days <= 6) return { saint: best.saint, label: best.days === 1 ? "Feast day tomorrow" : `Feast day in ${best.days} days` };
  const dayIndex = Math.floor(today.getTime() / 864e5);
  return { saint: SAINTS[dayIndex % SAINTS.length], label: "A saint to walk with today" };
}
