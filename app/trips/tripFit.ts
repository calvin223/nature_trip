// "Is this trip right for you?" notes for the trip pages.
//
// Every sentence here must follow from the trip's own entry in lib/data.ts. Each
// note carries an `evidence` check that runs at build time against that entry:
// if the data changes so a note is no longer supported, the build fails and
// names the note, instead of publishing a claim the itinerary no longer backs.
// A trip with no notes here also fails the build: add notes for it, drawn only
// from its data, rather than shipping the page without honest expectations.

import type { Trip } from '@/lib/data';

type Check = (t: Trip) => boolean;

interface Note {
  text: (t: Trip) => string;
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

/* Same wording as the difficulty grades on app/practical/page.tsx. */
const GRADE_TEXT: Record<Trip['difficulty'], string> = {
  Easy: 'Mostly vehicle-based safaris, walks in lodge grounds and gentle trails. Suits most fitness levels, including families.',
  Moderate:
    'More walking on uneven forest trails, some climbs, early starts and more exposure to rain, heat or cold. Needs basic fitness and comfort outdoors.',
  Challenging: 'Longer walks, higher altitude, steep trails, remote habitat or long field hours. Needs good fitness and stamina.',
};

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

const NUMBER_WORDS = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
/** 5 -> "five" (house style spells out small numbers); larger numbers stay as digits. */
const words = (n: number) => NUMBER_WORDS[n] ?? String(n);

/** "A, B and C" */
function listText(items: string[]): string {
  return items.length > 1 ? `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}` : (items[0] ?? '');
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
      text: (t) => {
        const bases = overnightBases(t);
        return (
          `Moderate, and on the move: ${words(bases.length)} bases in ${words(t.durationDays)} days ` +
          `(${listText(bases.map((b) => b.place))}), so you pack up and move on ${words(bases.length - 1)} times.`
        );
      },
      evidence: [isGrade('Moderate'), minBases(3)],
    },
    terrain: {
      text: () =>
        'Lowland forest at Thattekad, shola forest and grassland on the high ground at Pampadum Shola and Mukurthi, ' +
        'the Nilgiri tahr country of Eravikulam, and rain-shadow forest at Chinnar.',
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
      text: () =>
        'Cool to cold mornings on the high ground around Munnar and Ooty, and possible showers from the ' +
        'north-east monsoon between October and December.',
      evidence: [
        inToBring(/high-altitude mornings/),
        inItinerary(/Night at Munnar/),
        inItinerary(/Night at Ooty/),
        inSeasonNote(/north-east monsoon/),
      ],
    },
    mayNotSuit: [
      {
        text: () =>
          'Time on the road: the route crosses Kerala, Tamil Nadu and Karnataka, with transfers between bases on hill roads. ' +
          'If you would rather unpack once, ask about a private trip with fewer bases.',
        evidence: [inRegion(/Kerala, Tamil Nadu & Karnataka/), inItinerary(/Travel through/), minBases(3)],
      },
      {
        text: () =>
          'Uneven ground on the high shola-grassland walks at Mukurthi, Avalanche and Emerald, which need steady footing and basic fitness.',
        evidence: [isGrade('Moderate'), inItinerary(/Walk the high shola-grassland/)],
      },
    ],
  },

  'monsoon-rainforest-nights': {
    pace: {
      text: (t) =>
        'Moderate, with the main sessions after dark: guided night walks for frogs, geckos, snakes, owls and moths. ' +
        `Day ${dayOf(t, /slower morning/)} starts with a slower morning.`,
      evidence: [isGrade('Moderate'), inHighlights(/night walks.*frogs, geckos, snakes, owls, moths/i), inItinerary(/slower morning/)],
    },
    terrain: {
      text: () => 'Forest edges and stream banks in monsoon rain, often walked after dark by headlamp. Sturdy waterproof boots matter here.',
      evidence: [inItinerary(/streams/), inItinerary(/forest-edge/), inToBring(/Headlamp/), inToBring(/waterproof boots/)],
    },
    rhythm: {
      text: () =>
        'Rain is part of the trip: the monsoon is when amphibians are most active. Bring reliable rain gear and a dry bag for electronics.',
      evidence: [inSeason(/monsoon/), inHighlights(/peak amphibian activity/), inToBring(/rain gear/), inToBring(/Dry bag/)],
    },
    mayNotSuit: [
      {
        text: () => 'Leeches are common on wet forest paths in the monsoon. Long trousers and sturdy boots help.',
        evidence: [inSeason(/monsoon/), inToBring(/Long trousers/), inToBring(/boots/)],
      },
      {
        text: () =>
          'Snakes are among the animals we look for. We watch them only from a safe distance with a guide, but if snakes worry you, this trip may not be for you.',
        evidence: [inHighlights(/snake/i)],
      },
      {
        text: () => 'Late evenings on uneven, wet ground in the dark, which needs steady footing.',
        evidence: [isGrade('Moderate'), inItinerary(/night walk/)],
      },
    ],
  },

  'central-india-big-cats': {
    pace: {
      text: (t) =>
        'Easy. Most wildlife watching is from a safari jeep, walks stay in lodge grounds and buffer forest, ' +
        `and there is downtime between drives. Day ${dayOf(t, /lighter day/)} is a lighter day.`,
      evidence: [
        isGrade('Easy'),
        inHighlights(/Jeep safaris/),
        inHighlights(/lodge grounds and buffer forests/),
        inHighlights(/downtime between drives/),
        inItinerary(/lighter day/),
      ],
    },
    terrain: {
      text: () => 'Dry forest, meadows, waterholes and rocky forest edges, seen mostly from the vehicle.',
      evidence: [inScenery(/Dry forest/), inScenery(/meadows/), inScenery(/waterholes/), inScenery(/Rocky forest edges/)],
    },
    rhythm: {
      text: () => 'Safari days have a morning and an afternoon drive. Early-morning drives can be cool, so bring a light jacket.',
      evidence: [inItinerary(/Morning and afternoon jeep safaris/), inToBring(/Light jacket for early morning drives/)],
    },
    mayNotSuit: [
      {
        text: () => 'Big-cat watching takes patience: long, quiet spells in the jeep, with no promise that a tiger will appear.',
        evidence: [inItinerary(/patient big-cat viewing/)],
      },
      {
        text: () => 'Heat late in the season: daytime highs in central India can pass 40 °C by the end of May.',
        evidence: [inSeasonNote(/40 °C/)],
      },
      {
        text: () =>
          'No night drives: night tourism is not permitted inside tiger reserves, so after-dark birding is in lodge grounds outside the reserve.',
        evidence: [inHighlights(/night tourism inside tiger reserves is not permitted/)],
      },
    ],
  },

  'himalaya-birds-mountain-wildlife': {
    pace: {
      text: (t) =>
        'Moderate, at a flexible walking pace with warm meals and rest breaks built in, ' +
        `and a slower afternoon on Day ${dayOf(t, /slower afternoon/)}.`,
      evidence: [isGrade('Moderate'), inHighlights(/Flexible walking pace/), inItinerary(/slower afternoon/)],
    },
    terrain: {
      text: () => 'Forest trails through oak, pine and rhododendron, a ridge route with viewpoints, and village paths.',
      evidence: [inHighlights(/oak, pine, and rhododendron/), inItinerary(/ridge route/), inHighlights(/village trails/i)],
    },
    rhythm: {
      text: () => 'Dawn starts for birding, and cold mornings in the mountains: bring warm layers.',
      evidence: [inHighlights(/Dawn birding/), inToBring(/Warm layers/)],
    },
    mayNotSuit: [
      {
        text: (t) =>
          `Higher ground: Day ${dayOf(t, /higher forest belt/)} visits a higher forest belt. ` +
          'If you have a heart or breathing condition, tell us before you book.',
        evidence: [inItinerary(/higher forest belt/)],
      },
      {
        text: () => 'A plan that bends to the mountains: the high forest day runs only if conditions allow.',
        evidence: [inItinerary(/if conditions allow/)],
      },
    ],
  },
};

/** The "Is this trip right for you?" notes for a trip. Throws if any note is unsupported. */
export function tripFit(trip: Trip): TripFit {
  const spec = SPECS[trip.id];
  if (!spec) {
    throw new Error(
      `app/trips/tripFit.ts: no "Is this trip right for you?" notes for trip "${trip.id}". ` +
        'Add them, drawn only from its entry in lib/data.ts.',
    );
  }
  const resolve = (note: Note, where: string): string => {
    const text = note.text(trip);
    if (!note.evidence.every((check) => check(trip))) {
      throw new Error(
        `app/trips/tripFit.ts: the ${where} note for "${trip.id}" is no longer supported by lib/data.ts: "${text}"`,
      );
    }
    return text;
  };
  return {
    grade: GRADE_TEXT[trip.difficulty],
    pace: resolve(spec.pace, 'pace'),
    terrain: resolve(spec.terrain, 'terrain'),
    rhythm: resolve(spec.rhythm, 'daily rhythm'),
    mayNotSuit: spec.mayNotSuit.map((n, i) => resolve(n, `may-not-suit #${i + 1}`)),
  };
}
