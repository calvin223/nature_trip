// Data for Wildora Expeditions
//
// Content rules (from the owners): no hype, no guaranteed sightings, and never
// invent a species record, credential, review, contact or policy fact.
// Answers marked `policy: true` are proposed defaults awaiting the owners'
// confirmation; every one is listed in POLICY_REVIEW.md at the repo root.

import { SITE } from './site';

/** 0 = Sunday ... 6 = Saturday, matching Date#getUTCDay. */
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/**
 * Which day(s) of each in-season month a trip departs on.
 * nth: 1-4 = first to fourth occurrence of `weekday` in the month, -1 = last.
 * lib/schedule.ts turns this into concrete dates.
 */
export interface DepartureRule {
  weekday: Weekday;
  nth: Array<1 | 2 | 3 | 4 | -1>;
}

export interface Trip {
  id: string;
  title: string;
  description: string;
  duration: string;
  /** Number of calendar days, day 1 = departure date. Must match `duration`. */
  durationDays: number;
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
  /** Human-readable season, shown on cards. */
  season: string;
  /** Months (1-12) in which the whole trip may run; drives the schedule. */
  seasonMonths: number[];
  /** Why the season is what it is, where that is not obvious (closures, heat). */
  seasonNote?: string;
  departureRule: DepartureRule;
  groupSize: string;
  price: string;
  /** Where guests join the trip. Getting there is the guest's responsibility. */
  startPoint: string;
  /** Where the trip finishes. */
  endPoint: string;
  targetSpecies?: string;
  region?: string;
  highlights: string[];
  /** Scenic places and landscapes, drawn only from what the itinerary names. */
  sceneryHighlights: string[];
  itinerary: { day: number; title: string; description: string }[];
  included: string[];
  toBring: string[];
  learningOutcomes: string[];
  suitableFor: string[];
}

export interface Service {
  id: string;
  title: string;
  tagline: string;
  description: string;
  forWho: string;
}

export interface Expert {
  id: string;
  name: string;
  qualifications: string;
  specialization: string;
  experience: string;
  bio: string;
  imageUrl?: string;
}

export interface Species {
  id: string;
  commonName: string;
  scientificName: string;
  category: 'Birds' | 'Mammals' | 'Reptiles' | 'Amphibians' | 'Butterflies' | 'Flora';
  endemic: boolean;
  threatened: boolean;
  habitat: string;
  fieldNote: string;
  imageUrl?: string;
}

export const CONFIRMED_AT_BOOKING = 'Confirmed at booking';

/** Footnote for every trip: no sighting is ever promised. */
export const wildlifeDisclaimer =
  'Wildlife sightings depend on the season, the weather and local conditions on the day of your visit. ' +
  'We plan routes and timings to give you the best chance, but no particular sighting can be guaranteed.';

export const trips: Trip[] = [
  {
    id: 'central-india-big-cats',
    title: 'Central India Big Cats & Forest Safari',
    description: 'A wildlife holiday through tiger country, dry forests, river edges, meadows, and bird-rich buffer zones.',
    duration: '7 days / 6 nights',
    durationDays: 7,
    difficulty: 'Easy',
    season: 'October to May',
    // Tiger-reserve core zones close for the monsoon from 1 July to 30 September
    // and reopen on 1 October. Pench (MP) is open only from 1 October to
    // 15 June; the monsoon arrives in the second week of June; mean daily
    // maxima reach 42 °C in May and 41 °C in June.
    // Source: Pench Tiger Reserve FAQ (MP Forest Department), Q5-Q7,
    //   https://forest.mponline.gov.in/Images/PenchFAQ.pdf (VERIFIED 2026-10-03)
    // Also Tadoba core zones closed 1 July - 30 September:
    //   https://bigcatsindia.com/tadoba-safari-timings/ (VERIFIED 2026-10-03)
    // So June is excluded: a 7-day trip there would run into closures and the
    // monsoon's arrival.
    seasonMonths: [10, 11, 12, 1, 2, 3, 4, 5],
    seasonNote:
      'Tiger-reserve core zones close for the monsoon from 1 July to 30 September, and some reserves close from mid-June. ' +
      'We stop at the end of May, when daytime highs in central India can pass 40 °C.',
    // First Sunday of each in-season month. Day 4 (the lighter "Slow Wildlife
    // Day") then falls on a Wednesday, when Madhya Pradesh tiger reserves close
    // for afternoon safaris (Pench FAQ Q9, URL above). A first-week start also
    // keeps this trip clear of the Western Ghats Endemics departures (third
    // week) in October to January, so naturalists can lead both.
    departureRule: { weekday: 0, nth: [1] },
    groupSize: 'Max 10 guests',
    price: 'Price on request',
    // The itinerary names no reserve or town, so no start/end can be stated.
    startPoint: CONFIRMED_AT_BOOKING,
    endPoint: CONFIRMED_AT_BOOKING,
    targetSpecies: 'Tigers, leopards, wild dogs, owls, raptors',
    region: 'Central India forests',
    highlights: [
      'Jeep safaris in prime tiger and leopard habitat',
      'Birding and nature walks in lodge grounds and buffer forests',
      'Evening birding in lodge grounds outside the reserve for owls, nightjars and forest sounds (night tourism inside tiger reserves is not permitted)',
      'Comfortable lodges, local food, and relaxed downtime between drives',
      'Ethical viewing with guides who understand animal behaviour and park rules'
    ],
    sceneryHighlights: [
      'Dry forest, open meadows and grassland mosaics',
      'River edges and waterholes',
      'Rocky forest edges',
      'Optional village and riverside walks on the slower Day 4'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Tiger Country',
        description: 'Arrive, settle into your lodge, meet your naturalist, and take a short birding walk near the property.'
      },
      {
        day: 2,
        title: 'First Safari Drives',
        description: 'Morning and afternoon jeep safaris focused on tracks, calls, habitat signs, and patient big-cat viewing.'
      },
      {
        day: 3,
        title: 'Birds, Meadows, and Waterholes',
        description: 'Explore different safari zones with time for raptors, woodland birds, deer, wild boar, and possible predator movement near water.'
      },
      {
        day: 4,
        title: 'Slow Wildlife Day',
        description: 'A lighter day with optional village, river, or lodge-ground birding between safari sessions.'
      },
      {
        day: 5,
        title: 'Leopards and Forest Edges',
        description: 'Search rocky edges, dry forest, and grassland mosaics for leopards, sloth bears, owls, and smaller mammals.'
      },
      {
        day: 6,
        title: 'Final Full Safari Day',
        description: 'Use the final full day to revisit the most productive habitats and refine the group checklist.'
      },
      {
        day: 7,
        title: 'Breakfast Review and Departure',
        description: 'Review sightings, photographs, and route notes before departure after breakfast.'
      }
    ],
    included: [
      'Wildlife lodge accommodation',
      'All meals, with vegetarian-friendly options',
      'Expert naturalist guide throughout',
      'Safari vehicle coordination where included in the plan',
      'Transportation during the trip',
      'Park entry and permit guidance'
    ],
    toBring: [
      'Neutral-coloured comfortable clothing',
      'Light jacket for early morning drives',
      'Hat, sunglasses, and sunscreen',
      'Personal medications',
      'Binoculars if you have them',
      'Camera or phone for photography'
    ],
    learningOutcomes: [
      'Enjoy ethical big-cat viewing across varied forest habitats',
      'Understand animal tracks, alarm calls, and safari fieldcraft',
      'Leave with a personal wildlife checklist and route notes',
      'Balance safari intensity with rest, food, and comfortable travel',
      'See India beyond a single habitat or species'
    ],
    suitableFor: [
      'International visitors',
      'Families',
      'First-time safari guests',
      'Photographers',
      'Wildlife enthusiasts'
    ]
  },
  {
    id: 'monsoon-rainforest-nights',
    title: 'Monsoon Rainforest Nights & Endemics',
    description: 'A guided rainforest experience for frogs, reptiles, endemic birds, butterflies, waterfalls, spice country, and forest nights.',
    duration: '5 days / 4 nights',
    durationDays: 5,
    difficulty: 'Moderate',
    season: 'June to September (monsoon)',
    // South-west monsoon season. Normal onset over Kerala is 1 June, standard
    // deviation about 7 days. Source: IMD press release, 15 May 2020,
    //   https://internal.imd.gov.in/press_release/20200515_pr_801.pdf (VERIFIED 2026-10-03, read in full)
    // Normal withdrawal from the far south is about 15 October under IMD's 2020
    // revised normals. Secondary source (press report, not IMD itself):
    //   https://www.thenewsminute.com/news/imd-change-reference-dates-onset-withdrawal-southwest-monsoon-year-116189
    seasonMonths: [6, 7, 8, 9],
    seasonNote: 'It runs in the south-west monsoon, when frogs and reptiles are most active and the forest is at its greenest.',
    // Second Saturday of June to September. The earliest possible start
    // (8 June) is one standard deviation after the normal 1 June onset, so in
    // most years the monsoon has arrived; a 5-day trip always finishes by the 18th.
    departureRule: { weekday: 6, nth: [2] },
    groupSize: 'Max 12 guests',
    price: 'Price on request',
    // The itinerary names no place, so no start/end can be stated.
    startPoint: CONFIRMED_AT_BOOKING,
    endPoint: CONFIRMED_AT_BOOKING,
    targetSpecies: 'Frogs, geckos, pit vipers, hornbills, forest butterflies',
    region: 'Indian rainforests',
    highlights: [
      'Guided night walks on private estate and homestay land outside protected areas, for frogs, geckos, snakes, owls, moths and rainforest soundscapes',
      'Stream and forest-edge visits during peak amphibian activity',
      'Waterfall, viewpoint, spice, and plantation stops between wildlife sessions',
      'Safe snake observation from respectful distances',
      'Monsoon photography support for low light, rain, and macro subjects'
    ],
    sceneryHighlights: [
      'A waterfall or viewpoint visit on Day 3',
      'Spice country and plantation stops',
      'Rainforest streams and forest edges in the monsoon'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival and Rainforest Welcome',
        description: 'Arrive, settle in, meet your guide, and take a short evening walk if weather allows.'
      },
      {
        day: 2,
        title: 'Rainforest Streams After Dark',
        description: 'A slower morning, forest-edge exploration after lunch, and a guided night walk along frog-rich streams on private land outside the protected area.'
      },
      {
        day: 3,
        title: 'Reptiles, Waterfalls, and Viewpoints',
        description: 'Daytime search for lizards and forest birds, followed by a waterfall or viewpoint visit and another optional night session.'
      },
      {
        day: 4,
        title: 'Endemic Wildlife Focus',
        description: 'Look for locally special frogs, birds, butterflies, and reptiles, with a relaxed evening checklist session.'
      },
      {
        day: 5,
        title: 'Breakfast Review and Departure',
        description: 'Review sightings and photo highlights over breakfast before departure after lunch.'
      }
    ],
    included: [
      'Accommodation',
      'All meals',
      'Expert naturalist guide',
      'Shared torches and field references',
      'Transportation during the trip',
      'Permits and local coordination'
    ],
    toBring: [
      'Sturdy waterproof boots',
      'Reliable rain gear',
      'Headlamp',
      'Long trousers and full-sleeve shirts',
      'Insect repellent',
      'Dry bag for electronics'
    ],
    learningOutcomes: [
      'Experience tropical rainforest at its most alive',
      'Observe frogs, reptiles, birds, and insects safely with a specialist guide',
      'Build a personal list of monsoon species and photo subjects',
      'Understand the rainforest by walking it, listening to it, and watching it after dark',
      'Balance adventurous night walks with enough rest between sessions'
    ],
    suitableFor: [
      'Wildlife enthusiasts',
      'Adventure travellers',
      'Photographers',
      'Advanced naturalists',
      'Small private groups'
    ]
  },
  {
    id: 'himalaya-birds-mountain-wildlife',
    title: 'Himalaya Birds & Mountain Wildlife',
    description: 'A scenic Himalayan nature break combining pheasants, high-altitude birds, forest mammals, village landscapes, and mountain views.',
    duration: '6 days / 5 nights',
    durationDays: 6,
    difficulty: 'Moderate',
    season: 'March to May and October to November',
    // Owner-stated season (ASSUMED, not independently sourced: the itinerary
    // names no location). It skips the south-west monsoon (June to September,
    // landslide-prone mountain roads) and winter snow (December to February).
    seasonMonths: [3, 4, 5, 10, 11],
    // Second Saturday of each in-season month. A mid-month start keeps every
    // departure away from the season edges (late-May pre-monsoon, late-November
    // cold), and a 6-day trip always finishes by the 19th.
    departureRule: { weekday: 6, nth: [2] },
    groupSize: 'Max 10 guests',
    price: 'Price on request',
    // The itinerary names no place, so no start/end can be stated.
    startPoint: CONFIRMED_AT_BOOKING,
    endPoint: CONFIRMED_AT_BOOKING,
    targetSpecies: 'Pheasants, laughingthrushes, woodpeckers, deer, martens',
    region: 'Indian Himalaya',
    highlights: [
      'Dawn birding for Himalayan specialities in oak, pine, and rhododendron forests',
      'Scenic village trails, viewpoints, and mountain photography stops',
      'Flexible walking pace with warm meals and rest breaks built in',
      'Search for mammals, raptors, woodpeckers, and mixed feeding flocks',
      // Was: "Custom extensions possible for snow leopard country, red panda
      // habitat, or higher passes" - no such extension has been confirmed.
      'Longer or higher-altitude extensions can be discussed on request'
    ],
    sceneryHighlights: [
      'Mountain views and viewpoints',
      'A scenic ridge route on Day 3, with village and tea stops',
      'Oak, pine and rhododendron forests',
      'Village trails and landscapes',
      'A higher forest belt on Day 5, if conditions allow'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in the Foothills',
        description: 'Arrive, settle in, and enjoy a short acclimatisation walk for common mountain birds.'
      },
      {
        day: 2,
        title: 'Oak Forest Birding',
        description: 'Early walk through oak and mixed forest, with time for woodpeckers, laughingthrushes, flycatchers, and raptors.'
      },
      {
        day: 3,
        title: 'Ridge Trails and Viewpoints',
        description: 'Follow a scenic ridge route with stops for birds, landscapes, tea, and local village life.'
      },
      {
        day: 4,
        title: 'Pheasant and Mammal Search',
        description: 'Look for shy forest birds and mammals during the most active hours, with a slower afternoon for rest or photography.'
      },
      {
        day: 5,
        title: 'High Forest Day',
        description: 'Visit a higher forest belt if conditions allow, focusing on mixed flocks, raptors, and mountain plant life.'
      },
      {
        day: 6,
        title: 'Final Walk and Departure',
        description: 'Short morning walk, checklist review, and departure after breakfast.'
      }
    ],
    included: [
      'Mountain lodge or guesthouse accommodation',
      'Meals',
      'Expert bird and wildlife guide',
      'Field guides',
      'Transportation during the trip',
      'Local access coordination'
    ],
    toBring: [
      'Comfortable walking shoes',
      'Warm layers',
      'Hat and sunscreen',
      'Binoculars',
      'Camera or phone',
      'Water bottle'
    ],
    learningOutcomes: [
      'Enjoy Himalayan birds and mammals at a comfortable travel pace',
      'Recognise key mountain habitats and seasonal wildlife patterns',
      'Improve birding and wildlife observation in forested terrain',
      'Experience local culture and scenery alongside wildlife',
      'Take home a personal checklist and practical viewing tips'
    ],
    suitableFor: [
      'Birders',
      'Nature lovers',
      'Couples and friends',
      'Photographers',
      'Slow travellers'
    ]
  },
  {
    id: 'western-ghats-endemics',
    title: 'Western Ghats Endemics Expedition',
    description: 'A 10-day journey through the UNESCO-listed Western Ghats — rainforest bird sanctuaries, shola grasslands, and tiger country — focused on species found nowhere else on Earth.',
    duration: '10 days / 9 nights',
    durationDays: 10,
    difficulty: 'Moderate',
    season: 'October to January (post-monsoon)',
    // Post-monsoon window, cut short to avoid the Eravikulam closure (Day 4).
    // Eravikulam National Park closes every year for the Nilgiri tahr calving
    // season: 1 February - 31 March in 2026, February - March in 2025
    // (reopened 1 April 2025).
    // Sources (VERIFIED 2026-10-03):
    //   https://www.onmanorama.com/travel/kerala/2026/01/06/eravikulam-national-park-munnar-to-be-closed.amp.html
    //   https://www.outlooktraveller.com/News/eravikulam-national-park-in-kerala-to-reopen
    // So February and March are excluded rather than running Day 4 without the park.
    // October to December can also bring north-east monsoon showers, mostly on
    // the Tamil Nadu side (Valparai, Ooty) - ASSUMED, general IMD seasonal pattern.
    seasonMonths: [10, 11, 12, 1],
    seasonNote:
      'We do not run this trip in February and March: Eravikulam National Park (Day 4) closes each year for the Nilgiri tahr calving season, ' +
      'usually from 1 February to 31 March. October to December can bring showers from the north-east monsoon.',
    // Third Saturday of October to January. The third Saturday is always the
    // 15th or later, so October departures start after the south-west
    // monsoon's normal withdrawal date (about 15 October, IMD 2020 normals;
    // secondary source cited on the monsoon trip above). A 10-day trip from the 15th-21st ends by
    // the 30th, so January departures finish before the 1 February closure.
    departureRule: { weekday: 6, nth: [3] },
    groupSize: 'Max 10 guests',
    price: 'Price on request',
    // Kochi airport (COK, Nedumbassery) to Thattekad is quoted at 40-49 km by road.
    // Sources (VERIFIED 2026-10-03; travel guides, not an official source):
    //   https://www.ncra.tifr.res.in/~yogesh/wildlife/thattekad.html
    //   https://www.outlookindia.com/traveller/destinations/kerala-birding-thattekkad/
    startPoint: 'Thattekad Bird Sanctuary, Kerala. Nearest airport: Kochi (COK), roughly 40–50 km by road.',
    // Bandipur is about 80 km from Mysuru on the Mysuru-Ooty highway (NH 766).
    // Sources (VERIFIED 2026-10-03; travel guides, not an official source):
    //   https://www.theserai.in/bandipur-resort/blogs/where-is-bandipur-national-park.html
    //   https://wildtrails.in/bandipur-tiger-sightings/
    // Bengaluru distance quoted inconsistently, so omitted.
    endPoint: 'Bandipur Tiger Reserve, Karnataka. Nearest gateways: Mysuru (about 80 km by road) and Bengaluru (BLR).',
    targetSpecies: 'Lion-tailed Macaque, Nilgiri Tahr, Malabar Grey Hornbill, Sri Lanka Frogmouth',
    region: 'Western Ghats (Kerala, Tamil Nadu & Karnataka)',
    highlights: [
      'Explore a UNESCO World Heritage Site and one of the world\'s eight hottest biodiversity hotspots, rich in plants and animals found nowhere else on Earth',
      'Search for 20+ endemic bird possibilities including Malabar Grey Hornbill, Sri Lanka Frogmouth, Nilgiri Laughingthrush, and sholakilis',
      'Look for endemic mammals: Lion-tailed Macaque, Nilgiri Tahr, Nilgiri Langur, and Malabar Giant Squirrel',
      'Walk shola-grassland mosaics, montane forests, and lowland rainforest across Kerala, Tamil Nadu, and Karnataka',
      'Finish in Bandipur Tiger Reserve with a chance of Bengal Tiger, Asian Elephant, Leopard, and Dhole'
    ],
    sceneryHighlights: [
      'The Periyar River at Thattekad (Day 1)',
      'Shola forest and grassland at Pampadum Shola and the Vattavada region (Day 3)',
      'Rajamalai in Eravikulam National Park (Day 4)',
      'Rain-shadow forest at Chinnar (Day 5)',
      'Rainforest fragments and tea-estate edges around Valparai, Nallamudi and Sholayar (Days 6–7)',
      'Doddabetta, Wenlock Downs and the Government Botanical Garden, Ooty (Day 8)',
      'High shola-grassland country at Mukurthi, Avalanche and Emerald (Day 9)'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival at Thattekad Bird Sanctuary (Kerala)',
        description: 'Visit the Salim Ali Bird Interpretation Centre, Thattekad Bird Sanctuary, and the Periyar River. Targets: Malabar Grey Hornbill, Sri Lanka Frogmouth, Malabar Trogon, White-bellied Treepie, and Rufous Babbler. Night at Thattekad.'
      },
      {
        day: 2,
        title: 'Thattekad Bird Sanctuary',
        description: 'A full day focused on the endemic birds of the Western Ghats in one of South India\'s richest lowland forests. Night at Thattekad.'
      },
      {
        day: 3,
        title: 'Pampadum Shola National Park',
        description: 'Explore Pampadum Shola National Park and the Vattavada region for Nilgiri Pipit, Nilgiri Wood Pigeon, endemic orchids, rhododendrons — and, if fortunate, the elusive Nilgiri Marten. Night at Munnar.'
      },
      {
        day: 4,
        title: 'Eravikulam National Park',
        description: 'Visit Rajamalai and the interpretation centre in the heartland of the Nilgiri Tahr. Also watch for Nilgiri Pipit, Black-and-orange Flycatcher, and Nilgiri Flycatcher. Night at Munnar.'
      },
      {
        day: 5,
        title: 'Chinnar Wildlife Sanctuary',
        description: 'Cross into the rain-shadow forests of Chinnar for Grizzled Giant Squirrel, Indian Star Tortoise, Mugger Crocodile, and Indian Giant Flying Squirrel. Night at Chinnar.'
      },
      {
        day: 6,
        title: 'Anamalai Tiger Reserve (Top Slip – Valparai)',
        description: 'Travel through Top Slip, the Parambikulam border, and on to Valparai. Targets: Lion-tailed Macaque, Nilgiri Langur, Malabar Giant Squirrel, and Great Hornbill. Night at Valparai.'
      },
      {
        day: 7,
        title: 'Valparai Rainforests',
        description: 'Explore Nallamudi, Sholayar, and the tea-estate edges where rainforest fragments hold Lion-tailed Macaque and Nilgiri Langur, alongside Asian Elephant and Gaur. Night at Valparai.'
      },
      {
        day: 8,
        title: 'Nilgiri Biosphere Reserve (Ooty)',
        description: 'Visit the Government Botanical Garden, Doddabetta, and Wenlock Downs for Nilgiri Laughingthrush, Nilgiri Flycatcher, and classic shola vegetation. Night at Ooty.'
      },
      {
        day: 9,
        title: 'Mukurthi National Park',
        description: 'Walk the high shola-grassland country of Mukurthi, Avalanche, and Emerald for Nilgiri Tahr, Black-and-orange Flycatcher, and a rare chance of Nilgiri Marten. Night at Ooty.'
      },
      {
        day: 10,
        title: 'Bandipur Tiger Reserve (Karnataka) & Departure',
        description: 'A finale in Bandipur National Park with its interpretation centre. Chances of Bengal Tiger, Asian Elephant, Leopard, Dhole, Gaur, Sambar Deer, and Crested Hawk-Eagle before departure.'
      }
    ],
    included: [
      'Accommodation throughout (lodges and guesthouses)',
      'Meals',
      'Expert naturalist guide',
      'Park entry fees and access coordination',
      'Transportation during the trip',
      'Field guides and checklists'
    ],
    toBring: [
      'Comfortable walking shoes',
      'Warm layers for high-altitude mornings',
      'Rain protection',
      'Binoculars',
      'Camera or phone',
      'Water bottle'
    ],
    learningOutcomes: [
      'Understand why the Western Ghats hold such extraordinary endemism',
      'Identify key endemic birds, mammals, and plants in the field',
      'Recognise shola-grassland, montane, and lowland rainforest habitats',
      'Learn how the Southwest Monsoon shapes these ecosystems',
      'Take home a personal species checklist from a world biodiversity hotspot'
    ],
    suitableFor: [
      'Birders',
      'Mammal watchers',
      'Photographers',
      'Nature lovers',
      'Endemic species enthusiasts'
    ]
  }
];

export const experts: Expert[] = [
  {
    id: 'dr-a-relton',
    name: 'Dr. A. Relton',
    qualifications: 'Honorary Wildlife Warden, Nature Club Advisor, Course Director of Ecology of Indian Tropics',
    specialization: 'Birds, butterflies, wetland ecology and wildlife interpretation',
    imageUrl: '/photos/experts/relton.webp',
    experience: '30+ years in biodiversity research and nature education; author of "Birds of Bishop Heber College" and "Butterflies of Bishop Heber College"',
    bio: 'A wildlife naturalist, educator, and conservationist with over three decades in the field, Dr. Relton has spent years documenting the flora and fauna of the Western and Eastern Ghats, Ramsar wetlands, and protected areas across India. His research focuses on butterfly diversity and conservation in the Eastern Ghats, and his expertise spans birds, butterflies, amphibians, reptiles, mammals, and tropical ecosystems. Through Nature Expeditions he leads eco-tours, birdwatching expeditions, butterfly walks, biodiversity camps, and photography tours that pair scientific interpretation with engaging storytelling. He believes meaningful conservation begins with meaningful experiences in nature.'
  },
  {
    id: 'a-daisy-caroline-mary',
    name: 'Dr. A. Daisy Caroline Mary',
    qualifications: 'Former Assistant Professor of Environmental Sciences, Bishop Heber College (Autonomous), Tiruchirappalli',
    imageUrl: '/photos/experts/daisy.webp',
    specialization: 'Environmental science, biodiversity conservation, and sustainability education',
    experience: 'Decades of university teaching, research supervision, and community environmental outreach',
    bio: 'An accomplished environmental scientist, educator, and researcher, Dr. Daisy has dedicated her career to inspiring students and communities to understand and protect the natural world. Her expertise spans environmental management, biodiversity conservation, ecosystem restoration, climate change, and sustainable development. She regularly leads environmental workshops, nature camps, and field-based learning programmes for schools, colleges, NGOs, and organizations, with a focus on connecting participants directly with nature. Her guiding conviction: "Protecting nature begins with understanding it, and education is the first step towards lasting conservation."'
  },
  {
    id: 'r-carlton',
    name: 'Dr. Carlton Relton',
    qualifications: 'Assistant Professor of Environmental Sciences, Bishop Heber College; Ph.D. in Environmental Sciences',
    specialization: 'Butterflies, birds, and tropical ecosystems of the Western and Eastern Ghats',
    imageUrl: '/photos/experts/carlton.webp',
    experience: '10+ years in biodiversity research; advanced training in Ecology of Indian Tropics and Ornithology at the Au Sable Institute, USA',
    bio: 'An environmental scientist, wildlife naturalist, and conservation communicator, Carlton connects people with nature through immersive learning experiences. His research centres on butterflies, birds, and the protected landscapes of the Western and Eastern Ghats, combining science with citizen science and environmental awareness. An avid wildlife photographer, he has explored many of India\'s biodiversity hotspots and authored and co-authored books on biodiversity. He leads curated birdwatching tours, butterfly walks, photography tours, and rainforest explorations designed to go beyond sightseeing — helping guests understand ecosystems and become ambassadors for conservation.'
  },
  {
    id: 'dr-griffith-michael',
    name: 'Dr. Griffith Michael',
    qualifications: 'Ph.D. in Zoology; postgraduate qualifications in Wildlife Biology and Zoology',
    specialization: 'Mammal ecology and conservation, with a focus on the lesser-known mammals of South India',
    imageUrl: '/photos/experts/griffith.webp',
    experience: 'Striped Hyena research in Sanjay Dubri Tiger Reserve; bird, butterfly, mammal, and tiger monitoring at Karaivetti, Point Calimere, and Anamalai Tiger Reserve',
    bio: 'A wildlife biologist and zoologist, Dr. Griffith\'s doctoral research explored the diversity and ecology of the lesser-known small mammals of Tiruchirappalli. He has taken part in biodiversity surveys across India\'s protected areas and trained in Ecology of the Indian Tropics at the Au Sable Institute, Michigan, USA. He leads birdwatching programmes, mammal tracking sessions, and wildlife interpretation walks that combine scientific accuracy with hands-on field craft. His belief: every species, large or small, common or elusive, plays a vital role in healthy ecosystems — and conservation begins with curiosity.'
  }
];

export const species: Species[] = [
  {
    id: 'bengal-tiger',
    commonName: 'Bengal Tiger',
    scientificName: 'Panthera tigris tigris',
    category: 'Mammals',
    endemic: false,
    threatened: true,
    habitat: 'Forests, grasslands, mangroves, and riverine habitats',
    fieldNote: 'Best observed through patient safari drives, track reading, and listening for alarm calls.'
  },
  {
    id: 'great-hornbill',
    commonName: 'Great Hornbill',
    scientificName: 'Buceros bicornis',
    category: 'Birds',
    endemic: false,
    threatened: true,
    habitat: 'Mature evergreen and moist forests',
    fieldNote: 'Listen for heavy wingbeats and watch fruiting trees in the early morning.'
  },
  {
    id: 'southern-birdwing',
    commonName: 'Southern Birdwing',
    scientificName: 'Troides minos',
    category: 'Butterflies',
    endemic: true,
    threatened: false,
    habitat: 'Forest edges and clearings',
    fieldNote: "One of India's two largest butterflies, often seen flying high along forest edges."
  },
  {
    id: 'rhododendron',
    commonName: 'Rhododendron',
    scientificName: 'Rhododendron spp.',
    category: 'Flora',
    endemic: false,
    threatened: false,
    habitat: 'Himalayan and highland forests',
    fieldNote: 'Spectacular blooms in spring attract birds, insects, and photographers.'
  }
];

// ---------------------------------------------------------------------------
// Guest responsibilities and health & safety (owner brief, points 5-7)
// ---------------------------------------------------------------------------

export interface InfoItem {
  title: string;
  detail: string;
}

/** What guests arrange and bring themselves (owner brief, point 5). */
export const guestResponsibilities: InfoItem[] = [
  {
    title: 'Getting to the start and home again',
    detail:
      'You arrange and pay for your own travel to the trip\'s start point and home from its end point, including international and domestic flights, trains and any hotel nights before or after the trip. ' +
      'The start and end points are under "At a glance" on each trip page; where they say "Confirmed at booking", we give you the details when you book.'
  },
  {
    // Official portal: https://indianvisaonline.gov.in ; Indian missions warn of
    // look-alike sites, e.g. https://www.cgisf.gov.in/page/important-advisory-on-fake-indian-e-visa-websites/
    // (VERIFIED 2026-10-03)
    title: 'Passport and visa',
    detail:
      'Make sure your passport is valid and that you hold the right Indian visa before you travel. ' +
      'Apply only through the Government of India\'s official site, indianvisaonline.gov.in: look-alike sites charge several times the real fee.'
  },
  {
    title: 'Your own kit',
    detail:
      'Cameras, binoculars, walking shoes, rain gear, chargers and a plug adapter are yours to bring; we carry shared field guides and references. ' +
      'The packing list on Practical Info covers the rest.'
  },
  {
    title: 'Personal medication',
    detail:
      'Bring enough of any medication you take for the whole trip plus a few days\' spare, in its original packaging with a copy of the prescription, and keep it in your hand luggage. ' +
      'Our guides carry a basic first-aid kit but cannot supply prescription medicines.'
  }
];

/** Insurance, allergies and medical disclosure (owner brief, points 6-7). */
export const healthAndSafety: InfoItem[] = [
  {
    title: 'Travel medical insurance is essential',
    detail:
      'Every guest must hold comprehensive travel medical insurance for the whole trip, covering medical treatment, hospital stays and emergency evacuation from remote areas. ' +
      'Check that it covers the activities on your trip and, where relevant, your age and any pre-existing conditions.'
  },
  {
    title: 'Tell us about any allergies',
    detail:
      'Tell us at booking about any allergy, whether to food, insect stings or medicines. We pass food allergies on to every kitchen on the route. ' +
      'If you carry an adrenaline auto-injector or antihistamines, bring a spare and show your guide where you keep them.'
  },
  {
    title: 'Declare medical conditions before you book',
    detail:
      'Tell us before you book about any medical condition, disability, pregnancy or mobility limitation, and any medicines you take regularly. ' +
      'We will ask you to fill in a short health form so we can judge whether a trip suits you, plan the pace and respond properly in an emergency.'
  },
  {
    title: 'Remote places, distant hospitals',
    detail:
      'Many of our routes are remote. The nearest hospital can be several hours away by road, and mobile signal can be patchy or absent. ' +
      'That is why insurance and an honest health declaration matter.'
  }
];

// ---------------------------------------------------------------------------
// FAQs
// ---------------------------------------------------------------------------

export type FaqCategory =
  | 'About the trips'
  | 'Who can join'
  | 'Food & diet'
  | 'Accessibility'
  | 'Health & safety'
  | 'Practicalities'
  | 'Booking';

export interface Faq {
  category: FaqCategory;
  question: string;
  answer: string;
  /** Proposed business policy awaiting owner confirmation (see POLICY_REVIEW.md). */
  policy?: boolean;
}

/** Display order for FAQ categories. */
export const faqCategories: FaqCategory[] = [
  'About the trips',
  'Who can join',
  'Food & diet',
  'Accessibility',
  'Health & safety',
  'Practicalities',
  'Booking'
];

const leadWeeks = Math.round(SITE.bookingLeadDays / 7);

export const faqs: Faq[] = [
  // --- About the trips -----------------------------------------------------
  {
    category: 'About the trips',
    question: 'Where do your trips go?',
    answer:
      'Our home ground is the Western Ghats of South India, across Kerala, Tamil Nadu and Karnataka, where our naturalists have done much of their field research. ' +
      'Alongside the Western Ghats Endemics Expedition we run a monsoon rainforest trip for frogs and reptiles, a Central India big-cat safari and a Himalayan birding trip. ' +
      'Custom routes can be discussed on request.'
  },
  {
    category: 'About the trips',
    question: 'Will we definitely see tigers, or the species listed on a trip page?',
    answer:
      `${wildlifeDisclaimer} The species on each trip page are what the habitats hold and what we will look for, not a promise. ` +
      'Whatever turns up on the day, your naturalist will help you find it, identify it and understand how it lives.'
  },
  {
    category: 'About the trips',
    // Sources: Eravikulam closure - see western-ghats-endemics seasonMonths;
    // tiger-reserve closure and May heat - Pench FAQ,
    // https://forest.mponline.gov.in/Images/PenchFAQ.pdf (VERIFIED 2026-10-03)
    question: 'When is the best time to go?',
    answer:
      'It depends on the trip. Western Ghats Endemics runs from October to January; we stop in February and March because Eravikulam National Park closes each year for the Nilgiri tahr calving season. ' +
      'Monsoon Rainforest Nights runs from June to September, when frogs and reptiles are most active and the forest is at its greenest. ' +
      'Central India Big Cats runs from October to May: tiger-reserve core zones close for the monsoon from 1 July to 30 September, and late-May days can pass 40 °C. ' +
      'The Himalaya trip runs from March to May and in October and November.'
  },
  {
    category: 'About the trips',
    question: 'How academic are the tours?',
    answer:
      'They are experience-led, not lecture-led. Guides explain what you are seeing in the field, but the emphasis is on wildlife watching, photography, landscapes, food, rest and comfortable travel.'
  },
  {
    category: 'About the trips',
    // Scenery is drawn from each trip's sceneryHighlights, which in turn only
    // repeat places named in the itineraries.
    question: 'Apart from wildlife, I want to see beautiful places. Is that included?',
    answer:
      'Yes. Scenic places are part of each route, not an extra. On the Western Ghats Endemics Expedition you pass through the shola forests and grasslands of Pampadum Shola and Mukurthi, Rajamalai in Eravikulam National Park, the tea-estate country around Valparai, and Doddabetta and Wenlock Downs near Ooty. ' +
      'The monsoon trip includes a waterfall or viewpoint visit and stops in spice and plantation country; the Himalaya trip follows a ridge route with mountain views. ' +
      'Each trip page lists its scenic highlights. If landscapes matter more to you than wildlife, we can weight a private itinerary towards them.'
  },
  {
    category: 'About the trips',
    question: 'Can you provide guided day tours?',
    answer:
      'Yes. Where local logistics allow, we offer half-day and full-day guiding for birds, butterflies, forest trails, wetlands and safaris, for guests who are already in the area.'
  },
  {
    category: 'About the trips',
    question: 'Can you design a programme for our group?',
    answer:
      'Yes. We design custom programmes for families, private groups, photographers, clubs, companies, schools and universities. Tell us your dates, group size, comfort level and interests.'
  },

  // --- Who can join --------------------------------------------------------
  {
    category: 'Who can join',
    question: 'I have a six-month-old baby. Can we join, and what is the minimum age?',
    policy: true,
    answer:
      'Our fixed departures are not suitable for babies and toddlers. Days involve long drives on winding hill roads, pre-dawn starts, open safari vehicles and stays in remote areas that can be hours from a hospital with children\'s care. ' +
      'Our minimum age on fixed departures is 8, and 12 for night walks, which means the Monsoon Rainforest Nights trip is for ages 12 and over. Everyone under 18 travels with a parent or guardian. Some forest-department treks set their own higher limits (Tamil Nadu forest treks, for example, generally exclude children under 10), so a few walks may not be open to younger children. ' +
      'If you are travelling with a baby, ask us about a private, gentle itinerary: short drives, one comfortable base and daytime walks, with nothing that depends on early starts. Please also talk to your doctor about travel and vaccinations for your child.'
  },
  {
    category: 'Who can join',
    question: 'I am 75 and walk slowly. Can I join?',
    policy: true,
    answer:
      'Age on its own is not a barrier; pace and health are what matter. The Central India Big Cats trip is rated Easy: most wildlife watching is from a safari vehicle, and walks are short and optional. ' +
      'Our Moderate trips include walks on uneven forest trails, some climbs and cool early starts at altitude. The guide sets a pace the whole group can manage, and you can sit out any walk. ' +
      'If you would rather set your own pace throughout, a private departure is the better fit. Getting into an open safari jeep involves a high step. ' +
      'Please tell us about any mobility limits or medical conditions before booking, and check that your travel insurance covers you at your age, as some policies have upper age limits.'
  },
  {
    category: 'Who can join',
    question: 'We are a family and want to see wildlife in the forest without much risk. Is there a suitable trip?',
    policy: true,
    answer:
      'Yes. The Central India Big Cats & Forest Safari is our most family-friendly route: it is rated Easy, wildlife is watched from safari vehicles with a naturalist, walks stay in lodge grounds and buffer forest, and there is downtime between drives. ' +
      'Our guides keep a safe distance from animals, follow park rules and never handle wildlife. ' +
      'For younger children or a gentler pace, a private family itinerary or a few guided day walks may suit you better. The minimum age on fixed departures is 8.'
  },
  {
    category: 'Who can join',
    question: 'Do I need previous wildlife knowledge?',
    answer:
      'No. Most trips are beginner-friendly, and our guides help you see, identify and enjoy wildlife at your level. Experienced naturalists can still ask for specialist routes and deeper interpretation.'
  },
  {
    category: 'Who can join',
    question: 'What level of fitness do I need?',
    answer:
      'It depends on the trip. The Central India safari is rated Easy and is mostly vehicle-based. The rainforest, Western Ghats and Himalaya trips are Moderate, with more walking on uneven ground, some climbs and more exposure to weather. ' +
      'Each trip page shows its difficulty. On a private departure we can tailor the pace.'
  },
  {
    category: 'Who can join',
    question: 'Do you welcome international visitors?',
    policy: true,
    answer:
      'Yes. Our trips are planned with overseas travellers in mind and are guided in English. ' +
      'For the Western Ghats Endemics Expedition, the nearest airport to the start at Thattekad is Kochi (COK); the trip ends at Bandipur, about 80 km from Mysuru, with onward travel via Mysuru or Bengaluru (BLR). ' +
      'For the other trips we confirm the start point and nearest gateway when you book. You are responsible for your own visa: apply only through the official site, indianvisaonline.gov.in. Carry your passport on park days, as entry permits for foreign nationals are checked against it.'
  },

  // --- Food & diet ---------------------------------------------------------
  {
    category: 'Food & diet',
    question: 'I am vegan. Will I get food I can eat?',
    policy: true,
    answer:
      'Yes, with notice. Indian cooking has a strong vegetarian tradition, and many everyday dishes can be made without dairy: idli, dosa, sambar and coconut-based vegetable curries in the south; dal, chana and vegetable dishes with roti elsewhere. ' +
      'Ghee, butter, paneer, curd and milk in tea are common, though, so tell us at booking and we will brief every lodge and kitchen on the route. ' +
      'Menus at remote lodges are simpler than in towns, and we cannot promise a separate vegan kitchen, but we will plan so that you have a proper meal at every stop.'
  },
  {
    category: 'Food & diet',
    question: 'I cannot eat spicy food. Will there be something I can enjoy?',
    policy: true,
    answer:
      'Yes. Tell us when you book and we will ask each kitchen to make mild versions of dishes for you. Plain rice, chapati, dal, vegetables, curd, eggs and toast are easy to find in most lodges, ' +
      'and your guide can point out which dishes on a shared table are mild. If you are unsure about a dish, just ask before you try it.'
  },
  {
    category: 'Food & diet',
    question: 'Are meals included?',
    answer:
      'Yes. Meals are included on all four trips (each trip page lists exactly what is included). Food is usually fresh, local and vegetarian-friendly. ' +
      'Tell us about any allergy, intolerance or dietary need when you book.'
  },

  // --- Accessibility -------------------------------------------------------
  {
    category: 'Accessibility',
    question: 'Do you have tours suitable for disabled travellers?',
    policy: true,
    answer:
      'We do not yet run trips designed for wheelchair users, and we would rather say so plainly than promise access we have not checked. ' +
      'Forest trails are uneven, open safari jeeps have a high step, and many lodges and park facilities have steps and bathrooms that are not adapted. ' +
      'Some parts of our trips involve little walking: jeep safaris once you are aboard, wildlife watching from the vehicle, birding in lodge gardens, and interpretation centres such as the Salim Ali Bird Interpretation Centre at Thattekad and those at Eravikulam and Bandipur. We have not yet assessed these for step-free access. ' +
      'Please tell us about your needs. We will be honest about what is realistic and, where it is, build a private itinerary around it.'
  },

  // --- Health & safety -----------------------------------------------------
  {
    category: 'Health & safety',
    question: 'Do I need travel insurance?',
    policy: true,
    answer:
      'Yes, it is essential. Every guest must hold comprehensive travel medical insurance for the whole trip, covering medical treatment, hospital stays and emergency evacuation from remote areas. ' +
      'Check that it covers the activities on your trip and, where relevant, your age and any pre-existing conditions.'
  },
  {
    category: 'Health & safety',
    question: 'I have allergies. What should I tell you?',
    policy: true,
    answer:
      'Tell us at booking about any allergy: to foods such as nuts, gluten or shellfish, to insect stings, to medicines, or anything else. We pass food allergies on to every kitchen on the route. ' +
      'If you carry an adrenaline auto-injector or antihistamines, bring a spare and show your guide where you keep them.'
  },
  {
    category: 'Health & safety',
    question: 'I have a medical condition. Do I need to tell you?',
    policy: true,
    answer:
      'Yes. Please tell us before you book about any medical condition, disability, pregnancy or mobility limitation, and any medicines you take regularly. We will ask you to fill in a short health form. ' +
      'This is not to turn people away: it lets us judge whether a trip suits you, plan the pace and know what to do in an emergency. ' +
      'Many of our routes are remote, and the nearest hospital can be several hours away by road.'
  },
  {
    category: 'Health & safety',
    question: 'Are the trips safe? What about snakes and large mammals?',
    answer:
      'Our guides keep a safe distance from wildlife, follow park rules, and never handle, bait or crowd animals. Snakes are watched from a respectful distance and only with a guide. ' +
      'Large mammals such as elephants and gaur are given plenty of room, and safaris follow the park\'s rules on vehicles and routes.'
  },

  // --- Practicalities ------------------------------------------------------
  {
    category: 'Practicalities',
    question: 'What do I need to arrange myself?',
    answer:
      'Your travel to the trip\'s start point and home from its end point (flights, trains and visa included); your camera gear, binoculars and walking or trekking gear; chargers, power banks and a plug adapter; and any personal medication with copies of your prescriptions. ' +
      'Comprehensive travel medical insurance is essential.'
  },
  {
    category: 'Practicalities',
    // India: Types C, D and M; 230 V; 50 Hz. Type D is the standard for small
    // devices, Type M for heavy appliances; Type C plugs fit most Type D sockets.
    // Source: https://www.worldstandards.eu/electricity/plug-voltage-by-country/india/
    // (VERIFIED 2026-10-03; the IEC World Plugs site lists the same but refused automated access)
    question: 'What plugs and voltage does India use?',
    answer:
      'India runs on 230 V at 50 Hz. Sockets are Type D (three round pins in a triangle, the most common), Type M (a larger three-pin version for heavy appliances) and Type C (the two-pin Europlug, which fits most Type D sockets). ' +
      'Most phone, camera and laptop chargers accept 100–240 V, but check the label; single-voltage appliances from 110–120 V countries need a converter, not just an adapter. ' +
      'Bring a universal adapter and a power bank, as power can be intermittent at remote lodges.'
  },
  {
    category: 'Practicalities',
    // Coverage gaps in forest areas: e.g. Edamalakkudy, deep inside Eravikulam
    // National Park, lacks "a robust link to a mobile phone network" (The South
    // First, 30 Oct 2022): https://thesouthfirst.com/news/forgotten-village-kerala-to-finally-construct-road-to-its-only-tribal-gram-panchayat-edamalakkudy
    // Phones must be on silent during park safaris (Pench FAQ Q11):
    // https://forest.mponline.gov.in/Images/PenchFAQ.pdf (VERIFIED 2026-10-03)
    // Town coverage on our routes: ASSUMED, not measured.
    question: 'Will I have mobile signal and internet? Can I use my laptop?',
    answer:
      'Expect to be partly offline. Most towns on our routes have mobile data, but signal is weak or absent inside many forests and sanctuaries and on stretches of hill road, and lodge Wi-Fi, where there is any, can be slow. ' +
      'You are welcome to bring a laptop for the evenings, but please do not plan video calls or work deadlines during the trip. Phones must be kept on silent during park safaris, and some tiger reserves do not allow phones in core safari zones at all; your guide will brief you. ' +
      'Overseas visitors should check international roaming with their provider before travelling, and leave a copy of the itinerary with family.'
  },
  {
    category: 'Practicalities',
    question: 'Do you supply toilet paper, soap, toothpaste and other essentials?',
    policy: true,
    answer:
      'The lodges and hotels we use normally supply soap and toilet paper in rooms. Please bring your own toothbrush, toothpaste and other toiletries. ' +
      'On the road and in forest areas, public toilets often have neither toilet paper nor soap, and many Indian toilets have a hand-held water spray instead of paper, so carry a small kit: tissues or a travel roll, hand sanitiser and wet wipes.'
  },
  {
    category: 'Practicalities',
    question: 'What accommodation can I expect?',
    answer:
      'We use wildlife lodges, guesthouses and nature stays chosen for comfort and for being close to the field. Each trip page shows the type of accommodation on that route.'
  },

  // --- Booking -------------------------------------------------------------
  {
    category: 'Booking',
    question: 'How do I book a trip?',
    answer:
      `Message us on WhatsApp (${SITE.whatsapp.display}) or send the enquiry form with the trip and dates you are interested in, your group size and any health or dietary needs. ` +
      'We will reply with availability, a suggested plan and how to confirm your place.'
  },
  {
    category: 'Booking',
    question: 'Are the listed dates fixed? How far ahead should I book?',
    policy: true,
    answer:
      `The dates on each trip page are planned departures for the coming seasons, set by each trip's season and departure pattern. We list departures at least ${leadWeeks} weeks ahead, to leave time for park permits, lodges and your own travel plans. ` +
      'We confirm each date with you when you enquire. If none of them suits you, ask about a private departure. ' +
      'Parks occasionally close or suspend safaris at short notice for weather, wildlife-management or legal reasons. If that happens on your dates, we substitute a comparable site or activity and tell you as early as we can.'
  }
];

export const services: Service[] = [
  {
    id: 'guided-day-tours',
    title: 'Guided Day Tours',
    tagline: 'Birding, safaris, trails, and wetlands',
    description: 'Half-day and full-day guiding for guests already in a region, with routes matched to the season, local wildlife, and your pace.',
    forWho: 'Travellers, resort guests, families'
  },
  {
    id: 'private-custom',
    title: 'Private & Tailor-Made Tours',
    tagline: 'Your dates, your pace, your comfort level',
    description: 'A private itinerary built around your interests, fitness, wish-list species, preferred accommodation, and available travel window.',
    forWho: 'Couples, friends, solo travellers'
  },
  {
    id: 'target-species',
    title: 'Target Species Routes',
    tagline: 'Wildlife with a clear purpose',
    // Was: "...pheasants, red pandas, snow leopards..." - no route for those exists or has been confirmed.
    description: 'Routes planned around the species you most want to look for: Western Ghats endemics, hornbills, tigers, leopards, elephants, frogs, butterflies, and more. We plan for the best chance, never a guarantee.',
    forWho: 'Birders, naturalists, photographers'
  },
  {
    id: 'custom-groups',
    title: 'Custom Group Programmes',
    tagline: 'Made for your group',
    description: 'Flexible programmes for private groups, clubs, companies, families, schools, universities, and international travel groups.',
    forWho: 'Groups of 6 or more'
  },
];

// Guest reviews for the home page. The former array was removed on 2026-10-03: no trip had
// yet run under this brand, so every review in it was invented. Add reviews only from real
// guests, with their written permission, and keep the wording exactly as they gave it
// (EU and UK law ban fake or edited consumer reviews). While this list is empty the
// "What our guests say" section shows marked samples in development and nothing on the
// live site.
export interface Review {
  name: string;
  country: string;
  trip: string;
  text: string;
  /** Out of 5, as the guest gave it. */
  rating: number;
  /** Month of travel, e.g. "November 2026". */
  travelled?: string;
}

export const reviews: Review[] = [];

