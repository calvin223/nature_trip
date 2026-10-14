// "Is this trip right for you?" notes for the trip pages.
//
// Every sentence here must follow from the trip's own entry in lib/data.ts. Each
// note carries an `evidence` check that runs at build time against that entry:
// if the data changes so a note is no longer supported, the build fails and
// names the note, instead of publishing a claim the itinerary no longer backs.
// A trip with no notes here also fails the build: add notes for it, drawn only
// from its data, rather than shipping the page without honest expectations.
//
// The wording lives in messages/<locale>/tripDetail.json → fitNotes. The evidence
// reads the English source entry, so pass the trip from lib/data.ts, not a translation.

import { createTranslator } from 'next-intl';
import { LOCALE_META, type Locale } from '@/i18n/locales';
import type { Trip } from '@/lib/data';
import { loadMessages } from '@/messages';

type Check = (t: Trip) => boolean;

const translator = (locale: Locale) => createTranslator({ locale, messages: loadMessages(locale), namespace: 'tripDetail.fitNotes' });

/** What a note's text is built with: its messages and the house style for lists. Counts go to
    the messages as numbers, so each language picks its own plural forms and spelled-out words. */
interface Fmt {
  t: ReturnType<typeof translator>;
  /** "A, B and C" */
  list: (items: string[]) => string;
}

interface Note {
  text: (t: Trip, m: Fmt) => string;
  evidence: Check[];
}

interface FitSpec {
  pace: Note;
  terrain: Note;
  rhythm: Note;
  mayNotSuit: Note[];
}

export interface TripFit {
  /** Plain-English meaning of the difficulty grade (mirrors GRADES on /practical/). */
  grade: string;
  pace: string;
  terrain: string;
  rhythm: string;
  mayNotSuit: string[];
}

/* The difficulty grades, also listed on app/[locale]/practical/page.tsx. */
export function gradeText(level: Trip['difficulty'], locale: Locale): string {
  return translator(locale)(`grades.${level}`);
}

// ---------------------------------------------------------------------------
// Evidence helpers: each reads one field of the trip
// ---------------------------------------------------------------------------

const dayText = (d: Trip['itinerary'][number]) => `${d.title} ${d.description}`;
const inItinerary = (re: RegExp): Check => (t) => t.itinerary.some((d) => re.test(dayText(d)));
const inHighlights = (re: RegExp): Check => (t) => t.highlights.some((h) => re.test(h));
const inScenery = (re: RegExp): Check => (t) => t.sceneryHighlights.some((s) => re.test(s));
const inToBring = (re: RegExp): Check => (t) => t.toBring.some((b) => re.test(b));
const inSeason = (re: RegExp): Check => (t) => re.test(t.season);
const inSeasonNote = (re: RegExp): Check => (t) => re.test(t.seasonNote ?? '');
const inRegion = (re: RegExp): Check => (t) => re.test(t.region ?? '');
const isGrade = (g: Trip['difficulty']): Check => (t) => t.difficulty === g;
const minBases = (n: number): Check => (t) => overnightBases(t).length >= n;

/** Day number of the first itinerary day matching `re`. Throws when none does. */
function dayOf(t: Trip, re: RegExp): number {
  const day = t.itinerary.find((d) => re.test(dayText(d)));
  if (!day) throw new Error(`app/trips/tripFit.ts: no itinerary day of "${t.id}" matches ${re}`);
  return day.day;
}

/**
 * Overnight bases in itinerary order, read from "Night at X." in the day descriptions.
 * Consecutive nights at the same place count as one base.
 */
export function overnightBases(t: Trip): { place: string; nights: number }[] {
  const bases: { place: string; nights: number }[] = [];
  for (const d of t.itinerary) {
    const m = /Night at ([^.]+)\./.exec(d.description);
    if (!m) continue;
    const last = bases[bases.length - 1];
    if (last && last.place === m[1]) last.nights += 1;
    else bases.push({ place: m[1], nights: 1 });
  }
  return bases;
}

// ---------------------------------------------------------------------------
// Notes per trip
// ---------------------------------------------------------------------------

const SPECS: Record<string, FitSpec> = {
  'western-ghats-endemics': {
    pace: {
      text: (t, m) => {
        const bases = overnightBases(t);
        return m.t('westernGhatsEndemics.pace', {
          bases: bases.length,
          days: t.durationDays,
          places: m.list(bases.map((b) => b.place)),
          moves: bases.length - 1,
        });
      },
      evidence: [isGrade('Moderate'), minBases(3)],
    },
    terrain: {
      text: (_, m) => m.t('westernGhatsEndemics.terrain'),
      evidence: [
        inItinerary(/lowland forests/),
        inItinerary(/Pampadum Shola/),
        inItinerary(/shola-grassland country of Mukurthi/),
        inItinerary(/Eravikulam/),
        inItinerary(/heartland of the Nilgiri Tahr/),
        inItinerary(/rain-shadow forests of Chinnar/),
      ],
    },
    rhythm: {
      text: (_, m) => m.t('westernGhatsEndemics.rhythm'),
      evidence: [
        inToBring(/high-altitude mornings/),
        inItinerary(/Night at Munnar/),
        inItinerary(/Night at Ooty/),
        inSeasonNote(/north-east monsoon/),
      ],
    },
    mayNotSuit: [
      {
        text: (_, m) => m.t('westernGhatsEndemics.mayNotSuit.roads'),
        evidence: [inRegion(/Kerala, Tamil Nadu & Karnataka/), inItinerary(/Travel through/), minBases(3)],
      },
      {
        text: (_, m) => m.t('westernGhatsEndemics.mayNotSuit.footing'),
        evidence: [isGrade('Moderate'), inItinerary(/Walk the high shola-grassland/)],
      },
    ],
  },

  'monsoon-rainforest-nights': {
    pace: {
      text: (t, m) => m.t('monsoonRainforestNights.pace', { day: dayOf(t, /slower morning/) }),
      evidence: [isGrade('Moderate'), inHighlights(/night walks.*frogs, geckos, snakes, owls, moths/i), inItinerary(/slower morning/)],
    },
    terrain: {
      text: (_, m) => m.t('monsoonRainforestNights.terrain'),
      evidence: [inItinerary(/streams/), inItinerary(/forest-edge/), inToBring(/Headlamp/), inToBring(/waterproof boots/)],
    },
    rhythm: {
      text: (_, m) => m.t('monsoonRainforestNights.rhythm'),
      evidence: [inSeason(/monsoon/), inHighlights(/peak amphibian activity/), inToBring(/rain gear/), inToBring(/Dry bag/)],
    },
    mayNotSuit: [
      {
        text: (_, m) => m.t('monsoonRainforestNights.mayNotSuit.leeches'),
        evidence: [inSeason(/monsoon/), inToBring(/Long trousers/), inToBring(/boots/)],
      },
      {
        text: (_, m) => m.t('monsoonRainforestNights.mayNotSuit.snakes'),
        evidence: [inHighlights(/snake/i)],
      },
      {
        text: (_, m) => m.t('monsoonRainforestNights.mayNotSuit.footing'),
        evidence: [isGrade('Moderate'), inItinerary(/night walk/)],
      },
    ],
  },

  'central-india-big-cats': {
    pace: {
      text: (t, m) => m.t('centralIndiaBigCats.pace', { day: dayOf(t, /lighter day/) }),
      evidence: [
        isGrade('Easy'),
        inHighlights(/Jeep safaris/),
        inHighlights(/lodge grounds and buffer forests/),
        inHighlights(/downtime between drives/),
        inItinerary(/lighter day/),
      ],
    },
    terrain: {
      text: (_, m) => m.t('centralIndiaBigCats.terrain'),
      evidence: [inScenery(/Dry forest/), inScenery(/meadows/), inScenery(/waterholes/), inScenery(/Rocky forest edges/)],
    },
    rhythm: {
      text: (_, m) => m.t('centralIndiaBigCats.rhythm'),
      evidence: [inItinerary(/Morning and afternoon jeep safaris/), inToBring(/Light jacket for early morning drives/)],
    },
    mayNotSuit: [
      {
        text: (_, m) => m.t('centralIndiaBigCats.mayNotSuit.patience'),
        evidence: [inItinerary(/patient big-cat viewing/)],
      },
      {
        text: (_, m) => m.t('centralIndiaBigCats.mayNotSuit.heat'),
        evidence: [inSeasonNote(/40 °C/)],
      },
      {
        text: (_, m) => m.t('centralIndiaBigCats.mayNotSuit.nightDrives'),
        evidence: [inHighlights(/night tourism inside tiger reserves is not permitted/)],
      },
    ],
  },

  'himalaya-birds-mountain-wildlife': {
    pace: {
      text: (t, m) => m.t('himalayaBirdsMountainWildlife.pace', { day: dayOf(t, /slower afternoon/) }),
      evidence: [isGrade('Moderate'), inHighlights(/Flexible walking pace/), inItinerary(/slower afternoon/)],
    },
    terrain: {
      text: (_, m) => m.t('himalayaBirdsMountainWildlife.terrain'),
      evidence: [inHighlights(/oak, pine, and rhododendron/), inItinerary(/ridge route/), inHighlights(/village trails/i)],
    },
    rhythm: {
      text: (_, m) => m.t('himalayaBirdsMountainWildlife.rhythm'),
      evidence: [inHighlights(/Dawn birding/), inToBring(/Warm layers/)],
    },
    mayNotSuit: [
      {
        text: (t, m) => m.t('himalayaBirdsMountainWildlife.mayNotSuit.altitude', { day: dayOf(t, /higher forest belt/) }),
        evidence: [inItinerary(/higher forest belt/)],
      },
      {
        text: (_, m) => m.t('himalayaBirdsMountainWildlife.mayNotSuit.conditions'),
        evidence: [inItinerary(/if conditions allow/)],
      },
    ],
  },
};

/** The "Is this trip right for you?" notes for a trip (its English entry in lib/data.ts), in
    `locale`. Throws if any note is unsupported. */
export function tripFit(trip: Trip, locale: Locale): TripFit {
  const spec = SPECS[trip.id];
  if (!spec) {
    throw new Error(
      `app/trips/tripFit.ts: no "Is this trip right for you?" notes for trip "${trip.id}". ` +
        'Add them, drawn only from its entry in lib/data.ts.',
    );
  }
  const t = translator(locale);
  const listFormat = new Intl.ListFormat(LOCALE_META[locale].htmlLang, { type: 'conjunction' });
  const m: Fmt = { t, list: (items) => listFormat.format(items) };
  const resolve = (note: Note, where: string): string => {
    const text = note.text(trip, m);
    if (!note.evidence.every((check) => check(trip))) {
      throw new Error(
        `app/trips/tripFit.ts: the ${where} note for "${trip.id}" is no longer supported by lib/data.ts: "${text}"`,
      );
    }
    return text;
  };
  return {
    grade: t(`grades.${trip.difficulty}`),
    pace: resolve(spec.pace, 'pace'),
    terrain: resolve(spec.terrain, 'terrain'),
    rhythm: resolve(spec.rhythm, 'daily rhythm'),
    mayNotSuit: spec.mayNotSuit.map((n, i) => resolve(n, `may-not-suit #${i + 1}`)),
  };
}
