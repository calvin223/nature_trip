/* Licensed action photos of people (guests, birders, trekkers, safari jeeps).
   Every image is from Wikimedia Commons under CC BY / CC BY-SA; the credit
   block must be displayed wherever the image is shown. Licence, author and
   selection reasons per image: public/photos/people/CREDITS.md.
   Sourced and licence-checked 2026-10-03. */

export interface PeoplePhoto {
  slug: string;
  alt: string;
  scene: 'forest-walk' | 'birdwatching' | 'jeep-safari' | 'photography' | 'group-guide' | 'viewpoint' | 'night-walk';
  src: string;
  thumb: string;
  w: number;
  h: number;
  credit: {
    author: string;
    source: 'Wikimedia Commons' | 'Unsplash' | 'Pexels' | string;
    sourceUrl: string;
    licence: string;
    licenceUrl: string;
    /** Changes made to the original (shown on /credits/, required by CC BY-SA). Default: resized and converted to WebP. */
    changes?: string;
  };
}

const BY_SA_4 = { licence: 'CC BY-SA 4.0', licenceUrl: 'https://creativecommons.org/licenses/by-sa/4.0/' };
const BY_SA_3 = { licence: 'CC BY-SA 3.0', licenceUrl: 'https://creativecommons.org/licenses/by-sa/3.0/' };
const BY_3 = { licence: 'CC BY 3.0', licenceUrl: 'https://creativecommons.org/licenses/by/3.0/' };
const BY_2 = { licence: 'CC BY 2.0', licenceUrl: 'https://creativecommons.org/licenses/by/2.0/' };

export const peoplePhotos: PeoplePhoto[] = [
  {
    slug: 'hiker-forest-trail-agasthyarkoodam',
    alt: "A hiker with a blue rucksack walks away from the camera along a leaf-strewn forest trail on the Agasthyarkoodam trek in Kerala's Western Ghats",
    scene: 'forest-walk',
    src: '/photos/people/hiker-forest-trail-agasthyarkoodam.webp',
    thumb: '/photos/people/thumb/hiker-forest-trail-agasthyarkoodam.webp',
    w: 1600, h: 1200,
    credit: { author: 'Athulvis', source: 'Wikimedia Commons', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Agasthyarkoodam_Trekking_25.jpg', ...BY_SA_4 },
  },
  {
    slug: 'guided-forest-trek-periyar',
    alt: "A small trekking group walks single file along a shaded forest path on one of Thekkady's guided forest treks in Periyar, Kerala",
    scene: 'group-guide',
    src: '/photos/people/guided-forest-trek-periyar.webp',
    thumb: '/photos/people/thumb/guided-forest-trek-periyar.webp',
    w: 1600, h: 1200,
    credit: { author: 'Kir360', source: 'Wikimedia Commons', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Thekkady_Forest_Trek.JPG', ...BY_3 },
  },
  {
    slug: 'birding-group-spotting-scope',
    alt: 'A small birding party with a spotting scope on a tripod scans open, sun-dried grassland at Madhure Kere',
    scene: 'group-guide',
    src: '/photos/people/birding-group-spotting-scope.webp',
    thumb: '/photos/people/thumb/birding-group-spotting-scope.webp',
    w: 1600, h: 900,
    credit: { author: 'Mike Prince', source: 'Wikimedia Commons', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Birding_at_Madhure_Kere_(50890314532).jpg', ...BY_2 },
  },
  {
    slug: 'birdwatchers-western-ghats-road',
    alt: 'Two birdwatchers stand on a quiet forest road in the Southern Western Ghats, binoculars raised to scan the canopy',
    scene: 'birdwatching',
    src: '/photos/people/birdwatchers-western-ghats-road.webp',
    thumb: '/photos/people/thumb/birdwatchers-western-ghats-road.webp',
    w: 1600, h: 1060,
    credit: { author: 'PJeganathan', source: 'Wikimedia Commons', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Birdwatchers_in_Southern_Western_Ghats_JEG0936.jpg', ...BY_SA_4 },
  },
  {
    slug: 'birders-binoculars-forest',
    alt: 'Three birders with binoculars and a tripod watch the canopy from the edge of a leaf-strewn forest stream bed in India',
    scene: 'birdwatching',
    src: '/photos/people/birders-binoculars-forest.webp',
    thumb: '/photos/people/thumb/birders-binoculars-forest.webp',
    w: 1200, h: 1600,
    credit: { author: 'Mike Prince', source: 'Wikimedia Commons', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Birding_(49443372038).jpg', ...BY_2 },
  },
  {
    slug: 'safari-gypsy-sambar-corbett',
    alt: 'A sambar deer crosses a leaf-strewn forest road ahead of an open safari Gypsy in Dhikala, Corbett Tiger Reserve',
    scene: 'jeep-safari',
    src: '/photos/people/safari-gypsy-sambar-corbett.webp',
    thumb: '/photos/people/thumb/safari-gypsy-sambar-corbett.webp',
    w: 1600, h: 1200,
    credit: { author: 'A. J. T. Johnsingh, WWF-India and NCF', source: 'Wikimedia Commons', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Sambar_and_gypsy,_Dhikala,_4th_June_2017,_AJT_Johnsingh._P1120795.JPG', ...BY_SA_3 },
  },
  {
    slug: 'photographers-maguri-beel',
    alt: 'Two wildlife photographers seen from behind, one shouldering a long telephoto lens, look out over the Maguri Beel wetland in Assam under a stormy sky',
    scene: 'photography',
    src: '/photos/people/photographers-maguri-beel.webp',
    thumb: '/photos/people/thumb/photographers-maguri-beel.webp',
    w: 1200, h: 1600,
    credit: { author: 'JyotiPN', source: 'Wikimedia Commons', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Loren_Sonowal_and_Nilotpal_Baruah_at_Maguri_Beel.jpg', ...BY_SA_4 },
  },
  {
    slug: 'photographer-kole-wetland-egrets',
    alt: 'A birdwatcher seen from behind photographs egrets, painted storks and ibises across a channel during a bird walk at the Pullazhi Kole Wetlands, Kerala',
    scene: 'photography',
    src: '/photos/people/photographer-kole-wetland-egrets.webp',
    thumb: '/photos/people/thumb/photographer-kole-wetland-egrets.webp',
    w: 1600, h: 989,
    credit: { author: 'Manojk', source: 'Wikimedia Commons', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Bird_Walk_at_Pullazhi_Kole_Wetlands,_2024_Nov_13.jpg', ...BY_SA_4 },
  },
  {
    slug: 'trekker-kudremukh-ridge',
    alt: 'A lone trekker with a walking stick pauses on a narrow grassy ridge trail in Kudremukh National Park, looking out over mist-wrapped Western Ghats hills',
    scene: 'viewpoint',
    src: '/photos/people/trekker-kudremukh-ridge.webp',
    thumb: '/photos/people/thumb/trekker-kudremukh-ridge.webp',
    w: 1600, h: 949,
    credit: { author: 'Ramesh Desai', source: 'Wikimedia Commons', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Kudremukh_Peak.jpg', ...BY_SA_4 },
  },
  {
    slug: 'trekkers-netravati-ridge-trail',
    alt: 'Groups of trekkers follow a red-earth trail over rolling green grassland towards the mist on Netravati Peak, Kudremukh National Park',
    scene: 'viewpoint',
    src: '/photos/people/trekkers-netravati-ridge-trail.webp',
    thumb: '/photos/people/thumb/trekkers-netravati-ridge-trail.webp',
    w: 1600, h: 1067,
    credit: { author: 'iMahesh', source: 'Wikimedia Commons', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Trekking_trail_from_Netravati_peak.jpg', ...BY_SA_4, changes: 'cropped, resized and converted to WebP' },
  },
  {
    slug: 'hiker-munnar-valley-view',
    alt: 'A backpacker seen from behind looks out over forested hills and a distant river near Kolukkumalai, Munnar',
    scene: 'viewpoint',
    src: '/photos/people/hiker-munnar-valley-view.webp',
    thumb: '/photos/people/thumb/hiker-munnar-valley-view.webp',
    w: 1066, h: 1600,
    credit: { author: 'Varkeyparakkal', source: 'Wikimedia Commons', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Trekking_Across_Munnar.jpg', ...BY_SA_4 },
  },
];
