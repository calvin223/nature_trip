import { overlayEntry } from '@/i18n/content';
import type { Locale } from '@/i18n/locales';

export interface Photo {
  category: string;
  categoryLabel: string;
  slug: string;
  name: string;
  src: string;
  thumb: string;
  w: number;
  h: number;
  /* Landscape re-crop for the wide trip card/hero frames, where a portrait
     original would otherwise be cropped down to the subject's body. */
  wide?: string;
}

export const photos: Photo[] = [
  { category: 'amphibians', categoryLabel: 'Amphibians', slug: 'common-indian-toad', name: "Common Indian Toad", src: '/photos/amphibians/common-indian-toad.webp', thumb: '/photos/amphibians/thumb/common-indian-toad.webp', w: 1600, h: 1063 },
  { category: 'amphibians', categoryLabel: 'Amphibians', slug: 'green-frog', name: "Green Frog", src: '/photos/amphibians/green-frog.webp', thumb: '/photos/amphibians/thumb/green-frog.webp', w: 1600, h: 1200 },
  { category: 'amphibians', categoryLabel: 'Amphibians', slug: 'painted-frog', name: "Painted Frog", src: '/photos/amphibians/painted-frog.webp', thumb: '/photos/amphibians/thumb/painted-frog.webp', w: 1600, h: 1200 },
  { category: 'birds', categoryLabel: 'Birds', slug: 'bar-headed-goose', name: "Bar-headed Goose", src: '/photos/birds/bar-headed-goose.webp', thumb: '/photos/birds/thumb/bar-headed-goose.webp', w: 1600, h: 1063 },
  { category: 'birds', categoryLabel: 'Birds', slug: 'waterbird-flock', name: "Waterbird Flock", src: '/photos/birds/waterbird-flock.webp', thumb: '/photos/birds/thumb/waterbird-flock.webp', w: 1600, h: 1071 },
  { category: 'birds', categoryLabel: 'Birds', slug: 'birds-in-flight', name: "Birds in Flight", src: '/photos/birds/birds-in-flight.webp', thumb: '/photos/birds/thumb/birds-in-flight.webp', w: 1401, h: 560 },
  { category: 'birds', categoryLabel: 'Birds', slug: 'blue-bearded-bee-eater', name: "Blue-bearded Bee-eater", src: '/photos/birds/blue-bearded-bee-eater.webp', thumb: '/photos/birds/thumb/blue-bearded-bee-eater.webp', w: 1600, h: 1063 },
  { category: 'birds', categoryLabel: 'Birds', slug: 'blue-tailed-bee-eater', name: "Blue-tailed Bee-eater", src: '/photos/birds/blue-tailed-bee-eater.webp', thumb: '/photos/birds/thumb/blue-tailed-bee-eater.webp', w: 1600, h: 1200 },
  { category: 'birds', categoryLabel: 'Birds', slug: 'collared-dove', name: "Collared Dove", src: '/photos/birds/collared-dove.webp', thumb: '/photos/birds/thumb/collared-dove.webp', w: 1600, h: 1200 },
  { category: 'birds', categoryLabel: 'Birds', slug: 'dusky-eagle-owl', name: "Dusky Eagle-Owl", src: '/photos/birds/dusky-eagle-owl.webp', thumb: '/photos/birds/thumb/dusky-eagle-owl.webp', w: 1067, h: 1600 },
  { category: 'birds', categoryLabel: 'Birds', slug: 'great-indian-bustard', name: "Great Indian Bustard", src: '/photos/birds/great-indian-bustard.webp', thumb: '/photos/birds/thumb/great-indian-bustard.webp', w: 1600, h: 1081 },
  { category: 'birds', categoryLabel: 'Birds', slug: 'himalayan-whistling-thrush', name: "Himalayan Whistling-Thrush", src: '/photos/birds/himalayan-whistling-thrush.webp', thumb: '/photos/birds/thumb/himalayan-whistling-thrush.webp', w: 1600, h: 1200 },
  { category: 'birds', categoryLabel: 'Birds', slug: 'hoopoe', name: "Hoopoe", src: '/photos/birds/hoopoe.webp', thumb: '/photos/birds/thumb/hoopoe.webp', w: 1587, h: 1058 },
  { category: 'birds', categoryLabel: 'Birds', slug: 'indian-roller', name: "Indian Roller", src: '/photos/birds/indian-roller.webp', thumb: '/photos/birds/thumb/indian-roller.webp', w: 1600, h: 1200 },
  { category: 'birds', categoryLabel: 'Birds', slug: 'white-throated-kingfisher', name: "White-throated Kingfisher", src: '/photos/birds/white-throated-kingfisher.webp', thumb: '/photos/birds/thumb/white-throated-kingfisher.webp', w: 1600, h: 1200 },
  { category: 'birds', categoryLabel: 'Birds', slug: 'legge-s-hawk-eagle', name: "Legge's Hawk-Eagle", src: '/photos/birds/legge-s-hawk-eagle.webp', thumb: '/photos/birds/thumb/legge-s-hawk-eagle.webp', w: 1600, h: 1200 },
  { category: 'birds', categoryLabel: 'Birds', slug: 'lesser-yellownape-woodpecker', name: "Lesser Yellownape Woodpecker", src: '/photos/birds/lesser-yellownape-woodpecker.webp', thumb: '/photos/birds/thumb/lesser-yellownape-woodpecker.webp', w: 1600, h: 1063 },
  { category: 'birds', categoryLabel: 'Birds', slug: 'montagu-s-harrier', name: "Montagu's Harrier", src: '/photos/birds/montagu-s-harrier.webp', thumb: '/photos/birds/thumb/montagu-s-harrier.webp', w: 1600, h: 1200 },
  { category: 'birds', categoryLabel: 'Birds', slug: 'mottled-wood-owl', name: "Mottled Wood-Owl", src: '/photos/birds/mottled-wood-owl.webp', thumb: '/photos/birds/thumb/mottled-wood-owl.webp', w: 1067, h: 1600 },
  { category: 'birds', categoryLabel: 'Birds', slug: 'osprey', name: "Osprey", src: '/photos/birds/osprey.webp', thumb: '/photos/birds/thumb/osprey.webp', w: 1600, h: 1067 },
  { category: 'birds', categoryLabel: 'Birds', slug: 'indian-paradise-flycatcher', name: "Indian Paradise Flycatcher", src: '/photos/birds/indian-paradise-flycatcher.webp', thumb: '/photos/birds/thumb/indian-paradise-flycatcher.webp', w: 800, h: 651 },
  { category: 'birds', categoryLabel: 'Birds', slug: 'indian-peafowl', name: "Indian Peafowl", src: '/photos/birds/indian-peafowl.webp', thumb: '/photos/birds/thumb/indian-peafowl.webp', w: 1600, h: 1200 },
  { category: 'birds', categoryLabel: 'Birds', slug: 'pied-cuckoo', name: "Pied Cuckoo", src: '/photos/birds/pied-cuckoo.webp', thumb: '/photos/birds/thumb/pied-cuckoo.webp', w: 1600, h: 1200 },
  { category: 'birds', categoryLabel: 'Birds', slug: 'plain-prinia', name: "Plain Prinia", src: '/photos/birds/plain-prinia.webp', thumb: '/photos/birds/thumb/plain-prinia.webp', w: 1600, h: 1200 },
  { category: 'birds', categoryLabel: 'Birds', slug: 'purple-heron', name: "Purple Heron", src: '/photos/birds/purple-heron.webp', thumb: '/photos/birds/thumb/purple-heron.webp', w: 1600, h: 1200 },
  { category: 'birds', categoryLabel: 'Birds', slug: 'red-whiskered-bulbul', name: "Red-whiskered Bulbul", src: '/photos/birds/red-whiskered-bulbul.webp', thumb: '/photos/birds/thumb/red-whiskered-bulbul.webp', w: 1600, h: 1200 },
  { category: 'birds', categoryLabel: 'Birds', slug: 'indian-rock-eagle-owl', name: "Indian Rock Eagle-Owl", src: '/photos/birds/indian-rock-eagle-owl.webp', thumb: '/photos/birds/thumb/indian-rock-eagle-owl.webp', w: 1600, h: 1063 },
  { category: 'birds', categoryLabel: 'Birds', slug: 'northern-shoveler', name: "Northern Shoveler", src: '/photos/birds/northern-shoveler.webp', thumb: '/photos/birds/thumb/northern-shoveler.webp', w: 1600, h: 1062 },
  { category: 'birds', categoryLabel: 'Birds', slug: 'sri-lanka-bay-owl', name: "Sri Lanka Bay Owl", src: '/photos/birds/sri-lanka-bay-owl.webp', thumb: '/photos/birds/thumb/sri-lanka-bay-owl.webp', w: 1067, h: 1600 },
  { category: 'birds', categoryLabel: 'Birds', slug: 'woolly-necked-stork', name: "Woolly-necked Stork", src: '/photos/birds/woolly-necked-stork.webp', thumb: '/photos/birds/thumb/woolly-necked-stork.webp', w: 1600, h: 1065 },
  { category: 'butterflies', categoryLabel: 'Butterflies', slug: 'baronet', name: "Baronet", src: '/photos/butterflies/baronet.webp', thumb: '/photos/butterflies/thumb/baronet.webp', w: 1600, h: 1200 },
  { category: 'butterflies', categoryLabel: 'Butterflies', slug: 'common-map', name: "Common Map", src: '/photos/butterflies/common-map.webp', thumb: '/photos/butterflies/thumb/common-map.webp', w: 1600, h: 1065 },
  { category: 'butterflies', categoryLabel: 'Butterflies', slug: 'crimson-tip', name: "Crimson Tip", src: '/photos/butterflies/crimson-tip.webp', thumb: '/photos/butterflies/thumb/crimson-tip.webp', w: 1600, h: 1200 },
  { category: 'butterflies', categoryLabel: 'Butterflies', slug: 'large-salmon-arab', name: "Large Salmon Arab", src: '/photos/butterflies/large-salmon-arab.webp', thumb: '/photos/butterflies/thumb/large-salmon-arab.webp', w: 1600, h: 1142 },
  { category: 'butterflies', categoryLabel: 'Butterflies', slug: 'common-leopard-butterfly', name: "Common Leopard Butterfly", src: '/photos/butterflies/common-leopard-butterfly.webp', thumb: '/photos/butterflies/thumb/common-leopard-butterfly.webp', w: 1600, h: 1143 },
  { category: 'butterflies', categoryLabel: 'Butterflies', slug: 'southern-birdwing', name: "Southern Birdwing", src: '/photos/butterflies/southern-birdwing.webp', thumb: '/photos/butterflies/thumb/southern-birdwing.webp', w: 1280, h: 960 },
  { category: 'butterflies', categoryLabel: 'Butterflies', slug: 'tawny-coster', name: "Tawny Coster", src: '/photos/butterflies/tawny-coster.webp', thumb: '/photos/butterflies/thumb/tawny-coster.webp', w: 1600, h: 1200 },
  { category: 'butterflies', categoryLabel: 'Butterflies', slug: 'yellow-pansy', name: "Yellow Pansy", src: '/photos/butterflies/yellow-pansy.webp', thumb: '/photos/butterflies/thumb/yellow-pansy.webp', w: 1464, h: 976 },
  { category: 'mammals', categoryLabel: 'Mammals', slug: 'black-faced-langur', name: "Black-faced Langur", src: '/photos/mammals/black-faced-langur.webp', thumb: '/photos/mammals/thumb/black-faced-langur.webp', w: 1600, h: 1200 },
  { category: 'mammals', categoryLabel: 'Mammals', slug: 'blackbuck', name: "Blackbuck", src: '/photos/mammals/blackbuck.webp', thumb: '/photos/mammals/thumb/blackbuck.webp', w: 1600, h: 1065 },
  { category: 'mammals', categoryLabel: 'Mammals', slug: 'chital-herd', name: "Chital Herd", src: '/photos/mammals/chital-herd.webp', thumb: '/photos/mammals/thumb/chital-herd.webp', w: 1600, h: 1063 },
  { category: 'mammals', categoryLabel: 'Mammals', slug: 'asian-elephant', name: "Asian Elephant", src: '/photos/mammals/asian-elephant.webp', thumb: '/photos/mammals/thumb/asian-elephant.webp', w: 1600, h: 1200 },
  { category: 'mammals', categoryLabel: 'Mammals', slug: 'asian-elephant-tusker', name: "Asian Elephant Tusker", src: '/photos/mammals/asian-elephant-tusker.webp', thumb: '/photos/mammals/thumb/asian-elephant-tusker.webp', w: 1600, h: 1063 },
  { category: 'mammals', categoryLabel: 'Mammals', slug: 'nilgiri-tahr', name: "Nilgiri Tahr", src: '/photos/mammals/nilgiri-tahr.webp', thumb: '/photos/mammals/thumb/nilgiri-tahr.webp', w: 1600, h: 1040 },
  { category: 'mammals', categoryLabel: 'Mammals', slug: 'indian-gaur', name: "Indian Gaur", src: '/photos/mammals/indian-gaur.webp', thumb: '/photos/mammals/thumb/indian-gaur.webp', w: 1600, h: 1200 },
  { category: 'mammals', categoryLabel: 'Mammals', slug: 'indian-giant-squirrel', name: "Indian Giant Squirrel", src: '/photos/mammals/indian-giant-squirrel.webp', thumb: '/photos/mammals/thumb/indian-giant-squirrel.webp', w: 1600, h: 1067 },
  { category: 'mammals', categoryLabel: 'Mammals', slug: 'indian-leopard', name: "Indian Leopard", src: '/photos/mammals/indian-leopard.webp', thumb: '/photos/mammals/thumb/indian-leopard.webp', w: 1600, h: 1200 },
  { category: 'mammals', categoryLabel: 'Mammals', slug: 'lion-tailed-macaque', name: "Lion-tailed Macaque", src: '/photos/mammals/lion-tailed-macaque.webp', thumb: '/photos/mammals/thumb/lion-tailed-macaque.webp', w: 1067, h: 1600, wide: '/photos/mammals/lion-tailed-macaque-wide.webp' },
  { category: 'mammals', categoryLabel: 'Mammals', slug: 'asiatic-lion', name: "Asiatic Lion", src: '/photos/mammals/asiatic-lion.webp', thumb: '/photos/mammals/thumb/asiatic-lion.webp', w: 1600, h: 1067 },
  { category: 'mammals', categoryLabel: 'Mammals', slug: 'one-horned-rhinoceros', name: "One-horned Rhinoceros", src: '/photos/mammals/one-horned-rhinoceros.webp', thumb: '/photos/mammals/thumb/one-horned-rhinoceros.webp', w: 1600, h: 1200 },
  { category: 'mammals', categoryLabel: 'Mammals', slug: 'slender-loris', name: "Slender Loris", src: '/photos/mammals/slender-loris.webp', thumb: '/photos/mammals/thumb/slender-loris.webp', w: 1600, h: 1025 },
  { category: 'mammals', categoryLabel: 'Mammals', slug: 'sloth-bear', name: "Sloth Bear", src: '/photos/mammals/sloth-bear.webp', thumb: '/photos/mammals/thumb/sloth-bear.webp', w: 720, h: 456 },
  { category: 'mammals', categoryLabel: 'Mammals', slug: 'smooth-coated-otter', name: "Smooth-coated Otter", src: '/photos/mammals/smooth-coated-otter.webp', thumb: '/photos/mammals/thumb/smooth-coated-otter.webp', w: 1600, h: 1063 },
  { category: 'mammals', categoryLabel: 'Mammals', slug: 'stripe-necked-mongoose', name: "Stripe-necked Mongoose", src: '/photos/mammals/stripe-necked-mongoose.webp', thumb: '/photos/mammals/thumb/stripe-necked-mongoose.webp', w: 1600, h: 1065 },
  { category: 'mammals', categoryLabel: 'Mammals', slug: 'bengal-tiger-on-the-move', name: "Bengal Tiger on the Move", src: '/photos/mammals/bengal-tiger-on-the-move.webp', thumb: '/photos/mammals/thumb/bengal-tiger-on-the-move.webp', w: 1600, h: 1067 },
  { category: 'mammals', categoryLabel: 'Mammals', slug: 'tiger-cub-resting', name: "Tiger Cub Resting", src: '/photos/mammals/tiger-cub-resting.webp', thumb: '/photos/mammals/thumb/tiger-cub-resting.webp', w: 1600, h: 1067 },
  { category: 'mammals', categoryLabel: 'Mammals', slug: 'tiger-cub', name: "Tiger Cub", src: '/photos/mammals/tiger-cub.webp', thumb: '/photos/mammals/thumb/tiger-cub.webp', w: 1600, h: 1067 },
  { category: 'mammals', categoryLabel: 'Mammals', slug: 'tigress-with-cubs', name: "Tigress with Cubs", src: '/photos/mammals/tigress-with-cubs.webp', thumb: '/photos/mammals/thumb/tigress-with-cubs.webp', w: 1600, h: 1067 },
  { category: 'mammals', categoryLabel: 'Mammals', slug: 'bengal-tiger', name: "Bengal Tiger", src: '/photos/mammals/bengal-tiger.webp', thumb: '/photos/mammals/thumb/bengal-tiger.webp', w: 1063, h: 1600 },
  { category: 'mammals', categoryLabel: 'Mammals', slug: 'wild-buffalo', name: "Wild Buffalo", src: '/photos/mammals/wild-buffalo.webp', thumb: '/photos/mammals/thumb/wild-buffalo.webp', w: 1600, h: 1200 },
  { category: 'moths', categoryLabel: 'Moths', slug: 'atlas-moth', name: "Atlas Moth", src: '/photos/moths/atlas-moth.webp', thumb: '/photos/moths/thumb/atlas-moth.webp', w: 1600, h: 1067 },
  { category: 'moths', categoryLabel: 'Moths', slug: 'indian-moon-moth', name: "Indian Moon Moth", src: '/photos/moths/indian-moon-moth.webp', thumb: '/photos/moths/thumb/indian-moon-moth.webp', w: 1502, h: 1127 },
  { category: 'plants-habitats', categoryLabel: 'Plants & Habitats', slug: 'avicennia-mangrove', name: "Avicennia Mangrove", src: '/photos/plants-habitats/avicennia-mangrove.webp', thumb: '/photos/plants-habitats/thumb/avicennia-mangrove.webp', w: 1600, h: 1200 },
  { category: 'plants-habitats', categoryLabel: 'Plants & Habitats', slug: 'bamboo-forest', name: "Bamboo Forest", src: '/photos/plants-habitats/bamboo-forest.webp', thumb: '/photos/plants-habitats/thumb/bamboo-forest.webp', w: 1600, h: 1200 },
  { category: 'plants-habitats', categoryLabel: 'Plants & Habitats', slug: 'dry-deciduous-forest', name: "Dry Deciduous Forest", src: '/photos/plants-habitats/dry-deciduous-forest.webp', thumb: '/photos/plants-habitats/thumb/dry-deciduous-forest.webp', w: 1600, h: 1200 },
  { category: 'plants-habitats', categoryLabel: 'Plants & Habitats', slug: 'indian-coral-tree', name: "Indian Coral Tree", src: '/photos/plants-habitats/indian-coral-tree.webp', thumb: '/photos/plants-habitats/thumb/indian-coral-tree.webp', w: 1280, h: 960 },
  { category: 'plants-habitats', categoryLabel: 'Plants & Habitats', slug: 'evergreen-forest', name: "Evergreen Forest", src: '/photos/plants-habitats/evergreen-forest.webp', thumb: '/photos/plants-habitats/thumb/evergreen-forest.webp', w: 1600, h: 1200 },
  { category: 'plants-habitats', categoryLabel: 'Plants & Habitats', slug: 'flame-of-the-forest', name: "Flame of the Forest", src: '/photos/plants-habitats/flame-of-the-forest.webp', thumb: '/photos/plants-habitats/thumb/flame-of-the-forest.webp', w: 1600, h: 1200 },
  { category: 'plants-habitats', categoryLabel: 'Plants & Habitats', slug: 'glory-lily', name: "Glory Lily", src: '/photos/plants-habitats/glory-lily.webp', thumb: '/photos/plants-habitats/thumb/glory-lily.webp', w: 1600, h: 1200 },
  { category: 'plants-habitats', categoryLabel: 'Plants & Habitats', slug: 'grassland-shola-mosaic', name: "Grassland & Shola Mosaic", src: '/photos/plants-habitats/grassland-shola-mosaic.webp', thumb: '/photos/plants-habitats/thumb/grassland-shola-mosaic.webp', w: 1280, h: 960 },
  { category: 'plants-habitats', categoryLabel: 'Plants & Habitats', slug: 'mangrove-creek', name: "Mangrove Creek", src: '/photos/plants-habitats/mangrove-creek.webp', thumb: '/photos/plants-habitats/thumb/mangrove-creek.webp', w: 1280, h: 960 },
  { category: 'plants-habitats', categoryLabel: 'Plants & Habitats', slug: 'montane-shola-forest', name: "Montane Shola Forest", src: '/photos/plants-habitats/montane-shola-forest.webp', thumb: '/photos/plants-habitats/thumb/montane-shola-forest.webp', w: 1600, h: 1200 },
  { category: 'plants-habitats', categoryLabel: 'Plants & Habitats', slug: 'palmyra-palms', name: "Palmyra Palms", src: '/photos/plants-habitats/palmyra-palms.webp', thumb: '/photos/plants-habitats/thumb/palmyra-palms.webp', w: 1600, h: 1200 },
  { category: 'plants-habitats', categoryLabel: 'Plants & Habitats', slug: 'nilgiri-rhododendron', name: "Nilgiri Rhododendron", src: '/photos/plants-habitats/nilgiri-rhododendron.webp', thumb: '/photos/plants-habitats/thumb/nilgiri-rhododendron.webp', w: 1600, h: 1071 },
  { category: 'reptiles', categoryLabel: 'Reptiles', slug: 'bronze-backed-tree-snake', name: "Bronze-backed Tree Snake", src: '/photos/reptiles/bronze-backed-tree-snake.webp', thumb: '/photos/reptiles/thumb/bronze-backed-tree-snake.webp', w: 1600, h: 1065 },
  { category: 'reptiles', categoryLabel: 'Reptiles', slug: 'indian-chameleon', name: "Indian Chameleon", src: '/photos/reptiles/indian-chameleon.webp', thumb: '/photos/reptiles/thumb/indian-chameleon.webp', w: 1067, h: 1600 },
  { category: 'reptiles', categoryLabel: 'Reptiles', slug: 'common-skink', name: "Common Skink", src: '/photos/reptiles/common-skink.webp', thumb: '/photos/reptiles/thumb/common-skink.webp', w: 1280, h: 960 },
  { category: 'reptiles', categoryLabel: 'Reptiles', slug: 'monitor-lizard', name: "Monitor Lizard", src: '/photos/reptiles/monitor-lizard.webp', thumb: '/photos/reptiles/thumb/monitor-lizard.webp', w: 1600, h: 1067 },
  { category: 'reptiles', categoryLabel: 'Reptiles', slug: 'indian-star-tortoise', name: "Indian Star Tortoise", src: '/photos/reptiles/indian-star-tortoise.webp', thumb: '/photos/reptiles/thumb/indian-star-tortoise.webp', w: 1280, h: 960 },
  /* Invertebrates — kept together and ordered by name so the gallery reads as one block. */
  { category: 'invertebrates', categoryLabel: 'Invertebrates', slug: 'giant-wood-spider', name: "Giant Wood Spider", src: '/photos/invertebrates/giant-wood-spider.webp', thumb: '/photos/invertebrates/thumb/giant-wood-spider.webp', w: 1600, h: 1200 },
  { category: 'invertebrates', categoryLabel: 'Invertebrates', slug: 'indian-red-scorpion', name: "Indian Red Scorpion", src: '/photos/invertebrates/indian-red-scorpion.webp', thumb: '/photos/invertebrates/thumb/indian-red-scorpion.webp', w: 1600, h: 1200 },
  { category: 'invertebrates', categoryLabel: 'Invertebrates', slug: 'man-faced-stink-bug', name: "Man-faced Stink Bug", src: '/photos/invertebrates/man-faced-stink-bug.webp', thumb: '/photos/invertebrates/thumb/man-faced-stink-bug.webp', w: 1600, h: 1200 },
  { category: 'invertebrates', categoryLabel: 'Invertebrates', slug: 'sea-star', name: "Sea Star", src: '/photos/invertebrates/sea-star.webp', thumb: '/photos/invertebrates/thumb/sea-star.webp', w: 1600, h: 1200 },
  { category: 'invertebrates', categoryLabel: 'Invertebrates', slug: 'shore-crab', name: "Shore Crab", src: '/photos/invertebrates/shore-crab.webp', thumb: '/photos/invertebrates/thumb/shore-crab.webp', w: 1600, h: 1071 },
  { category: 'amphibians', categoryLabel: 'Amphibians', slug: 'bronze-frog', name: "Bronze Frog", src: '/photos/amphibians/bronze-frog.webp', thumb: '/photos/amphibians/thumb/bronze-frog.webp', w: 1600, h: 1067 },
  { category: 'amphibians', categoryLabel: 'Amphibians', slug: 'golden-backed-frog', name: "Golden-backed Frog", src: '/photos/amphibians/golden-backed-frog.webp', thumb: '/photos/amphibians/thumb/golden-backed-frog.webp', w: 1600, h: 1067 },
  { category: 'birds', categoryLabel: 'Birds', slug: 'asian-openbill-stork', name: "Asian Openbill Stork", src: '/photos/birds/asian-openbill-stork.webp', thumb: '/photos/birds/thumb/asian-openbill-stork.webp', w: 1067, h: 1600 },
  { category: 'birds', categoryLabel: 'Birds', slug: 'broad-tailed-grassbird', name: "Broad-tailed Grassbird", src: '/photos/birds/broad-tailed-grassbird.webp', thumb: '/photos/birds/thumb/broad-tailed-grassbird.webp', w: 1600, h: 1067 },
  { category: 'birds', categoryLabel: 'Birds', slug: 'flame-throated-bulbul', name: "Flame-throated Bulbul", src: '/photos/birds/flame-throated-bulbul.webp', thumb: '/photos/birds/thumb/flame-throated-bulbul.webp', w: 1600, h: 1067 },
  { category: 'birds', categoryLabel: 'Birds', slug: 'great-cormorant', name: "Great Cormorant", src: '/photos/birds/great-cormorant.webp', thumb: '/photos/birds/thumb/great-cormorant.webp', w: 1600, h: 1067 },
  { category: 'birds', categoryLabel: 'Birds', slug: 'great-indian-hornbill', name: "Great Indian Hornbill", src: '/photos/birds/great-indian-hornbill.webp', thumb: '/photos/birds/thumb/great-indian-hornbill.webp', w: 1600, h: 1067 },
  { category: 'birds', categoryLabel: 'Birds', slug: 'malabar-grey-hornbill', name: "Malabar Grey Hornbill", src: '/photos/birds/malabar-grey-hornbill.webp', thumb: '/photos/birds/thumb/malabar-grey-hornbill.webp', w: 1067, h: 1600 },
  { category: 'birds', categoryLabel: 'Birds', slug: 'malabar-parakeet', name: "Malabar Parakeet", src: '/photos/birds/malabar-parakeet.webp', thumb: '/photos/birds/thumb/malabar-parakeet.webp', w: 1600, h: 1067 },
  { category: 'birds', categoryLabel: 'Birds', slug: 'malabar-trogon', name: "Malabar Trogon (Male)", src: '/photos/birds/malabar-trogon.webp', thumb: '/photos/birds/thumb/malabar-trogon.webp', w: 1600, h: 1067 },
  { category: 'birds', categoryLabel: 'Birds', slug: 'malabar-whistling-thrush', name: "Malabar Whistling Thrush", src: '/photos/birds/malabar-whistling-thrush.webp', thumb: '/photos/birds/thumb/malabar-whistling-thrush.webp', w: 1600, h: 1067 },
  { category: 'birds', categoryLabel: 'Birds', slug: 'nilgiri-flycatcher', name: "Nilgiri Flycatcher (Male)", src: '/photos/birds/nilgiri-flycatcher.webp', thumb: '/photos/birds/thumb/nilgiri-flycatcher.webp', w: 1600, h: 1067 },
  { category: 'birds', categoryLabel: 'Birds', slug: 'nilgiri-pipit', name: "Nilgiri Pipit", src: '/photos/birds/nilgiri-pipit.webp', thumb: '/photos/birds/thumb/nilgiri-pipit.webp', w: 1600, h: 1067 },
  { category: 'birds', categoryLabel: 'Birds', slug: 'nilgiri-wood-pigeon', name: "Nilgiri Wood Pigeon", src: '/photos/birds/nilgiri-wood-pigeon.webp', thumb: '/photos/birds/thumb/nilgiri-wood-pigeon.webp', w: 1600, h: 1067 },
  { category: 'birds', categoryLabel: 'Birds', slug: 'white-bellied-treepie', name: "White-bellied Treepie", src: '/photos/birds/white-bellied-treepie.webp', thumb: '/photos/birds/thumb/white-bellied-treepie.webp', w: 1067, h: 1600 },
  { category: 'birds', categoryLabel: 'Birds', slug: 'white-bellied-woodpecker', name: "White-bellied Woodpecker", src: '/photos/birds/white-bellied-woodpecker.webp', thumb: '/photos/birds/thumb/white-bellied-woodpecker.webp', w: 1600, h: 1067 },
  { category: 'birds', categoryLabel: 'Birds', slug: 'white-cheeked-barbet', name: "White-cheeked Barbet", src: '/photos/birds/white-cheeked-barbet.webp', thumb: '/photos/birds/thumb/white-cheeked-barbet.webp', w: 1600, h: 1067 },
  { category: 'birds', categoryLabel: 'Birds', slug: 'yellow-throated-bulbul', name: "Yellow-throated Bulbul", src: '/photos/birds/yellow-throated-bulbul.webp', thumb: '/photos/birds/thumb/yellow-throated-bulbul.webp', w: 1600, h: 1067 },
  { category: 'mammals', categoryLabel: 'Mammals', slug: 'asian-elephant-herd', name: "Asian Elephant Herd", src: '/photos/mammals/asian-elephant-herd.webp', thumb: '/photos/mammals/thumb/asian-elephant-herd.webp', w: 1600, h: 1067 },
  { category: 'mammals', categoryLabel: 'Mammals', slug: 'indian-wild-dog', name: "Indian Wild Dog (Dhole)", src: '/photos/mammals/indian-wild-dog.webp', thumb: '/photos/mammals/thumb/indian-wild-dog.webp', w: 1600, h: 1067 },
  { category: 'mammals', categoryLabel: 'Mammals', slug: 'jungle-cat', name: "Jungle Cat", src: '/photos/mammals/jungle-cat.webp', thumb: '/photos/mammals/thumb/jungle-cat.webp', w: 1600, h: 1067 },
  { category: 'mammals', categoryLabel: 'Mammals', slug: 'nilgiri-tahr-female', name: "Nilgiri Tahr (Female)", src: '/photos/mammals/nilgiri-tahr-female.webp', thumb: '/photos/mammals/thumb/nilgiri-tahr-female.webp', w: 1600, h: 1067 },
  { category: 'mammals', categoryLabel: 'Mammals', slug: 'nilgiri-tahr-male', name: "Nilgiri Tahr (Male)", src: '/photos/mammals/nilgiri-tahr-male.webp', thumb: '/photos/mammals/thumb/nilgiri-tahr-male.webp', w: 1600, h: 1067 },
  { category: 'mammals', categoryLabel: 'Mammals', slug: 'rhesus-macaque', name: "Rhesus Macaque", src: '/photos/mammals/rhesus-macaque.webp', thumb: '/photos/mammals/thumb/rhesus-macaque.webp', w: 1067, h: 1600 },
  { category: 'mammals', categoryLabel: 'Mammals', slug: 'ruddy-mongoose', name: "Ruddy Mongoose", src: '/photos/mammals/ruddy-mongoose.webp', thumb: '/photos/mammals/thumb/ruddy-mongoose.webp', w: 1600, h: 1067 },
  { category: 'reptiles', categoryLabel: 'Reptiles', slug: 'anaimalai-spiny-lizard', name: "Anaimalai Spiny Lizard", src: '/photos/reptiles/anaimalai-spiny-lizard.webp', thumb: '/photos/reptiles/thumb/anaimalai-spiny-lizard.webp', w: 1600, h: 1067 },
  { category: 'reptiles', categoryLabel: 'Reptiles', slug: 'forest-calotes', name: "Forest Calotes", src: '/photos/reptiles/forest-calotes.webp', thumb: '/photos/reptiles/thumb/forest-calotes.webp', w: 1600, h: 1067 },
  { category: 'reptiles', categoryLabel: 'Reptiles', slug: 'green-calotes', name: "Green Calotes", src: '/photos/reptiles/green-calotes.webp', thumb: '/photos/reptiles/thumb/green-calotes.webp', w: 1600, h: 1067 },
  { category: 'reptiles', categoryLabel: 'Reptiles', slug: 'hump-nosed-pit-viper', name: "Hump-nosed Pit Viper", src: '/photos/reptiles/hump-nosed-pit-viper.webp', thumb: '/photos/reptiles/thumb/hump-nosed-pit-viper.webp', w: 1600, h: 1067 },
  { category: 'reptiles', categoryLabel: 'Reptiles', slug: 'large-scaled-green-lizard', name: "Large-scaled Green Lizard", src: '/photos/reptiles/large-scaled-green-lizard.webp', thumb: '/photos/reptiles/thumb/large-scaled-green-lizard.webp', w: 1600, h: 1067 },
  { category: 'reptiles', categoryLabel: 'Reptiles', slug: 'large-scaled-pit-viper', name: "Large-scaled Pit Viper", src: '/photos/reptiles/large-scaled-pit-viper.webp', thumb: '/photos/reptiles/thumb/large-scaled-pit-viper.webp', w: 1600, h: 1067 },
  { category: 'reptiles', categoryLabel: 'Reptiles', slug: 'malabar-pit-viper', name: "Malabar Pit Viper", src: '/photos/reptiles/malabar-pit-viper.webp', thumb: '/photos/reptiles/thumb/malabar-pit-viper.webp', w: 1600, h: 1067 },
  { category: 'reptiles', categoryLabel: 'Reptiles', slug: 'saw-scaled-viper', name: "Saw-scaled Viper", src: '/photos/reptiles/saw-scaled-viper.webp', thumb: '/photos/reptiles/thumb/saw-scaled-viper.webp', w: 1600, h: 1067 },
];


export const photoCategories = Array.from(
  new Map(photos.map((p) => [p.category, p.categoryLabel])).entries()
).map(([id, label]) => ({ id, label, count: photos.filter((p) => p.category === id).length }));

/* Species-page tabs. Every photo category maps to exactly one tab so no photo is orphaned. */
export const speciesTabs = ['All', 'Birds', 'Mammals', 'Reptiles', 'Amphibians', 'Butterflies & Moths', 'Invertebrates', 'Flora'] as const;

const photoCategoryToTab: Record<string, string> = {
  birds: 'Birds',
  mammals: 'Mammals',
  reptiles: 'Reptiles',
  amphibians: 'Amphibians',
  butterflies: 'Butterflies & Moths',
  moths: 'Butterflies & Moths',
  invertebrates: 'Invertebrates',
  'plants-habitats': 'Flora',
};

export function tabForPhotoCategory(categoryId: string): string | undefined {
  return photoCategoryToTab[categoryId];
}

export function photosForTab(tab: string): Photo[] {
  if (tab === 'All') return photos;
  return photos.filter((p) => photoCategoryToTab[p.category] === tab);
}

/* data.ts species categories are singular labels; map them onto the same tabs. */
export function speciesMatchesTab(speciesCategory: string, tab: string): boolean {
  if (tab === 'All') return true;
  if (tab === 'Butterflies & Moths') return speciesCategory === 'Butterflies' || speciesCategory === 'Moths';
  return speciesCategory === tab;
}

export function byCategory(category: string): Photo[] {
  return photos.filter((p) => p.category === category);
}

export function findPhoto(slug: string): Photo | undefined {
  return photos.find((p) => p.slug === slug);
}

/* GitHub Pages serves the site under /nature_trip; <img> src needs the prefix explicitly. */
export const BASE_PATH = '/nature_trip';
export const img = (path: string) => `${BASE_PATH}${path}`;

/** A photo's caption name in `locale` where translated (content/<locale>/photos.json, keyed by slug). */
export const photoName = (p: Photo, locale: Locale): string => overlayEntry<Photo>(locale, 'photos', p.slug)?.name ?? p.name;

/* Thumbnails are 480 or 640 px on the long side (VERIFIED 2026-10-03 across all photos), so the
   480-px-long-side width used here is a lower bound: the browser never stretches a thumbnail. */
export function thumbWidth(p: Photo): number {
  return p.w >= p.h ? 480 : Math.round((480 * p.w) / p.h);
}

/* "What you might see" strip on each trip page: only species the trip's itinerary, highlights or
   target list name. A trip with fewer than four matching photos shows no strip. */
export const tripSpeciesPhotoSlugs: Record<string, string[]> = {
  'western-ghats-endemics': [
    'lion-tailed-macaque', 'nilgiri-tahr', 'malabar-trogon', 'nilgiri-flycatcher', 'nilgiri-pipit', 'nilgiri-wood-pigeon',
    'great-indian-hornbill', 'indian-giant-squirrel', 'indian-star-tortoise', 'indian-gaur', 'asian-elephant-herd',
  ],
  'monsoon-rainforest-nights': [
    'golden-backed-frog', 'bronze-frog', 'malabar-pit-viper', 'large-scaled-pit-viper', 'hump-nosed-pit-viper',
    'bronze-backed-tree-snake', 'forest-calotes', 'southern-birdwing',
  ],
  'central-india-big-cats': [
    'bengal-tiger', 'tigress-with-cubs', 'indian-leopard', 'indian-wild-dog', 'chital-herd', 'mottled-wood-owl', 'indian-rock-eagle-owl',
  ],
};

/* Representative photo for each trip card / trip page hero. */
export const tripPhotoSlugs: Record<string, string> = {
  'central-india-big-cats': 'tigress-with-cubs',
  'monsoon-rainforest-nights': 'golden-backed-frog',
  'himalaya-birds-mountain-wildlife': 'himalayan-whistling-thrush',
  'western-ghats-endemics': 'lion-tailed-macaque',
};
