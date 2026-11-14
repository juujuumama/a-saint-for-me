// Traditional Catholic prayers and devotions. These are shown VERBATIM from this
// file and are always labeled "Traditional prayer" — never AI-written.
// kind: "prayer" (full text included), "rosary" (a set of mysteries), "devotion"
// (described, with a link to an authoritative source for the full text).

export const DEVOTIONS = [
  {
    id: "memorare", kind: "prayer", title: "The Memorare",
    themes: ["hope", "discouragement", "motherhood", "fear", "overwhelm", "sadness"],
    text: "Remember, O most gracious Virgin Mary, that never was it known that anyone who fled to thy protection, implored thy help, or sought thine intercession was left unaided. Inspired by this confidence, I fly unto thee, O Virgin of virgins, my Mother. To thee do I come; before thee I stand, sinful and sorrowful. O Mother of the Word Incarnate, despise not my petitions, but in thy mercy hear and answer me. Amen.",
  },
  {
    id: "hail_holy_queen", kind: "prayer", title: "Hail, Holy Queen (Salve Regina)",
    themes: ["sadness", "grief", "motherhood", "hope"],
    text: "Hail, holy Queen, Mother of mercy, our life, our sweetness and our hope. To thee do we cry, poor banished children of Eve. To thee do we send up our sighs, mourning and weeping in this valley of tears. Turn then, most gracious advocate, thine eyes of mercy toward us, and after this our exile show unto us the blessed fruit of thy womb, Jesus. O clement, O loving, O sweet Virgin Mary. Pray for us, O holy Mother of God, that we may be made worthy of the promises of Christ. Amen.",
  },
  {
    id: "st_michael", kind: "prayer", title: "Prayer to St. Michael the Archangel",
    themes: ["fear", "addiction", "family", "anxiety"],
    text: "St. Michael the Archangel, defend us in battle. Be our protection against the wickedness and snares of the devil. May God rebuke him, we humbly pray; and do thou, O Prince of the heavenly host, by the power of God, cast into hell Satan and all the evil spirits who prowl about the world seeking the ruin of souls. Amen.",
  },
  {
    id: "anima_christi", kind: "prayer", title: "Anima Christi",
    themes: ["health", "faith", "growth", "fear"],
    text: "Soul of Christ, sanctify me. Body of Christ, save me. Blood of Christ, inebriate me. Water from the side of Christ, wash me. Passion of Christ, strengthen me. O good Jesus, hear me. Within thy wounds hide me. Permit me not to be separated from thee. From the wicked foe defend me. At the hour of my death call me, and bid me come to thee, that with thy saints I may praise thee for ever and ever. Amen.",
  },
  {
    id: "suscipe", kind: "prayer", title: "Suscipe of St. Ignatius",
    themes: ["decisions", "growth", "confusion", "faith"],
    text: "Take, Lord, and receive all my liberty, my memory, my understanding, and my entire will, all I have and call my own. You have given all to me. To you, Lord, I return it. Everything is yours; do with it what you will. Give me only your love and your grace. That is enough for me.",
  },
  {
    id: "teresa_bookmark", kind: "prayer", title: "St. Teresa of Ávila's Bookmark",
    themes: ["anxiety", "peace", "overwhelm", "fear"],
    text: "Let nothing disturb you, let nothing frighten you. All things are passing away; God never changes. Patience obtains all things. Whoever has God lacks nothing; God alone suffices.",
  },
  {
    id: "peace_prayer", kind: "prayer", title: "Peace Prayer (traditionally attributed to St. Francis)",
    themes: ["relationships", "anger", "peace", "family", "inspiration"],
    note: "First published anonymously in 1912; long associated with Franciscan spirituality.",
    text: "Lord, make me an instrument of your peace: where there is hatred, let me sow love; where there is injury, pardon; where there is doubt, faith; where there is despair, hope; where there is darkness, light; where there is sadness, joy. O divine Master, grant that I may not so much seek to be consoled as to console, to be understood as to understand, to be loved as to love. For it is in giving that we receive, it is in pardoning that we are pardoned, and it is in dying that we are born to eternal life. Amen.",
  },
  {
    id: "eternal_rest", kind: "prayer", title: "Eternal Rest",
    themes: ["grief"],
    text: "Eternal rest grant unto them, O Lord, and let perpetual light shine upon them. May they rest in peace. May their souls and the souls of all the faithful departed, through the mercy of God, rest in peace. Amen.",
  },
  {
    id: "act_of_hope", kind: "prayer", title: "Act of Hope",
    themes: ["hope", "discouragement", "finances", "work"],
    text: "O my God, relying on your almighty power and infinite mercy and promises, I hope to obtain pardon of my sins, the help of your grace, and life everlasting, through the merits of Jesus Christ, my Lord and Redeemer. Amen.",
  },
  {
    id: "jesus_prayer", kind: "prayer", title: "The Jesus Prayer",
    themes: ["anxiety", "addiction", "overwhelm", "peace"],
    text: "Lord Jesus Christ, Son of God, have mercy on me, a sinner.",
    note: "An ancient prayer of the Christian East, prayed slowly with the breath.",
  },
  {
    id: "glory_be", kind: "prayer", title: "Glory Be",
    themes: ["gratitude", "inspiration", "peace"],
    text: "Glory be to the Father, and to the Son, and to the Holy Spirit, as it was in the beginning, is now, and ever shall be, world without end. Amen.",
  },
  {
    id: "act_of_contrition", kind: "prayer", title: "Act of Contrition",
    themes: ["addiction", "growth", "anger", "relationships"],
    text: "O my God, I am heartily sorry for having offended you, and I detest all my sins because of your just punishments, but most of all because they offend you, my God, who are all good and deserving of all my love. I firmly resolve, with the help of your grace, to sin no more and to avoid the near occasion of sin. Amen.",
  },

  // Rosary
  { id: "rosary_joyful", kind: "rosary", title: "The Joyful Mysteries", days: "Mondays and Saturdays", themes: ["motherhood", "parenting", "family", "gratitude", "inspiration"], mysteries: ["The Annunciation", "The Visitation", "The Nativity", "The Presentation in the Temple", "The Finding in the Temple"] },
  { id: "rosary_sorrowful", kind: "rosary", title: "The Sorrowful Mysteries", days: "Tuesdays and Fridays", themes: ["grief", "sadness", "health", "addiction", "fear", "anger"], mysteries: ["The Agony in the Garden", "The Scourging at the Pillar", "The Crowning with Thorns", "The Carrying of the Cross", "The Crucifixion"] },
  { id: "rosary_glorious", kind: "rosary", title: "The Glorious Mysteries", days: "Wednesdays and Sundays", themes: ["hope", "grief", "growth", "inspiration", "faith"], mysteries: ["The Resurrection", "The Ascension", "The Descent of the Holy Spirit", "The Assumption", "The Coronation of Mary"] },
  { id: "rosary_luminous", kind: "rosary", title: "The Luminous Mysteries", days: "Thursdays", themes: ["decisions", "marriage", "relationships", "confusion", "work"], mysteries: ["The Baptism in the Jordan", "The Wedding at Cana", "The Proclamation of the Kingdom", "The Transfiguration", "The Institution of the Eucharist"] },

  // Devotions & novenas (described; full texts via link)
  { id: "divine_mercy_chaplet", kind: "devotion", title: "The Divine Mercy Chaplet", themes: ["anxiety", "fear", "addiction", "health", "grief", "hope"], description: "Prayed on ordinary rosary beads, traditionally at 3 p.m., the hour of mercy. On each bead: \"For the sake of His sorrowful Passion, have mercy on us and on the whole world.\" It takes about seven minutes.", url: "https://www.thedivinemercy.org/message/devotions/chaplet" },
  { id: "novena_st_jude", kind: "devotion", title: "Novena to St. Jude", themes: ["hope", "discouragement", "finances", "health"], description: "Nine days of prayer asking the intercession of the patron of situations that feel impossible. Many parishes and shrines publish a traditional form.", url: "https://www.shrineofstjude.org/" },
  { id: "novena_st_joseph", kind: "devotion", title: "Novena to St. Joseph", themes: ["work", "finances", "family", "parenting", "decisions"], description: "Nine days entrusting work, provision and home life to St. Joseph — traditionally prayed March 10–18, before his feast, but it can be prayed any time.", url: "https://www.usccb.org/prayers" },
  { id: "surrender_novena", kind: "devotion", title: "The Surrender Novena (Fr. Dolindo Ruotolo)", themes: ["anxiety", "overwhelm", "fear", "decisions"], description: "A nine-day novena of surrender with a simple refrain: \"O Jesus, I surrender myself to you; take care of everything.\" Good for times when you can't fix what you're carrying.", url: "https://www.catholic.com/" },
  { id: "examen", kind: "devotion", title: "The Daily Examen", themes: ["decisions", "growth", "confusion", "gratitude", "work"], description: "St. Ignatius's short evening prayer: become aware of God's presence, review the day with gratitude, notice your feelings, choose one moment to pray from, and look toward tomorrow. About ten to fifteen minutes.", url: "https://www.ignatianspirituality.com/ignatian-prayer/the-examen/" },
  { id: "lectio_divina", kind: "devotion", title: "Lectio Divina", themes: ["faith", "peace", "confusion", "inspiration"], description: "Slow, prayerful reading of a short Scripture passage: read, meditate, pray, and rest in contemplation. Try it with today's passage.", url: "https://www.usccb.org/prayer-and-worship/prayers-and-devotions/lectio-divina" },
  { id: "rosary_seven_sorrows", kind: "devotion", title: "The Seven Sorrows of Mary (Servite Rosary)", themes: ["grief", "motherhood", "sadness", "parenting"], description: "A meditation on seven sorrows of the Blessed Mother, from Simeon's prophecy to the burial of Jesus. A companion for anyone whose heart has been pierced by love for someone.", url: "https://www.usccb.org/prayers" },
  { id: "litany_humility", kind: "devotion", title: "Litany of Humility", themes: ["relationships", "growth", "anger", "work"], description: "A litany asking to be freed from the desire to be esteemed and the fear of being forgotten. Helpful for self-worth that rests on God rather than others' opinions.", url: "https://www.usccb.org/prayers" },
  { id: "gratitude_te_deum", kind: "devotion", title: "The Te Deum", themes: ["gratitude", "inspiration"], description: "The Church's ancient hymn of thanksgiving (\"We praise you, O God\"), traditionally sung on occasions of great gratitude.", url: "https://www.usccb.org/prayers" },
  { id: "sacrament_reconciliation", kind: "devotion", title: "The Sacrament of Reconciliation", themes: ["addiction", "growth", "anger", "relationships", "peace"], description: "If something weighs on your conscience, Confession is a place of mercy, not judgment. Parishes list regular times; many priests welcome appointments.", url: "https://www.usccb.org/prayer-and-worship/sacraments-and-sacramentals/penance" },
  { id: "anointing_sick", kind: "devotion", title: "Anointing of the Sick", themes: ["health"], description: "A sacrament of strength and healing for anyone facing serious illness, surgery or the frailty of age. Call your parish to ask a priest.", url: "https://www.usccb.org/prayer-and-worship/sacraments-and-sacramentals/anointing-of-the-sick" },
];

export const DEVOTION_IDS = DEVOTIONS.map((d) => d.id);
export const devotionById = (id) => DEVOTIONS.find((d) => d.id === id);
