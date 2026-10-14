# Wildora Expeditions: Europe market audit

*Prepared 2026-10-14. Scope: the website as a European traveller experiences it, how it compares with
European wildlife-tour operators selling India, and where Wildora's edge lies.*

**Method.** Three independent inputs:

1. **Expert UX audit.** I read the site's code and content (`app/`, `lib/data.ts`, `lib/site.ts`) and rendered the built
   site in Edge at 1440 px and 390 px.
2. **Synthetic-traveller panel (MiroFish).** The MiroFish swarm-simulation engine ran 16 AI personas of European
   prospective travellers. They discussed the site on a simulated forum, then each one was interviewed. See §3.
3. **Competitor desk research.** I compared Wildora with European operators that sell India wildlife trips. See §4.

> **Status, later on 2026-10-14 (after the redesign).** Findings in §2.2, by number:
> - **Done:** 13 (one floating button now; nothing covers text on phones) and 14 (the opening animation is gone).
> - **Drafted, waiting on the owners:** 2 (Company details, Booking terms and Privacy pages exist with
>   "To be confirmed" placeholders), 3 (a web enquiry form exists; email and a form service are still needed)
>   and 8 (booking mechanics are placeholders in the terms).
> - **Partly done:** 5 (a reviews section is built but hidden until real reviews exist), 15 (responsive
>   images and blur placeholders; the maps are still inline SVG) and 16 (the home page now leads with the
>   two Western Ghats trips).
> - **Open:** 1 (prices), 4 (domain), 6, 7, 10 and 17 (places, transfers, lodges, day 10), 9 (travel
>   health), 11 (languages) and 12 (sustainability evidence). Questions for each are in `CLIENT_QUESTIONS.md`.

---

## 1. Verdict in one paragraph

**Wildora has the best product in an underserved niche, and a storefront Europeans won't trust yet.**

- **The product is strong.** It offers scientist-guides plus the deepest Western Ghats itinerary on sale. No German,
  Dutch, French, Spanish or Italian operator sells a naturalist-led Western Ghats wildlife trip. UK specialists run one
  a year or less, charge £3,900–6,000, and their departures sell out.
- **The storefront is the problem.** The site is honest and well made, but it shows no price and no legal entity, it
  offers no booking protection, it runs only through WhatsApp to an Indian mobile number, and it is hosted on a
  personal GitHub address.
- **The panel confirms it.** The 16-persona MiroFish panel scored trust to pay a deposit at **1.6/10**. Yet **16 of 16**
  personas named Wildora's guides and its Western Ghats niche as better than European operators.
- **The fixes are cheap.** Every blocker is a business or legal fix (domain, prices, entity, terms, insolvency cover,
  email). None needs a redesign. Do the legal part before taking any deposit.

---

## 2. UX audit: the European traveller's journey

Severity: **P0** loses the booking or creates legal exposure · **P1** costs a lot of conversions · **P2** polish.

### 2.1 What already works (keep it)

- **The content is honest and specific.** Every trip has a day-by-day itinerary, a difficulty grade, an "Is this
  trip right for you?" section and a "who it may not suit" list. Season windows are explained with park closures
  (Eravikulam calving closure, tiger-reserve monsoon closure). Few European brochures are this candid.
- **The FAQ is excellent for a European audience.** It covers vegan and non-spicy food, age 75, babies, disability
  (an honest "not yet"), plugs (it names the Europlug), mobile signal and toilet paper, and it links to the official
  e-Visa site with a warning about scam lookalikes.
- **Scientist-guides are front and centre.** Four doctorate-level naturalists, with photos, bios and real
  institutional affiliations. Only the premium end of the European market (Naturetrek's expert leaders, Steppes'
  specialists) matches this.
- **Real departure dates** are generated from season rules and kept at least six weeks out. Trips also have
  printable itineraries and interactive route maps.
- **The design is visually strong.** At a true 390 px viewport the mobile layout is clean, with no overflow. The
  forms are accessible: labelled fields, focus moved to the first error, a live region for status, and a skip link.
- **Nothing is invented.** There are no fake reviews and no fake scarcity. Keep it that way: it is a long-term
  asset under EU unfair-commercial-practices rules.

### 2.2 Findings

| # | Sev | Finding | Why it matters to a European buyer | Fix |
|---|---|---|---|---|
| 1 | P0 | **No price anywhere.** All four trips say "Price on request", and no currency appears on the site. | Every European competitor shows a "from" price, usually in GBP or EUR per person. Buyers shortlist by price before they contact anyone. "On request" reads as "expensive", or as "they'll quote by who I am". | Publish "from €X pp (land only, sharing)" for each trip, with the single supplement and a small-group surcharge. Show GBP as well if you target the UK. |
| 2 | P0 | **No legal entity, address, terms, privacy policy or imprint.** The footer has a © line and a WhatsApp number, nothing else. | You live in Europe and sell to European consumers. If you combine lodges, transport and guiding into one price, you are almost certainly a package **organiser** under the **EU Package Travel Directive 2015/2302**, or under the **UK Package Travel Regulations 2018** if you are UK-based (the same principles; ATOL is added only if you sell flights). An organiser outside the EU that "directs" sales to EU countries is also caught (Art. 17). That means pre-contract information (the standard information form), written booking conditions and **insolvency protection for prepayments**. Your country's e-commerce rules also require trader identification (in DE/AT an *Impressum*). A GDPR privacy notice is needed because enquiries pass health data (the "medical notes" field) through WhatsApp. | Get advice from a travel lawyer or your national tour-operator association **before taking deposits**. Then add Booking Conditions, Privacy, and Company/Imprint pages, plus a "Your money is protected" panel naming the insolvency guarantor. |
| 3 | P0 | **WhatsApp to an Indian +91 mobile is the only channel.** There is no email, phone or web form that reaches you without WhatsApp. | Many European buyers (corporate, older, privacy-minded) will not open a chat with an unknown foreign number, and some can't (company policy). The form also sends health details through Meta. Replies are promised in IST only. | Get a custom-domain email (`hello@wildora…`). Send the form to that inbox (Formspree, Basin or Netlify Forms all work on a static site). Add a European phone/WhatsApp number in your own time zone and a "Book a 20-min video call" link. Keep WhatsApp as one option among several. |
| 4 | P0 | **The site lives at `vivian4fb.github.io/nature_trip`.** | A personal GitHub subdomain signals "hobby project" at exactly the moment you ask for trust. It also blocks a branded email address. | Buy `wildora-expeditions.com` (or `.eu`) and point GitHub Pages at it. Set `metadataBase` and `basePath` to match. |
| 5 | P1 | **No social proof.** There are no reviews (correctly removed), no social links and no memberships. | European buyers lean on Trustpilot, Feefo, Tripadvisor and Google reviews, and on badges such as AITO, ABTA, ATOL, ANVR (NL), DRV (DE) and SGR. | Build proof that is honest: (a) testimonials from past tours the naturalists led under other banners (e.g. Dr Relton's *Nature Expeditions*), labelled as such; (b) links to the guides' papers and books; (c) Indian Ministry of Tourism approval or Kerala/Karnataka registration if held; (d) after the first departures, Trustpilot or Google reviews. |
| 6 | P1 | **Three of four trips name no place.** Central India, Monsoon and Himalaya all say "Start/end: Confirmed at booking". | Europeans book long-haul flights 6–10 months ahead and need the gateway airport. "Somewhere in central India" also cannot be compared with a named Kanha or Tadoba trip. | Name the reserve or region and the gateway airport for each trip, even if it is marked "typically". |
| 7 | P1 | **Land-only, with no airport transfers.** "Getting to the start is the guest's responsibility." | Competitors either include flights (UK, ATOL-protected) or at least include arrival and departure transfers. First-timers worry most about arrival day. | Include a meet-and-greet transfer from Kochi (COK) and back to Bengaluru (BLR). Offer optional pre/post nights. Add a "Flights from Europe" panel: typical routings (via the Gulf hubs), flight time, and the best arrival days. |
| 8 | P1 | **Nothing on booking mechanics.** No deposit, balance date, payment methods (SEPA or card), currency, cancellation scale, minimum numbers to run, single supplement, or room-sharing policy. | These are the questions a European asks just before paying. Leaving them unanswered pushes the decision to a competitor that answers them on the page. | Add a "Booking & payment" page and link it from every trip's dates panel. Mark departures as "Guaranteed" or "Needs 2 more". |
| 9 | P1 | **No health guidance for adults.** Malaria, routine vaccinations, dengue in the monsoon and leeches are missing. (Vaccinations appear only in the babies FAQ.) | This is a standard European pre-trip question, and national travel-health sites ask people to check before booking. | Add a short "Travel health" block that points to the NHS Fit for Travel page, the RKI/Tropeninstitut or your own national service, so you are not giving medical advice. |
| 10 | P1 | **Accommodation is unnamed** ("lodges and guesthouses"). | Lodge names and photos are a main driver of comfort expectations, and of price, for European buyers. | Name the lodges as "typically" (e.g. Hornbill Camp, Thattekad), with one photo each. |
| 11 | P1 | **English only.** | Germany, the Netherlands and France are large long-haul nature markets. Dutch and German buyers book in their own language when they can. | Start with one German landing page plus a German booking-conditions PDF. Add a language note ("Wir antworten auch auf Deutsch") if anyone on the team can. |
| 12 | P1 | **The sustainability story is asserted, not evidenced.** "Ethical, low-impact" appears with no specifics. | Danish, Dutch and German eco-minded buyers expect concrete facts: local ownership, community spend, conservation donations, a carbon statement. You are **Indian scientists, locally led**, which is a genuine advantage that is currently unstated. | Add a "Responsible travel" page: local guides and lodges, a % to named conservation or research, what you don't do (baiting, elephant rides), and a carbon note. |
| 13 | P2 | **The floating WhatsApp and Enquire buttons cover text on mobile.** At 390 px they sit over body text (e.g. "a suggested p…" in "What happens next" on Contact, and season lines on trip cards). | This makes the page feel unfinished on phones, and most European browsing is on phones. | Add bottom padding to the page equal to the button stack, or collapse the two buttons into one. |
| 14 | P2 | **The intro "canopy curtain" adds about 2.3 s before first content** on the first visit of each session (`components/IntroCurtain.tsx`). | First-time visitors from ads or search are the least patient visitors. Reduced-motion users already skip it. | Shorten it to under 1 s, or play it only on the home page. |
| 15 | P2 | **Home HTML is 618 KB.** The India map's SVG paths are serialised twice (markup plus React payload), and full-size `.webp` photos run to about 650 KB each. | It loads fine on European broadband but is slow on roaming mobile data, which is exactly how people browse on the trip. | Load the overview map as a static `.svg` file. Serve responsive image sizes. |
| 16 | P2 | **The trip catalogue mixes core and non-core products.** The brand is "Western Ghats specialists", yet half the trips are Central India and Himalaya and are only lightly specified. | This dilutes the one thing nobody else does as well. | Lead with Western Ghats products (see §5). Keep tiger and Himalaya trips as extensions. |
| 17 | P2 | **Day 10 of the Endemics trip packs a Bandipur visit and departure into one day**, with the nearest airport (BLR) about 4–5 h away. | European long-haul departures from BLR are often late night or early morning. A safari-plus-transfer day is tiring and risks missed flights. | Add a night 10 in Bandipur or Mysuru, or end the trip in Mysuru with a transfer to BLR. |

---

## 3. Synthetic-traveller panel (MiroFish)

### 3.1 Setup

- **Engine.** MiroFish's OASIS simulation engine, run locally on Ollama `qwen3-vl:8b` (16k context). The kit is in
  `D:\Vivian\Wildora\MiroFish\wildora_audit\`; `README.md` explains how to re-run it.
- **Panel.** 16 personas from 15 European countries: a UK retired-GP birder, a German big-lens photographer, a Dutch
  family, a French honeymooner, a Swedish herpetologist, a Spanish solo nurse, an Italian budget backpacker, a Belgian
  HR director, a Swiss luxury traveller, a Polish first-timer, a Danish sustainability consultant, an Irish
  daughter-and-mother pair, a Norwegian hiker, an Austrian vegan UX designer, a UK AITO travel agent and a Portuguese
  documentary producer. Each persona describes needs only; none was told what to think of Wildora.
- **Seed.** Two forum threads: the website's facts, taken from the code, and the competitor facts in §4.
- **Run.** 8 simulated hours produced 29 comments, 9 comment likes and 3 follows. Then each persona answered audit
  questions.
- **Gap.** Questions 1–4 completed for all 16 personas. Q5 (preferred contact channel) failed inside the engine; the
  forum comments cover that topic instead.
- **Raw output.** `out/summary.md`, `out/interviews.json` and `out/posts.json`.

### 3.2 Results

**Trust to pay a deposit: mean 1.6 / 10.** Seven personas scored 1 and nine scored 2. Not one persona was above 2.

**And yet every persona named a real edge.** Asked what Wildora does better than European operators, all 16 pointed
to the same two things: **doctorate-level guides** and **a Western Ghats niche that European operators don't cover**.
Representative answers:

> "Wildora's niche Western Ghats trips (like Valparai/Thattekad endemics) are unmatched by European operators, who
> focus on Kerala culture or generic tiger safaris." *(Claire, FR, honeymooner)*

> "Those 4 naturalists with PhDs … are rare. European operators … hire guides with solid field experience but rarely
> with academic credentials." *(Lars, NO, hiker)*

> "Wildora's naturalist team has strong academic credentials and honest transparency about wildlife sightings, which
> is refreshing. But they lack ATOL/ABTA protection, fixed pricing, and verifiable contact details." *(Margaret, UK,
> birder)*

**Top blockers** (share of 16 personas who mentioned each one when asked for their top 3):

| Blocker | Personas |
|---|---|
| No price shown | 14 / 16 |
| No company identity, address or registration | 14 / 16 |
| WhatsApp-only contact | 11 / 16 |
| No legal or insolvency protection (ATOL, Pauschalreise, SGR…) | 9 / 16 |
| No email or phone | 8 / 16 |
| No terms, deposit or cancellation info | 5 / 16 |
| Flights and transfers not included | 4 / 16 |
| English only | 4 / 16 |

**Segment colour from the forum discussion:**

- **Corporate buyer (BE):** "WhatsApp-only is non-compliant." He needs a VAT invoice, a contract and a CET contact.
- **Honeymooner (FR):** asked for "pricing details via email or a form instead of WhatsApp".
- **Budget traveller (IT):** the only persona comfortable with WhatsApp, but "no numbers = no trust".
- **AITO travel agent (UK):** wants a Ministry of Tourism registration ID and an insurance certificate before
  partnering. This is the B2B path in §5.3.
- **Herpetologist (SE) and documentary producer (PT):** want the guides' publication lists. This is cheap proof you
  already have.

### 3.3 How to read this

These are language-model personas, not customers.

- **Absolute scores are not reliable.** The seed lists the site's gaps explicitly, which primes scrutiny.
- **The small local model sometimes invents things.** One persona claimed to have "cross-checked the Ministry of
  Tourism portal". Another cited *Phrynobatrachus*, an African frog genus, as a Western Ghats endemic. A third wanted
  a cookie banner, which this site does not legally need because it sets no tracking cookies.
- **The relative ranking of objections is the useful signal.** It matches the expert audit (§2) and competitor norms
  (§4) closely: price, identity, channel and protection.

Re-run the panel after each fix (edit `SITE_FACTS` in `seed.py`) and watch the trust score move. Validate with 5–8
real European prospects; a birding club mailing list is a good source.

---

## 4. Competitor landscape: who sells India wildlife to Europeans

Desk research on 2026-10-14. Prices are per person, "from", sharing a room. A source URL is given for every operator.

### 4.1 Comparison matrix

| Operator (HQ) | India wildlife product relevant to Wildora | Price & length | Group / guiding | Booking & protection | Social proof |
|---|---|---|---|---|---|
| **Wildora** (India-led, EU-based owner) | **Western Ghats Endemics 10 d** (Thattekad, Munnar/Eravikulam, Chinnar, Valparai, Ooty/Mukurthi, Bandipur) + Monsoon frogs 5 d + Central India 7 d + Himalaya 6 d | **Not shown** | Max 10–12; **4 PhD-level Indian naturalists** | WhatsApp enquiry only; **no published protection, terms or entity** | None yet |
| [Naturetrek](https://www.naturetrek.co.uk/tours/the-national-parks-of-southern-india) (UK) | National Parks of Southern India 16 d (Nagarhole, Bandipur, Nilgiris, Valparai, Thattekad); Kerala 9 d | £5,495 land / £5,995 with flights; Kerala £2,495 land | "Expert local naturalist guides" | Book online, 20% deposit, ATOL + ABTOT | Trustpilot 4.7; AITO 99%; tour reports since 2007 |
| [Wildlife Worldwide](https://www.wildlifeworldwide.com/group-tours/indias-wild-south) / [Travelling Naturalist](https://www.naturalist.co.uk/tours/nagarholes-tigers-wild-dogs-leopards) (UK) | India's Wild South 12 d (Nagarhole, Wayanad, Valparai); Nagarhole 10 d | £3,895 land / £4,495 with flights; Nagarhole £3,995 / £4,595 | 5–6 guests, named Indian naturalists | Live availability (FULL, "3 spaces"); ATOL 10544 | Trustpilot 4.8; British Travel Awards |
| [Birdquest](https://www.birdquest-tours.com/birding-tours/india-south-andaman-islands/) (UK) | South India & Andamans 16 d (Ooty, Munnar, Periyar, Thattekad) | £4,260 / €5,010 | Max 7, leader + local guide | Online form, 20% deposit; Nov 2026 **FULL** | Running since 1985 |
| [Rockjumper](https://www.rockjumperbirding.com/tour-info/india-southern-endemics-of-the-western-ghats-small-group-2028/50861) (non-EU benchmark) | Endemics of the Western Ghats 12 d | ~US$5,295–5,700 | Small group | Prices in USD, GBP, EUR and AUD; Jan 2027 shows no space | Global birding brand |
| [TransIndus](https://transindus.co.uk/tours/exploring-the-western-ghats) (UK) | Exploring the Western Ghats 16 d, tailor-made | £3,745 with flights | Private | Enquiry; ATOL, AITO | 35+ years |
| [Responsible Travel](https://www.responsibletravel.com/holiday/24826/western-ghats-wildlife-tour-in-india) (UK marketplace) | Western Ghats wildlife 11 d; Kerala birding 7 d | US$2,880 / US$1,540 land | Max 6 (birding) | Enquiry | Marketplace brand |
| [Steppes](https://www.steppestravel.com/destinations/india/) / [Natural World Safaris](https://www.naturalworldsafaris.com/asia/india) (UK, luxury) | Central India tigers only; **no Western Ghats product** | £6,500–11,250+ | Private, specialist-designed | Enquiry; ATOL, B Corp | Trustpilot 4.8 (229) |
| [Exodus](https://www.exodus.co.uk/india-holidays) / [Explore](https://www.explore.co.uk/destinations/asia/india) (UK, mass adventure) | One wildlife trip each, central India tigers; Kerala sold as culture/cycling | £3,095–3,499 land, 15–16 d | 10–12 | Online booking, live chat; ATOL, ABTA | Trustpilot 4.9 (5,760); Feefo Platinum |
| [Diamir](https://www.diamir.de/indien) (DE) | Tiger tour 13 d; South India = culture | €4,790 with flights | 6–12 | Online cart, phone/video advice | Rainforest-protection claim |
| [Wikinger](https://www.wikinger-reisen.de/wanderreisen/indien/3311.php) / [Chamäleon](https://www.chamaeleon-reisen.de/Asien/Indien) (DE) | Kerala hiking 20 d / Kerala 18 d (Periyar walk only) | €2,965 / €4,199 with flights | 6–15, **German-speaking** leader | Online booking; "guaranteed" departures | Travelife; reviews |
| [Riksja](https://www.riksjatravel.nl/india/rondreis/) / [Sawadee](https://www.sawadee.nl/india/) (NL) | Private South India 14 d (Wayanad, Coonoor, Periyar) | from €1,650 | Private / up to 20 | ANVR + SGR + Calamiteitenfonds | Trustpilot 4.6 (1,855); B Corp |
| [Terres d'Aventure](https://www.terdav.com/ps-inde/rn-inde-sud) / [Nomade](https://www.nomade-aventure.com/voyage-aventure/inde/voyage-aventure-inde-du-sud/ide73) (FR) | Inde du Sud / Kerala treks 14–15 d | €2,519–3,350 with flights | 4–15, **French-speaking** guide | Online; seats-left counter | 93% satisfaction; B Corp |
| [WeRoad](https://www.weroad.it/viaggi/india-sud-kerala-madurai/99e6645f-58d5-4981-a089-2ba238d82237) (IT) / [Exoticca](https://www.exoticca.com/es/asia/subcontinente-indio/india) (ES) | Budget South India / Golden Triangle + Kerala | €1,099 land / €2,449 | ~12 | Online; €100 deposit once confirmed | Trustpilot 4.5 |
| [Nature Safari India](https://www.naturesafariindia.com/) (India) | Central India tigers; Western Ghats only as herping mention | Not shown | Senior naturalists | Enquiry form, "reply within 12 h" | Tripadvisor 5.0 (170); Trustpilot 4.8 |

Notes: Audley, the Nordic operators, Ikarus and Tuareg could not be verified. SNP (NL) currently lists no India trips.

### 4.2 What the market tells us

1. **The Western Ghats is underserved, and outside the UK it is essentially unserved.**
   - Every continental operator I checked (DE, NL, FR, ES, IT) sells Kerala as culture, backwaters or hiking. None runs a
     naturalist-led trip to Valparai, Thattekad, the Nilgiris endemics or Anamalai.
   - Even in the UK, Western Ghats group tours run once a year or less. Naturetrek's has a single departure (Jan 2028),
     Wildlife Worldwide runs once a year and Birdquest every other year.
2. **Demand exceeds supply at the specialist end.**
   - Sold out: Birdquest Nov 2026, Wildlife Worldwide Nagarhole 14 Mar 2027, Travelling Naturalist 28 Feb 2027.
   - Rockjumper's Jan 2027 tour shows no space.
   - Groups are capped at 5–7 people.
3. **Tigers are crowded.** Exodus, Explore, Steppes, Natural World Safaris and Diamir all sell central-India tiger
   trips, many backed by thousands of reviews. Wildora's 7-day Central India trip, with no reserve named and no price,
   cannot win there.
4. **The table stakes are uniform.** Every European competitor has:
   - a visible price;
   - legal insolvency protection (ATOL/ABTOT, SGR, a Sicherungsschein or equivalent);
   - online booking or a clear deposit rule (20% is the norm);
   - departure status labels ("guaranteed", "full", "3 spaces");
   - a review score;
   - and, increasingly, a carbon figure per trip.

   Wildora currently has none of these.
5. **Price corridor.**
   - UK specialist Western Ghats tours: £3,900–6,000 (≈ €4,500–7,000) for 12–16 days.
   - Continental Kerala culture tours: €1,100–4,200.
   - A 10-day, naturalist-led, land-only Western Ghats trip at **about €2,400–3,200 pp** would undercut UK specialists by
     30–45% on a like-for-like land basis and still sit at a premium to culture tours. This is an inference from the
     ranges above, not a sourced figure; validate it against your real costs.

---

## 5. Business edge: Wildora vs the field

### 5.1 Where Wildora genuinely wins

| Edge | vs whom | Why it is real |
|---|---|---|
| **The guides are the scientists.** Four PhD-level Indian naturalists who research these exact habitats. | Everyone. UK operators subcontract "local naturalist guides"; continental operators send culture tour leaders. | It cannot be copied quickly, and it is the strongest claim in this market. Birders and herpers pay for guide quality above everything else. |
| **The deepest Western Ghats route on offer.** Thattekad, Munnar/Eravikulam, Chinnar, Valparai, Ooty/Mukurthi and Bandipur in 10 days. | Naturetrek IND34 (16 d), Wildlife Worldwide (12 d), Birdquest (16 d). | It covers the key endemics hotspots in fewer days, so it costs less in leave and in money. |
| **The monsoon frog and herp trip.** | No European operator sells one. | A true blue-ocean product for herpetologists and macro photographers, in a low season when lodges are cheap. |
| **Frequent departures.** Monthly in season. | Competitors run Western Ghats trips 0.5–1× per year, and they sell out. | You can catch the overflow from sold-out UK tours. |
| **The price headroom of a local operator.** | UK specialists at £3,900–6,000. | There is no UK middleman margin, so you can price 30–45% lower and still make a healthy margin. |
| **Honest, specific content.** Fit notes, season logic, FAQ. | Most mid-market sites. | It builds trust **once the basic trust markers exist**. Right now it is honesty without proof. |
| **A European-based owner.** | India-based operators (Nature Safari India etc.). | You can become the EU-compliant organiser, insured in the EU, priced in EUR, reachable in CET hours, which an India-only operator cannot easily be (PTD Art. 17/20). |

### 5.2 Where Wildora loses today

| Gap | Who does it well | Fix priority |
|---|---|---|
| No price | Everyone | **Week 1** |
| No insolvency protection, terms or entity | ATOL/ABTOT (UK), SGR (NL), Sicherungsschein (DE) | **Before the first deposit** |
| WhatsApp-only, Indian number, IST | Sawadee/Exoticca offer WhatsApp *plus* phone, email and chat | Week 1 |
| github.io address | Everyone | Week 1 |
| No reviews or badges | Trustpilot 4.6–4.9 everywhere | Months 1–6 |
| No transfers or flights help | UK operators sell flight-inclusive packages; continental operators include flights | Month 1 |
| English only | Wikinger/Diamir (DE), Terdav/Nomade (FR) | Month 2–3 (DE first) |
| No availability status or online deposit | Wildlife Worldwide, Birdquest, Explore | Month 2 |
| No carbon or conservation figure | Naturetrek, Explore, Diamir | Month 2 |

### 5.3 Recommended positioning

> **"The Western Ghats, guided by the scientists who study it."** Europe's only specialist for India's
> south-western rainforests, with scientist-guided small groups, EUR prices and EU booking protection.

1. **Lead with the Western Ghats Endemics trip and the Monsoon frog trip.** Treat Central India and the Himalaya as
   add-on extensions, not headline products, because they are crowded and under-specified.
2. **Sell land-only in EUR, with optional flight advice.** This avoids becoming a flight seller (and, for UK clients,
   ATOL). Include arrival and departure transfers.
3. **Target three segments first:**
   - UK and Northern-European birders who missed sold-out departures (Birdquest, Wildlife Worldwide);
   - German and Dutch nature travellers with no specialist Western Ghats option in their own language;
   - herpetology and macro-photography niches for the monsoon trip.
4. **Use B2B as a second channel.** Offer Wildora as the ground operator to UK and EU specialists (the David persona
   in §3 and TransIndus/Responsible Travel-type sellers). They bring the trust and the protection; you bring the
   scientists. This also produces reviews faster.

### 5.4 Action plan

| When | Action |
|---|---|
| **Week 1** | Custom domain and email. Publish "from €" prices with the single supplement. Add an email or web-form channel and a European phone number. Add the Company/Imprint page. |
| **Before taking any deposit** | Take legal advice on PTD organiser status in your country of residence. Arrange insolvency protection (insurer or bank guarantee). Publish Booking Conditions, the PTD standard information form and a Privacy notice. Move health data out of WhatsApp. |
| **Month 1** | Name the lodges, gateways and transfers. Add a Booking & payment page (20% deposit, SEPA/card, balance at 8 weeks, cancellation scale, minimum numbers). Add departure status labels. Add a Travel health block. Fix the mobile floating-button overlap. Shorten the intro animation. |
| **Months 2–3** | German landing page with EUR prices. Responsible-travel page with a carbon figure. Pitch the B2B ground-handling offer to 5 UK and EU specialists. Collect testimonials from the naturalists' past tours. |
| **After the first departures** | Trustpilot or Google reviews. Tour reports (Naturetrek-style species lists, which are excellent SEO for birders). Apply to AITO or a national association. |
