# Questions for the client (running list)

*Started 2026-10-14. Add to this list as we go; tick items off when answered. "Where" says which file the answer goes in.*

## Needed for the contact form and legal pages (work done 2026-10-14)

| # | Question | Where it goes | Answer |
|---|---|---|---|
| 1 | What public **email address** should enquiries go to? (A real mailbox on your own domain, not a personal one.) | `SITE.email` in `lib/site.ts` | ☐ |
| 2 | Which **form service** will receive web-form enquiries (e.g. Formspree, Basin)? We need its endpoint URL, and the service's name and country for the privacy notice. | `SITE.formEndpoint`; Privacy page | ☐ |
| 3 | **Legal name** of the business, **registered address**, **registration number**, **VAT/GST number** (or "none"). | `SITE.legal` | ☐ |
| 4 | **Indian tourism registration / approval number** (Ministry of Tourism or state). Is the business approved? | `SITE.legal.tourismRegistration` | ☐ |
| 5 | What **protects customers' prepayments** if the business fails (insurer, bank guarantee, fund)? Which countries will you sell to first? This decides what European law requires. | `SITE.legal.insolvencyProtection`; Booking conditions §6, Package travel page | ☐ |
| 6 | **Deposit** amount, **balance due date**, accepted **payment methods** and **currency**. | Booking conditions §5 | ☐ |
| 7 | **Cancellation charges** by days before departure; **minimum group size** for a departure to run; what happens if a departure is cancelled. | Booking conditions §8, §9 | ☐ |
| 8 | **Complaints contact**, and which country's law and courts apply. | Booking conditions §14, §17 | ☐ |
| 9 | Who handles **privacy requests**, and how long are enquiries and booking records kept? Which mail and hosting providers are used? Are guest details stored in India only? | Privacy page | ☐ |
| 10 | Who reads the **health form** and how is it stored? (Already open in POLICY_REVIEW.md item 10.) | Privacy page; FAQ | ☐ |
| 11 | Will a lawyer review the legal pages (legal notice, booking conditions, package travel information, privacy, cookies, accessibility)? (The draft banner stays until `SITE.legal.reviewed = true`.) | `SITE.legal.reviewed` | ☐ |

## From the Europe audit (not started)

| # | Question | Answer |
|---|---|---|
| 12 | **Prices.** "From" price per person for each trip, currency (EUR and/or GBP), and single-room supplement. | ☐ |
| 13 | **Domain name** to buy (and who owns the account). The site is still on `vivian4fb.github.io`. | ☐ |
| 14 | **Start and end places** (and nearest airport) for Central India, Monsoon Rainforest and Himalaya trips. | ☐ |
| 15 | **Lodge names** per trip, and whether arrival and departure **airport transfers** are included. | ☐ |
| 16 | Real **reviews or testimonials** from past tours the naturalists led, with permission to publish. Links to the naturalists' papers and books. | ☐ |
| 17 | **Facebook / Instagram** URLs. | ☐ |
| 18 | Is a **European phone or WhatsApp number** available, in addition to the Indian one? Will anyone reply in CET hours? | ☐ |
| 19 | Sustainability facts: percentage to conservation, local ownership, community spend, carbon figure per trip. | ☐ |
| 20 | Day 10 of the Endemics trip: add a night in Bandipur or Mysuru before the airport transfer? | ☐ |
| 21 | Is German (or Dutch/French) content wanted, and is anyone able to answer in those languages? | ☑ 2026-10-14: French, German, Spanish, Portuguese (Portugal) and Polish, translated once the English copy is final. Still open: who translates and checks, and can anyone answer enquiries in those languages? |

## From the design review (2026-10-14)

| # | Question | Answer |
|---|---|---|
| 22 | **Full-resolution originals** for the endemic species and landscapes the redesign leads with: Malabar trogon, Malabar parakeet, Nilgiri tahr, Nilgiri flycatcher, Malabar & large-scaled pit vipers, golden-backed frog, shola grassland (Munnar), montane shola forest, hiker above the Munnar valley. The site only has ~1000–1600 px copies; the "Website Photos" folder has none of these. A full-screen hero needs ≥2400 px. | ☐ |
| 23 | **Who took each photo?** Top sites credit the photographer on every image. If the naturalists took them, crediting them doubles as proof of expertise. | ☐ |
| 24 | Any **video** from the field (even 10–20 s of forest, a hornbill, rain), for an optional muted hero loop? | ☐ |
| 25 | Photos from **past tours the naturalists have led** (guests in the field, with permission) for a trip-report gallery? | ☐ |

## From the second design pass (2026-10-14)

| # | Question | Answer |
|---|---|---|
| 26 | **Guest reviews.** The home page now has a "What our guests say" section, but it stays hidden on the live site until real reviews exist (fake or edited reviews are banned under EU and UK consumer law). Can you send reviews from guests of tours the naturalists have already led (for example Dr. Relton's Nature Expeditions trips), each with the guest's written permission, name or initials, country, trip and month? Add them to `reviews` in `lib/data.ts`. See also item 16. | ☐ |
| 27 | **"500+ species recorded"** (home page). Recorded by whom and where: the naturalists' combined field lists, or on Wildora routes? We need a source we could show if asked. "25+ years in the field" rests on Dr. Relton's 30+ years. | ☐ |
| 28 | **Species notes review.** Every photo in the gallery now opens with a short description, IUCN status, size and range, researched from Wikipedia, the IUCN Red List, BirdLife and the Reptile Database. Please ask a naturalist to check `SPECIES_FACTS_REVIEW.md`, starting with the low and medium entries. | ☐ |
| 29 | **Photo names to confirm** (the research flagged them): "Green Frog" (*Euphlyctis* sp.?), "Common Skink" (*Eutropis carinata*?), "Monitor Lizard" (Bengal monitor?), "Shore Crab" (looks like a ghost crab, *Ocypode*), "Himalayan Whistling-Thrush" (blue whistling thrush?), "Black-faced Langur" (grey langur, which species?), "Giant Wood Spider" (*Nephila pilipes*?), "Sea Star" (taken in India?), "Painted Frog" (*Uperodon* sp.). | ☐ |
| 30 | **Photos of places and scenery.** Every trip page's itinerary now uses openly licensed Wikimedia Commons photos (20 in all, credited on each photo and on the Credits page). For Central India, Monsoon and Himalaya they are examples from typical places (Kanha, Bandhavgarh, Jog Falls, Wayanad, Kausani, Binsar, Singalila…), captioned "Photographed at …". Your own photos of the actual places would be better and would remove the third-party credits. | ☐ |
| 31 | **Naturalist bios.** On the Naturalists page each bio repeats its own Specialism and Experience boxes (e.g. "30+ years" and "over three decades"; Au Sable Institute twice for Carlton). May we shorten the bios so each fact appears once? (Not changed yet, since the bios came from the naturalists.) | ☐ |
| 32 | **Courtesy request.** Timothy A. Gonsalves, whose two photos show Valparai and the Ketti Valley near Ooty, asks commercial users to let him know. The licence (CC BY-SA 4.0) already allows the use; a short email to him would be polite. | ☐ |

## From the legal pages and languages work (2026-10-14, evening)

The six legal pages are drafts: every gap shows as "[To be confirmed: …]" on the page. Items 3–11 above
still apply; these are the extra facts the drafts need. Where: the file under `content/legal/en/`.

| # | Question | Where it goes | Answer |
|---|---|---|---|
| 33 | **Legal form** (e.g. private limited company, partnership, sole proprietor), the **people who can act for the business**, the **person responsible for the website's content** (German law asks for a name and address), and a **phone number for calls** (or confirm WhatsApp is the phone contact). | `notice.tsx` | ☐ |
| 34 | **Where Wildora's services start and end** (the airport-to-airport scope): the exact wording, which arrival and departure airport for each trip, and whether those transfers are included. Several FAQ answers and "What you arrange" still say guests travel to the start point; they change with this answer. Confirm that **flights are not part of the package**. | `terms.tsx` §4; `lib/data.ts` | ☐ |
| 35 | **Prices after booking:** can a price change after booking (only for fuel, third-party taxes or exchange rates, by law), and how is it calculated? **Single supplement**; **fees for changes**; what happens if the **balance isn't paid** on time; is the **full price due** for late bookings? | `terms.tsx` §4, §5, §7 | ☐ |
| 36 | A **24-hour emergency contact** during trips; which **insurance details** you need from travellers and by when; the **time limit for complaints**. | `terms.tsx` §10, §14, §18 | ☐ |
| 37 | **Liability limit** (EU law allows no less than three times the trip price), **governing law** and **courts**. | `terms.tsx` §13, §17 | ☐ |
| 38 | **Legal advice on organiser status:** does EU (or UK) package travel law apply to your bookings, which country's law, and which **competent authority** and **insolvency protection provider** (with contact details) go on the package travel page? | `packageTravel.tsx` | ☐ |
| 39 | **Minimum age** on fixed departures and for night walks. The FAQ proposes 8 and 12 (`POLICY_REVIEW.md` item 1); the booking conditions wait for your confirmation. | `terms.tsx` §11; FAQ | ☐ |
| 40 | **Privacy extras:** an **EU representative** and a **UK representative** under GDPR Art. 27 (or confirm none is needed); which **identity or passport details** lodges or park permits require; **how soon after a trip** booking data is deleted; which **legal obligations** (including Indian law) require you to keep records. | `privacy.tsx` | ☐ |
| 41 | **Accessibility statement:** contact for accessibility problems, the **response time**, the statement's **date**, and whether the European Accessibility Act applies to you (small businesses are often exempt). | `accessibility.tsx` | ☐ |
| 42 | **New host and domain:** where will the site move from GitHub Pages? A host that runs code lets English drop the `/en/` from its addresses. (See also item 13.) | `i18n/routing.ts` | ☐ |

## From the competitor gap analysis (2026-10-14, end of session)

Each answer unlocks an item in `COMPETITOR_GAPS.md`. Group sizes stay as they are (decided 2026-10-14).

| # | Question | Gap | Answer |
|---|---|---|---|
| 43 | **Google Search Console and Bing Webmaster Tools:** sign in with the business's Google/Microsoft account, add the site with the "HTML tag" method and send us the two codes (they go in `SITE.searchVerification` in `lib/site.ts`); then submit `…/nature_trip/sitemap.xml`. Today Google finds no Wildora page. | 11 | ☐ |
| 44 | **Minimum number of guests** for a departure to run, and **how far ahead** you confirm or cancel (e.g. 60 days, before guests buy flights). We'll then show each date as "Open: runs with N" and mark "Guaranteed", "Few places" or "Full" only when true. | 7 | ☐ |
| 45 | **Who leads which trip** (or "one of X or Y"), and what happens if a leader can't come. We'll show "Led by Dr …" on each trip and date. | 10 | ☐ |
| 46 | **Office hours** (IST, and whether anyone answers in European hours), a **reply-time promise** you can keep (e.g. within 24 hours), whether the +91 number takes **voice calls**, and the **name** of the person who answers. | 4 | ☐ |
| 47 | **Approve copy with search phrases:** each trip's intro mentioning "birding tour", "herping", "tiger safari" naturally, and 3–5 FAQs per trip worded as people search ("How much does a Western Ghats birding tour cost?"). We'll draft; you approve. | 12 | ☐ |
| 48 | **Place pages and month notes:** can the naturalists check or supply ~200 words each on Thattekad, Munnar & Eravikulam, and Valparai & Anamalai, and one line per month on what wildlife to expect? | 27 | ☐ |
| 49 | **Photographer and herper brief:** night-walk rules (torch and flash policy, group size on walks), time allowed at sightings, hides, lens advice. Only facts the naturalists confirm. | 22 | ☐ |
| 50 | **Drive times, walking distances and altitudes** per itinerary day (rough figures are fine). | 17 | ☐ |

