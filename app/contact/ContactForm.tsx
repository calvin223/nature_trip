'use client';

import Link from 'next/link';
import { useId, useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react';
import { WhatsAppIcon } from '@/components/FloatingCTA';
import { SITE, hasEmail, mailtoLink, waLink } from '@/lib/site';

/* Enquiry form. Nothing is sent or stored by this (static) site: submitting writes a
   WhatsApp message with every filled-in field and opens it in a new tab for the guest
   to send. Email is offered only when SITE.email is configured (hasEmail). */

export interface TripOption {
  id: string;
  title: string;
}

interface Fields {
  name: string;
  country: string;
  trip: string;
  dates: string;
  groupSize: string;
  childAges: string;
  diet: string;
  medical: string;
  message: string;
}
type FieldName = keyof Fields;
type Errors = Partial<Record<FieldName, string>>;

const EMPTY: Fields = {
  name: '',
  country: '',
  trip: '',
  dates: '',
  groupSize: '',
  childAges: '',
  diet: '',
  medical: '',
  message: '',
};

/** Order used for the message and for focusing the first invalid field. */
const LABELS: [FieldName, string][] = [
  ['name', 'Name'],
  ['country', 'Country'],
  ['trip', 'Trip of interest'],
  ['dates', 'Preferred month or dates'],
  ['groupSize', 'Group size'],
  ['childAges', 'Ages of any children'],
  ['diet', 'Dietary needs'],
  ['medical', 'Medical or mobility notes'],
  ['message', 'Message'],
];

const EXTRA_TRIP_OPTIONS = ['A private or custom trip', 'A guided day tour', 'Not sure yet: please help me choose'];

function validate(f: Fields): Errors {
  const errors: Errors = {};
  if (!f.name.trim()) errors.name = 'Please enter your name.';
  if (!f.message.trim()) errors.message = 'Please write a short message so we know how to help.';
  const size = f.groupSize.trim();
  if (size && !/^[1-9]\d{0,2}$/.test(size)) errors.groupSize = 'Group size must be a whole number, 1 or more.';
  return errors;
}

function composeMessage(f: Fields): string {
  const details = LABELS.filter(([key]) => key !== 'message' && f[key].trim() !== '').map(
    ([key, label]) => `${label}: ${f[key].trim()}`,
  );
  return [
    'Hello Wildora, I would like to enquire about a trip.',
    '',
    ...details,
    '',
    'Message:',
    f.message.trim(),
    '',
    '(Sent from the enquiry form on the Wildora website)',
  ].join('\n');
}

export default function ContactForm({ trips }: { trips: TripOption[] }) {
  const uid = useId();
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [attempted, setAttempted] = useState(false);
  const [sent, setSent] = useState(false);

  const id = (name: FieldName) => `${uid}-${name}`;
  const errorCount = Object.keys(errors).length;

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const next = { ...fields, [e.target.name as FieldName]: e.target.value };
    setFields(next);
    if (attempted) setErrors(validate(next));
  };

  /** Validates; on failure focuses the first invalid field and returns false. */
  const check = (): boolean => {
    const found = validate(fields);
    setErrors(found);
    setAttempted(true);
    const first = LABELS.map(([key]) => key).find((key) => found[key]);
    if (first) {
      setSent(false);
      document.getElementById(id(first))?.focus();
      return false;
    }
    return true;
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!check()) return;
    window.open(waLink(composeMessage(fields)), '_blank', 'noopener,noreferrer');
    setSent(true);
  };

  const onEmail = () => {
    if (!check()) return;
    window.location.href = mailtoLink(`Trip enquiry from ${fields.name.trim()}`, composeMessage(fields));
  };

  /** Shared props for a text control: id, name, value, and the accessible error wiring. */
  const control = (name: FieldName, hint = false) => {
    const describedBy = [hint && `${id(name)}-hint`, errors[name] && `${id(name)}-error`].filter(Boolean).join(' ');
    return {
      id: id(name),
      name,
      value: fields[name],
      onChange,
      className: 'wd-input',
      'aria-invalid': errors[name] ? true : undefined,
      'aria-describedby': describedBy || undefined,
    };
  };

  const field = (name: FieldName, label: string, input: ReactNode, opts: { required?: boolean; hint?: ReactNode; wide?: boolean } = {}) => (
    <div className={opts.wide ? 'sm:col-span-2' : undefined}>
      <label htmlFor={id(name)} className="wd-label">
        {label}
        {opts.required ? (
          // The control itself carries aria-required, so the asterisk is visual only.
          <> <span aria-hidden="true" className="text-wd-sun">*</span></>
        ) : (
          <span className="font-normal text-wd-faint"> (optional)</span>
        )}
      </label>
      {input}
      {opts.hint && (
        <p id={`${id(name)}-hint`} className="mt-1.5 text-xs leading-relaxed text-wd-faint">{opts.hint}</p>
      )}
      {errors[name] && (
        <p id={`${id(name)}-error`} className="mt-1.5 text-sm font-medium text-[#ff9a85]">{errors[name]}</p>
      )}
    </div>
  );

  return (
    <form onSubmit={onSubmit} noValidate aria-describedby={`${uid}-intro`} data-no-float>
      <p id={`${uid}-intro`} className="text-sm text-wd-muted">
        Fields marked <span className="text-wd-sun">*</span> are required. Fill in as much or as little of the rest as
        you like.
      </p>

      {attempted && errorCount > 0 && (
        <div role="alert" className="mt-5 rounded-xl border border-[rgba(226,85,59,0.45)] bg-[rgba(226,85,59,0.12)] px-4 py-3 text-sm text-[#ffc2b5]">
          Please check {errorCount === 1 ? 'the field' : `the ${errorCount} fields`} marked below.
        </div>
      )}

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        {field('name', 'Your name', <input type="text" autoComplete="name" maxLength={100} required aria-required="true" {...control('name')} />, { required: true })}
        {field('country', 'Country you live in', <input type="text" autoComplete="country-name" maxLength={80} {...control('country')} />)}

        {field(
          'trip',
          'Trip of interest',
          <select {...control('trip')}>
            <option value="">Choose a trip</option>
            <optgroup label="Our trips">
              {trips.map((t) => (
                <option key={t.id} value={t.title}>{t.title}</option>
              ))}
            </optgroup>
            <optgroup label="Something else">
              {EXTRA_TRIP_OPTIONS.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </optgroup>
          </select>,
          { wide: true },
        )}

        {field('dates', 'Preferred month or dates', <input type="text" maxLength={120} placeholder="e.g. December 2026, or flexible" {...control('dates')} />)}
        {field(
          'groupSize',
          'Group size',
          <input type="number" inputMode="numeric" min={1} step={1} {...control('groupSize', true)} />,
          { hint: 'Number of people, including you.' },
        )}

        {field('childAges', 'Ages of any children', <input type="text" maxLength={80} placeholder="e.g. 9 and 13" {...control('childAges')} />)}
        {field('diet', 'Dietary needs', <input type="text" maxLength={200} placeholder="e.g. vegan, no spicy food, nut allergy" {...control('diet')} />)}

        {field(
          'medical',
          'Medical or mobility notes',
          <textarea rows={3} maxLength={600} {...control('medical', true)} />,
          {
            wide: true,
            hint: (
              <>
                We need to know about any medical condition, allergy or mobility limitation before you book. See{' '}
                <Link href="/practical/#health" className="underline underline-offset-2 hover:text-white">health &amp; insurance</Link>.
              </>
            ),
          },
        )}

        {field(
          'message',
          'Your message',
          <textarea
            rows={6}
            maxLength={1500}
            required
            aria-required="true"
            placeholder="What would you like to see or do? Your pace, comfort level, wish-list species, any questions…"
            {...control('message')}
          />,
          { required: true, wide: true },
        )}
      </div>

      <p className="mt-6 text-sm leading-relaxed text-wd-muted">
        By sending, you agree that Wildora Expeditions may contact you on WhatsApp about this enquiry. This website does
        not store anything you type: the form only writes the message, and you choose whether to send it from your own
        WhatsApp.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button type="submit" className="btn btn-wa btn-lg">
          <WhatsAppIcon /> Send on WhatsApp
        </button>
        {hasEmail && (
          <button type="button" onClick={onEmail} className="btn btn-ghost btn-lg">
            Send by email instead
          </button>
        )}
        <span className="text-xs text-wd-faint">Opens WhatsApp in a new tab, to {SITE.whatsapp.display}.</span>
      </div>

      <div role="status" aria-live="polite" className="mt-6">
        {sent && (
          <div className="rounded-xl border border-[rgba(37,211,102,0.4)] bg-[rgba(37,211,102,0.1)] px-4 py-3 text-sm leading-relaxed text-wd-ink">
            WhatsApp should now be open in a new tab with your message filled in. Press send there to reach us.
            {' '}Nothing opened?{' '}
            <a
              href={waLink(composeMessage(fields))}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-wd-lime underline underline-offset-2"
            >
              Open WhatsApp with my message
            </a>
          </div>
        )}
      </div>
    </form>
  );
}
