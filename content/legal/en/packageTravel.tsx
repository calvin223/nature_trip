import type { LegalDoc } from '@/content/legal';
import { Tbc } from '@/components/LegalPage';
import { SITE } from '@/lib/site';

/* The standard information form for package travel contracts, Directive (EU) 2015/2302, Annex I,
   Part A (contracts where hyperlinks can be used). The wording follows the Annex; only the
   bracketed details are ours. Do not reword it: translations should use the official text of the
   Directive in that language (EUR-Lex). */
const name = <Tbc value={SITE.legal.legalName} hint="legal name" />;

const packageTravel: LegalDoc = {
  title: 'Package travel information',
  description: 'Your rights under the EU Package Travel Directive (EU) 2015/2302, and who protects your payments.',
  lede: 'If your trip is a package, these are the rights you have by law. This is the standard information form set out in the EU Package Travel Directive.',
  updated: '2026-10-14',
  sections: [
    {
      id: 'applies',
      title: 'When this information applies',
      content: (
        <p>
          Draft note: whether and how this form applies to our bookings depends on legal advice about whether{' '}
          {SITE.name} is a package organiser under the EU Package Travel Directive (as transposed in the traveller&apos;s
          country) and, for travellers in the United Kingdom, under the Package Travel and Linked Travel Arrangements
          Regulations 2018.{' '}
          <Tbc value={null} hint="confirm after legal advice, then remove this note" />
        </p>
      ),
    },
    {
      id: 'standard-information',
      title: 'Standard information form',
      content: (
        <>
          <p>
            The combination of travel services offered to you is a package within the meaning of Directive (EU)
            2015/2302.
          </p>
          <p>
            Therefore, you will benefit from all EU rights applying to packages. Company {name} will be fully
            responsible for the proper performance of the package as a whole.
          </p>
          <p>
            Additionally, as required by law, company {name} has protection in place to refund your payments and, where
            transport is included in the package, to ensure your repatriation in the event that it becomes insolvent.
          </p>
          <p>
            <a href="#key-rights">More information on key rights under Directive (EU) 2015/2302</a>
          </p>
        </>
      ),
    },
    {
      id: 'key-rights',
      title: 'Key rights under Directive (EU) 2015/2302',
      content: (
        <>
          <ul>
            <li>Travellers will receive all essential information about the package before concluding the package travel contract.</li>
            <li>
              There is always at least one trader who is liable for the proper performance of all the travel services
              included in the contract.
            </li>
            <li>
              Travellers are given an emergency telephone number or details of a contact point where they can get in
              touch with the organiser or the travel agent.
            </li>
            <li>Travellers may transfer the package to another person, on reasonable notice and possibly subject to additional costs.</li>
            <li>
              The price of the package may only be increased if specific costs rise (for instance, fuel prices), and if
              expressly provided for in the contract, and in any event not later than 20 days before the start of the
              package. If the price increase exceeds 8% of the price of the package, the traveller may terminate the
              contract. If the organiser reserves the right to a price increase, the traveller has a right to a price
              reduction if there is a decrease in the relevant costs.
            </li>
            <li>
              Travellers may terminate the contract without paying any termination fee and get a full refund of any
              payments if any of the essential elements of the package, other than the price, are changed significantly.
              If before the start of the package the trader responsible for the package cancels the package, travellers
              are entitled to a refund and compensation, where appropriate.
            </li>
            <li>
              Travellers may terminate the contract without paying any termination fee before the start of the package
              in the event of exceptional circumstances, for instance if there are serious security problems at the
              destination which are likely to affect the package.
            </li>
            <li>
              Additionally, travellers may at any time before the start of the package terminate the contract in return
              for an appropriate and justifiable termination fee.
            </li>
            <li>
              If, after the start of the package, significant elements of the package cannot be provided as agreed,
              suitable alternative arrangements will have to be offered to the traveller at no extra cost. Travellers may
              terminate the contract without paying any termination fee, where services are not performed in accordance
              with the contract and this substantially affects the performance of the package and the organiser fails to
              remedy the problem.
            </li>
            <li>
              Travellers are also entitled to a price reduction and/or compensation for damages where the travel
              services are not performed or are improperly performed.
            </li>
            <li>The organiser has to provide assistance if the traveller is in difficulty.</li>
            <li>
              If the organiser or, in some Member States, the retailer becomes insolvent, payments will be refunded. If
              the organiser or, where applicable, the retailer becomes insolvent after the start of the package and if
              transport is included in the package, repatriation of the travellers is secured.
            </li>
          </ul>
          <p>
            {name} has taken out insolvency protection with{' '}
            <Tbc value={SITE.legal.insolvencyProtection} hint="insolvency protection provider, with address, email and telephone" />.
            Travellers may contact this entity or, where applicable, the competent authority (
            <Tbc value={null} hint="competent authority, with address, email and telephone" />) if services are denied
            because of {name}&apos;s insolvency.
          </p>
          <p>
            {/* The Annex wants a link to the national law; until legal advice names it, EUR-Lex's list of every
                Member State's transposition stands in. */}
            Directive (EU) 2015/2302 as transposed into national law:{' '}
            <Tbc value={null} hint="link to the national law that applies to our bookings, as advised by a lawyer" />{' '}
            (national transposition measures:{' '}
            <a href="https://eur-lex.europa.eu/legal-content/EN/NIM/?uri=CELEX:32015L2302" target="_blank" rel="noopener noreferrer">
              EUR-Lex
            </a>
            )
          </p>
        </>
      ),
    },
  ],
};

export default packageTravel;
