'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useId, useState, useSyncExternalStore, type ChangeEvent, type FormEvent, type ReactNode } from 'react';
import { WhatsAppIcon } from '@/components/FloatingCTA';
import { SITE, hasEmail, hasForm, mailtoLink, waLink } from '@/lib/site';

/* Enquiry form. This (static) site stores nothing. Three ways to send, each offered only
   when configured: a form service (SITE.formEndpoint; needs explicit consent because the
   form can carry health notes), email (SITE.email), and WhatsApp, which writes the message
   and opens it in a new tab for the guest to send. With no form service, WhatsApp is the
   main button. */

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
type Translator = ReturnType<typeof useTranslations<'contact'>>;

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

/** The query string never changes without a navigation, so there is nothing to subscribe to. */
const noSubscribe = () => () => {};

/** Order used for the message and for focusing the first invalid field. */
const ORDER = Object.keys(EMPTY) as FieldName[];

function validate(f: Fields, t: Translator): Errors {
  const errors: Errors = {};
  if (!f.name.trim()) errors.name = t('form.errors.name');
  if (!f.message.trim()) errors.message = t('form.errors.message');
  const size = f.groupSize.trim();
  if (size && !/^[1-9]\d{0,2}$/.test(size)) errors.groupSize = t('form.errors.groupSize');
  return errors;
}

/* Written in the visitor's language (contact.message), like the answers themselves. */
function composeMessage(f: Fields, t: Translator): string {
  const details = ORDER.filter((key): key is Exclude<FieldName, 'message'> => key !== 'message' && f[key].trim() !== '').map(
    (key) => t('message.line', { label: t(`message.labels.${key}`), value: f[key].trim() }),
  );
  return [
    t('message.greeting'),
    '',
    ...details,
    '',
    t('message.messageHeading'),
    f.message.trim(),
    '',
    t('message.footer'),
  ].join('\n');
}

export default function ContactForm({ trips }: { trips: TripOption[] }) {
  const t = useTranslations('contact');
  const uid = useId();
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [attempted, setAttempted] = useState(false);
  const [sent, setSent] = useState(false);
  const [consent, setConsent] = useState(false);
  const [consentError, setConsentError] = useState(false);
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle');

  /* Arriving from a trip page's date (/contact/?trip=<id>&date=<dates>): start with them filled in.
     The query string is browser-only (the static page is built without one), so it is read as an
     external value ('' while prerendering) and copied into the fields once, during render. */
  const search = useSyncExternalStore(noSubscribe, () => window.location.search, () => '');
  const [prefilledFrom, setPrefilledFrom] = useState('');
  if (search !== prefilledFrom) {
    setPrefilledFrom(search);
    const q = new URLSearchParams(search);
    const trip = trips.find((tr) => tr.id === q.get('trip'))?.title;
    const dates = q.get('date')?.slice(0, 120);
    if (trip || dates) setFields((f) => ({ ...f, ...(trip && { trip }), ...(dates && { dates }) }));
  }

  const id = (name: FieldName) => `${uid}-${name}`;
  const errorCount = Object.keys(errors).length;

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const next = { ...fields, [e.target.name as FieldName]: e.target.value };
    setFields(next);
    if (attempted) setErrors(validate(next, t));
  };

  /** Validates; on failure focuses the first invalid field and returns false. */
  const check = (needConsent = false): boolean => {
    const found = validate(fields, t);
    setErrors(found);
    setAttempted(true);
    const first = ORDER.find((key) => found[key]);
    if (first) {
      setSent(false);
      document.getElementById(id(first))?.focus();
      return false;
    }
    if (needConsent && !consent) {
      setConsentError(true);
      document.getElementById(`${uid}-consent`)?.focus();
      return false;
    }
    return true;
  };

  const openWhatsApp = () => {
    if (!check()) return;
    window.open(waLink(composeMessage(fields, t)), '_blank', 'noopener,noreferrer');
    setSent(true);
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!hasForm) return openWhatsApp();
    if (!check(true)) return;
    const honeypot = new FormData(e.currentTarget).get('_gotcha') ?? '';
    setStatus('sending');
    try {
      const res = await fetch(SITE.formEndpoint as string, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...fields, _subject: t('message.subject', { name: fields.name.trim() }), _gotcha: honeypot }),
      });
      if (res.ok) {
        setStatus('ok');
        setFields(EMPTY);
        setErrors({});
        setAttempted(false);
        setConsent(false);
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  const onEmail = () => {
    if (!check()) return;
    window.location.href = mailtoLink(t('message.subject', { name: fields.name.trim() }), composeMessage(fields, t));
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

  const field = (name: FieldName, input: ReactNode, opts: { required?: boolean; hint?: ReactNode; wide?: boolean } = {}) => (
    <div className={opts.wide ? 'sm:col-span-2' : undefined}>
      <label htmlFor={id(name)} className="wd-label">
        {t(`form.fields.${name}`)}
        {opts.required ? (
          // The control itself carries aria-required, so the asterisk is visual only.
          <> <span aria-hidden="true" className="text-wd-sun">*</span></>
        ) : (
          <span className="font-normal text-wd-faint"> {t('form.optional')}</span>
        )}
      </label>
      {input}
      {opts.hint && (
        <p id={`${id(name)}-hint`} className="mt-1.5 text-xs leading-relaxed text-wd-faint">{opts.hint}</p>
      )}
      {errors[name] && (
        <p id={`${id(name)}-error`} className="wd-appear mt-1.5 text-sm font-medium text-wd-trogon">{errors[name]}</p>
      )}
    </div>
  );

  const privacyLink = (chunks: ReactNode) => (
    <Link href="/privacy/" className="underline underline-offset-2 hover:text-wd-ink">{chunks}</Link>
  );

  return (
    <form onSubmit={onSubmit} noValidate aria-describedby={`${uid}-intro`}>
      <p id={`${uid}-intro`} className="text-sm text-wd-muted">
        {t.rich('form.intro', { star: (chunks) => <span className="text-wd-sun">{chunks}</span> })}
      </p>

      {attempted && errorCount > 0 && (
        <div role="alert" className="wd-appear mt-5 rounded-xl border border-[rgba(226,85,59,0.45)] bg-[rgba(226,85,59,0.12)] px-4 py-3 text-sm text-[#7c2a1a]">
          {t('form.errorSummary', { count: errorCount })}
        </div>
      )}

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        {field('name', <input type="text" autoComplete="name" maxLength={100} required aria-required="true" {...control('name')} />, { required: true })}
        {field('country', <input type="text" autoComplete="country-name" maxLength={80} {...control('country')} />)}

        {field(
          'trip',
          <select {...control('trip')}>
            <option value="">{t('form.trip.choose')}</option>
            <optgroup label={t('form.trip.ourTrips')}>
              {trips.map((trip) => (
                <option key={trip.id} value={trip.title}>{trip.title}</option>
              ))}
            </optgroup>
            <optgroup label={t('form.trip.somethingElse')}>
              {(t.raw('form.trip.other') as string[]).map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </optgroup>
          </select>,
          { wide: true },
        )}

        {field('dates', <input type="text" maxLength={120} placeholder={t('form.placeholders.dates')} {...control('dates')} />)}
        {field(
          'groupSize',
          <input type="number" inputMode="numeric" min={1} step={1} {...control('groupSize', true)} />,
          { hint: t('form.hints.groupSize') },
        )}

        {field('childAges', <input type="text" maxLength={80} placeholder={t('form.placeholders.childAges')} {...control('childAges')} />)}
        {field('diet', <input type="text" maxLength={200} placeholder={t('form.placeholders.diet')} {...control('diet')} />)}

        {field(
          'medical',
          <textarea rows={3} maxLength={600} {...control('medical', true)} />,
          {
            wide: true,
            hint: t.rich('form.hints.medical', {
              link: (chunks) => <Link href="/practical/#health" className="underline underline-offset-2 hover:text-wd-ink">{chunks}</Link>,
            }),
          },
        )}

        {field(
          'message',
          <textarea
            rows={6}
            maxLength={1500}
            required
            aria-required="true"
            placeholder={t('form.placeholders.message')}
            {...control('message')}
          />,
          { required: true, wide: true },
        )}
      </div>

      {/* Honeypot: invisible to people, filled in by simple bots. */}
      <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

      {hasForm ? (
        <div className="mt-6">
          <label className="flex items-start gap-3 text-sm leading-relaxed text-wd-muted">
            <input
              type="checkbox"
              id={`${uid}-consent`}
              checked={consent}
              onChange={(e) => {
                setConsent(e.target.checked);
                if (e.target.checked) setConsentError(false);
              }}
              aria-invalid={consentError ? true : undefined}
              aria-describedby={consentError ? `${uid}-consent-error` : undefined}
              className="mt-1 h-4 w-4 flex-none accent-[#f2b134]"
            />
            <span>{t.rich('form.consent', { link: privacyLink })}</span>
          </label>
          {consentError && (
            <p id={`${uid}-consent-error`} className="mt-1.5 text-sm font-medium text-wd-trogon">
              {t('form.errors.consent')}
            </p>
          )}
        </div>
      ) : (
        <p className="mt-6 text-sm leading-relaxed text-wd-muted">
          {t.rich('form.whatsappNotice', { link: privacyLink })}
        </p>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        {hasForm ? (
          <>
            <button type="submit" className="btn btn-primary btn-lg" disabled={status === 'sending'}>
              {status === 'sending' ? t('form.buttons.sending') : t('form.buttons.send')}
            </button>
            <button type="button" onClick={openWhatsApp} className="btn btn-wa btn-lg">
              <WhatsAppIcon /> {t('form.buttons.orWhatsApp')}
            </button>
          </>
        ) : (
          <button type="submit" className="btn btn-wa btn-lg">
            <WhatsAppIcon /> {t('form.buttons.sendWhatsApp')}
          </button>
        )}
        {hasEmail && (
          <button type="button" onClick={onEmail} className="btn btn-ghost btn-lg">
            {t('form.buttons.sendEmail')}
          </button>
        )}
        <span className="text-xs text-wd-faint">
          {t(hasForm ? 'form.opensNote.form' : 'form.opensNote.whatsapp', { number: SITE.whatsapp.display })}
        </span>
      </div>

      <div role="status" aria-live="polite" className="mt-6">
        {status === 'ok' && (
          <div className="wd-appear rounded-xl border border-[rgba(37,211,102,0.4)] bg-[rgba(37,211,102,0.1)] px-4 py-3 text-sm leading-relaxed text-wd-ink">
            {t('form.status.ok')}
          </div>
        )}
        {status === 'error' && (
          <div className="wd-appear rounded-xl border border-[rgba(226,85,59,0.45)] bg-[rgba(226,85,59,0.12)] px-4 py-3 text-sm leading-relaxed text-[#7c2a1a]">
            {t(hasEmail ? 'form.status.errorWithEmail' : 'form.status.error')}
          </div>
        )}
        {sent && (
          <div className="wd-appear rounded-xl border border-[rgba(37,211,102,0.4)] bg-[rgba(37,211,102,0.1)] px-4 py-3 text-sm leading-relaxed text-wd-ink">
            {t.rich('form.status.sent', {
              link: (chunks) => (
                <a
                  href={waLink(composeMessage(fields, t))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-wd-lime underline underline-offset-2"
                >
                  {chunks}
                </a>
              ),
            })}
          </div>
        )}
      </div>
    </form>
  );
}
