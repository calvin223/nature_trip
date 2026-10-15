/* Wildora mark: a single leaf with its midrib, in the canopy gradient. */
export default function LeafMark({ className, id }: { className: string; id: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#1f7a45" />
          <stop offset="0.55" stopColor="#9ad14b" />
          <stop offset="1" stopColor="#f2b134" />
        </linearGradient>
      </defs>
      <path d="M8 56C8 30 24 10 58 6c-2 30-20 50-50 50z" fill={`url(#${id})`} />
      <path d="M8 56C22 42 36 28 50 14" fill="none" stroke="#07140d" strokeWidth="2.6" strokeLinecap="round" opacity="0.75" />
      <path d="M20 44l-2-10M28 36l-1-11M36 28l1-9M24 40l10 1M32 32l10 0M40 24l8-1" fill="none" stroke="#07140d" strokeWidth="1.6" strokeLinecap="round" opacity="0.45" />
    </svg>
  );
}
