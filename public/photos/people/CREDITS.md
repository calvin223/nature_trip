# People photos: credits and selection record

All 12 images come from **Wikimedia Commons**. The licence, author and source URL of each were
read from the Commons API (`extmetadata`) on **2026-10-03**; none carries a Commons `Restrictions`
flag such as personality rights. Licences are CC BY or CC BY-SA, all of which allow commercial use.

**Attribution is mandatory.** Every page that shows one of these images must display the author, a
link to the source page and the licence with its link (the `credit` block in `lib/peoplePhotos.ts`).
For the CC BY-SA files, the website copies (resized, converted to WebP, metadata stripped, and
cropped in one case) stay under the same CC BY-SA licence, and the changes must be stated: "resized
and converted to WebP", plus "cropped" for `trekkers-netravati-ridge-trail`.

Selection tests applied to every image:
- **No identifiable face.** People are seen from behind, distant, or have their faces covered by
  binoculars or cameras. Checked at the final 1600 px size.
- **Not controversial.** No handling, feeding, baiting, crowding or chasing of animals, no
  off-track vehicles, no flash, litter, drones, weapons, alcohol or smoking, and no prominent logos
  or religious sites. Children were excluded.

| # | Slug | Scene | Author | Source page | Licence | Why it passes |
|---|---|---|---|---|---|---|
| 1 | `hiker-forest-trail-agasthyarkoodam` | forest-walk | Athulvis | [File:Agasthyarkoodam_Trekking_25.jpg](https://commons.wikimedia.org/wiki/File:Agasthyarkoodam_Trekking_25.jpg) | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) | One hiker walking away from the camera, face never shown. Forest trail in Peppara WLS / Agasthyamala, Kerala Western Ghats. Nothing else in frame. Source was Display P3, converted to sRGB. |
| 2 | `guided-forest-trek-periyar` | group-guide | Kir360 | [File:Thekkady_Forest_Trek.JPG](https://commons.wikimedia.org/wiki/File:Thekkady_Forest_Trek.JPG) | [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/) | Small group walking away down a forest path, distant and seen from behind. The source describes Thekkady's guided treks ("a team of five, along with a native guide") in Periyar, Kerala. |
| 3 | `birding-group-spotting-scope` | group-guide | Mike Prince (Commons artist field: "Mike Prince from Bangalore, India"; Flickr import, licence verified by FlickreviewR 2) | [File:Birding_at_Madhure_Kere_(50890314532).jpg](https://commons.wikimedia.org/wiki/File:Birding_at_Madhure_Kere_(50890314532).jpg) | [CC BY 2.0](https://creativecommons.org/licenses/by/2.0/) | Three birders and a scope on a tripod in open grassland, mid-distance; two face away, one is crouched behind a camera. No wildlife disturbed. |
| 4 | `birdwatchers-western-ghats-road` | birdwatching | PJeganathan | [File:Birdwatchers_in_Southern_Western_Ghats_JEG0936.jpg](https://commons.wikimedia.org/wiki/File:Birdwatchers_in_Southern_Western_Ghats_JEG0936.jpg) | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) | Two birdwatchers on a forest road, faces fully covered by binoculars and hands. Southern Western Ghats; contributed via NCF. |
| 5 | `birders-binoculars-forest` | birdwatching | Mike Prince (Commons artist field: "Mike Prince from Bangalore, India"; Flickr import, licence verified by FlickreviewR 2) | [File:Birding_(49443372038).jpg](https://commons.wikimedia.org/wiki/File:Birding_(49443372038).jpg) | [CC BY 2.0](https://creativecommons.org/licenses/by/2.0/) | Three birders at a forest edge, faces behind binoculars, small in the frame. The page gives no location beyond "Birdwatching in India", so the alt text names none. |
| 6 | `safari-gypsy-sambar-corbett` | jeep-safari | A. J. T. Johnsingh, WWF-India and NCF | [File:Sambar_and_gypsy,_Dhikala,_4th_June_2017,_AJT_Johnsingh._P1120795.JPG](https://commons.wikimedia.org/wiki/File:Sambar_and_gypsy,_Dhikala,_4th_June_2017,_AJT_Johnsingh._P1120795.JPG) | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) | One open Gypsy on the forest road, well back from a sambar crossing. Guests are too distant to identify. Calm scene with no crowding. |
| 7 | ~~`safari-jeep-tiger-kanha`~~ **REMOVED 2026-10-03** (tiger close to a vehicle; owner brief asks for nothing controversial; files deleted) | jeep-safari | Ashishmahaur | [File:Jungle_safari_-_Kanha_National_Park.jpg](https://commons.wikimedia.org/wiki/File:Jungle_safari_-_Kanha_National_Park.jpg) | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) | A single vehicle on the designated track. The source states "the jeep reverses as the tiger move forward", so the vehicle is giving way. Guests' faces are about 10 px tall at 1600 px and covered by cameras. **Editorial note:** it shows a tiger close to a vehicle; drop it if the owner wants zero ambiguity. |
| 8 | `photographers-maguri-beel` | photography | JyotiPN | [File:Loren_Sonowal_and_Nilotpal_Baruah_at_Maguri_Beel.jpg](https://commons.wikimedia.org/wiki/File:Loren_Sonowal_and_Nilotpal_Baruah_at_Maguri_Beel.jpg) | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) | Two photographers, one with a telephoto lens, both seen entirely from behind. The file title names them, so the site's alt text does not. Maguri Beel, Assam (Wiki Loves Birds, Assam chapter). |
| 9 | `photographer-kole-wetland-egrets` | photography | Manojk | [File:Bird_Walk_at_Pullazhi_Kole_Wetlands,_2024_Nov_13.jpg](https://commons.wikimedia.org/wiki/File:Bird_Walk_at_Pullazhi_Kole_Wetlands,_2024_Nov_13.jpg) | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) | One photographer seen from behind, standing still on the bank across the channel from the birds (painted storks, black-headed ibis and egrets, per Commons categories). Kole Birders Collective bird walk. |
| 10 | `trekker-kudremukh-ridge` | viewpoint | Ramesh Desai | [File:Kudremukh_Peak.jpg](https://commons.wikimedia.org/wiki/File:Kudremukh_Peak.jpg) | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) | One trekker on the trail, face turned away towards the valley in profile, head about 30 px tall at 1600 px. Low identifiability, but the least concealed face in the set. Kudremukh NP, Western Ghats. |
| 11 | `trekkers-netravati-ridge-trail` | viewpoint | iMahesh | [File:Trekking_trail_from_Netravati_peak.jpg](https://commons.wikimedia.org/wiki/File:Trekking_trail_from_Netravati_peak.jpg) | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) | **Cropped** to columns 40–100 % and rows 5–65 % of the source (3:2 kept) to remove foreground walkers whose faces were visible. The remaining trekkers are distant (faces about 10 px at 1600 px). Netravati Peak, Kudremukh NP. |
| 12 | `hiker-munnar-valley-view` | viewpoint | Varkeyparakkal | [File:Trekking_Across_Munnar.jpg](https://commons.wikimedia.org/wiki/File:Trekking_Across_Munnar.jpg) | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) | One backpacker seen entirely from behind above a forested valley. Near Kolukkumalai, Chinnakanal (Munnar), Kerala. |

## Scenes not filled

- **Night walk (optional): none used.** The only licensed candidates found were Maui headlamp
  shots (CC BY 3.0 US), which show two points of light in darkness and nothing usable, and US
  desert night hikes, which are a clearly non-Indian landmark.

## Owner's own photos checked (2026-10-03)

`Website Photos/z wildlife photos/` and `Wildora/photos/` (plus its `western ghats/` sub-folder)
hold wildlife, plant and habitat photos only; no file name indicates people. The only people
photos the owner holds are the four expert portraits (`Wildora/experts/*.jpeg`, already on the site
under `public/photos/experts/`). They are identifiable portraits, not action shots, so none were
used here.

## Notable rejections

Crowds of safari vehicles around a tiger (several Commons files), a tourism-board canter with
logos and visible faces, a jeep photo carrying a phone-brand watermark, bird-walk selfies, the
SEEK 2018 Madayipara nature-camp set (faces visible, probable minors), "Bird Photographers at
Sattal" (personality-rights flag, faces visible), and a tour-operator upload of Corbett. Unsplash
was unreachable (bot challenge on its search endpoint), so no Unsplash or Pexels images were
assessed.
