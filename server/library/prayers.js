// Hand-written prayer library for the built-in (no-AI) composer.
// Built around the intentions people most often bring to prayer. Each intention has
// its own words, saints, Scripture and devotions; pieces are combined so prayers
// rarely repeat. Placeholders in "other" text: {who} (e.g. "my mom"), {them}, {their}, {they}.
// Please have a priest or catechist review before launch.

export const INTENTS = [
  {
    id: "abuse", themes: ["fear", "family"],
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
    id: "difficult", themes: ["family", "relationships", "anger"],
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
    id: "suicideloss", themes: ["grief", "sadness"],
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
    id: "dying", themes: ["grief", "health", "fear"], hooks: { joseph: "patron of a happy death" },
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
    id: "sickchild", themes: ["parenting", "health", "fear"],
    keywords: ["nicu", "picu", "pediatric", "children's hospital", "my child is sick", "my son is sick", "my daughter is sick", "my baby is sick", "special needs", "autism", "autistic", "down syndrome", "disability", "disabilities", "developmental delay", "seizures", "my son has", "my daughter has", "my child has", "my baby has"],
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
    keywords: ["cancer", "chemo", "tumor", "tumour", "biopsy", "radiation", "oncolog", "surgery", "operation", "diagnos", "scan results", "mri", "malignant"],
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
    keywords: ["sick", "illness", "ill ", "hospital", "in pain", "chronic", "flu", "covid", "infection", "heart attack", "stroke", "my health", "doctor", "recovering from"],
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
    keywords: ["died", "passed away", "passed on", "funeral", "death of", "lost my mom", "lost my dad", "lost my mother", "lost my father", "lost my husband", "lost my wife", "lost my son", "lost my daughter", "lost my brother", "lost my sister", "lost my grandma", "lost my grandpa", "lost my friend", "grieving", "grief", "anniversary of", "miss her", "miss him", "cemetery", "was killed"],
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
    id: "babyloss", themes: ["grief", "motherhood"], hooks: { gianna: "who gave her life for her child" },
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
    keywords: ["pregnant", "expecting", "due date", "labor", "delivery", "c-section", "baby on the way", "trimester", "giving birth", "ultrasound"],
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
    keywords: ["infertil", "ivf", "trying to conceive", "trying for a baby", "can't get pregnant", "cant get pregnant", "ttc", "fertility"],
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
    keywords: ["~my son", "~my daughter", "~my kids", "~my children", "~my child", "~my teen", "~my toddler", "~my baby", "parenting", "as a mom", "as a dad", "being a mom", "being a parent", "single mom", "single dad", "custody"],
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
    keywords: ["my marriage", "~my husband", "~my wife", "divorce", "separated", "separation", "we fight", "fighting", "cheated", "affair", "unfaithful", "counseling", "marriage"],
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
    keywords: ["broke up", "break up", "breakup", "heartbroken", "heartbreak", "my ex", "dumped", "left me", "walked out", "ghosted", "rejected"],
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
    keywords: ["job", "lost my job", "laid off", "layoff", "fired", "unemploy", "interview", "career", "my boss", "coworker", "resume", "applications", "work is"],
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
    keywords: ["money", "rent", "bills", "debt", "afford", "evict", "mortgage", "broke", "paycheck", "food stamps", "can't pay", "financial", "overdraft"],
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
    keywords: ["addict", "sober", "sobriety", "relapse", "drinking", "alcohol", "drugs", "using again", "recovery", "gambling", "porn", "clean for", "rehab", "aa meeting", "na meeting", "craving"],
    saints: ["matt_talbot", "moses_black", "augustine"], scripture: ["1cor10_13", "2cor5_17", "lam3_22"], devotions: ["st_michael", "sacrament_reconciliation", "divine_mercy_chaplet"],
    title: ["A prayer for recovery", "A prayer for strength today"],
    titleOther: "A prayer for {who}'s recovery",
    opening: ["Every day of recovery is a victory. If today is hard, you're still not alone.", "God's mercy is new every morning, including this one."],
    openingOther: ["Loving someone in addiction is exhausting and holy. Let's pray for {who}.", "Let's bring {who} to the One who sets captives free."],
    self: [
      "Lord, I can't do this on my own, so I'm asking You to do it with me. Give me strength for today, just today. When the craving comes, be stronger. When I fall, help me get up without despair. Surround me with people who tell me the truth and help me stay free.",
      "Jesus, You make all things new. Break the chains I cannot break, heal the wounds I've been trying to numb, and fill the empty places with Your love. Thank You for every sober day, and give me one more.",
    ],
    other: [
      "Lord, You see {who} in {their} struggle. Break the hold of this addiction, protect {them} from harm, and lead {them} to the help that fits {them}. Give me wisdom to love {them} without enabling, and peace when I can't fix it.",
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
    keywords: ["exam", "finals", "midterm", "a test", "my test", "studying", "bar exam", "boards", "grades", "college application", "~school"],
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
    keywords: ["lonely", "alone", "isolated", "no friends", "nobody cares", "no one cares", "left out", "invisible"],
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
    keywords: ["forgive", "resent", "betray", "angry at", "mad at", "hurt me", "can't let go", "bitter", "abused me", "lied to me"],
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
    keywords: ["travel", "trip", "flight", "driving", "deploy", "military", "keep safe", "keep them safe", "protect", "protection", "danger", "police", "first responder", "storm", "hurricane", "fire"],
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
    keywords: ["doubt", "can't feel god", "cant feel god", "where is god", "is god real", "faith is weak", "far from god", "god feels distant", "don't know if i believe", "struggling with faith", "spiritual dryness"],
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
    keywords: ["caregiver", "caregiving", "taking care of my", "dementia", "alzheimer", "my aging", "nursing home", "hospice care"],
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
    id: "prison", themes: ["family", "fear", "hope"], hooks: { joseph: "who protected his family through danger" },
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
    id: "immigration", themes: ["family", "fear", "loneliness"],
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
    keywords: ["not good enough", "hate myself", "hate my body", "body image", "i'm ugly", "im ugly", "worthless", "not enough", "insecure", "compare myself", "self-esteem", "self esteem", "my weight", "feel like a failure", "unlovable"],
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
    keywords: ["my dog", "my cat", "my pet", "put down", "put to sleep", "euthan", "the vet", "my puppy", "my kitten", "my horse", "rainbow bridge"],
    saints: ["francis", "anthony", "kateri"], scripture: ["ps145_9", "ps34_18"], devotions: ["glory_be", "memorare"],
    title: ["A prayer for a beloved animal", "A prayer after losing a pet"],
    opening: ["Grief for an animal you loved is real grief. Their love was a gift from God.", "St. Francis called the animals his brothers and sisters. Your love for yours matters."],
    self: [
      "Creator God, thank You for the gift of my companion: the loyalty, the comfort, the joy they brought into my days. My heart hurts. Hold my grief, and let me remember them with gratitude. Your tender mercies are over all Your works.",
      "Lord, You made every creature and called it good. I'm worried about my animal and I love them so much. Ease their pain, guide their care, and give me the wisdom and courage to do what is kind.",
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
    variants: [{
      when: "\\b(raise|promot|bonus)",
      title: ["A prayer of thanks for a raise", "A prayer of thanks for a promotion"],
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
    keywords: ["got into", "accepted to", "accepted into", "acceptance letter", "got accepted", "scholarship", "passed my exam", "passed the exam", "passed the bar", "passed my boards", "passed my test", "made the team", "made honor roll", "dean's list", "got my license"],
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
    variants: [{
      when: "engaged|said yes|proposed",
      title: ["A prayer for our engagement"],
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
    keywords: ["cancer free", "cancer-free", "in remission", "remission", "clear scan", "scan was clear", "scans were clear", "results came back good", "results were good", "good results", "results were normal", "surgery went well", "successful surgery", "benign", "came home from the hospital", "home from the hospital", "recovering well", "is recovering", "got better", "feeling better", "no more chemo", "last chemo", "rang the bell"],
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
  ],
  other: [
    "And hold me too, Lord, as I love {them} through this.",
    "Give me patience and hope as I keep praying for {them}.",
    "Thank You for loving {them} even more than I do.",
  ],
};

// Pronouns for "praying for someone" (my mom → she/her).
const FEM = /\b(mom|mother|mama|grandma|grandmother|sister|daughter|wife|girlfriend|aunt|niece|fiancee|stepmom|godmother|mother-in-law)\b/;
const MASC = /\b(dad|father|papa|grandpa|grandfather|brother|son|husband|boyfriend|uncle|nephew|fiance|stepdad|godfather|father-in-law)\b/;
export function pronounsFor(who = "") {
  const w = who.toLowerCase();
  if (FEM.test(w)) return { they: "she", them: "her", their: "her", are: "is" };
  if (MASC.test(w)) return { they: "he", them: "him", their: "his", are: "is" };
  return { they: "they", them: "them", their: "their", are: "are" };
}
const RELATION = /\bmy (mother-in-law|father-in-law|in-laws|sister-in-law|brother-in-law|mom|mother|mama|dad|father|papa|grandma|grandmother|grandpa|grandfather|sister|brother|son|daughter|husband|wife|boyfriend|girlfriend|fianc[eé]e?|partner|friend|best friend|aunt|uncle|cousin|niece|nephew|baby|kids|children|family|parents|stepmom|stepdad|godmother|godfather|coworker|neighbor)\b/i;

// Find who the prayer is for, when the person is praying for someone else.
export function detectWho(text = "", intentId) {
  const m = text.match(RELATION);
  if (!m) return "";
  const forSomeone = /\bpray(ing)? for (my|her|him|them|our)\b/i.test(text);
  const theirStory = ["joy_pregnancy", "joy_baby", "joy_health", "difficult", "cancer", "illness", "faithchild", "grief", "protection", "pregnancy", "addiction", "mental", "dying", "sickchild", "prison", "immigration", "suicideloss"].includes(intentId);
  // "my husband left me" is the speaker's story, not a prayer for him
  const selfStory = /\b(left me|cheated on me|hurt me|lied to me|broke up with me)\b/i.test(text);
  return (forSomeone || theirStory) && !selfStory ? `my ${m[1].toLowerCase()}` : "";
}

const WORRY = /\b(worried|worry|scared|afraid|anxious|anxiety|stressed|struggling|hard|hate|dread|lost|fired|laid off|sad|crying|can't|cannot|won't)\b/;
const HAPPY = /(!|\b(excited|happy|thrilled|grateful|thankful|blessed|finally|yay|so glad|praise god|good news|congrat|celebrat|can't wait|cant wait)\b)/;
export function detectIntent(text = "", themes = []) {
  const t = ` ${text.toLowerCase()} `;
  const worried = WORRY.test(t), happy = HAPPY.test(t);
  let best = null;
  for (const it of INTENTS) {
    // keywords starting with "~" are generic ("my son") and count for less than specific ones ("jail")
    let hits = it.keywords.reduce((n, k) => (k.startsWith("~") ? (t.includes(k.slice(1)) ? n + 0.5 : n) : t.includes(k) ? n + 1 : n), 0);
    if (it.joy && hits) hits *= worried && !happy ? 0.4 : 2;
    if (hits && (!best || hits > best.hits)) best = { it, hits };
  }
  if (best) return best.it;
  // fall back to the strongest theme (e.g. a chip, or a feeling word)
  return INTENTS.find((it) => it.themes[0] === themes[0]) || null;
}

export function fill(str, who) {
  const p = pronounsFor(who);
  return str.replace(/\{who\}/g, who).replace(/\{them\}/g, p.them).replace(/\{their\}/g, p.their).replace(/\{they\}/g, p.they).replace(/\{are\}/g, p.are);
}
