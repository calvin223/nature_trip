import { useTranslations } from 'next-intl';
import type { SpeciesFacts } from '@/lib/speciesFacts';

/* The text panel under a full-screen photo: Latin name, a line from the naturalist's
   notebook, then the facts. Used as the lightbox slide description. */
export default function SpeciesCaption({ facts, seenOn }: { facts?: SpeciesFacts; seenOn?: string }) {
  const t = useTranslations('common.facts');
  if (!facts) return seenOn ? <p className="wd-lb__about">{seenOn}</p> : null;
  const rows = (
    [
      [t('size'), facts.size],
      [t('status'), facts.status],
      [t('range'), facts.range],
      [t('endemicTo'), facts.endemicTo],
      [t('habitat'), facts.feature],
      [t('whereWeLook'), seenOn],
    ] as [string, string | null | undefined][]
  ).filter((r): r is [string, string] => Boolean(r[1]));

  return (
    <div className="wd-lb">
      {facts.latin && <p className="wd-lb__latin">{facts.latin}</p>}
      <p className="wd-lb__about">{facts.about}</p>
      {rows.length > 0 && (
        <dl className="wd-lb__facts">
          {rows.map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}

/* Lightbox captions toggle, pinned to the lower right of the screen (.wd-lb-toggle) instead of
   the top toolbar. A render function for yet-another-react-lightbox's render.buttonCaptions. */
export function captionsToggle(props: CaptionsState) {
  return <CaptionsToggle {...props} />;
}

interface CaptionsState {
  visible: boolean;
  show: () => void;
  hide: () => void;
}

function CaptionsToggle({ visible, show, hide }: CaptionsState) {
  const t = useTranslations('common.lightbox');
  return (
    <button type="button" className="wd-lb-toggle" onClick={visible ? hide : show}>
      {visible ? t('hideCaptions') : t('showCaptions')}
    </button>
  );
}
