# Policy review: decisions for the Wildora owners

*Prepared 2026-10-03, alongside the data-layer update to `lib/data.ts`, `lib/site.ts` and `lib/schedule.ts`.*

The website now answers questions that nobody at Wildora has formally decided. Where that happened, a
**conservative, honest default** was written, and the answer carries `policy: true` in `lib/data.ts`.
Nothing below is a confirmed policy until an owner signs it off.

**How to use this:** for each item, tick *Confirm*, or write the change. Edit the matching text in
`lib/data.ts` (search for the question), or send the change to whoever maintains the site.

---

## A. FAQ answers marked `policy: true` (12)

| # | Question (as on the site) | Proposed default | Confirm / change |
|---|---|---|---|
| 1 | I have a six-month-old baby. Can we join, and what is the minimum age? | Fixed departures **not suitable for babies or toddlers** (long drives, pre-dawn starts, open vehicles, remote areas far from children's hospital care). **Minimum age 8** on fixed departures; **12 for night walks**, so the Monsoon Rainforest Nights trip is **12+**. Under-18s travel with a parent or guardian. Families with babies are offered a private, gentle itinerary. | ☐ Confirm ☐ Change: |
| 2 | I am 75 and walk slowly. Can I join? | Age alone is not a barrier. Central India (Easy) is the recommended fit; on Moderate trips the guide sets a group pace and guests may sit out any walk; a private departure suits anyone who wants their own pace. Guests declare mobility and medical conditions; they are told to check that their insurance covers their age. | ☐ Confirm ☐ Change: |
| 3 | We are a family … without much risk. Is there a suitable trip? | Recommends **Central India Big Cats** as the most family-friendly trip, plus private family itineraries or day walks for younger children. Repeats minimum age 8. | ☐ Confirm ☐ Change: |
| 4 | Do you welcome international visitors? | States that trips are **guided in English**. Names Kochi (COK) for the Endemics start, and Mysuru / Bengaluru (BLR) after the Bandipur finish. Says the guest is responsible for their visa. | ☐ Confirm English guiding ☐ Change: |
| 5 | I am vegan. Will I get food I can eat? | Yes, with notice at booking. We brief every kitchen; we cannot promise a separate vegan kitchen; **"we will plan so that you have a proper meal at every stop"**. | ☐ Confirm ☐ Change: |
| 6 | I cannot eat spicy food … | Yes. We ask each kitchen for mild versions; plain rice, chapati, dal, vegetables, curd, eggs and toast are widely available. | ☐ Confirm ☐ Change: |
| 7 | Do you have tours suitable for disabled travellers? | **No trips designed for wheelchair users**, and this is said plainly. Lists the lower-mobility parts (jeep safaris once aboard, viewing from the vehicle, lodge-garden birding, interpretation centres at Thattekad, Eravikulam and Bandipur), states that these have **not been assessed for step-free access**, and invites guests to discuss a private itinerary. | ☐ Confirm ☐ Change: |
| 8 | Do I need travel insurance? | **Essential** (owner-stated). *Added detail to confirm:* cover must include **emergency evacuation** from remote areas, and guests should check it covers their activities, age and pre-existing conditions. | ☐ Confirm details ☐ Change: |
| 9 | I have allergies. What should I tell you? | Declare at booking (food, stings, medicines). *Added detail to confirm:* **we pass food allergies on to every kitchen on the route**; auto-injector carriers bring a spare and show the guide. | ☐ Confirm ☐ Change: |
| 10 | I have a medical condition. Do I need to tell you? | Declare before booking (owner-stated). *Added detail to confirm:* guests complete **a short health form**. **A form needs to exist, and someone must decide who reads it and how it is stored.** | ☐ Confirm; form owner: ☐ Change: |
| 11 | Do you supply toilet paper, soap, toothpaste …? | Lodges normally supply soap and toilet paper in rooms; guests bring their own toothbrush, toothpaste and toiletries plus a small kit for the road (tissues, sanitiser, wipes). *Added detail to confirm:* **our guides carry a basic first-aid kit**. | ☐ Confirm ☐ Change: |
| 12 | Are the listed dates fixed? How far ahead should I book? | Listed dates are **planned departures, confirmed on enquiry**. They are shown at least **6 weeks** ahead (`SITE.bookingLeadDays = 42`). Private departures are offered if no date suits. | ☐ Confirm 6 weeks ☐ Change: |

The same commitments also appear in the `healthAndSafety` list (insurance with evacuation cover,
allergy hand-off to kitchens, health form, first-aid kit). Changing an answer above means changing
the matching item there too.

---

## B. Departure schedule: rules and season changes

Departure dates are no longer typed in by hand; `lib/schedule.ts` works them out at build time.
Each date is at least `bookingLeadDays` after the build date (or after `SITE.launchDate`, if that is set
and still in the future). **Rebuild the site at least monthly**, or the listed dates go stale. To
reproduce a build exactly, run `BUILD_DATE=YYYY-MM-DD npm run build`.

| Trip | Season now | Was | Departure rule | First 3 dates (build 2026-10-03) | Confirm / change |
|---|---|---|---|---|---|
| Central India Big Cats (7 d) | **Oct–May** | Oct–Jun | First **Sunday** | Sun 6 Dec 2026, Sun 3 Jan 2027, Sun 7 Feb 2027 | ☐ |
| Monsoon Rainforest Nights (5 d) | Jun–Sep | Jun–Sep | Second **Saturday** | Sat 12 Jun 2027, Sat 10 Jul 2027, Sat 14 Aug 2027 | ☐ |
| Himalaya Birds (6 d) | Mar–May, Oct–Nov | same | Second **Saturday** | Sat 14 Nov 2026, Sat 13 Mar 2027, Sat 10 Apr 2027 | ☐ |
| Western Ghats Endemics (10 d) | **Oct–Jan** | Oct–Mar | Third **Saturday** | Sat 21 Nov 2026, Sat 19 Dec 2026, Sat 16 Jan 2027 | ☐ |

Why the seasons changed (sources are cited in `lib/data.ts`):

- **Endemics drops February and March.** Eravikulam National Park (Day 4) closes every year for the
  Nilgiri tahr calving season: 1 February–31 March in 2026, and February–March in 2025 (reopened
  1 April). VERIFIED 2026-10-03 (Onmanorama, Outlook Traveller). *Alternative:* keep Feb–Mar
  departures with Day 4 swapped for another shola site. Tell us if you prefer that.
- **Central India drops June.** Tiger-reserve core zones close 1 July–30 September. Pench (MP) is
  open only from 1 October to 15 June, the monsoon arrives in the second week of June, and mean
  daily maxima are 42 °C in May. VERIFIED 2026-10-03 (Pench Tiger Reserve FAQ, MP Forest Dept).
- **Why first Sunday for Central India:** Day 4, the lighter "Slow Wildlife Day", then falls on a
  Wednesday, when Madhya Pradesh reserves close for afternoon safaris (Pench FAQ). This assumes the
  trip uses MP reserves; **which reserves does it use?**
- **Why third Saturday for Endemics:** it always falls on the 15th or later, after the south-west
  monsoon's normal withdrawal date (about 15 October), and a January departure finishes by the 30th,
  before the Eravikulam closure.
- **Himalaya season** is taken from the existing copy (ASSUMED). The itinerary names no location, so
  it could not be checked against any park calendar.

---

## C. Facts the site still lacks (please supply; nothing has been invented)

| Item | Current state | Needed |
|---|---|---|
| Public email | `SITE.email = null`. The old `info@wildoraexpeditions.com` was a placeholder for a domain nobody owns, and has been removed from the data layer. | A working inbox, or confirmation that the site is WhatsApp-only. |
| Facebook / Instagram | `null`, so no link is shown. | Real page URLs. |
| Launch date | `SITE.launchDate = null`, so dates are computed from the build date. | The go-live date, if departures should not appear before it. |
| Phone `+91 98765 43210` | Still in `app/contact/page.tsx`, `components/Footer.tsx` and `README.md`. It looks like a placeholder; those files are owned by other contributors. | A real number, or removal. |
| Start/end points | Only the Endemics trip names places (Thattekad → Bandipur). The other three say "Confirmed at booking". | The reserve/town and nearest gateway for Central India, Monsoon and Himalaya. |
| Monsoon trip location | Region is "Indian rainforests". | Is it in the Western Ghats? Which area? |
| Airport transfers | Not stated anywhere. Guests are told that travel to the start point is their responsibility. | Do you offer a Kochi airport pickup (paid or included)? |
| Dr. A. Relton's bio | Says "Through **Nature Expeditions** he leads eco-tours …". | Is that a former brand name? Should it read "Wildora Expeditions" or stay as history? |
| Species list | Includes the Asiatic lion, which no trip visits (it lives only in Gujarat). | Keep as general interest, or replace it with a Western Ghats species. |

---

## D. Removed or softened (no action needed, listed for transparency)

- **Six customer reviews deleted** (`reviews` array and `Review` type). No trip has yet run under
  this brand, so every one of them was invented. Add reviews back only from real guests, with their
  permission.
- **"Next departure" and "Only N spots left" removed** from every trip. The dates were typed in by
  hand and went stale; the spot counts were invented scarcity.
- **Trust signals:** "Guided tours across India" and "Forests, deserts, wetlands, mountains, coasts"
  replaced (no desert, wetland or coastal trips exist). Added "Honest expectations: no guaranteed
  sightings" and "Led by PhD-level naturalists".
- **FAQs:** the India-wide answer (deserts, mangroves, coasts) was rewritten around the Western Ghats
  and the four real trips. Removed the claim that "many guests travel from the UK, Europe, North
  America, Australia", because no guests have travelled yet. Removed "support for local communities"
  from the accommodation answer because it is unverified. Removed email from the booking answer.
- **Himalaya trip:** "Custom extensions possible for snow leopard country, red panda habitat" became
  "Longer or higher-altitude extensions can be discussed on request". No such extension has been
  confirmed.
- **Services:** removed red pandas, snow leopards, desert and coastal experiences.
- Wording: "Target"/"Track" in some itinerary lines became "Look for"; "Recognize" became
  "Recognise"; "Long pants" became "Long trousers".

## Added 2026-10-03 from the official-rules research (`Deep research/06_Local_Competitor_Insights_2026-10.md`)

- [ ] **Night walks are now described as running only on private estate / homestay land outside protected areas.** The Supreme Court banned night tourism in tiger reserves on 17 Nov 2025 (VERIFIED 2026-10-03 via the research file), which covers Anamalai/Top Slip, Mudumalai, Bandipur and Periyar. Confirm where the Monsoon Rainforest Nights walks actually run.
- [ ] **Central India trip:** the "evening sessions for owls, nightjars, civets" highlight now says lodge grounds outside the reserve. Confirm.
- [ ] **Minimum age 8** (policy) now notes that some forest-department treks set higher limits (Tamil Nadu treks generally exclude under-10s; Periyar department walks are 12+). No official minimum exists for safaris at Bandipur, Mudumalai, Top Slip or for Eravikulam, so the site states none.
- [ ] **Park closures:** a substitution clause was added to the "Are the listed dates fixed?" answer. Confirm it matches your booking terms.
- [ ] **Chinnar day mentions Indian Giant Flying Squirrel** (nocturnal). If viewing it needs an evening outing inside the sanctuary, check it is permitted, or reword.
