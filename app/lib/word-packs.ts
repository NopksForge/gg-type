export type Mode = 'hype' | 'rage';
export type Lang = 'en' | 'th';
export type PackName = 'overwatch' | 'dota2' | 'lol';

interface SentenceSet {
  neutral: string[];
  hype: string[];
  rage: string[];
}

interface SentencePack {
  en: SentenceSet;
  th: SentenceSet;
}

const _ow: SentencePack = {
  en: {
    neutral: [
      'push the payload now',
      'i need healing',
      'ult ready, on my mark',
      'group up before the fight',
      'enemy genji flanking right',
      'mercy is dead, fall back',
      'who is going tank',
      'ana sleep on the reaper',
      'shield broken, get back',
      'nano boost coming, push in',
      'one more round, last shot',
      'pharah is freecasting up there',
      'mei wall the choke please',
      'tracer in the back, help',
      'sigma is melting our team',
    ],
    hype: [
      'great team comp, we got this',
      'amazing rez! you saved us!',
      'clean play guys, keep it up',
      'love this team, lets gooo',
      'beautiful nano combo team',
      'we are cooking right now',
      'awesome shotcalling, on it',
      'gg team you are all stars',
      'no worries we will get the next one',
      'positive vibes only, we win',
    ],
    rage: [
      'support diff, ff15',
      'why is no one on point lol',
      'enemy team has six dps, what a joke',
      'absolute dogwater team',
      'this dps is feeding sooo hard',
      'unbelievable b**chmade play',
      'how do you miss that shot',
      'NPC behavior from our tank',
      'cope harder, skill issue',
      'go next, this team is cooked',
    ],
  },
  th: {
    neutral: [
      'ดันเพย์โหลดเลย',
      'ขอฮีลด่วน',
      'อัลพร้อมแล้ว รอผมนะ',
      'รวมตัวก่อนเข้า fight',
      'เก็นจิแฟลงค์ขวา ระวัง',
      'เมอร์ซี่ตายแล้ว ถอย',
      'ใครจะเล่นแทงค์',
      'ชีลด์แตกแล้ว ถอย',
      'นาโน่บูสมา ลุยเลย',
    ],
    hype: [
      'ทีมเวิร์คดีมาก สู้ๆ',
      'รีซสวยมาก! ขอบคุณ!',
      'เพลย์สะอาด ทำต่อไป',
      'รักทีมนี้ ไปกันต่อ',
      'จีจี ทุกคนเก่งมาก',
      'ไม่เป็นไร เอาตาต่อไป',
    ],
    rage: [
      'ซัพห่วย FF เถอะ',
      'ทีมเขาดีพีเอสหมด ตลกมาก',
      'ทีมห่วยแบบนี้',
      'ดีพีเอสฟีดหนักมาก',
      'ยิงไม่โดนได้ไง',
      'แทงค์เล่นห่วยสุด',
      'สกิลอิชชู่ของแท้',
      'ไปต่อเถอะ ทีมแตก',
    ],
  },
};

const _dota: SentencePack = {
  en: {
    neutral: [
      'gank mid please',
      'rosh up in two minutes',
      'ward the enemy jungle now',
      'smoke gank top',
      'buy bkb or we lose',
      'tp coming, hold the tower',
      'glyph the rax',
      'aegis on the carry',
      'jungle creeps stacked for you',
      'enemy tinker has aghs',
    ],
    hype: [
      'great farm carry, we win this',
      'amazing teamfight, all in',
      'clutch rosh, lets push',
      'support is goated, mvp',
      'incredible hook from pudge',
      'gg well played team',
      'one more push and we win',
    ],
    rage: [
      'support diff, no wards all game',
      'pos five buy mango stop being lazy',
      'mid is lost, play passive scrub',
      'why are we still farming, throw',
      'tower diving is throwing the game',
      'this carry is absolute trash',
      'report this pos five for griefing',
      'cope and seethe, we lose',
    ],
  },
  th: {
    neutral: [
      'แกงค์มิดที',
      'โรชอีก 2 นาที',
      'วอร์ดป่าเลย',
      'สโมคแกงค์ท็อป',
      'ซื้อบีเคบีเร็ว',
      'ทีพีมา รออยู่',
      'อีจิสให้แครี่',
    ],
    hype: [
      'แครี่ฟาร์มสวยมาก',
      'ทีมไฟท์เยี่ยม ลุยต่อ',
      'จีจี เกมส์สวย',
      'อีกพุชเดียวชนะ',
    ],
    rage: [
      'ซัพห่วยทั้งเกม ไม่มีวอร์ด',
      'มิดแตก เล่นเซฟๆ',
      'ทำไมยังฟาร์มอีก โยน',
      'แครี่ห่วยมาก',
      'รีพอร์ตคนนี้',
    ],
  },
};

const _lol: SentencePack = {
  en: {
    neutral: [
      'baron in thirty seconds',
      'dragon up, group mid',
      'enemy jg botside, ward',
      'i need a gank top',
      'flash is down on their mid',
      'wombo combo on three',
      'group for objective please',
      'one more wave then back',
      'we have herald, take tower',
      'ping the missing enemy',
    ],
    hype: [
      'amazing teamfight, lets goooo',
      'clean baron steal, mvp',
      'support carrying this game',
      'gg team we win this',
      'incredible flash combo',
      'this game is so winnable lets focus',
    ],
    rage: [
      'jg diff, no ganks all game',
      'why are you splitpush there, throw',
      'all chat: ez gg report mid',
      'this adc is absolute dogwater',
      'support diff every game lol',
      'b**chmade engage, we lose',
      'cope and ff15, this is over',
      'NPC support, never roams',
    ],
  },
  th: {
    neutral: [
      'บารอนอีกครึ่งนาที',
      'ดราก้อนมา รวมมิด',
      'จังเกิ้ลเขาอยู่บอท',
      'ขอแกงค์ท็อปที',
      'แฟลชเขาหมด',
      'รวมตัวเอาออบเจกต์',
    ],
    hype: [
      'ทีมไฟท์สวยมาก',
      'จีจี ทีมเก่ง',
      'ซัพคาร์รี่เกม',
      'อีกเวฟเดียว แล้วเบส',
    ],
    rage: [
      'จังเกิ้ลห่วย ไม่แกงค์เลย',
      'แอดซีห่วยมาก',
      'ซัพห่วยทุกเกม',
      'FF เถอะ จบแล้ว',
    ],
  },
};

export const SENTENCE_PACKS: Record<PackName, SentencePack> = {
  overwatch: _ow,
  dota2: _dota,
  lol: _lol,
};

export function getSentencePool(pack: PackName, lang: Lang, mode: Mode): string[] {
  const p = SENTENCE_PACKS[pack][lang];
  return [...p.neutral, ...p[mode]];
}

export const AMBIENT_CHAT: Record<Mode, Record<Lang, string[]>> = {
  hype: {
    en: [
      'nice shot!', 'GG team', "let's go!!", 'we got this', 'clean play',
      'great call', 'smart positioning', 'good job', 'wp wp', 'ily team',
      'you carried that fight', 'playing out of your mind', 'nice combo',
      'we win together', 'respect the grind', 'team is locked in',
    ],
    th: [
      'เยี่ยม!', 'เก่งมาก', 'ทีมเวิร์คดีมาก', 'สู้ๆ!', 'ทำได้แน่',
      'เพลย์สวย', 'เก่งจริง', 'ยอดเยี่ยม', 'ไปกันต่อ!',
    ],
  },
  rage: {
    en: [
      'what was that lmao', 'uninstall', 'trash team', 'report mid',
      'skill issue', 'ratio + L', 'absolute b**chmade play', 'dogwater aim',
      'go next', 'im int feed start', 'why u even queue',
      'ff15 plz', "this team is sh*t", 'npc behavior', 'u fr??',
      'L + ratio + cope', 'tilted? me? never.', 'afk farm only',
    ],
    th: [
      'พิมพ์อะไรของแก', 'ทีมห่วยชิบ', 'เลิกเล่นเถอะ', 'สกิลอิชชู่',
      'ยอมแพ้เถอะ', 'เล่นห่วยมาก', 'รีพอร์ตมิด', 'ทีมแตก',
      'FF เถอะ', 'โน้บแท้',
    ],
  },
};

export const CHAT_AUTHORS: Record<'ally' | 'enemy', Array<{ name: string; role: string }>> = {
  ally: [
    { name: 'Mochi_main',  role: 'TANK' },
    { name: 'sleepywidow', role: 'DPS'  },
    { name: 'mercy.btw',   role: 'SUP'  },
    { name: 'jungleDad',   role: 'JG'   },
    { name: 'ezreal_one',  role: 'ADC'  },
    { name: 'kookkook',    role: 'MID'  },
    { name: 'pos5_andy',   role: 'SUP'  },
  ],
  enemy: [
    { name: 'xX_endmeXx',   role: 'DPS'   },
    { name: 'urmom_2k',     role: 'MID'   },
    { name: 'reportedlol',  role: 'JG'    },
    { name: 'cancel.queue', role: 'TOP'   },
    { name: 'iddqd_69',     role: 'CARRY' },
    { name: 'sleepyhanzo',  role: 'DPS'   },
  ],
};

export const BOSSES: Record<Mode, { name: string; tag: string; color: string }> = {
  hype: { name: 'COACH_GG',     tag: 'mentor',   color: '#7CFF3F' },
  rage: { name: 'xX_DESTROYER', tag: 'unhinged', color: '#FF2D2D' },
};
