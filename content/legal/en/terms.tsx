import type { LegalDoc } from '@/content/legal';
import { Tbc } from '@/components/LegalPage';
import { Link } from '@/i18n/navigation';
import { SITE, waLink } from '@/lib/site';

/* Booking conditions. Structured on the EU Package Travel Directive (EU) 2015/2302; article
   references in comments are for the reviewing lawyer. DRAFT: wording to be checked by a lawyer. */
const L = SITE.legal;

const CANCELLATION_BANDS = [1, 2, 3, 4];

const terms: LegalDoc = {
  title: 'Booking conditions',
  description: 'How booking, payment, changes and cancellation work with Wildora Expeditions, and the rights you have.',
  lede: 'How booking, payment, changes and cancellation work, and the rights you have. Please read these before you pay a deposit.',
  updated: '2026-10-14',
  sections: [
    {
      id: 'organiser',
      title: '1. Who you are booking with',
      content: (
        <>
          <p>
            Trips are organised by {SITE.name} (<Tbc value={L.legalName} hint="legal name" />), called &quot;we&quot; or
            &quot;us&quot; here. Our full company details are in the <Link href="/legal/">legal notice</Link>.
          </p>
          <p>
            &quot;You&quot; means every traveller named on the booking. The person who makes the booking accepts these
            conditions on behalf of everyone named on it.
          </p>
        </>
      ),
    },
    {
      id: 'package-travel',
      title: '2. Package travel and your rights',
      content: (
        <>
          <p>
            A trip that combines accommodation, transport and guiding for one price is normally a package. When the
            package travel rules apply to your booking, you have all the rights they give you, summarised on our{' '}
            <Link href="/package-travel/">package travel information</Link> page. Nothing in these conditions takes away
            a right you have by law.
          </p>
          <p>
            <Tbc value={null} hint="which package travel law applies to our bookings, as advised by a lawyer" />
          </p>
        </>
      ),
    },
    {
      id: 'booking',
      title: '3. Booking and the contract',
      content: (
        <>
          <p>
            You send an enquiry. We reply with availability, a suggested plan and how to confirm your place. Before you
            book, we give you the trip&apos;s main details and these conditions.
          </p>
          <p>
            A booking, and the contract between us, is confirmed only when we have confirmed it to you in writing and
            your deposit has been received. We then send you a booking confirmation:{' '}
            <Tbc value={null} hint="what the confirmation contains and how it is sent" />. Please check it and tell us
            straight away if anything is wrong.
          </p>
          <p>
            Listed dates are planned departures, confirmed when you enquire. They are listed at least{' '}
            {SITE.bookingLeadDays} days ahead, to leave time for permits and lodge bookings.
          </p>
        </>
      ),
    },
    {
      id: 'price',
      title: '4. Prices and what is included',
      content: (
        <>
          <p>
            The price of your trip is the price we confirm to you in writing when you book. Currency, and whether prices
            are per person sharing: <Tbc value={null} hint="currency, per person sharing or not" />. Single-room
            supplement: <Tbc value={null} hint="single supplement, if any" />.
          </p>
          <p>
            Each trip page lists what we arrange (&quot;We arrange&quot;) and what you arrange yourself (&quot;You
            arrange&quot;). Your booking confirmation sets out exactly what your package includes.
          </p>
          <ul>
            <li>
              Where our services start and end:{' '}
              <Tbc value={null} hint="where our services start and end, e.g. arrival and departure airport" />.
            </li>
            <li>
              Flights: <Tbc value={null} hint="international and domestic flights are not part of the package" />.
            </li>
            <li>Unless a trip page says otherwise, visas and travel insurance are not included.</li>
          </ul>
          {/* PTD Art. 10(1)-(4); the three grounds are the only ones Art. 10(1) allows. */}
          <p>
            Price changes after you book: <Tbc value={null} hint="whether the price can change after booking" />. Any
            increase can only be made as the package travel rules allow, as a direct result of a change, after you
            book, in:
          </p>
          <ul>
            <li>the cost of transporting passengers, resulting from the cost of fuel or other power sources;</li>
            <li>
              taxes or fees on the travel services in your package imposed by third parties not directly involved in
              providing it, such as tourist taxes; or
            </li>
            <li>the exchange rates relevant to your package.</li>
          </ul>
          <p>
            How an increase is calculated: <Tbc value={null} hint="how a price revision is calculated" />. We will tell
            you about any increase clearly, on a durable medium such as an email, with the reason for it and the
            calculation, and never later than 20 days before departure. If an increase is more than 8% of the price, you
            may cancel without a cancellation charge (see section 9). If those costs fall, you are entitled to a matching
            reduction.
          </p>
        </>
      ),
    },
    {
      id: 'payment',
      title: '5. Payment',
      content: (
        <ul>
          <li>
            Deposit: <Tbc value={null} hint="deposit amount or percentage" />.
          </li>
          <li>
            Balance: <Tbc value={null} hint="when the balance is due, e.g. days before departure" />. If you book after
            that date: <Tbc value={null} hint="whether the full price is due at booking" />.
          </li>
          <li>
            Accepted payment methods: <Tbc value={null} hint="bank transfer, card, other" />.
          </li>
          <li>
            If the balance is not paid on time:{' '}
            <Tbc value={null} hint="what happens, e.g. we may treat the booking as cancelled by you and apply the charges in section 8" />.
          </li>
        </ul>
      ),
    },
    {
      id: 'protection',
      title: '6. Protection of your money',
      content: (
        <>
          <p>
            Your payments are protected if we become insolvent:{' '}
            <Tbc value={L.insolvencyProtection} hint="insurer, bank guarantee or fund" />. If that happened, payments for
            services not yet provided would be refunded.
          </p>
          <p>
            How you receive proof of this protection: <Tbc value={null} hint="e.g. with the booking confirmation" />. See
            also <Link href="/package-travel/">package travel information</Link>.
          </p>
        </>
      ),
    },
    {
      id: 'your-changes',
      title: '7. Changes you make',
      content: (
        <>
          <p>
            If you want to change your booking, for example the dates or the trip, tell us as soon as you can. We will
            try to help, but cannot always. Change fee: <Tbc value={null} hint="fee for changes, if any" />, plus any
            extra costs charged to us by lodges or other suppliers because of the change.
          </p>
          {/* PTD Art. 9. */}
          <p>
            <strong>Transferring your booking to someone else.</strong> You can transfer your place to another person who
            meets all the conditions for the trip, if you tell us in writing within a reasonable time before departure.
            Notice given at least 7 days before departure is always reasonable. You and the new traveller are jointly
            responsible for paying any balance and any fees, charges or other costs that the transfer causes. We will
            tell you what those costs are, show you how they arise, and they will never be more than is reasonable or
            more than the costs we actually incur.
          </p>
        </>
      ),
    },
    {
      id: 'cancellation-by-you',
      title: '8. If you cancel',
      content: (
        <>
          {/* PTD Art. 12(1). */}
          <p>
            You can cancel your booking at any time before departure. Please tell us in writing; your cancellation takes
            effect on the day we receive it. A cancellation charge then applies, depending on how long before departure
            we receive it:
          </p>
          <table>
            <thead>
              <tr>
                <th scope="col">When we receive your cancellation</th>
                <th scope="col">Cancellation charge</th>
              </tr>
            </thead>
            <tbody>
              {CANCELLATION_BANDS.map((n) => (
                <tr key={n}>
                  <td>
                    <Tbc value={null} hint={`period ${n}, in days before departure`} />
                  </td>
                  <td>
                    <Tbc value={null} hint="charge, e.g. as % of the trip price" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* PTD Art. 12(2). */}
          <p>
            <strong>No charge in unavoidable and extraordinary circumstances.</strong> You can cancel without any
            cancellation charge if unavoidable and extraordinary circumstances at or near the destination significantly
            affect the trip, or the transport of travellers to the destination (see section 15). You then get a full
            refund of what you have paid, but no further compensation.
          </p>
          {/* PTD Art. 12(4). */}
          <p>Any refund due to you is paid without undue delay, and at the latest within 14 days of the cancellation.</p>
        </>
      ),
    },
    {
      id: 'changes-by-us',
      title: '9. If we change or cancel your trip',
      content: (
        <>
          {/* PTD Art. 11(1). */}
          <p>
            <strong>Minor changes.</strong> We plan carefully, but local conditions change. We may make minor changes,
            for example to the order or timing of activities, and will tell you about them clearly in writing.
          </p>
          <p>
            <strong>Park closures.</strong> Parks occasionally close or suspend safaris at short notice for weather,
            wildlife-management or legal reasons. If that happens on your dates, we substitute a comparable site or
            activity and tell you as early as we can.
          </p>
          {/* PTD Art. 11(2)-(5). */}
          <p>
            <strong>Significant changes.</strong> If, before departure, we have to change an essential part of your
            trip significantly, cannot meet a special request we have accepted, or would need to raise the price by more
            than 8%, we will tell you without delay, clearly and in writing. You can then:
          </p>
          <ul>
            <li>accept the change;</li>
            <li>cancel and get a full refund, with no cancellation charge; or</li>
            <li>accept a substitute trip, if we offer one, with an appropriate price reduction if it is of lower quality or cost.</li>
          </ul>
          <p>
            We will tell you how long you have to decide and what happens if you do not reply:{' '}
            <Tbc value={null} hint="time allowed to reply, and the consequence of no reply" />.
          </p>
          {/* PTD Art. 12(3). */}
          <p>
            <strong>If we cancel.</strong> Each departure needs a minimum number of travellers:{' '}
            <Tbc value={null} hint="minimum group size" />. If that number is not reached, we may cancel the departure and
            will tell you no later than{' '}
            <Tbc
              value={null}
              hint="notice period; the latest the law allows is 20 days before departure for trips of more than 6 days, and 7 days for trips of 2 to 6 days"
            />
            . We may also cancel if unavoidable and extraordinary circumstances prevent us from running the trip, and
            will then tell you without undue delay before departure.
          </p>
          <p>
            In either case you get a full refund of what you have paid, within 14 days, but no further compensation. If
            we cancel for any other reason, you also get a full refund and may be entitled to compensation.
          </p>
        </>
      ),
    },
    {
      id: 'responsibilities',
      title: '10. Your responsibilities',
      content: (
        <ul>
          <li>
            <strong>Passport and visa.</strong> Make sure your passport is valid and that you hold the right Indian visa
            before you travel. Apply only through the Government of India&apos;s official site, indianvisaonline.gov.in.
          </li>
          <li>
            <strong>Health requirements.</strong> Follow the advice of your doctor or national travel-health service on
            vaccinations and other precautions, and meet any health requirements for entering India.
          </li>
          <li>
            <strong>Travel insurance is essential.</strong> Every traveller must hold comprehensive travel medical
            insurance for the whole trip, covering medical treatment, hospital stays and emergency evacuation from
            remote areas. Check that it covers the activities on your trip and, where relevant, your age and any
            pre-existing conditions. Policy details we need from you:{' '}
            <Tbc value={null} hint="e.g. insurer, policy number and emergency number, and by when" />.
          </li>
          <li>
            <strong>Accurate information.</strong> Tell us before you book about any medical condition, disability,
            pregnancy or mobility limitation, medicines you take regularly, allergies (food, insect stings or medicines)
            and dietary needs, and tell us if anything changes. We will ask you to fill in a short health form. We pass
            food allergies on to every kitchen on the route.
          </li>
          <li>
            <strong>Medication.</strong> Bring enough of any medication you take for the whole trip plus a few
            days&apos; spare. Our guides carry a basic first-aid kit but cannot supply prescription medicines.
          </li>
          <li>
            <strong>Instructions and park rules.</strong> Follow your guide&apos;s instructions, especially on safety,
            and the rules of the parks and reserves we visit. If a traveller&apos;s behaviour puts themselves, others or
            wildlife at risk, or seriously disrupts the group:{' '}
            <Tbc value={null} hint="what we may do, e.g. exclude the traveller from an activity or the rest of the trip, and whether any refund is due" />.
          </li>
          <li>
            <strong>Ethical wildlife watching.</strong> Follow the ethical wildlife-watching code on our{' '}
            <Link href="/species/">species page</Link>: keep a respectful distance, never handle, bait or crowd
            wildlife, and do not disturb nesting or breeding animals.
          </li>
        </ul>
      ),
    },
    {
      id: 'suitability',
      title: '11. Health, fitness and suitability',
      content: (
        <>
          <p>
            Every trip has a difficulty grade. Our <Link href="/practical/#difficulty">difficulty grades</Link> explain
            what each one means. Choose a trip that suits your fitness and health, and ask us if you are unsure.
          </p>
          <p>
            Many of our routes are remote. The nearest hospital can be several hours away by road, and mobile signal
            can be patchy or absent. See <Link href="/practical/#health">health and insurance</Link>.
          </p>
          <ul>
            <li>
              Minimum age: <Tbc value={null} hint="minimum age on fixed departures, and for night walks" />.
            </li>
            <li>
              Suitability for people with reduced mobility:{' '}
              <Tbc value={null} hint="general statement for each trip" />. Ask us for precise information about any
              trip.
            </li>
            <li>
              If the information you give us suggests a trip is unsuitable or unsafe for you:{' '}
              <Tbc value={null} hint="what we do, e.g. advise you and, if necessary, decline the booking" />.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: 'wildlife',
      title: '12. Wildlife sightings',
      content: (
        <p>
          Wildlife sightings depend on the season, the weather and local conditions on the day of your visit. We plan
          routes and timings to give you the best chance, but no particular sighting can be guaranteed, so not seeing a
          particular animal is not a fault in your trip.
        </p>
      ),
    },
    {
      id: 'liability',
      title: '13. Our liability',
      content: (
        <>
          {/* PTD Art. 13(1), 14(1)-(3). The Art. 14(3) defences exclude only compensation, never the price reduction. */}
          <p>
            We are responsible for the proper performance of all the travel services in your package, whether we
            provide them ourselves or through lodges, drivers, guides and other suppliers. If a service is not performed
            or not performed properly (see section 14):
          </p>
          <ul>
            <li>
              you are entitled to an appropriate price reduction for any period in which it was not performed properly,
              unless we show that the problem was caused by you; and
            </li>
            <li>
              you are entitled to appropriate compensation for any damage you suffer as a result, unless we show that the
              problem was caused by you, by a third party unconnected with the services and was unforeseeable or
              unavoidable, or by unavoidable and extraordinary circumstances.
            </li>
          </ul>
          {/* PTD Art. 14(4). */}
          <p>
            Where the law allows, our liability is limited to{' '}
            <Tbc value={null} hint="limit, e.g. a multiple of the trip price; the Directive allows no less than three times the total price" />
            . This limit never applies to personal injury, or to damage we cause intentionally or negligently. Where an
            international convention limits the compensation a supplier has to pay, our liability is limited in the same
            way.
          </p>
          {/* PTD Art. 16. */}
          <p>
            <strong>Help if you are in difficulty.</strong> If you get into difficulty during the trip, for example
            through illness or injury, we will help you without undue delay: with information on health services, local
            authorities and consular help, with communications, and with finding other arrangements. If you caused the
            difficulty deliberately or through your own negligence, we may charge a reasonable fee for this help, no
            more than our actual costs.
          </p>
          <p>
            Emergency contact during your trip: <Tbc value={null} hint="24-hour emergency phone number or contact point" />.
          </p>
        </>
      ),
    },
    {
      id: 'complaints',
      title: '14. If something goes wrong',
      content: (
        <>
          {/* PTD Art. 13. */}
          <p>
            Tell your guide straight away if something is wrong, so we can put it right during the trip. If you cannot
            reach your guide, contact us on WhatsApp ({SITE.whatsapp.display}). Please also confirm the problem to us in
            writing. Telling us promptly matters: we can only fix what we know about.
          </p>
          <p>
            We will put the problem right unless that is impossible or would cost far more than is reasonable. If we
            cannot, you may be entitled to a price reduction and/or compensation. If a significant part of the trip
            cannot be provided as agreed, we will offer suitable alternative arrangements at no extra cost. If the
            problem substantially affects your trip and we do not put it right within a reasonable time, you may end the
            contract without a fee.
          </p>
          <p>
            After the trip, write to us: <Tbc value={null} hint="complaints contact and time limit" />.
          </p>
        </>
      ),
    },
    {
      id: 'unavoidable',
      title: '15. Unavoidable and extraordinary circumstances',
      content: (
        <>
          {/* PTD Art. 3(12) and recital 31. */}
          <p>
            These are situations beyond the control of whoever relies on them, whose consequences could not have been
            avoided even if all reasonable measures had been taken. Examples are war or other serious security problems
            such as terrorism, serious risks to health such as the outbreak of a serious disease at the destination, and
            natural disasters such as floods, earthquakes or weather that makes it impossible to travel safely.
          </p>
          <p>
            What they mean for cancellations is set out in sections 8 and 9. We are not liable to pay compensation for a
            problem caused by them, but we will still help you as described in section 13.
          </p>
        </>
      ),
    },
    {
      id: 'personal-data',
      title: '16. Personal data',
      content: (
        <p>
          We use your personal data, including health and dietary information, to arrange and run your trip, and share
          it with lodges, drivers and guides only as far as they need it to look after you. See our{' '}
          <Link href="/privacy/">privacy notice</Link>.
        </p>
      ),
    },
    {
      id: 'law',
      title: '17. Applicable law and courts',
      content: (
        <>
          <p>
            These conditions and your contract with us are governed by <Tbc value={null} hint="governing law" />. Courts:{' '}
            <Tbc value={null} hint="jurisdiction" />.
          </p>
          {/* Rome I Regulation (EC) 593/2008, Art. 6. */}
          <p>
            If you book as a consumer, this choice of law does not take away the protection you have under the
            mandatory rules of the country where you live.
          </p>
        </>
      ),
    },
    {
      id: 'contact',
      title: '18. Contact',
      content: (
        <ul>
          <li>
            WhatsApp:{' '}
            <a href={waLink()} target="_blank" rel="noopener noreferrer">
              {SITE.whatsapp.display}
            </a>
          </li>
          <li>
            Email:{' '}
            {SITE.email ? <a href={`mailto:${SITE.email}`}>{SITE.email}</a> : <Tbc value={null} hint="public email address" />}
          </li>
          <li>
            Post: <Tbc value={L.address} hint="postal address" />
          </li>
        </ul>
      ),
    },
  ],
};

export default terms;
