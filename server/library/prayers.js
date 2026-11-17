// Hand-written prayer library for the built-in (no-AI) composer.
// Built around the intentions people most often bring to prayer. Each intention has
// its own words, saints, Scripture and devotions; pieces are combined so prayers
// rarely repeat. Placeholders in "other" text: {who} (e.g. "my mom"), {them}, {their}, {they}.
// Please have a priest or catechist review before launch.

export const INTENTS = [
  {
    id: "abuse", noFallback: true, themes: ["fear", "family"],
    keywords: ["abuse", "abusive", "abused", "hits me", "hit me", "beats me", "chokes me", "not safe at home", "afraid of my husband", "afraid of my boyfriend", "afraid of my partner", "afraid of my wife", "domestic violence", "threatens me", "controlling", "he hurts me", "she hurts me"],
    saints: ["rita", "bakhita", "michael"], scripture: ["ps27_10", "is41_10", "ps34_18"], devotions: ["st_michael", "memorare"],
    title: ["A prayer for safety", "A prayer for courage and safety"],
    opening: ["It is never God's will for you to be harmed. You deserve to be safe, and reaching out for help is right and good.", "What's happening is not your fault. Your safety matters more than keeping the peace."],
    self: [
      "Lord, You see what is happening to me, and You do not want me to be hurt. Protect me. Give me courage to tell someone I trust, wisdom to make a plan, and safe people and places to turn to. Free me from the lie that I deserve this, and lead me into safety and peace.",
      "God my refuge, hide me in the shadow of Your wings. Surround me and anyone in my care with Your protection. Give me strength to take the next step toward safety, and let me never confuse Your will with someone else's control.",
    ],
    reflection: ["Reaching out is brave. The National Domestic Violence Hotline (1-800-799-7233) is free and confidential, any hour.", "You are not alone, and you are not to blame. Tell one safe person today."],
  },
  {
    id: "difficult", noFallback: true, themes: ["family", "relationships", "anger"],
    hooks: { monica: "who loved a difficult family with patience", rita: "who kept her peace in a hard home" },
    keywords: ["narcissis", "toxic", "manipulat", "gaslight", "selfish", "self-centered", "self centered", "guilt trip", "guilt-trip", "boundaries", "boundary", "controlling mother", "controlling father", "controlling mom", "controlling dad", "my in-laws", "mother-in-law", "father-in-law", "never apologizes", "always about them", "always about her", "always about him", "walk on eggshells", "walking on eggshells", "emotionally draining", "difficult person", "difficult family", "my difficult"],
    saints: ["monica", "rita", "teresa_avila"], scripture: ["rom12_18", "mt10_16", "prov4_23"], devotions: ["surrender_novena", "peace_prayer", "memorare"],
    title: ["A prayer for dealing with a difficult person", "A prayer for boundaries and peace"],
    titleOther: "A prayer about {who}",
    opening: ["Loving a selfish or manipulative person is exhausting. Honoring your family doesn't mean accepting mistreatment.", "It's okay to protect your peace. Boundaries can be an act of love, for them and for you."],
    openingOther: ["Loving {who} when {they} {are} hard to be around takes so much. Let's bring it to God honestly.", "Honoring family doesn't mean accepting mistreatment. Let's ask for wisdom with {who}."],
    self: [
      "Lord, You see how this person treats me, and how much it costs me. Give me clear eyes to see what is true when I'm being twisted or blamed, and the courage to set boundaries without guilt. Teach me to love without losing myself, to be kind without being used, and to let go of the hope that I can change them.",
      "Jesus, You knew when to speak and when to walk away. Give me that wisdom. Guard my heart, quiet the voice that says I'm the problem, and help me respond with calm instead of reacting. Heal the old wounds this relationship keeps reopening, and bless them in the ways only You can.",
      "Holy Spirit, I'm tired of walking on eggshells. Show me where my responsibility ends and theirs begins. Help me honor them without enabling them, forgive without pretending nothing happened, and find peace that doesn't depend on their approval.",
    ],
    other: [
      "Lord, You know {who} and everything that has made {them} the way {they} {are}. Soften {their} heart and open {their} eyes to how {their} words and actions affect others. And give me wisdom with {them}: clear boundaries, a calm spirit, and the freedom to love {them} without being controlled.",
      "Jesus, I lift up {who} to You. Heal what is wounded in {them}, the hurt that makes {them} hurt others. Protect my heart and my peace, help me speak the truth in love, and let me stop carrying responsibility for {their} choices.",
    ],
    reflection: ["A boundary isn't a punishment. It's telling the truth about what you can carry.", "You can pray for someone and still keep your distance. Both can be love."],
  },
  {
    id: "suicideloss", noFallback: true, themes: ["grief", "sadness"],
    keywords: ["died by suicide", "took his own life", "took her own life", "took their own life", "killed himself", "killed herself", "lost to suicide", "committed suicide", "suicide loss"],
    saints: ["monica", "elizabeth_seton", "dymphna"], scripture: ["rom8_38", "ps34_18", "rev21_4"], devotions: ["eternal_rest", "divine_mercy_chaplet", "rosary_seven_sorrows"],
    title: ["A prayer after a suicide loss"],
    titleOther: "A prayer for {who}",
    opening: ["Losing someone to suicide brings a grief like no other. The Church does not despair for them, and neither should you.", "There is no shame here, only love and loss. God's mercy is deeper than we can imagine."],
    openingOther: ["The Church prays for those who have taken their own lives and trusts in God's mercy. Let's pray for {who}.", "Nothing can separate {who} from the love of God. Let's entrust {them} to that love."],
    self: [
      "Merciful God, I am devastated and full of questions. The Church teaches that we should not despair of the salvation of those who have taken their own lives, for You can reach them in ways known to You alone. I entrust the one I love to Your mercy. Heal my guilt and my what-ifs, and hold me in this grief.",
    ],
    other: [
      "Merciful God, I entrust {who} to You. You knew {their} pain better than anyone. In ways known to You alone, reach {them} with Your mercy and bring {them} into Your peace, where there is no more suffering. Heal the guilt and the what-ifs in me, and hold all of us who loved {them}.",
      "Lord Jesus, nothing can separate {who} from Your love, not death, not despair, not the darkness {they} could not escape. Receive {them} gently. Comfort everyone who misses {them}, and let {their} memory be held in tenderness, not shame.",
    ],
    reflection: ["It wasn't your fault. Grief after suicide carries questions; you don't have to answer them alone. Consider a suicide-loss support group.", "Speak their name with love. Their life was more than how it ended."],
  },
  {
    id: "dying", noFallback: true, themes: ["grief", "health", "fear"], hooks: { joseph: "patron of a happy death" },
    keywords: ["dying", "end of life", "last days", "hospice", "palliative", "won't make it", "not going to make it", "on a ventilator", "life support", "days to live", "weeks to live", "deathbed"],
    saints: ["joseph", "raphael", "faustina"], scripture: ["ps23_1", "jn14_27", "ps116_15"], devotions: ["divine_mercy_chaplet", "anointing_sick", "anima_christi"],
    title: ["A prayer for a peaceful death", "A prayer at the bedside"],
    titleOther: "A prayer for {who} at the end of life",
    opening: ["Keeping vigil is one of the holiest things we do for each other. God is in this room.", "These are tender, sacred days. Let's ask for peace."],
    openingOther: ["Keeping vigil for {who} is a sacred act of love. Let's pray for {them} and for you.", "St. Joseph died in the arms of Jesus and Mary. Let's ask that kind of peace for {who}."],
    self: [
      "Lord Jesus, I am facing the end of my life, and I am afraid and also tired. Forgive me, hold me, and give me peace. Let me make my peace with the people I love, receive the sacraments, and rest in Your mercy. Into Your hands I commend my spirit.",
    ],
    other: [
      "Lord Jesus, I entrust {who} to You in these last days. Ease {their} pain, calm {their} fears, and surround {them} with peace. Let {them} receive the sacraments and feel how loved {they} {are}. When the time comes, welcome {them} home, and comfort us who must say goodbye.",
      "St. Joseph, patron of a happy death, pray for {who}. Lord, let {their} passing be gentle, free from fear and pain. Give us words of love and forgiveness while there is time, and the grace to let {them} go into Your arms.",
    ],
    reflection: ["Say what matters: thank you, I love you, I forgive you, please forgive me. Ask for a priest for the Anointing of the Sick.", "Presence is enough. You don't have to find perfect words."],
  },
  {
    id: "sickchild", noFallback: true, themes: ["parenting", "health", "fear"],
    keywords: ["nicu", "picu", "pediatric", "children's hospital", "my child is sick", "my son is sick", "my daughter is sick", "my baby is sick", "special needs", "autism", "autistic", "down syndrome", "disability", "disabilities", "developmental delay", "seizures", "~my son has", "~my daughter has", "~my child has", "~my baby has"],
    saints: ["gianna", "raphael", "martin_porres"], scripture: ["mk10_14", "is49_15", "is43_2"], devotions: ["memorare", "anointing_sick"],
    title: ["A prayer for my child", "A prayer for a sick child"],
    titleOther: "A prayer for {who}",
    opening: ["Nothing shakes a parent like a child who is suffering. God holds your child even when you can't fix it.", "You are carrying so much. Let's bring your little one to Jesus."],
    openingOther: ["Let's bring {who} to Jesus, who welcomed the little children.", "God loves {who} even more than you do. Let's place {them} in His arms."],
    self: [
      "Jesus, You welcomed the little children and laid Your hands on them. Lay Your hands on my child now. Heal, comfort and protect them. Guide their doctors and therapists, give me strength for the long days and nights, and let my child always know how fiercely they are loved.",
    ],
    other: [
      "Jesus, You welcomed the little children and blessed them. Bless {who} now. Heal {their} body, comfort {their} fears, and give {them} peaceful rest. Guide everyone who cares for {them}, and give our family strength, patience and hope.",
      "Loving Father, You made {who} exactly as {they} {are}, wonderfully and with purpose. Protect {them}, help {them} flourish, and surround {them} with people who see {their} gifts. Give me wisdom, endurance and joy as I love {them}.",
    ],
    reflection: ["Take care of yourself too. Rest when you can, and accept help when it's offered.", "Your child is a gift, not a problem to solve. Delight in one small thing about them today."],
  },
  {
    id: "cancer", themes: ["health", "fear"],
    keywords: ["cancer", "chemo", "tumor", "tumour", "radiation", "oncolog", "malignant", "leukemia", "lymphoma", "metasta", "mastectomy", "carcinoma", "melanoma", "stage 4", "stage four"],
    saints: ["peregrine", "raphael", "padre_pio"], scripture: ["jer17_14", "is41_10"], devotions: ["anointing_sick", "divine_mercy_chaplet"],
    title: ["A prayer for healing", "A prayer before treatment", "A prayer in illness"],
    titleOther: "A prayer for {who}'s healing",
    opening: ["A diagnosis or a surgery can make the ground feel like it's moving. You don't have to be brave alone.", "This is a lot to carry. Let's bring it to the One who heals."],
    openingOther: ["Carrying someone you love through illness is holy, exhausting love. Let's bring {them} to God together.", "It's a gift to {who} that you're praying. Let's place {them} in God's hands."],
    self: [
      "Lord Jesus, You laid Your hands on the sick and they were made well. I bring You my body, my test results, and every appointment ahead. Guide the hands and minds of my doctors and nurses. Give me strength for each treatment, rest in the waiting, and courage when the news is hard.",
      "Divine Physician, I am afraid of what my body is going through. Heal me, if it is Your will, and hold me through every step of this. Let me feel Your presence in the waiting rooms and the long nights, and surround me with people who will carry me when I cannot carry myself.",
    ],
    other: [
      "Lord Jesus, You healed everyone who was brought to You. I bring You {who}. Lay Your healing hands on {them}. Guide {their} doctors and nurses, give {them} strength for every treatment, ease {their} pain, and let {them} feel how deeply they are loved.",
      "Divine Physician, I place {who} in Your hands, in body, mind and spirit. Fight this illness with {them}. Calm {their} fears, give {them} rest, and let every person caring for {them} be an instrument of Your healing.",
    ],
    reflection: ["You can take this one appointment, one day, at a time. God is in every waiting room with you.", "Healing comes in many forms: in the body, in the heart, in the love that gathers around us. Watch for all of them today."],
  },
  {
    id: "illness", themes: ["health"],
    keywords: ["sick", "illness", "ill ", "hosp", "in pain", "chronic", "flu", "covid", "infection", "heart attack", "stroke", "my health", "doctor", "recovering from", "surgery", "surgury", "operation", "procedure", "icu", "emergency room", " er ", "diagnos", "biopsy", "mri", "scan", "test results", "lab results", "bloodwork", "waiting for results", "dementia", "alzheimer", "memory loss"],
    variants: [
      {
        when: "\\b(dementia|alzheimer|memory loss|doesn't recognize|doesnt recognize|forgetting everything)",
        title: ["A prayer for a loved one with dementia"],
        titleOther: "A prayer for {who}",
        saints: ["joseph", "martin_porres", "dymphna"], scripture: ["is49_15", "rom8_38", "is40_31"], devotions: ["memorare", "rosary_sorrowful"],
        opening: ["Watching someone you love fade in memory is a long, quiet grief. God remembers everything they are.", "Even when they forget, they are never forgotten by God."],
        openingOther: ["Even when {who} forgets, God never forgets {them}. Let's pray.", "Loving someone with dementia is a long goodbye. Let's bring {who} to God."],
        self: [
          "Lord, I'm watching someone I love slip away in memory, and it breaks my heart. Even when they forget, You never forget them. Give them peace and dignity, and give me patience, tenderness and rest. Let me love the person they are today.",
        ],
        other: [
          "Lord, {who} is losing pieces of {their} memory, but You hold all of {them}. Keep {them} calm, safe and surrounded by gentle care. Let {them} feel love even when {they} can't name it, and give our family patience and grace.",
          "Father, You knew {who} before {they} {were} born and You know {them} still. Comfort {them} in confusion, guard {their} dignity, and give everyone caring for {them} strength and tenderness.",
        ],
        reflection: ["Love them as they are today. Music, touch and familiar prayers often reach deeper than memory.", "You are grieving someone who is still here. Be gentle with yourself."],
      },
      {
        when: "\\b(surgery|surgury|operation|procedure|operated|going under|anesthesia)\\b",
        title: ["A prayer before surgery", "A prayer for a safe surgery"],
        titleOther: "A prayer for {who}'s surgery",
        saints: ["raphael", "padre_pio", "joseph"], scripture: ["is41_10", "jer17_14", "ps23_1"], devotions: ["anima_christi", "memorare"],
        opening: ["Surgery can make anyone afraid. Let's place it all in God's hands.", "Before a surgery, it helps to remember: you are held."],
        openingOther: ["Let's pray for {who} and everyone caring for {them} in surgery.", "Let's place {who} in God's hands before surgery."],
        self: [
          "Lord, I'm going into surgery and I'm afraid. Guide the hands and minds of my surgeons, nurses and anesthesiologist. Keep me safe while I sleep, bring me through without complications, and give me a gentle, steady recovery. Into Your hands I place my body and my fear.",
          "Divine Physician, be in the operating room with me. Calm my nerves tonight, give the whole medical team clarity and skill, and let me wake up held by Your peace.",
        ],
        other: [
          "Lord, I place {who} in Your hands before {their} surgery. Guide the surgeons, nurses and everyone on the team with skill and wisdom. Keep {them} safe, bring {them} through without complications, and give {them} a gentle recovery. Calm {their} fears, and mine.",
          "Divine Physician, be in the operating room with {who}. Steady every hand that cares for {them}, protect {them} through every moment of surgery, and let {them} wake to peace and healing.",
        ],
        reflection: ["Breathe slowly and pray one sentence: 'Jesus, I trust in You.' Let that be enough.", "Ask someone to text you when it's over. You don't have to wait alone."],
      },
      {
        when: "\\b(results|biopsy|scan|scans|mri|ct scan|tests|bloodwork|diagnos|waiting to hear|waiting on the doctor)",
        title: ["A prayer while waiting for results"],
        titleOther: "A prayer for {who} while waiting for results",
        saints: ["raphael", "padre_pio", "bernadette"], scripture: ["phil4_6", "is41_10", "ps46_10"], devotions: ["surrender_novena", "teresa_bookmark"],
        opening: ["Waiting for results can be the hardest part. Let's rest this in God's hands.", "The waiting is real. You don't have to carry it alone."],
        openingOther: ["Waiting is hard. Let's pray for {who} while you wait.", "Let's hold {who} in prayer through the waiting."],
        self: [
          "Lord, I'm waiting for results and my mind keeps running ahead to the worst. Hold me in this in-between. Whatever the answer, You will be there, and so will the people who love me. Give me peace for tonight and courage for whatever comes.",
          "Jesus, I trust in You. I'm scared of what the doctors might say. Quiet my thoughts, keep me from imagining every possibility, and let me rest in Your care until I know more.",
        ],
        other: [
          "Lord, {who} is waiting for results, and we're all holding our breath. Give {them} peace in the waiting, good news if it is Your will, and strength for whatever comes. Hold us close until we know.",
        ],
        reflection: ["Pray, hope, and don't worry. Padre Pio's advice was made for waiting rooms.", "Do one kind, ordinary thing today while you wait."],
      },
    ],
    saints: ["raphael", "bernadette", "martin_porres"], scripture: ["jer17_14", "mk5_34"], devotions: ["anointing_sick", "anima_christi"],
    title: ["A prayer for healing", "A prayer in sickness"],
    titleOther: "A prayer for {who}'s recovery",
    opening: ["Being sick wears down more than the body. Rest here for a moment.", "Illness can make the world small. God meets you right where you are."],
    openingOther: ["Watching someone you love suffer is its own kind of pain. Let's pray for {them}.", "Let's bring {who} to the Lord who heals."],
    self: [
      "Lord, You know how tired and weak I feel. Bring healing to my body and peace to my mind. Give me patience with the slow days, gratitude for small improvements, and the humility to let others care for me.",
      "Jesus, healer of body and soul, touch me with Your mercy. Restore my strength, ease my pain, and use even this time of weakness to draw me closer to You.",
    ],
    other: [
      "Lord, You see {who} in {their} weakness. Restore {their} strength, ease {their} pain, and give {them} peaceful rest. Bless everyone caring for {them} with wisdom and gentleness.",
      "Jesus, healer of body and soul, touch {who} with Your mercy. Bring {them} back to health, if it is Your will, and let {them} feel Your nearness in every hour.",
    ],
    reflection: ["Rest is not wasted time. Let today be gentle.", "Small improvements are still gifts. Notice one today and say thank you."],
  },
  {
    id: "mental", themes: ["anxiety", "sadness"],
    keywords: ["depress", "panic attack", "anxiety", "anxious", "mental health", "therapy", "therapist", "can't get out of bed", "dark place", "numb", "hopeless", "intrusive thoughts", "ocd", "bipolar", "breakdown"],
    saints: ["dymphna", "padre_pio", "john_cross"], scripture: ["ps34_18", "phil4_6", "mt11_28"], devotions: ["teresa_bookmark", "jesus_prayer", "surrender_novena"],
    title: ["A prayer for a heavy mind", "A prayer for peace of mind", "A prayer in the dark"],
    titleOther: "A prayer for {who}'s peace of mind",
    opening: ["What you're feeling is real, and it is not a failure of faith. You are not alone in it.", "When your mind is heavy, even praying can be hard. These words can carry you."],
    openingOther: ["Loving someone through a hard season of the mind takes patience and grace. Let's pray for {them}.", "Let's ask God to hold {who} gently today."],
    self: [
      "Lord, my mind feels heavy and loud. Quiet the anxious thoughts that crowd in on me, and lift the weight I cannot lift myself. Lead me to the help I need, whether it is a friend, a doctor or a counselor, and let me receive it without shame.",
      "Jesus, You know the darkness I am walking through. I cannot always feel You, so I ask You to hold me anyway. Give me enough light for the next step, enough strength for today, and the courage to reach out when I need to.",
      "Holy Spirit, Comforter, breathe peace into my body and calm into my thoughts. Untangle what I cannot untangle. Remind me that I am more than how I feel today, and that Your love for me does not change with my moods.",
    ],
    other: [
      "Lord, You see the heaviness {who} is carrying. Lift the weight from {their} mind and heart. Surround {them} with people who listen, lead {them} to the help that fits {them}, and let {them} know {they} {are} deeply loved.",
      "Jesus, hold {who} in this dark season. Give {them} rest, quiet {their} fears, and send small lights into {their} days. Give me patience and wisdom as I love {them}.",
    ],
    reflection: ["Asking for help is an act of hope. If today is hard, reach out to one person.", "You don't have to feel better to be held. Breathe slowly, and let that be your prayer."],
  },
  {
    id: "grief", themes: ["grief"],
    keywords: ["died", "passed away", "passed on", "funeral", "death of", "lost my mom", "lost my dad", "lost my mother", "lost my father", "lost my husband", "lost my wife", "lost my son", "lost my daughter", "lost my brother", "lost my sister", "lost my grandma", "lost my grandpa", "lost my friend", "grieving", "grief", "anniversary of", "cemetery", "was killed", "passed last night", "passed yesterday", "passed this morning", "passed today", "passed recently", "just passed", "~passed", "~miss her", "~miss him"],
    saints: ["elizabeth_seton", "monica", "zelie_louis"], scripture: ["jn11_35", "rev21_4", "wis3_1"], devotions: ["eternal_rest", "rosary_glorious", "hail_holy_queen"],
    title: ["A prayer in grief", "A prayer for comfort", "A prayer of remembrance"],
    titleOther: "A prayer for {who}",
    opening: ["Grief is love with nowhere to go. You don't need to have the right words.", "There is no timeline for grief. Let's sit with it in God's presence."],
    openingOther: ["Love doesn't end, and neither does our prayer for those we've lost. Let's pray for {who}.", "Praying for those who have died is one of the oldest acts of love in the Church."],
    self: [
      "Lord Jesus, You wept at the tomb of Your friend. You know this ache. Hold me in my grief. Comfort me in the empty places, the sudden memories and the quiet nights, and let me feel that love is stronger than death.",
      "God of all consolation, my heart is broken. I don't understand, and I don't need to right now. Just stay close. Give me tears when I need them, rest when I can't sleep, and people who will sit with me.",
    ],
    other: [
      "Merciful God, I entrust {who} to You. Forgive whatever needs forgiving, and welcome {them} into the light and peace of Your presence. Until we meet again, let my love for {them} become prayer, and comfort me in the missing.",
      "Lord Jesus, You are the resurrection and the life. Receive {who} into Your kingdom, where every tear is wiped away. Hold {them} close, and hold me too, as I learn to carry {their} memory with gratitude.",
    ],
    reflection: ["Love does not end. The ones we have lost are held in the same hands that hold us.", "You may carry this for a long while. You will not carry it alone."],
  },
  {
    id: "babyloss", noFallback: true, themes: ["grief", "motherhood"], hooks: { gianna: "who gave her life for her child" },
    keywords: ["miscarriage", "miscarried", "stillbirth", "stillborn", "lost the baby", "lost our baby", "lost my baby", "pregnancy loss", "no heartbeat"],
    saints: ["zelie_louis", "gianna", "elizabeth_seton"], scripture: ["ps34_18", "is49_15", "rev21_4"], devotions: ["memorare", "rosary_seven_sorrows"],
    title: ["A prayer after losing a baby", "A prayer for a little one"],
    opening: ["Your baby was real, and so is your grief. You are still a mother, and your love still counts.", "There are no words big enough for this loss. Let God hold what words cannot."],
    self: [
      "Loving Father, my arms are empty and my heart is broken. I entrust my little one to You, knowing You loved this child before I did. Hold my baby close, and hold me too. Heal my body, comfort my spirit, and let me grieve without shame.",
      "Mary, Mother of Sorrows, you know what it is to lose a child. Stay with me in this grief. Lord, keep my little one safe in Your love, and let me one day know the joy of meeting them in Your presence.",
    ],
    reflection: ["Your love for your baby is not measured by time. Let yourself grieve as long as you need.", "Speak your baby's name, or give them one. Love remembered is love honored."],
  },
  {
    id: "pregnancy", themes: ["motherhood", "hope"],
    keywords: ["~pregnant", "expecting", "due date", "labor", "delivery", "c-section", "baby on the way", "trimester", "giving birth", "ultrasound"],
    saints: ["gerard", "gianna", "anne"], scripture: ["ps139_13", "lk1_46", "is49_15"], devotions: ["rosary_joyful", "memorare"],
    title: ["A prayer for a mother-to-be", "A prayer for a safe delivery"],
    titleOther: "A prayer for {who} and the baby",
    opening: ["New life is a holy and nerve-wracking thing. Let's bring you and your baby to God.", "What a gift to carry. Let's pray for you both."],
    openingOther: ["Let's pray for {who} and the little one on the way.", "What a beautiful thing to pray for. Let's bring {them} and the baby to God."],
    self: [
      "Creator God, You are knitting this child together within me. Watch over my baby and over my body. Give me a healthy pregnancy and a safe delivery, calm my worries, and prepare my heart to love this little one with Your own tenderness.",
      "Lord, I place my baby and myself in Your care. Guide my doctors and midwives, give me strength for labor, and surround our family with joy and peace as we welcome new life.",
    ],
    other: [
      "Creator God, bless {who} and the baby {they} {are} carrying. Give {them} a healthy pregnancy and a safe delivery. Calm {their} worries, guide {their} doctors, and fill {their} home with joy.",
    ],
    reflection: ["Every heartbeat is a small miracle. Take a moment to marvel today.", "You don't have to have everything ready. Love is the most important preparation."],
  },
  {
    id: "infertility", themes: ["motherhood", "hope", "sadness"],
    keywords: ["infertil", "ivf", "trying to conceive", "didn't get pregnant", "didnt get pregnant", "not pregnant", "negative test", "another negative", "period came", "wish i was pregnant", "wish i were pregnant", "still not pregnant", "trying for a baby", "can't get pregnant", "cant get pregnant", "ttc", "fertility"],
    saints: ["anne", "rita", "gianna"], scripture: ["lam3_22", "is49_15", "ps34_18"], devotions: ["memorare", "novena_st_jude"],
    title: ["A prayer for the gift of a child", "A prayer while waiting"],
    opening: ["Waiting month after month is its own quiet grief. God sees every hope and every tear.", "Your longing is holy. Let's bring it to God gently."],
    self: [
      "Lord of life, You know how deeply I long for a child. Hear my prayer and, if it is Your will, bless us with the gift of a baby. In the waiting, heal the disappointment, protect our marriage, and keep our hearts open to however You choose to make us a family.",
      "God of Sarah, Hannah and Elizabeth, You heard the prayers of women who waited. Hear mine too. Hold my hope gently, comfort me in the hard months, and give me peace that does not depend on outcomes.",
    ],
    reflection: ["Your worth is not measured by what your body can do. You are loved exactly as you are.", "Hope and grief can live side by side. Let both be prayer today."],
  },
  {
    id: "faithchild", themes: ["faith", "family", "hope"],
    keywords: ["left the church", "stopped going to church", "stopped going to mass", "doesn't believe", "lost his faith", "lost her faith", "lost their faith", "come back to god", "come back to church", "atheist", "turned away from god", "away from god"],
    saints: ["monica", "augustine", "jude"], scripture: ["lk15_20", "lam3_22"], devotions: ["rosary_glorious", "memorare"],
    title: ["A prayer for a loved one's return to faith"],
    titleOther: "A prayer for {who}'s return to faith",
    opening: ["St. Monica prayed for her son for years, and he became a saint. Your prayers matter.", "Love that keeps praying is never wasted."],
    openingOther: ["St. Monica prayed for her son for years, and he became a saint. Your prayers for {who} matter.", "Love that keeps praying is never wasted. Let's pray for {who}."],
    self: [
      "Lord, You are the Good Shepherd who goes after the one who wanders. I entrust to You the people I love who have drifted from You. Draw them back gently, through people and moments only You can arrange, and keep me patient, loving and hopeful while I wait.",
    ],
    other: [
      "Lord, You are the Good Shepherd who goes after the one who wanders. I entrust {who} to You. Draw {them} back to Your heart in Your own time and way. Protect {them}, surround {them} with people who reflect Your love, and help me love {them} without pressure or fear.",
      "Father, You ran to meet the prodigal son while he was still far off. Run to {who}. Soften {their} heart, answer {their} questions, and let {them} know You have never stopped loving {them}. Keep me faithful in prayer and gentle in love.",
    ],
    reflection: ["Your job is to love; God's is to draw. Rest in that division of labor today.", "Augustine's mother never stopped praying. Neither should you."],
  },
  {
    id: "parenting", themes: ["parenting", "family"], hooks: { joseph: "who raised Jesus with tenderness" },
    variants: [
      {
        when: "\\b(kindergarten|first day of school|starting school|leaving for college|off to college|moving out|empty nest|graduat)",
        title: ["A prayer for a child's new chapter"],
        titleOther: "A prayer for {who}'s new chapter",
        opening: ["Letting them grow is one of the hardest, holiest parts of loving them.", "Big transitions stir big feelings. Let's bless this new chapter."],
        openingOther: ["Let's bless {who} in this new step.", "It's tender to watch them grow. Let's pray for {who}."],
        self: ["Lord, my child is stepping into something new and my heart is full and aching at the same time. Go with them where I can't. Protect them, give them good friends and wise guides, and let them carry our love and Yours wherever they go."],
        other: [
          "Lord, bless {who} in this new chapter. Go with {them} where I can't. Give {them} courage, good friends and wise guides, protect {them} from harm, and let {them} always know the way home, to us and to You.",
        ],
        reflection: ["Say a blessing over them before they go, even a simple sign of the cross on their forehead.", "Their growing up is a sign you did something right."],
      },
      {
        when: "\\b(bullied|bullying|picked on|mean to (him|her|them))",
        title: ["A prayer for a child who is being bullied"],
        titleOther: "A prayer for {who}",
        other: [
          "Lord, {who} is being hurt by other kids, and it breaks my heart. Protect {them}, heal the words that wounded {them}, and remind {them} how loved and worthy {they} {are}. Give {them} a true friend, give the adults around {them} wisdom to act, and give me the right words.",
        ],
        self: ["Lord, my child is being bullied. Protect them, heal their heart, and send them a true friend. Give me wisdom to advocate for them and calm to help them feel safe at home."],
        reflection: ["Tell them today, in words, that they are loved and that it's not their fault.", "Kindness is contagious. Pray for the kids who are unkind too."],
      },
    ],
    keywords: ["~my son", "~my daughter", "~my kids", "~my children", "~my child", "~my teen", "~my toddler", "~my baby", "parenting", "kids fighting", "kids won't", "siblings", "bullied", "bullying", "kindergarten", "leaving for college", "off to college", "moving out", "empty nest", "as a mom", "as a dad", "being a mom", "being a parent", "single mom", "single dad", "custody"],
    saints: ["joseph", "monica", "anne"], scripture: ["is66_13", "ps139_13", "prov3_5"], devotions: ["rosary_joyful", "novena_st_joseph"],
    title: ["A prayer for my children", "A prayer for a tired parent"],
    opening: ["Parenting is holy work that rarely feels holy in the moment. You're doing more than you know.", "God loves your children even more than you do. Let's bring them to Him."],
    self: [
      "Lord, You entrusted these children to me, and some days I feel so unequal to the task. Give me patience when I'm tired, wisdom when I don't know what to do, and tenderness when it matters most. Protect my children, guide their steps, and let them always know they are loved, by me and by You.",
      "Holy Family of Nazareth, you knew ordinary days, worry and hard work. Watch over my home. Help me see my children through God's eyes, forgive my mistakes as a parent, and fill our home with peace.",
    ],
    reflection: ["You don't have to be a perfect parent, just a present one. Hug your child today, or say a quiet blessing over them.", "Your children are God's before they are yours. Let that be a relief."],
  },
  {
    id: "marriage", themes: ["marriage", "relationships"],
    keywords: ["my marriage", "~my husband", "~my wife", "divorce", "separated", "separation", "we fight", "~fighting", "arguing", "argue", "cheated", "affair", "unfaithful", "counseling", "marriage"],
    saints: ["rita", "zelie_louis", "thomas_more"], scripture: ["1cor13_4", "col3_13"], devotions: ["rosary_luminous", "peace_prayer"],
    title: ["A prayer for my marriage", "A prayer for healing in marriage"],
    opening: ["Marriage can carry deep wounds and deep grace at the same time. Let's bring yours to God.", "You're not alone in this. Christ was present at the wedding at Cana, and He's present now."],
    self: [
      "Lord, You were present at the wedding at Cana. Be present in my marriage now. Heal what has been hurt between us, soften what has hardened, and teach us to speak with honesty and kindness. Show us the next right step, and give me wisdom to know what is mine to carry.",
      "God of love, my marriage is struggling and I am tired. Help us see each other again with patience and mercy. Where there is resentment, bring forgiveness; where there is distance, bring understanding. And if there is harm, give me the courage to protect myself and seek help.",
    ],
    reflection: ["Love is patient and kind, starting with how you speak to yourself today.", "One honest, gentle conversation can be a beginning. Pray before you have it."],
  },
  {
    id: "heartbreak", themes: ["relationships", "sadness"],
    keywords: ["broke up", "break up", "breakup", "~heartbroken", "heartbreak", "my ex", "dumped", "left me", "walked out", "ghosted", "rejected"],
    saints: ["rita", "mary_magdalene", "therese"], scripture: ["ps34_18", "jer29_11"], devotions: ["memorare", "litany_humility"],
    title: ["A prayer for a broken heart"],
    opening: ["Heartbreak can feel physical. Be gentle with yourself today.", "The Lord is close to the brokenhearted, close to you right now."],
    self: [
      "Lord, my heart is hurting. You know what I hoped for and what I lost. Heal the wounds of this relationship, free me from replaying what went wrong, and remind me that my worth does not depend on anyone's choice to stay.",
      "Jesus, You are close to the brokenhearted. Stay close to me. Help me grieve what was, forgive what needs forgiving, including in myself, and trust that You have good things ahead for me.",
    ],
    reflection: ["You are not too much and you are not unlovable. You are God's beloved.", "Healing isn't linear. A hard day doesn't undo your progress."],
  },
  {
    id: "spouse", themes: ["relationships", "hope", "loneliness"],
    keywords: ["future husband", "future wife", "future spouse", "find a husband", "find a wife", "find love", "find the right person", "still single", "being single", "dating"],
    saints: ["raphael", "anne", "zelie_louis"], scripture: ["prov3_5", "jer29_11"], devotions: ["suscipe", "memorare"],
    title: ["A prayer for a future spouse"],
    opening: ["Wanting to be loved and to love someone well is a good desire. Let's give it to God.", "Your story isn't late. God is writing it with care."],
    self: [
      "Lord, You know the desire of my heart to love and be loved in marriage. If it is Your will, lead me to the person You have in mind for me, and lead them to me. Until then, make me whole, generous and ready, and let me find joy in the life I have now.",
      "St. Raphael, you guided Tobias to Sarah. Guide me too. Lord, protect my heart from settling for less than love, and give me patience to wait for what is good.",
    ],
    reflection: ["Become the kind of person you hope to meet: kind, faithful, joyful. That's never wasted.", "Your life now is not a waiting room. It's holy ground too."],
  },
  {
    id: "job", themes: ["work", "finances"],
    variants: [{
      when: "\\binterview",
      title: ["A prayer before an interview"],
      self: [
        "Lord, I have an interview coming up. Calm my nerves, clear my mind and help me be myself. Give me the right words, favor with the people I meet, and peace about the outcome. If this is the right door, open it; if not, lead me to the one that is.",
        "St. Joseph, pray for me as I interview. Lord, let me speak honestly about my gifts, listen well and leave the result in Your hands.",
      ],
      reflection: ["Prepare well, then rest. The right door won't pass you by.", "Pray for the person interviewing you too. It changes the room."],
    }],
    keywords: ["job", "lost my job", "laid off", "job interview", "interview", "layoff", "fired", "unemploy", "interview", "career", "my boss", "coworker", "resume", "applications", "work is"],
    saints: ["cajetan", "joseph"], scripture: ["mt6_26", "prov3_5", "mt7_7"], devotions: ["novena_st_joseph", "act_of_hope"],
    title: ["A prayer for work", "A prayer for a new job"],
    opening: ["Work troubles touch everything: money, identity, peace. Let's bring it all to God.", "St. Joseph worked with his hands to provide. He understands."],
    self: [
      "St. Joseph, worker and provider, pray with me. Lord, You know what I need before I ask. Open the right doors, close the wrong ones, and give me courage for every application and interview. Help me remember that my worth is not my job title.",
      "Lord, I bring You my work and my worries about it. Give me wisdom in my decisions, patience with difficult people, and the grace to do even ordinary tasks with love. Provide what my family needs, and help me trust You with tomorrow.",
    ],
    reflection: ["Do the next small thing: one application, one email, one conversation. Then rest.", "Your worth was settled before you ever had a job. It isn't up for review."],
  },
  {
    id: "money", themes: ["finances", "anxiety"], hooks: { joseph: "who provided for the Holy Family" },
    variants: [
      {
        when: "\\b(evict|eviction|behind on rent|can't pay rent|cant pay rent|pay rent|rent is due|foreclos|mortgage|homeless|shelter|losing (our|my) (home|house|apartment)|nowhere to live|landlord)",
        title: ["A prayer for a home", "A prayer when rent is due"],
        titleOther: "A prayer for {who}'s home",
        self: [
          "Lord, Jesus had nowhere to lay His head, so You know this fear. I'm afraid of losing our home. Provide what we need for the rent, soften the heart of anyone who holds our future, and lead us to help we don't know about yet. Whatever happens, keep us together and keep us safe.",
          "Holy Family, you had no room at the inn. Pray for us. Lord, give us a safe place to live and the means to keep it. Give me courage to ask for help, wisdom with every dollar, and peace tonight under whatever roof we have.",
        ],
        other: [
          "Lord, {who} is afraid of losing {their} home. Provide for {them}. Open doors to help, soften the hearts of landlords and lenders, and give {them} a safe place to live. Show me how I can help.",
        ],
      },
      {
        when: "\\b(food|groceries|feed my|feed our|food stamps|snap|wic|food bank|hungry|empty fridge|nothing to eat)\\b",
        title: ["A prayer for daily bread"],
        titleOther: "A prayer for {who}'s table",
        self: [
          "Our Father, give us this day our daily bread. Lord, I'm worried about putting food on the table. You fed the five thousand and You feed the birds of the air. Feed us too. Lead us to the help we need without shame, and let us never forget those who are hungry when we have enough.",
          "Lord, it's hard to admit we don't have enough to eat. You see us. Provide for my family today, bless the people and pantries that share, and give me the humility to receive and, one day, the joy to give.",
        ],
        other: [
          "Lord, {who} doesn't have enough to eat right now. Fill {their} table, lead {them} to help without shame, and move my heart to share what I have.",
        ],
      },
      {
        when: "\\b(medical bill|medical bills|hospital bill|hospital bills|medical debt|insurance|copay|can't afford (my |the )?(medication|medicine|treatment|surgery|prescription)|cant afford (my |the )?(medication|medicine|treatment))",
        title: ["A prayer for medical bills"],
        titleOther: "A prayer for {who}'s medical bills",
        self: [
          "Lord, I'm already carrying illness, and now the bills too. Lift this weight. Open doors to assistance, payment plans and people who will help, and give me peace to focus on healing. Remind me that my life is worth far more than what it costs.",
          "Divine Physician, provide for the care I need and the bills that come with it. Give me wisdom to find help, courage to ask, and trust that You will not abandon me in this.",
        ],
        other: [
          "Lord, {who} is facing medical bills on top of everything else. Provide for {them}, open doors to help and mercy, and let {them} focus on getting well.",
        ],
      },
      {
        when: "^(?=.*\\b(my kids|my children|my son|my daughter|my baby|my family)\\b)(?=.*\\b(afford|provide|money|christmas|presents|gifts|birthday|school supplies|shoes|clothes|diapers|formula|daycare|childcare)\\b)",
        title: ["A prayer for a providing parent"],
        other: null, // always the parent's own prayer
        self: [
          "St. Joseph, provider for the Holy Family, pray for me. Lord, I want to give my children everything, and right now I can't. Provide what they need, and help me remember that what they need most is my love and Yours. Let them never feel the weight I'm carrying.",
          "Lord, the holidays and birthdays make it harder. Help me give my children joy that money can't buy: time, laughter, faith and family. Provide for what they truly need, and free me from guilt over what I can't give.",
        ],
      },
      {
        when: "\\b(my business|our business|small business|my shop|my store|my restaurant|customers|clients|sales are|slow season|keep the doors open|payroll)\\b",
        title: ["A prayer for my business"],
        titleOther: "A prayer for {who}'s business",
        self: [
          "St. Joseph, craftsman of Nazareth, pray for me. Lord, I've poured myself into this work and it's struggling. Bring customers, give me wisdom in every decision, and help me provide for my family and the people who work with me. Whatever happens, let me run it with integrity.",
        ],
        other: [
          "Lord, bless {who}'s business. Bring customers and opportunities, give {them} wisdom and stamina, and let {their} work provide for {their} family and bless {their} community.",
        ],
      },
      {
        when: "\\b(car broke|car broke down|car repair|repair|repairs|transmission|emergency expense|unexpected|out of nowhere|vet bill|roof|furnace|water heater|broke down)\\b",
        title: ["A prayer for an unexpected expense"],
        self: [
          "Lord, just when I was getting by, this happened. You aren't surprised by it, even though I am. Provide what I need to fix it, give me creativity and help from unexpected places, and keep me from panic. You've carried me before; carry me again.",
        ],
      },
      {
        when: "\\b(debt|credit card|credit cards|loans|loan|collections|collector|overdue|behind on (bills|payments)|bills (are )?piling|bankrupt|late fees|interest)\\b",
        title: ["A prayer for freedom from debt"],
        titleOther: "A prayer for {who}'s finances",
        self: [
          "Lord, this debt feels like a weight on my chest every day. Free me from it, one payment at a time. Give me discipline and wisdom, honest help and fair creditors, and peace that doesn't wait until the balance is zero. My worth is not my bank account.",
          "Father, forgive me for any choices that led here, and help me make better ones. Show me a way out of this debt I can't see yet, and quiet the shame that keeps me awake. You are my provider, not my paycheck.",
        ],
        other: [
          "Lord, {who} is weighed down by debt. Give {them} a way forward, wise counsel and peace in the meantime. Free {them} from shame, and show me how to help without hurting either of us.",
        ],
      },
    ],
    keywords: ["money", "rent", "bills", "debt", "afford", "evict", "mortgage", "broke", "paycheck", "food stamps", "can't pay", "financial", "overdraft", "groceries", "food bank", "medical bills", "hospital bill", "hospital bills", "credit card", "loans", "collections", "behind on", "foreclos", "homeless", "utilities", "electric bill", "shut off", "my business", "small business", "sales are", "car broke", "repair", "unexpected expense", "struggling financially", "living paycheck", "make ends meet", "tight budget"],
    saints: ["cajetan", "joseph", "anthony"], scripture: ["phil4_19", "mt6_26"], devotions: ["novena_st_joseph", "act_of_hope"],
    title: ["A prayer for provision", "A prayer in financial hardship"],
    opening: ["Money worries can keep you up at night. God cares about the bills too.", "There's no shame in struggling. Let's ask God for what you need."],
    self: [
      "Father, You feed the birds of the air and clothe the lilies of the field. You know exactly what I need. Provide for me and my family: the rent, the bills, the food on the table. Show me wise choices and people who can help, and quiet the fear that keeps me awake.",
      "Lord, I am worried about money and I'm tired of being worried. Give us this day our daily bread, and teach me to trust You for tomorrow. Open doors I cannot see, and help me receive help with humility and give help when I can.",
    ],
    reflection: ["Make one small, wise step today, then let God hold the rest.", "Asking for help is not failure. It lets someone else be generous."],
  },
  {
    id: "addiction", themes: ["addiction", "growth"],
    variants: [
      {
        // in recovery themselves, praying for someone still struggling
        when: "^(?=.*\\b(i'm|i am|i've been|ive been|im|my own|i got|i'm in|i am in)\\b[^.]*\\b(sober|recovery|clean)\\b)(?=.*\\bmy (mom|mother|dad|father|brother|sister|son|daughter|husband|wife|boyfriend|girlfriend|partner|friend|best friend|cousin|uncle|aunt)\\b)",
        title: ["A prayer for both of us in recovery"],
        titleOther: "A prayer for {who}, and for my own recovery",
        self: [
          "Lord, You know the road I'm walking in recovery, and You know how much I want the people I love to find freedom too. Keep me strong one day at a time, and use my story to give hope without pressure. I can't save anyone, but You can. Hold all of us.",
        ],
        other: [
          "Lord, thank You for my own recovery, one day at a time. Now I bring You {who}, who is still caught in what I know too well. Break {their} chains as You broke mine. Protect {them} until {they} {are} ready, and when that day comes, let me be there with open arms, without losing my own sobriety in the process.",
          "Jesus, You freed me, and I know You can free {who}. Give {them} a moment of clarity and a way out. Give me wisdom to love {them} without enabling, to share hope without preaching, and to guard my own recovery while I pray for {them}.",
        ],
      },
      {
        when: "\\b(craving|crave|urge to|want to drink|want to use|want a drink|tempted)\\b",
        title: ["A prayer in a moment of craving"],
        self: [
          "Jesus, the craving is here right now. Be stronger than it. Help me breathe, call someone, pray, and wait it out. I don't have to win forever, just this moment, and I don't have to win it alone.",
          "Lord, I want to use right now, and I'm asking You for help instead. Get me through the next ten minutes. Remind me how far I've come and who I'm doing this for. Send me someone to call, and let this wave pass.",
        ],
      },
      {
        when: "\\b(overdos|fentanyl|heroin|opioid|terrified (he|she|they)'?ll die|scared (he|she|they)'?ll die)",
        title: ["A prayer for protection from overdose"],
        titleOther: "A prayer for {who}'s safety",
        self: [
          "Lord, I'm scared of what this addiction could do to me. Protect my life. Lead me to help today: a doctor, a counselor, a meeting, someone who will stay with me. I want to live, and I want to be free.",
        ],
        other: [
          "Lord, I'm afraid of getting the phone call. Protect {who} from overdose and from every danger. Wrap {them} in Your mercy tonight, send {them} people and moments that lead toward recovery, and calm my fear with trust in You.",
          "St. Michael, protect {who}. Lord, keep {them} alive, keep {them} safe, and bring {them} through this darkness to the day {they} {are} ready for help. Give me peace enough to sleep tonight, trusting {them} to You.",
        ],
      },
      {
        when: "\\b(rehab|detox|treatment center|in treatment|went into treatment|inpatient|outpatient program)\\b",
        title: ["A prayer for treatment and recovery"],
        titleOther: "A prayer for {who} in treatment",
        self: [
          "Lord, I'm starting treatment and I'm scared. Thank You for bringing me this far. Carry me through detox and the hard days, help me be honest and open, and let me meet the person I'm meant to be on the other side.",
        ],
        other: [
          "Jesus, {who} is in treatment now. Thank You for this step. Strengthen {them} through detox and the hard days ahead, give {them} honest friends in recovery, and let {them} discover who {they} {are} without the substance. Prepare our family to support {them} well.",
        ],
      },
      {
        when: "\\b(relapse|relapsed|slipped|used again|drank again|drinking again|using again|fell off|messed up my sobriety|lost my sobriety|start over)\\b",
        title: ["A prayer after a relapse", "A prayer to begin again"],
        self: [
          "Lord, I fell, and I'm ashamed. But You are the God of second chances, and seventy-times-seven chances. Lift me up without letting me drown in guilt. Help me tell someone today, get back to the meetings and the people who help, and start again with this very day.",
          "Jesus, a relapse doesn't erase the sober days You gave me, or Your love for me. Wash away my shame, show me what I need to learn, and give me the humility to reach out for help right now. Today is day one again, and You are with me in it.",
        ],
        other: [
          "Lord, {who} has relapsed, and my heart is heavy. Don't let {them} give up on {themself}. Lift {them} out of shame, keep {them} safe, and lead {them} back to help and to You. Give me patience and hope, and keep me from despair.",
        ],
      },
    ],
    keywords: ["addict", "sober", "sobriety", "relapse", "drinking", "alcohol", "drugs", "using again", "recovery", "gambling", "porn", "clean for", "rehab", "aa meeting", "na meeting", "craving", "overdose", "overdosed", "fentanyl", "opioid", "heroin", "meth", "detox", "treatment center", "still using", "drunk again", "binge", "high again", "using drugs", "his drinking", "her drinking", "addicted"],
    saints: ["matt_talbot", "moses_black", "augustine"], scripture: ["1cor10_13", "2cor5_17", "lam3_22"], devotions: ["st_michael", "sacrament_reconciliation", "divine_mercy_chaplet"],
    title: ["A prayer for recovery", "A prayer for strength today"],
    titleOther: "A prayer for {who}'s recovery",
    opening: ["Every day of recovery is a victory. If today is hard, you're still not alone.", "God's mercy is new every morning, including this one."],
    openingOther: ["Loving someone in addiction is exhausting and holy. Let's pray for {who}.", "Let's bring {who} to the One who sets captives free."],
    self: [
      "Lord, I can't do this on my own, so I'm asking You to do it with me. Give me strength for today, just today. When the craving comes, be stronger. When I fall, help me get up without despair. Surround me with people who tell me the truth and help me stay free.",
      "Jesus, You make all things new. Break the chains I cannot break, heal the wounds I've been trying to numb, and fill the empty places with Your love. Thank You for every sober day, and give me one more.",
      "Lord, these early days are so hard. My body and mind are fighting me. Carry me through the next hour, and the next. Keep me honest with the people helping me, and let me believe that it really does get better.",
      "Lord, I'm carrying so much shame about who I was when I was using. You see all of it and You still call me beloved. Help me make amends where I can, forgive myself where I should, and walk forward as the person You're making me.",
    ],
    other: [
      "Lord, You see {who} in {their} struggle. Break the hold of this addiction, protect {them} from harm, and lead {them} to the help that fits {them}. Give me wisdom to love {them} without enabling, and peace when I can't fix it.",
      "Mary, Mother of Sorrows, you watched your Son suffer. Stay with me as I watch {who} suffer in addiction. Lord, I can't fix this, so I give {them} to You. Keep {them} alive, keep {them} safe, and bring {them} to the day {they} {are} ready for help. Give me strength to love {them} and to take care of myself.",
      "Lord, loving {who} through addiction has worn me down. Help me set boundaries without bitterness, hope without enabling, and pray without carrying what only {they} and You can carry. Bring {them} home to {themself} and to You.",
    ],
    reflection: ["Just for today. That's enough. Tomorrow has its own grace.", "Your past isn't the whole story. Today is a new page."],
  },
  {
    id: "decision", themes: ["decisions", "confusion"],
    keywords: ["decide", "decision", "should i", "choice between", "torn between", "discern", "vocation", "job offer", "which school", "move to", "moving to", "big change"],
    saints: ["ignatius", "thomas_more", "joseph"], scripture: ["prov3_5", "jas1_5"], devotions: ["suscipe", "examen"],
    title: ["A prayer for guidance", "A prayer for a decision"],
    opening: ["Big decisions can feel heavy. You don't have to see the whole road, just the next step.", "God gives wisdom generously to those who ask. Let's ask."],
    self: [
      "Holy Spirit, I need Your wisdom. I lay this decision before You with all its options and fears. Quiet the noise, show me what leads to peace and what leads away from it, and give me courage to choose and freedom to trust You with what I can't control.",
      "Lord, I want to choose what You want for me. Help me notice where I feel Your peace and where I feel unrest. Give me good counsel from people who love me, and once I decide, let me walk forward without looking back in fear.",
    ],
    reflection: ["Notice which choice brings lasting peace, not just relief. That's often where God is.", "You don't need certainty to take a faithful step. Take one today."],
  },
  {
    id: "exam", themes: ["work", "anxiety"],
    keywords: ["exam", "finals", "midterm", "a test", "my test", "big test", "test tomorrow", "test today", "her test", "his test", "driving test", "studying", "bar exam", "boards", "grades", "college application", "~school"],
    saints: ["ignatius", "thomas_more", "therese"], scripture: ["jas1_5", "phil4_6"], devotions: ["jesus_prayer", "teresa_bookmark"],
    title: ["A prayer before an exam", "A prayer for school"],
    opening: ["You've prepared more than you think. Let's quiet your nerves.", "Bring your studying and your stress to God. He cares about both."],
    self: [
      "Holy Spirit, give me a clear mind and a calm heart. Help me remember what I've studied, think carefully, and do my best. Whatever the result, remind me that my worth is not a grade, and that You are with me in every question.",
      "Lord, I'm nervous. Settle my thoughts, steady my breathing, and help me focus. Bless my work and my rest, and let me receive the results with peace.",
    ],
    reflection: ["Breathe slowly before you begin. You've done the work; now trust it.", "Your worth is not a score. You are loved before, during and after the test."],
  },
  {
    id: "lonely", themes: ["loneliness"],
    keywords: ["lonely", "alone", "isolated", "no friends", "nobody cares", "no one cares", "left out", "invisible", "moved away", "miss my friend", "miss my family", "homesick"],
    saints: ["kateri", "teresa_calcutta", "martin_porres"], scripture: ["ps68_6", "heb13_5", "is49_15"], devotions: ["guardian_angel_prayer", "memorare"],
    title: ["A prayer in loneliness"],
    opening: ["Loneliness is one of the hardest feelings to name. Thank you for naming it here.", "You are seen, even when it feels like no one notices."],
    self: [
      "Lord, I feel alone, and You know how heavy that is. Be my companion today. Send me people who will see me and let me see them, give me courage to reach out first, and remind me that I am never truly alone in Your love.",
      "Jesus, You knew what it was to be abandoned by Your friends. Stay with me in this lonely place. Fill the silence with Your presence, and lead me toward a community where I belong.",
    ],
    reflection: ["Reach out to one person today, even with a small message. Connection starts small.", "God sets the lonely in families. Ask Him to show you yours."],
  },
  {
    id: "forgive", themes: ["anger", "relationships"],
    keywords: ["forgive", "resent", "betray", "~angry at", "~mad at", "hurt me", "can't let go", "bitter", "abused me", "lied to me"],
    saints: ["rita", "bakhita", "moses_black"], scripture: ["col3_13", "eph4_26"], devotions: ["peace_prayer", "litany_humility"],
    title: ["A prayer for forgiveness", "A prayer for a hurting heart"],
    opening: ["Being hurt is real, and so is your anger. Forgiveness is a process, not a pretending.", "God can hold your anger. Bring it honestly."],
    self: [
      "Lord, I've been hurt, and I'm angry. I don't know how to forgive yet, so I'm asking You to begin it in me. Heal the wound, free me from replaying it, and help me set boundaries that protect my heart without hardening it.",
      "Jesus, You forgave even from the cross. I can't do that on my own. Give me the grace to let go of what is poisoning me, to wish for the other's good, and to trust You with justice.",
    ],
    reflection: ["Forgiving isn't excusing. It's choosing not to let the hurt own you.", "Pray one sentence for the person who hurt you today, even if it's just their name."],
  },
  {
    id: "guilt", themes: ["growth", "faith"],
    keywords: ["guilt", "guilty", "ashamed", "shame", "regret", "i messed up", "my sin", "my sins", "confess", "confession", "i failed", "can't forgive myself"],
    saints: ["mary_magdalene", "augustine", "faustina"], scripture: ["lk15_20", "2cor5_17", "lam3_22"], devotions: ["act_of_contrition", "sacrament_reconciliation", "divine_mercy_chaplet"],
    title: ["A prayer for mercy", "A prayer for a fresh start"],
    opening: ["God's mercy is bigger than your worst moment. You're welcome here.", "Coming back to God is always the right direction."],
    self: [
      "Merciful Father, I am sorry for what I've done and for the good I failed to do. Thank You for running to meet me like the father of the prodigal son. Wash me clean, help me make things right where I can, and teach me to accept Your forgiveness.",
      "Jesus, I trust in You. I bring You what I'm ashamed of and leave it at Your feet. Make me new. Give me the courage to go to Confession, and the grace to start again today.",
    ],
    reflection: ["God doesn't love the future, cleaned-up you. He loves you now.", "Consider going to Confession this week. It's a place of mercy, not judgment."],
  },
  {
    id: "protection", themes: ["fear"],
    variants: [{
      when: "\\b(flood|flooded|storm|hurricane|tornado|earthquake|wildfire|fire|lost everything|house burned|evacuat)",
      title: ["A prayer after a disaster"],
      titleOther: "A prayer for {who} after the disaster",
      opening: ["Losing your home or belongings is a real loss. You don't have to be okay right now.", "God is close in the wreckage. Let's bring this to Him."],
      self: [
        "Lord, the storm took so much. I'm grateful to be safe, and I'm grieving what's gone. Provide what we need to rebuild, send help and kind neighbors, and give me strength for the long work ahead. Remind me that what matters most can't be washed away.",
      ],
      other: ["Lord, watch over {who} after this disaster. Keep {them} safe, provide shelter and everything that's needed, and send help quickly. Give {them} strength to rebuild and hope for what comes next."],
      reflection: ["Accept help when it's offered. Rebuilding is a community's work.", "Take one small step today, and rest."],
    }],
    keywords: ["travel", "trip", "flight", "flying", "plane", "driving", "flood", "flooded", "tornado", "earthquake", "wildfire", "lost everything", "deploy", "military", "keep safe", "keep them safe", "protect", "protection", "danger", "police", "first responder", "storm", "hurricane", "fire"],
    saints: ["raphael", "michael", "guardian_angel"], scripture: ["ps23_1", "dt31_6", "is41_10"], devotions: ["guardian_angel_prayer", "st_michael"],
    title: ["A prayer for protection", "A prayer for safe travels"],
    titleOther: "A prayer of protection for {who}",
    opening: ["Let's place those you love, and yourself, under God's protection.", "Fear is natural. God's care is greater."],
    openingOther: ["Let's place {who} under God's protection.", "Let's ask the angels to watch over {who}."],
    self: [
      "Lord, I place myself under Your protection. Guard me on every road and in every place I go. Send Your angels to watch over me, keep me from harm, and calm my fear with the knowledge that I am held.",
      "St. Michael and my guardian angel, watch over me. Lord, be my shelter and my shield. Whatever today brings, let me walk in Your peace.",
    ],
    other: [
      "Lord, I place {who} under Your protection. Guard {them} on every road and in every danger. Send Your angels to surround {them}, bring {them} home safely, and calm my worry with trust in Your care.",
    ],
    reflection: ["Say a short prayer of protection when you worry today. Let each worry become a blessing.", "You can't control every road. You can entrust every traveler."],
  },
  {
    id: "doubt", themes: ["faith", "confusion"],
    variants: [{
      when: "\\b(angry at god|mad at god|angry with god|why would god|why did god)",
      title: ["A prayer when I'm angry at God"],
      opening: ["The Psalms are full of people angry at God. Your honesty is a prayer.", "God can handle your anger. Bring it to Him instead of away from Him."],
      self: [
        "Lord, I'm angry with You. I don't understand why You allowed this. I'm telling You because You'd rather have my honest anger than my silence. Stay with me in it. I don't need an answer today, just Your presence.",
        "God, like Job, I have questions, and I'm hurt. I won't pretend otherwise. Don't let go of me while I wrestle with You, and lead me, in time, to peace.",
      ],
      reflection: ["Pray a lament Psalm today, like Psalm 13: 'How long, O Lord?'", "Anger at God is still talking to God. Keep talking."],
    }],
    keywords: ["doubt", "angry at god", "mad at god", "angry with god", "why would god", "why did god", "can't feel god", "cant feel god", "where is god", "is god real", "faith is weak", "far from god", "god feels distant", "don't know if i believe", "struggling with faith", "spiritual dryness"],
    saints: ["thomas_apostle", "teresa_calcutta", "john_cross"], scripture: ["mk9_24", "ps46_10"], devotions: ["lectio_divina", "jesus_prayer"],
    title: ["A prayer in doubt", "A prayer when God feels far"],
    opening: ["Honest questions are a form of prayer. Even saints felt God was far.", "Mother Teresa felt God's absence for decades and kept loving anyway. You're in good company."],
    self: [
      "Lord, I believe; help my unbelief. I don't feel You right now, and I'm not sure what I think. So I offer You my questions and my emptiness. Meet me in them, even if I can't sense You, and keep me open to being surprised by You.",
      "Jesus, Thomas needed to see, and You came to him. Come to me too, in whatever way I can recognize. Give me enough faith for today, and the patience to keep showing up.",
    ],
    reflection: ["Showing up with questions is still showing up. Sit quietly for one minute today.", "Faith isn't a feeling. It's a direction. Keep facing toward God."],
  },
  {
    id: "caregiving", themes: ["family", "overwhelm", "health"],
    keywords: ["caregiver", "caregiving", "taking care of my", "caring for my", "my aging", "nursing home", "burned out caring"],
    saints: ["martin_porres", "dymphna", "joseph"], scripture: ["mt11_28", "is40_31"], devotions: ["surrender_novena", "teresa_bookmark"],
    title: ["A prayer for a caregiver"],
    opening: ["Caring for someone is love made visible, and it is exhausting. You need care too.", "Let's pray for strength, for you and the one you care for."],
    self: [
      "Lord, caring for someone I love is wearing me down. Give me strength for the long days, patience in the hard moments, and tenderness when I feel empty. Send me help and rest, and let me see Your face in the one I care for.",
      "Jesus, You washed the feet of Your friends. Bless the work of my hands. Forgive me when I'm short-tempered and tired, refresh me when I'm depleted, and hold the one I care for in Your peace.",
    ],
    reflection: ["You can't pour from an empty cup. Accept one offer of help this week.", "Caring is holy, even the parts nobody sees. God sees."],
  },
  {
    id: "overwhelm", themes: ["overwhelm", "anxiety"],
    keywords: ["overwhelm", "stressed", "stress", "burnout", "burned out", "too much", "exhausted", "can't keep up", "drowning", "so tired"],
    saints: ["padre_pio", "teresa_avila", "joseph"], scripture: ["mt11_28", "phil4_6", "ps46_10"], devotions: ["surrender_novena", "teresa_bookmark"],
    title: ["A prayer when it's all too much", "A prayer for rest"],
    opening: ["When everything feels like too much, start with one breath. You're here, and that's enough for now.", "Jesus said, 'Come to me, all who are weary.' That's you, today."],
    self: [
      "Jesus, You invite the weary to come to You, and I am weary. I bring You everything I'm carrying: the lists, the people, the worries. Take what isn't mine to carry. Show me what matters today, and give me permission to rest.",
      "Lord, I surrender what I can't control. Calm my racing mind, slow my breathing, and help me take just the next small step. Let me remember that You are God and I am not, and that is good news.",
    ],
    reflection: ["Choose one thing to let go of today. The world will keep turning.", "Pray, hope, and don't worry. Padre Pio's advice still works."],
  },
  {
    id: "prison", noFallback: true, themes: ["family", "fear", "hope"], hooks: { joseph: "who protected his family through danger" },
    keywords: ["prison", "jail", "incarcerat", "locked up", "arrested", "court date", "trial", "sentencing", "probation", "parole", "my lawyer", "legal trouble", "charged with", "lawsuit"],
    saints: ["dismas", "joseph", "jude"], scripture: ["mt25_36", "lk23_43", "is41_10"], devotions: ["divine_mercy_chaplet", "memorare"],
    title: ["A prayer in legal trouble", "A prayer before court"],
    titleOther: "A prayer for {who}",
    opening: ["Whatever happened, God's mercy reaches every cell and courtroom. You're not beyond it.", "Legal trouble brings fear and shame. Let's bring it honestly to God."],
    openingOther: ["Jesus said, 'I was in prison and you came to me.' Your prayers for {who} matter.", "Let's pray for {who}, and for you as you love {them} through this."],
    self: [
      "Lord, I am afraid of what is coming. Be with me in every meeting and courtroom. Give me honesty, courage and a fair hearing. Where I have done wrong, help me take responsibility and make amends; where I am wronged, defend me. Whatever happens, let me know I am still Your child.",
    ],
    other: [
      "Lord, You were arrested, judged and condemned, so You know this road. Be with {who}. Protect {them} from harm, give {them} hope and dignity, and let {them} feel Your mercy. Bring justice tempered with mercy, and keep our family connected and faithful while we're apart.",
      "St. Dismas, who found mercy beside Jesus, pray for {who}. Lord, meet {them} where {they} {are}. Soften what needs softening, heal what's broken, and give {them} a future full of hope.",
    ],
    reflection: ["No one is defined by their worst moment. Mercy is bigger than any record.", "Write a letter, make a visit, or simply pray their name today."],
  },
  {
    id: "immigration", noFallback: true, themes: ["family", "fear", "loneliness"],
    keywords: ["immigra", "deport", " visa", "green card", "asylum", "citizenship", " ice ", "the border", "undocumented", "my papers", "refugee", "far from home", "far from my family"],
    saints: ["cabrini", "joseph", "raphael"], scripture: ["lev19_34", "dt31_6", "heb13_5"], devotions: ["memorare", "novena_st_joseph"],
    title: ["A prayer for immigrants and families", "A prayer far from home"],
    titleOther: "A prayer for {who}",
    opening: ["The Holy Family were refugees too. God knows what it is to be far from home.", "Your fear and your hope are both welcome here."],
    openingOther: ["The Holy Family fled to Egypt as refugees. Let's pray for {who} under their protection.", "Let's ask St. Frances Cabrini, mother of immigrants, to pray for {who}."],
    self: [
      "Lord, You were once a refugee in Egypt with Mary and Joseph. You know this fear and this longing for home. Protect me and my family. Open doors for our papers and our future, give us people who will treat us with dignity, and keep us together in Your care.",
    ],
    other: [
      "Lord, Holy Family who fled to Egypt, watch over {who}. Protect {them} on every road and in every office and courtroom. Give {them} dignity, safety and a fair hearing, and reunite families who are apart.",
    ],
    reflection: ["You carry a whole history and a whole family with you. That is strength, not weakness.", "God sets the lonely in families. Look for the community that welcomes you."],
  },
  {
    id: "selfworth", themes: ["growth", "sadness"],
    keywords: ["not good enough", "hate myself", "hate my body", "body image", "i'm ugly", "im ugly", "worthless", "not enough", "insecure", "compare myself", "self-esteem", "self esteem", "my weight", "feel like a failure", "unlovable", "behind in life", "feel behind", "turning 30", "turning 40", "turning 50", "midlife"],
    saints: ["therese", "bernadette", "mary_magdalene"], scripture: ["ps139_13", "eph2_10", "1sam16_7"], devotions: ["litany_humility", "memorare"],
    title: ["A prayer for self-worth", "A prayer to see myself as God does"],
    opening: ["The voice telling you you're not enough is not God's voice.", "You are fearfully and wonderfully made, on your hardest days too."],
    self: [
      "Lord, I keep telling myself I'm not enough: not pretty enough, smart enough, good enough. Quiet that voice. Let me see myself the way You see me, as Your beloved, made on purpose and with love. Heal the wounds that taught me to doubt my worth, and help me treat myself with the kindness I'd give a friend.",
      "Creator God, You formed me and called it good. Free me from comparison and from the mirror's judgment. Remind me that You look at the heart, and that my worth was settled the moment You made me.",
    ],
    reflection: ["Speak to yourself today the way you'd speak to someone you love.", "Your worth isn't earned or lost. It was given."],
  },
  {
    id: "friendship", themes: ["relationships", "family", "sadness"],
    keywords: ["falling out", "fell out", "estranged", "not speaking", "don't talk anymore", "cut me off", "cut off contact", "friendship", "lost a friend", "my best friend and i", "my sister and i", "my brother and i", "family drama", "family conflict", "won't talk to me"],
    saints: ["rita", "francis", "therese"], scripture: ["prov17_17", "col3_13", "mt5_9"], devotions: ["peace_prayer", "litany_humility"],
    title: ["A prayer for a broken relationship", "A prayer for reconciliation"],
    opening: ["Distance from someone you love is its own grief. Let's bring it to God.", "Relationships can break and heal. Let's ask for wisdom and peace."],
    self: [
      "Lord, there's a distance between me and someone I love, and it hurts. Show me my part in it honestly. Give me the humility to apologize where I need to, the courage to reach out if it's right, and the peace to wait if it isn't. Heal what can be healed, and help me release what I can't control.",
      "Jesus, peacemaker, bless this broken relationship. Soften both our hearts, help us listen, and if reconciliation comes, let it be real. If it doesn't, help me carry the love without the bitterness.",
    ],
    reflection: ["You can only do your part. Pray for them by name today.", "Forgiveness and reconciliation aren't the same. Both are worth praying for."],
  },
  {
    id: "pet", themes: ["grief", "sadness"],
    keywords: ["my dog", "my cat", "my pet", "my dog's", "my cat's", "our dog", "our cat", "put down", "put to sleep", "euthan", "the vet", "my puppy", "my kitten", "my horse", "rainbow bridge"],
    saints: ["francis", "anthony", "kateri"], scripture: ["ps145_9", "ps34_18"], devotions: ["glory_be", "memorare"],
    title: ["A prayer after losing a pet", "A prayer for a beloved animal"],
    variants: [{
      when: "\\b(sick|ill|vet|surgery|injured|hurt|limping|not eating|cancer|tumor|old age|getting old)\\b",
      title: ["A prayer for a sick pet"],
      opening: ["Worrying about an animal you love is real worry. St. Francis would understand.", "Your love for them matters to God. Let's pray for them."],
      self: [
        "Lord, You made every creature and called it good. I'm worried about my animal and I love them so much. Ease their pain, guide their care, and give me the wisdom and courage to do what is kind.",
        "St. Francis, friend of every creature, pray with me. Lord, comfort my companion, give the vet skill and wisdom, and help me make loving choices, whatever comes.",
      ],
      reflection: ["Sit with them for a few quiet minutes today. Your presence comforts them.", "Doing what is kind, even when it's hard, is love."],
    }],
    opening: ["Grief for an animal you loved is real grief. Their love was a gift from God.", "St. Francis called the animals his brothers and sisters. Your love for yours matters."],
    self: [
      "Creator God, thank You for the gift of my companion: the loyalty, the comfort, the joy they brought into my days. My heart hurts. Hold my grief, and let me remember them with gratitude. Your tender mercies are over all Your works.",
    ],
    reflection: ["Let yourself grieve. Love doesn't come in sizes.", "Tell a favorite story about them to someone today."],
  },
  {
    id: "lostthing", themes: ["confusion", "hope"],
    keywords: ["lost my keys", "lost my wallet", "lost my phone", "lost my ring", "lost my purse", "lost my passport", "can't find my", "cant find my", "cannot find my", "misplaced", "lost something"],
    saints: ["anthony", "jude", "joseph"], scripture: ["lk15_8", "mt7_7"], devotions: ["st_anthony_lost", "glory_be"],
    title: ["A prayer to St. Anthony", "A prayer for something lost"],
    opening: ["St. Anthony to the rescue. Take a breath; it helps you look, too.", "Even small worries are welcome in prayer."],
    self: [
      "St. Anthony, friend of the poor and finder of lost things, please help me find what I've lost. Lord, calm my frustration, clear my mind, and guide my eyes and hands. And help me remember that what matters most can never be lost in You.",
    ],
    reflection: ["Retrace your steps slowly. Peace helps you see.", "When you find it, say thank you, and maybe give a little to the poor, as St. Anthony's friends do."],
  },
  {
    id: "milestone", celebrate: true, themes: ["gratitude", "faith", "family"],
    keywords: ["baptism", "baptized", "christening", "first communion", "confirmation", "getting married", "our wedding", "my wedding", "ordination", "new home", "new house", "moving into", "birthday", "graduat", "rcia", "ocia", "becoming catholic", "entering the church", "new job starts", "anniversary"],
    saints: ["joseph", "zelie_louis", "therese"], scripture: ["josh24_15", "ps118_24", "jer29_11"], devotions: ["gratitude_te_deum", "glory_be", "rosary_joyful"],
    title: ["A prayer for a new beginning", "A prayer of blessing", "A prayer for a special day"],
    opening: ["What a beautiful moment to mark with prayer. Let's ask God's blessing on it.", "Milestones are holy. Let's celebrate this one with God."],
    self: [
      "Lord, thank You for bringing us to this day. Bless this new beginning and everyone it touches. Fill it with Your grace and joy, protect it in the years ahead, and help us remember this moment when life gets ordinary or hard.",
      "Holy Spirit, come and bless this milestone. Pour Your gifts on everyone gathered, deepen our faith and our love, and let this day be the start of something good and lasting.",
    ],
    reflection: ["Write down what you're grateful for today. You'll treasure it later.", "As for me and my house, we will serve the Lord. Let that be your blessing."],
  },
  {
    id: "world", themes: ["peace", "anger", "hope"],
    keywords: [" war", "wars", "peace in", "the world", "injustice", "racism", "racist", "shooting", "violence in", "refugees", "the news", "election", "our country", "persecut", "famine", "disaster"],
    saints: ["martin_porres", "katharine_drexel", "francis"], scripture: ["mt5_9", "amos5_24", "jn14_27"], devotions: ["peace_prayer", "rosary_glorious"],
    title: ["A prayer for peace", "A prayer for justice"],
    opening: ["When the world feels broken, prayer is not nothing. It's where change begins.", "Let's carry the world's pain to God, and ask what our part is."],
    self: [
      "Prince of Peace, look upon our wounded world. Comfort everyone suffering from war, violence and injustice. Turn hearts from hatred, give wisdom to those who lead, and protect the vulnerable. Make me an instrument of Your peace in my own small corner, and show me how to help.",
      "God of justice, let justice roll down like waters. Heal the wounds of racism and division, give courage to peacemakers, and keep me from despair or indifference. Help me love my neighbor, especially the one who is different from me.",
    ],
    reflection: ["Do one small, concrete act of peace or justice today.", "Peace starts close to home: in a word, a choice, a kindness."],
  },
  {
    id: "joy_pregnancy", joy: true, themes: ["gratitude", "motherhood", "hope"],
    nervous: {
      title: ["A prayer for a new pregnancy"],
      opening: ["A new pregnancy can bring joy and fear at the same time. Both are welcome here.", "Let's bring this little life, and your nerves, to God."],
      self: [
        "Lord, I just found out I'm pregnant and I'm nervous and overwhelmed. Thank You for this little life, even while I'm afraid. Watch over my baby and my body, calm my worries, and give me what I need for each step ahead.",
        "Creator God, this is a lot to take in. Hold me and this baby. Guide me to good care, surround me with support, and give me peace about what I can't control.",
      ],
    },
    keywords: ["i'm pregnant", "im pregnant", "i am pregnant", "we're pregnant", "we are pregnant", "we're expecting", "we are expecting", "positive pregnancy test", "positive test", "found out i'm pregnant", "is pregnant", "going to be a mom", "going to be a dad", "going to be parents", "going to be a grandma", "going to be a grandpa", "going to be an aunt", "going to be an uncle", "grandbaby on the way", "baby on the way"],
    saints: ["gerard", "anne", "gianna"], scripture: ["ps139_13", "lk1_46", "jer29_11"], devotions: ["rosary_joyful", "glory_be", "memorare"],
    title: ["A prayer of joy for new life", "A prayer for a little one on the way"],
    titleOther: "A prayer of joy for {who} and the baby",
    opening: ["Congratulations! New life is one of God's greatest gifts. Let's give thanks.", "What wonderful news. Let's celebrate this little one with God, nerves and all."],
    openingOther: ["What joyful news! Let's give thanks for {who} and the little one on the way.", "Congratulations! Let's pray for {who} and this new life."],
    self: [
      "Creator God, thank You for this new little life! My heart is full of wonder, and maybe some nerves too. Knit this child together in health, watch over my body, and prepare me to love them with Your own tenderness. Thank You for trusting me with this gift.",
      "Lord, my soul magnifies You, like Mary's did when she carried Jesus. Thank You for this baby. Calm my worries, guard this pregnancy, and fill the months ahead with joy and peace as we wait to meet them.",
    ],
    other: [
      "Creator God, thank You for the joyful news about {who}! Bless {them} and the baby {they} {are} carrying with health and peace. Guard this pregnancy, calm any worries, and fill {their} home with joy in the months ahead.",
    ],
    reflection: ["Write down how you felt when you found out. Someday you'll want to share it with them.", "Every heartbeat is a small miracle. Let yourself marvel today."],
  },
  {
    id: "joy_baby", joy: true, themes: ["gratitude", "motherhood", "family"],
    keywords: ["baby was born", "gave birth", "had the baby", "had her baby", "had our baby", "our son was born", "our daughter was born", "welcomed our", "new grandbaby", "became a grandma", "became a grandpa", "became an aunt", "became an uncle", "is here!"],
    saints: ["anne", "gerard", "zelie_louis"], scripture: ["ps139_13", "lk1_46", "josh24_15"], devotions: ["rosary_joyful", "glory_be"],
    title: ["A prayer of thanks for a new baby"],
    titleOther: "A prayer of thanks for {who}'s baby",
    opening: ["Welcome to the world, little one! Let's give thanks.", "A new life is here. What a gift!"],
    openingOther: ["What joyful news for {who}! Let's thank God for this baby.", "Let's welcome this little one with a prayer of thanks."],
    self: [
      "Thank You, Lord, for this precious new life! Thank You for bringing mother and baby safely through. Bless this child with health, faith and a long life full of love, and bless our family as we grow around them.",
    ],
    other: [
      "Thank You, Lord, for the new baby in {who}'s life! Bless this child with health and every grace, give {them} rest and joy in these first days, and surround the whole family with Your love.",
    ],
    reflection: ["Say a blessing over the baby today, even a simple one: 'God bless you, little one.'", "New parents need care too. Bring a meal or a kind word if you can."],
  },
  {
    id: "joy_work", joy: true, themes: ["gratitude", "work", "inspiration"], hooks: { cajetan: "who trusted God's providence" },
    nervous: {
      title: ["A prayer for a new job"],
      opening: ["New beginnings bring nerves. That's normal, and God goes ahead of you.", "Starting something new is brave. Let's bring the nerves to God."],
      self: [
        "Lord, I start this new job soon and I'm nervous. Calm my mind, help me learn quickly and be patient with myself while I do. Give me kind coworkers, a good first impression and the confidence that You placed me here for a reason.",
        "St. Joseph, worker, walk with me into this new job. Lord, settle my nerves, help me listen well, ask good questions and treat everyone with kindness. Let this work become a blessing.",
      ],
    },
    variants: [{
      when: "\\b(raise|promot|bonus)",
      title: ["A prayer of thanks for a raise or promotion"],
      self: [
        "Thank You, Lord, for this recognition and this provision! Thank You for the people I work with and for the strength You've given me. Help me carry new responsibility with humility, use this increase wisely and generously, and keep my work in its right place in my life.",
        "St. Joseph, worker and provider, rejoice with me! Lord, thank You for blessing my work. Let me lead and serve with kindness, remember those who are still struggling, and share what I've been given.",
      ],
    }],
    keywords: ["got the job", "got a job", "got hired", "i'm hired", "new job", "job offer", "got an offer", "promotion", "promoted", "got a raise", "a raise", "pay raise", "new position", "dream job", "first job", "started my business", "landed"],
    saints: ["joseph", "cajetan", "katharine_drexel"], scripture: ["jer29_11", "ps118_24", "phil4_19"], devotions: ["glory_be", "gratitude_te_deum", "examen"],
    title: ["A prayer of thanks for good news at work", "A prayer for a new job"],
    opening: ["Congratulations! Let's thank God for this open door.", "Your hard work and God's providence met today. Let's celebrate."],
    self: [
      "Thank You, Lord, for this good news! Thank You for opening this door and for everyone who helped me get here. Bless this new chapter of my work. Give me wisdom, humility and joy, and let me use what I earn and what I learn to do good for others.",
      "St. Joseph, worker, rejoice with me! Lord, I'm grateful and a little nervous. Help me start well, learn quickly and treat everyone around me with kindness. Let this work be a blessing to my family and a way to serve You.",
    ],
    reflection: ["Celebrate! Then thank someone who helped you along the way.", "Consider sharing a small part of this blessing with someone in need."],
  },
  {
    id: "joy_school", joy: true, themes: ["gratitude", "decisions", "inspiration"],
    nervous: {
      title: ["A prayer for a new beginning at school"],
      opening: ["New beginnings bring nerves. You're more ready than you feel.", "Let's ask God to go ahead of you into this new start."],
      self: [
        "Lord, I'm excited about this and also really nervous. Help me trust that I belong here. Give me good friends, a clear mind and the courage to ask for help when I need it.",
      ],
    },
    keywords: ["got into", "accepted to", "accepted into", "acceptance letter", "got accepted", "scholarship", "passed my exam", "passed the exam", "passed the bar", "passed my boards", "passed my test", "passed my driving test", "i passed", "passed my", "passed her", "passed his", "passed their", "passed the test", "made the team", "made honor roll", "dean's list", "got my license"],
    saints: ["ignatius", "therese", "thomas_more"], scripture: ["jer29_11", "ps118_24", "eph2_10"], devotions: ["glory_be", "gratitude_te_deum"],
    title: ["A prayer of thanks for good news"],
    opening: ["Congratulations! All that work paid off. Let's thank God.", "What a wonderful achievement. Let's celebrate with gratitude."],
    self: [
      "Thank You, Lord, for this good news! Thank You for the gifts You've given me and for everyone who supported me. Bless what comes next. Help me keep learning with humility and use what I've been given for good.",
    ],
    reflection: ["Thank a teacher, parent or friend who helped you get here.", "You were made for good works. This is one of them."],
  },
  {
    id: "joy_love", joy: true, themes: ["gratitude", "relationships", "marriage"],
    nervous: {
      title: ["A prayer for a new relationship"],
      opening: ["New love can be exciting and nerve-wracking. Let's bring it to God.", "Let's ask God to guide this new chapter of your heart."],
      self: [
        "Lord, I'm excited and nervous about this relationship. Guide us as we get to know each other. Help me be honest and myself, protect my heart, and let this grow in the direction You want for both of us.",
      ],
    },
    variants: [{
      when: "engaged|said yes|proposed",
      title: ["A prayer for our engagement"],
      nervous: {
        title: ["A prayer for our engagement"],
        opening: ["Big joy often comes with big nerves. Let's bring both to God.", "Wedding plans can be overwhelming. Let's keep your marriage at the center."],
        self: ["Lord, thank You for our engagement, and help me with the nerves: the planning, the costs, the big changes ahead. Keep our focus on our marriage more than the wedding, help us make wise choices together, and give us peace and joy along the way."],
      },
      self: [
        "Thank You, Lord, for our engagement! Thank You for bringing us together and for this promise. Prepare our hearts for the sacrament of marriage. Teach us to love each other with patience, honesty and faithfulness, and be the center of the home we're going to build.",
        "Jesus, You blessed the wedding at Cana. Bless us as we prepare to marry. Keep our focus on our marriage more than our wedding day, help us grow in faith together, and fill our engagement with joy and peace.",
      ],
    }],
    keywords: ["got engaged", "we're engaged", "we are engaged", "i'm engaged", "she said yes", "he said yes", "he proposed", "she proposed", "met someone", "fell in love", "new relationship", "found the one", "falling in love"],
    saints: ["zelie_louis", "raphael", "francis"], scripture: ["1cor13_4", "ps118_24", "col3_13"], devotions: ["rosary_luminous", "glory_be"],
    title: ["A prayer of thanks for love", "A prayer for a new love"],
    opening: ["Congratulations! Love is worth celebrating. Let's give thanks.", "What joyful news. Let's invite God into this love."],
    self: [
      "Thank You, Lord, for this love! Thank You for bringing us together. Be at the center of our relationship. Teach us patience, kindness and honesty, and let our love grow deeper and more faithful through every season.",
      "God of love, my heart is full. Bless this person You've brought into my life. Guide us as we discern our future, keep us close to You and to each other, and let our love be a sign of Yours.",
    ],
    reflection: ["Pray together, even briefly. It's one of the best gifts you can give your love.", "Love is patient and kind. Practice both today."],
  },
  {
    id: "joy_health", joy: true, themes: ["gratitude", "health", "hope"],
    keywords: ["cancer free", "cancer-free", "in remission", "remission", "clear scan", "scan was clear", "scans were clear", "results came back good", "results were good", "good results", "results were normal", "came back clear", "came back good", "came back negative", "came back benign", "not cancer", "isn't cancer", "all clear", "surgery went well", "successful surgery", "benign", "came home from the hospital", "home from the hospital", "recovering well", "is recovering", "got better", "feeling better", "no more chemo", "last chemo", "rang the bell"],
    saints: ["raphael", "peregrine", "bernadette"], scripture: ["jer17_14", "ps118_24", "mk5_34"], devotions: ["gratitude_te_deum", "glory_be", "anima_christi"],
    title: ["A prayer of thanks for healing", "A prayer of thanks for good news"],
    titleOther: "A prayer of thanks for {who}'s healing",
    opening: ["What wonderful news! Let's thank the Lord who heals.", "Answered prayers deserve thanksgiving. Let's celebrate."],
    openingOther: ["What wonderful news about {who}! Let's give thanks.", "Let's thank God for {who}'s healing."],
    self: [
      "Thank You, Lord, for this healing and this good news! Thank You for every doctor, nurse and friend who carried me. Strengthen my body as I keep recovering, and let me never forget what You've done.",
    ],
    other: [
      "Thank You, Lord, for the good news about {who}! Thank You for every person who cared for {them}. Keep strengthening {them}, give {them} rest and joy, and let us never forget Your goodness in this.",
      "Divine Physician, You heard our prayers for {who}. We are so grateful. Continue {their} healing, carry {them} through recovery, and let this gift draw us all closer to You.",
    ],
    reflection: ["Thank the people who prayed with you. Let them share the joy.", "Remember this day the next time you're afraid."],
  },
  {
    id: "joy_sober", joy: true, themes: ["gratitude", "addiction", "growth"],
    keywords: ["year sober", "years sober", "months sober", "days sober", "sober anniversary", "sobriety anniversary", "sober birthday", "clean for a year", "years clean", "months clean", "got my chip", "my coin"],
    saints: ["matt_talbot", "augustine", "moses_black"], scripture: ["2cor5_17", "lam3_22", "ps118_24"], devotions: ["glory_be", "act_of_hope"],
    title: ["A prayer of thanks for sobriety"],
    opening: ["Congratulations! Every sober day is a gift and a victory. Let's give thanks.", "Look how far you've come, one day at a time. Let's celebrate with God."],
    self: [
      "Thank You, Lord, for every sober day! I couldn't have done this without You and the people You sent me. Keep me humble and grateful, protect me from complacency, and let my story give hope to someone still struggling.",
    ],
    titleOther: "A prayer of thanks for {who}'s sobriety",
    openingOther: ["What a gift! Let's thank God for {who}'s sobriety.", "Every sober day is a miracle. Let's celebrate {who}."],
    other: [
      "Thank You, Lord, for {who}'s sobriety! Thank You for every hard-won day and every person who walked with {them}. Keep {them} strong, humble and surrounded by support, and let {their} story give hope to others.",
    ],
    reflection: ["Celebrate this, and tell someone who's still struggling that it's possible.", "Just for today, again. Gratitude keeps recovery strong."],
  },
  {
    id: "joy_answered", joy: true, themes: ["gratitude", "faith", "hope"],
    keywords: ["answered prayer", "prayers were answered", "prayer was answered", "prayers answered", "god came through", "it's a miracle", "a miracle", "finally happened", "everything worked out", "it all worked out", "good news!"],
    saints: ["therese", "jude", "anthony"], scripture: ["ps118_24", "lk1_46", "1thes5_16"], devotions: ["gratitude_te_deum", "glory_be"],
    title: ["A prayer of thanks for an answered prayer"],
    opening: ["God heard you! Let's give thanks.", "Answered prayers deserve thanksgiving. What a joy."],
    self: [
      "Thank You, Lord! You heard my prayer and answered it. I'm amazed and grateful. Let me never forget Your faithfulness, and let this joy make me braver in prayer and more generous to others.",
    ],
    reflection: ["Tell someone how God answered you. Your story might be the hope they need.", "Write this down. Faith is built from remembered answers."],
  },
  {
    id: "joy_newchapter", joy: true, themes: ["inspiration", "decisions", "hope"],
    keywords: ["excited but nervous", "nervous but excited", "excited and nervous", "nervous and excited", "scared but excited", "excited but scared", "new chapter", "first day", "starting a new", "starting college", "starting school", "big move", "new city", "new adventure", "moving abroad", "can't wait", "cant wait"],
    saints: ["raphael", "ignatius", "francis"], scripture: ["jer29_11", "dt31_6", "prov3_5"], devotions: ["suscipe", "glory_be"],
    title: ["A prayer for a new chapter", "A prayer for a fresh start"],
    opening: ["Excited and nervous is a holy combination. It means something good is beginning.", "New beginnings are worth blessing. Let's ask God to go ahead of you."],
    self: [
      "Lord, I'm excited and a little nervous about what's ahead. Thank You for this new chapter. Go ahead of me and prepare the way. Give me courage for the first steps, open my heart to new people, and let me feel Your presence in every new place.",
      "St. Raphael, guide of journeys, walk with me. Lord, bless this beginning. Turn my nerves into trust and my excitement into gratitude, and help me grow into who You're calling me to be.",
    ],
    reflection: ["Nerves are just excitement that hasn't found its footing yet. You'll find it.", "Take a moment to notice what you're grateful for at the start of this."],
  },
  {
    id: "gratitude", celebrate: true, themes: ["gratitude"],
    keywords: ["thank", "grateful", "blessed", "celebrat", "good news", "got married", "anniversary", "so happy", "so excited", "thrilled", "praise god"],
    saints: ["francis", "therese", "katharine_drexel"], scripture: ["ps118_24", "1thes5_16", "lk1_46"], devotions: ["gratitude_te_deum", "glory_be"],
    title: ["A prayer of thanksgiving", "A prayer of joy"],
    opening: ["What a gift to stop and give thanks. Let's celebrate with God.", "Joy shared with God is joy multiplied."],
    self: [
      "Thank You, Lord! My heart is full. Thank You for this gift and for every way You've carried me to this moment. Let my joy overflow into kindness, and help me remember this day when times are hard.",
      "Generous God, every good gift comes from You. I praise You for Your goodness and for answering me. Make me humble in blessing and generous with what I've received.",
    ],
    reflection: ["Tell someone about this gift today. Gratitude grows when it's shared.", "Write this blessing down somewhere you'll see it later."],
  },
];

// ---------- More prayers for the most common intentions ----------
// Research on prayer requests (Radiant Foundation 2023, Barna 2017) shows people pray
// most for loved ones in crisis, the sick, gratitude, family needs, guidance, health,
// forgiveness and safety. These additions deepen exactly those.
INTENTS.unshift({
  id: "lovedone", themes: ["family", "hope", "fear"],
  keywords: ["~pray for my", "~please pray for", "going through a lot", "going through a hard time", "going through a tough time", "going through something", "rough time", "rough patch", "having a hard time", "a hard season", "is struggling", "are struggling", "not doing well", "isn't doing well", "in a bad place", "really hard right now"],
  saints: ["jude", "raphael", "monica"], scripture: ["is41_10", "ps34_18", "rom8_28"], devotions: ["memorare", "novena_st_jude", "divine_mercy_chaplet"],
  title: ["A prayer for a hard season", "A prayer when life is hard"],
  titleOther: "A prayer for {who}",
  opening: ["You don't have to explain everything for God to understand. Let's bring this hard season to Him.", "Hard seasons don't last forever, even when they feel like they will. You're not alone in this one."],
  openingOther: ["Praying for someone you love is one of the most powerful things you can do. Let's pray for {who}.", "You don't need all the details. God knows exactly what {who} needs."],
  self: [
    "Lord, I'm going through a hard time, and I don't even have all the words for it. You know every part of it. Carry what I can't carry, give me strength for today, and send me the people and the grace I need. Remind me that this season is not the end of my story.",
    "Jesus, I'm tired and I'm hurting. I don't need to understand everything right now. I just need You close. Stay with me in this, give me one good thing to hold onto today, and lead me gently toward better days.",
  ],
  other: [
    "Lord, You know everything {who} is going through, even the parts {they} can't put into words. Surround {them} with Your love and protection. Give {them} strength for today, peace in the waiting, and people who will walk with {them}. Show me how to love {them} well.",
    "Jesus, I lift {who} up to You. Whatever {they} {are} carrying right now, carry it with {them}. Bring comfort where there is pain, hope where there is fear, and light where things feel dark. Let {them} feel, somehow, that {they} {are} not alone.",
    "Heavenly Father, I don't know exactly what {who} needs, but You do. Give {them} exactly that: healing, wisdom, rest, courage or peace. Hold {them} close tonight, and let my love for {them} become prayer.",
  ],
  reflection: ["Send them a message today, even a short one: 'Thinking of you and praying for you.'", "Hard seasons pass. Hold on to one small good thing today."],
});

const EXTRA = {
  cancer: {
    self: ["Lord, I hand You my fear of this illness and everything it might mean. Be my strength in treatment, my rest in exhaustion and my hope in uncertainty. Let me feel held by Your love and by the people You've placed around me."],
    other: ["Jesus, You never turned away anyone who was suffering. Stay close to {who} through every scan, treatment and long night. Fill {them} with courage, protect {their} body, and let {them} feel surrounded by the prayers of everyone who loves {them}."],
  },
  illness: {
    self: ["Heavenly Father, my body is tired and I feel discouraged. Restore my health, if it is Your will, and give me peace in the meantime. Help me rest without guilt and accept care with gratitude."],
    other: ["Heavenly Father, watch over {who} tonight. Bring rest to {their} body and peace to {their} mind. Strengthen {them} a little more each day, and help {them} feel how many people are praying for {them}."],
  },
  mental: {
    self: ["Lord, I'm not okay right now, and I'm telling You honestly. I don't have to perform for You. Meet me in the heaviness, give me enough strength to take care of myself today, and help me believe that light will come again."],
    other: ["Holy Spirit, Comforter, be near to {who}. Calm {their} mind, lift {their} spirit, and give {them} courage to keep going and to ask for help. Let {them} know {they} {are} not a burden and {they} {are} not alone."],
  },
  grief: {
    self: [
      "Lord, I miss them so much. Some moments the grief catches me by surprise. Hold me in those moments. Thank You for the gift of their life and for the love we shared, and keep them safe with You until we are together again.",
      "God of mercy, I don't know how to keep going without them, so I'll just ask You for today. Give me strength for this day, comfort for this night, and the hope of the resurrection to hold onto.",
    ],
    other: ["Eternal Father, I commend {who} to Your mercy. Thank You for {their} life and for everything {they} gave us. Wipe away every tear, bring {them} into the fullness of Your joy, and let us feel {their} love still, until we meet again."],
  },
  overwhelm: {
    self: ["Lord, I'm stretched too thin. Show me what can wait, what I can ask for help with, and what truly matters today. Give me rest, even a small one, and remind me that I don't have to do everything well to be loved."],
    other: ["Jesus, {who} is carrying so much right now. Lighten {their} load, send {them} help, and give {them} rest. Let {them} feel Your peace in the middle of everything."],
  },
  gratitude: {
    self: [
      "Lord, today I just want to say thank You. For the people I love, for the breath in my lungs, for the small mercies I usually overlook. Open my eyes to Your goodness everywhere, and let my gratitude spill over into kindness.",
      "Gracious God, You have been so good to me. Thank You for carrying me through the hard days and blessing me with the good ones. Make me generous with what I've received, and keep me close to You in joy as in sorrow.",
      "Praise You, Lord! My heart is full and I don't want to forget this feeling. Thank You for every gift, seen and unseen. Let me remember this joy on harder days, and help me share it freely.",
    ],
  },
  parenting: {
    self: [
      "Lord, I'm worried about my children. You know their hearts, their struggles and their futures better than I do. Protect them when I can't, guide them when they won't listen to me, and draw them close to You. Help me trust You with them.",
      "St. Joseph, guardian of the Holy Family, watch over my home. Lord, give me the right words for my children today, the patience to listen, and the humility to apologize when I get it wrong. Let our home be a place where they always feel loved.",
    ],
    other: [
      "Lord, I bring {who} to You. You love {them} even more than I do. Protect {them}, guide {their} choices, heal whatever is hurting {them}, and draw {them} close to Your heart. Give me wisdom to know when to speak and when to simply love.",
    ],
  },
  job: {
    self: ["Lord, I've been searching and waiting, and it's discouraging. Keep me from losing heart. Lead me to the right opportunity, give me favor with the people I meet, and provide for my needs while I wait."],
    other: ["St. Joseph, provider, pray for {who}. Lord, You know how much work matters to {them} right now. Open the right door, give {them} confidence and favor, and provide for {their} family during {their} search."],
  },
  money: {
    self: ["Lord, I'm afraid of not having enough. You've provided before, and I ask You to provide again. Give me wisdom with every dollar, help from unexpected places, and peace that doesn't depend on my bank account."],
    other: ["Father, You know what {who} needs. Provide for {them} and {their} family, open doors {they} can't see, and give {them} peace in the worry. Show me how I can help."],
  },
  decision: {
    self: ["Lord, I keep going back and forth. Calm my mind so I can hear You. Show me the choice that leads toward love, faith and peace, and give me the courage to make it and the freedom to let go of the other path."],
    other: ["Holy Spirit, give {who} wisdom in this decision. Quiet the pressure and fear, surround {them} with good counsel, and lead {them} toward the choice that brings lasting peace."],
  },
  exam: {
    other: ["Holy Spirit, be with {who} during this test. Give {them} a clear mind and a calm heart, help {them} remember what {they} studied, and let {them} know that {their} worth is not a grade."],
  },
  protection: {
    self: ["Lord, as I go about this day, cover me with Your protection. Keep me safe on the roads and in every place I go, guard my heart from fear, and bring me home in peace."],
    other: ["Guardian angels, watch over {who}. Lord, protect {them} today on every road, in every place and from every danger, seen and unseen. Bring {them} home safely, and calm my worry with trust in Your care."],
  },
  lonely: {
    other: ["Lord, {who} feels alone right now. Be {their} companion. Send {them} friendship, kindness and community, and show me how I can be part of that."],
  },
  heartbreak: {
    other: ["Lord, {who}'s heart is hurting. Heal {their} wounds, remind {them} of {their} worth, and surround {them} with people who love {them} well. Give {them} hope for what's ahead."],
  },
  abuse: {
    other: ["Lord, I'm afraid for {who}. Protect {them} from harm. Give {them} the courage to reach out, safe people and places to turn to, and a clear way to safety. Show me how to support {them} without pressure, and keep {them} close to Your heart."],
  },
  selfworth: {
    other: ["Lord, {who} can't see how precious {they} {are}. Open {their} eyes to see {themself} the way You do. Heal the voices that tell {them} {they} {are} not enough, and let {them} feel deeply, unshakably loved."],
  },
  forgive: {
    self: ["Lord, I want to let go of this resentment, but it keeps coming back. Each time it does, help me hand it to You again. Heal the place where I was hurt, and give me peace that doesn't depend on an apology."],
  },
  guilt: {
    self: ["Lord, I keep replaying what I did. Thank You that Your mercy is bigger than my mistakes. Help me make amends where I can, learn what I need to learn, and then let me rest in Your forgiveness instead of carrying this forever."],
  },
  marriage: {
    self: ["Lord, bless my marriage. Thank You for my spouse, even on the hard days. Help us choose each other again, protect us from what could pull us apart, and keep You at the center of our home."],
  },
  caregiving: {
    other: ["Lord, bless {who}, who gives so much of {themself} caring for someone else. Renew {their} strength, send {them} help and rest, and let {them} feel how much {their} love matters."],
  },
};
EXTRA.money.self.push(
  "Jesus, You told us not to worry about tomorrow, and I'm trying. Today I give You every bill, every number and every fear. Help me take one wise step today, and trust You with the rest.",
  "Lord, money is tight and our home feels tense. Protect our family from blaming each other. Help us talk honestly, plan together and trust You together.",
);
EXTRA.money.other.push(
  "St. Joseph, provider, pray for {who}. Lord, {who} is carrying so much financial stress. Lift the weight from {their} shoulders, bring unexpected help, and give {them} rest tonight.",
  "Lord, I'm worried about {who}'s finances. Give {them} wisdom, opportunity and peace, and give me the right words and the right ways to support {them}.",
);
for (const [id, add] of Object.entries(EXTRA)) {
  const it = INTENTS.find((x) => x.id === id);
  if (!it) continue;
  if (add.self) it.self = [...(it.self || []), ...add.self];
  if (add.other) it.other = [...(it.other || []), ...add.other];
}
const MORE_OPENINGS = {
  cancer: ["Whatever the scans say, you are held. Let's pray."],
  illness: ["Being unwell is hard, and so is waiting to feel better. Let's bring it to God."],
  mental: ["You reached out today, and that matters. Let's pray together."],
  grief: ["Your love for them hasn't gone anywhere. Let's bring it, and your grief, to God."],
  parenting: ["Every worry you carry for your children, God carries too."],
  gratitude: ["Gratitude is one of the most beautiful prayers there is. Let's give thanks."],
  overwhelm: ["Let's set some of this down at Jesus's feet."],
  job: ["God sees your effort and your need. Let's ask Him for the right door."],
};
for (const [id, lines] of Object.entries(MORE_OPENINGS)) {
  const it = INTENTS.find((x) => x.id === id);
  if (it) it.opening = [...it.opening, ...lines];
}

// A short line for each saint, used as "St. X, ___, pray for me."
export const SAINT_HOOKS = {
  monica: "who never stopped praying for her son", gianna: "who loved her family with her whole life", anne: "grandmother of Jesus",
  joseph: "protector of the Holy Family", zelie_louis: "who knew both joy and loss in family life", rita: "patron of impossible causes",
  thomas_more: "who chose conscience over comfort", bakhita: "who found freedom and forgave", moses_black: "who was made new by grace",
  matt_talbot: "who stayed sober one day at a time", augustine: "whose restless heart found rest in God", martin_porres: "who cared for the sick with tenderness",
  benedict_moor: "who served with humble joy", perpetua_felicity: "brave mothers of the early Church", charles_lwanga: "who protected the young and stood firm",
  katharine_drexel: "who gave everything away for love", cajetan: "patron of those seeking work", jude: "patron of desperate situations",
  dymphna: "patron of those who suffer in mind and heart", padre_pio: "who told us to pray, hope, and not worry", therese: "who found holiness in little things",
  teresa_avila: "who knew that God alone suffices", john_cross: "who found God in the dark night", teresa_calcutta: "who kept loving through darkness",
  peregrine: "patron of those with cancer", bernadette: "who trusted Mary in her suffering", elizabeth_seton: "who knew grief and kept hoping",
  ignatius: "teacher of discernment", francis: "who praised God for all creation", mary_magdalene: "first witness of the Resurrection",
  thomas_apostle: "who brought his doubts to Jesus", anthony: "friend of the poor", faustina: "apostle of Divine Mercy",
  kateri: "who found God in a lonely path", michael: "defender and protector", raphael: "angel of healing and safe journeys",
  gabriel: "who said, 'Do not be afraid'", guardian_angel: "who never leaves my side",
  dismas: "who received mercy at the last hour", cabrini: "mother of immigrants", gerard: "patron of mothers and babies",
};

// Lines for feelings mentioned alongside the main intention (first person).
export const JOY_NERVES = ["And where my joy is mixed with nerves, steady me, Lord.", "Calm the butterflies, Lord, and let me enjoy this gift."];

export const FEELING_LINES = {
  fear: ["And Lord, I'm afraid. Be my courage.", "Take my fear, Lord, and give me Your peace in its place."],
  anxiety: ["Quiet my anxious thoughts, Lord, and help me breathe.", "Calm the worry that keeps circling in my mind."],
  sadness: ["Hold my sadness gently, Lord. I don't have to hide it from You.", "Comfort the heaviness in my heart."],
  anger: ["You see my anger too, Lord. Help me feel it honestly and not let it harden me.", "Hold my anger and turn it toward healing."],
  loneliness: ["And when I feel alone, remind me that You are near.", "Be my companion in the lonely moments."],
  overwhelm: ["When it all feels like too much, show me just the next step.", "Lift what I was never meant to carry."],
  discouragement: ["When I'm discouraged, lend me Your hope.", "Strengthen my tired heart."],
  confusion: ["Where I can't see clearly, be my light.", "Untangle what I cannot understand."],
};

export const INVOCATIONS = {
  self: ["Loving God,", "Lord Jesus,", "Heavenly Father,", "God of all comfort,", "Holy Spirit,", "Merciful Lord,"],
  other: ["Loving God,", "Lord Jesus,", "Heavenly Father,", "Merciful Lord,"],
};

export const CLOSINGS = {
  joy: [
    "Thank You, Lord. Let my joy become praise.",
    "Keep me grateful, Lord, even when this becomes ordinary.",
    "Every good gift comes from You. Glory to You!",
  ],
  joyOther: [
    "Thank You, Lord, for loving {them} so well.",
    "Let this joy overflow for {them} and for all of us. Glory to You!",
  ],
  departed: [
    "Comfort me in the missing, Lord, until we meet again.",
    "Let my love for {them} become prayer, today and always.",
    "Eternal rest grant unto {them}, O Lord, and let perpetual light shine upon {them}.",
  ],
  self: [
    "Stay close to me today, Lord, and let me feel that I am held.",
    "I place all of this in Your hands. Give me peace for today.",
    "Thank You for hearing me. Help me trust You with what comes next.",
    "Be with me in every hour of this day.",
    "Give me Your peace, Lord, the kind the world can't give.",
    "Whatever today holds, let me face it with You.",
    "Hold me close tonight, and wake me with hope.",
  ],
  other: [
    "And hold me too, Lord, as I love {them} through this.",
    "Give me patience and hope as I keep praying for {them}.",
    "Thank You for loving {them} even more than I do.",
    "Let {them} feel, somehow, how many people are praying for {them}.",
    "I trust {them} to Your care, Lord, tonight and always.",
    "Show me how to be Your love for {them} this week.",
  ],
};

// Pronouns for "praying for someone" (my mom → she/her).
const FEM = /\b(mom|mother|mama|grandma|grandmother|sister|daughter|wife|girlfriend|aunt|niece|fiancee|stepmom|godmother|mother-in-law)\b/;
const MASC = /\b(dad|father|papa|grandpa|grandfather|brother|son|husband|boyfriend|uncle|nephew|fiance|stepdad|godfather|father-in-law)\b/;
export function pronounsFor(who = "", text = "") {
  const w = who.toLowerCase().split(/\s+/).pop(); // "my mom's friend" → friend
  // "my friend, she's..." — for relations that could be anyone, take a hint from the message
  if (!FEM.test(w) && !MASC.test(w) && text) {
    const she = /\b(she|she's|shes|her|herself)\b/i.test(text), he = /\b(he|he's|hes|him|his|himself)\b/i.test(text);
    if (she && !he) return { they: "she", them: "her", their: "her", are: "is", were: "was", themself: "herself" };
    if (he && !she) return { they: "he", them: "him", their: "his", are: "is", were: "was", themself: "himself" };
  }
  if (FEM.test(w)) return { they: "she", them: "her", their: "her", are: "is", were: "was", themself: "herself" };
  if (MASC.test(w)) return { they: "he", them: "him", their: "his", are: "is", were: "was", themself: "himself" };
  return { they: "they", them: "them", their: "their", are: "are", were: "were", themself: "themselves" };
}
const RELATION = /\bmy (?:(?:teenage|teen|little|older|younger|oldest|youngest|adult|grown|elderly|sweet) )?(mother-in-law|father-in-law|in-laws|sister-in-law|brother-in-law|mom|mother|mama|dad|father|papa|grandma|grandmother|grandpa|grandfather|sister|brother|son|daughter|husband|wife|boyfriend|girlfriend|fianc[eé]e?|partner|friend|best friend|aunt|uncle|cousin|niece|nephew|baby|kids|children|family|parents|stepmom|stepdad|godmother|godfather|coworker|neighbor)\b/i;

// Find who the prayer is for, when the person is praying for someone else.
const REL_WORDS = "mom|mother|dad|father|grandma|grandmother|grandpa|grandfather|sister|brother|son|daughter|husband|wife|boyfriend|girlfriend|partner|friend|aunt|uncle|cousin|baby|kids|children|parents|family";
export function detectWho(text = "", intentId) {
  const m = text.match(RELATION);
  if (!m) return "";
  // "my friend's mom died": the prayer is for the friend's mom
  const chain = text.slice(m.index + m[0].length).match(new RegExp(`^'s (${REL_WORDS})\\b`, "i"));
  if (chain) return `${m[0].toLowerCase()}'s ${chain[1].toLowerCase()}`;
  const forSomeone = /\bpray(ing)? for (my|her|him|them|our)\b/i.test(text);
  const theirStory = ["joy_sober", "lovedone", "joy_pregnancy", "joy_baby", "joy_health", "difficult", "cancer", "illness", "faithchild", "grief", "protection", "pregnancy", "addiction", "mental", "dying", "sickchild", "prison", "immigration", "suicideloss"].includes(intentId);
  // "my husband left me" is the speaker's story, not a prayer for him
  const selfStory = /\b(left me|cheated on me|hurt me|lied to me|broke up with me|and i (keep|are|have|can't|cant|don't|dont|aren't|fight|argue))\b/i.test(text);
  // "my husband lost his job", "my son is struggling": the story is about them
  const aboutThem = new RegExp(`\\b${m[0].replace(/[-]/g, "\\-")}('s)? (is|was|has|had|lost|got|needs|just|starts|started|can't|cant|won't|keeps|isn't|doesn't|has been|went)\\b`, "i").test(text);
  return (forSomeone || theirStory || aboutThem) && !selfStory ? m[0].toLowerCase() : "";
}

const WORRY = /\b(worried|worry|scared|afraid|anxious|anxiety|nervous|stressed|struggling|hard|hate|dread|lost|fired|laid off|sad|crying|can't|cannot|won't)\b/;
const HAPPY = /(!|\b(excited|happy|thrilled|grateful|thankful|blessed|finally|yay|so glad|praise god|good news|congrat|celebrat|can't wait|cant wait)\b)/;
const PRIORITY = ["pet", "joy_school", "prison"];
export function detectIntent(text = "", themes = []) {
  const t = ` ${text.toLowerCase()} `;
  const worried = WORRY.test(t), happy = HAPPY.test(t);
  let best = null;
  for (const it of INTENTS) {
    // keywords starting with "~" are generic ("my son") and count for less than specific ones ("jail")
    if ((it.id === "pregnancy" || it.id === "joy_pregnancy") && /\b(not pregnant|didn'?t get pregnant|wish i (was|were) pregnant|negative test)\b/.test(t)) continue;
    let hits = it.keywords.reduce((n, k) => (k.startsWith("~") ? (t.includes(k.slice(1)) ? n + 0.5 : n) : t.includes(k) ? n + 1 : n), 0);
    const hasNerves = it.nervous || (it.variants || []).some((v) => v.nervous);
    if (it.joy && hits) hits *= worried && !happy && !hasNerves ? 0.4 : 2;
    if (PRIORITY.includes(it.id) && hits) hits += 0.25;
    if (hits && (!best || hits > best.hits)) best = { it, hits };
  }
  if (best) return best.it;
  // fall back to the strongest theme (e.g. a chip, or a feeling word)
  return INTENTS.find((it) => !it.noFallback && !it.joy && it.themes[0] === themes[0]) || null;
}

export function fill(str, who, text = "") {
  const p = pronounsFor(who, text);
  return str.replace(/\{who\}/g, who).replace(/\{them\}/g, p.them).replace(/\{their\}/g, p.their).replace(/\{they\}/g, p.they).replace(/\{are\}/g, p.are).replace(/\{themself\}/g, p.themself).replace(/\{were\}/g, p.were);
}
