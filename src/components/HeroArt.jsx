// Original SVG illustrations used by the hero slider.
export function HeadphonesArt() {
  return (
    <svg viewBox="0 0 400 400" className="art" role="img" aria-label="Headphones illustration">
      <defs>
        <linearGradient id="hpA" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ffffff" /><stop offset="1" stopColor="#c7d2fe" /></linearGradient>
        <linearGradient id="hpB" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6366f1" /><stop offset="1" stopColor="#4338ca" /></linearGradient>
      </defs>
      <circle cx="200" cy="200" r="178" fill="#fff" fillOpacity=".1" />
      <circle cx="200" cy="200" r="128" fill="#fff" fillOpacity=".12" />
      <path d="M97 228 V196 a103 103 0 0 1 206 0 V228" fill="none" stroke="url(#hpA)" strokeWidth="24" strokeLinecap="round" />
      <path d="M97 228 V196 a103 103 0 0 1 206 0 V228" fill="none" stroke="#4338ca" strokeOpacity=".25" strokeWidth="6" strokeLinecap="round" strokeDasharray="2 14" />
      <rect x="60" y="212" width="74" height="124" rx="32" fill="url(#hpA)" />
      <rect x="266" y="212" width="74" height="124" rx="32" fill="url(#hpA)" />
      <rect x="76" y="236" width="36" height="80" rx="18" fill="url(#hpB)" />
      <rect x="288" y="236" width="36" height="80" rx="18" fill="url(#hpB)" />
      <circle cx="94" cy="276" r="7" fill="#fff" fillOpacity=".85" />
      <circle cx="306" cy="276" r="7" fill="#fff" fillOpacity=".85" />
      <g fill="none" stroke="#fff" strokeLinecap="round" strokeWidth="6" opacity=".85">
        <path d="M22 262 q-14 14 0 28" /><path d="M8 250 q-26 26 0 52" opacity=".6" />
        <path d="M378 262 q14 14 0 28" /><path d="M392 250 q26 26 0 52" opacity=".6" />
      </g>
      <g fill="#fff"><circle cx="70" cy="90" r="5" opacity=".8" /><circle cx="338" cy="70" r="7" opacity=".6" /><circle cx="200" cy="40" r="4" opacity=".7" /></g>
    </svg>
  )
}

export function SneakerArt() {
  return (
    <svg viewBox="0 0 400 400" className="art" role="img" aria-label="Sneaker illustration">
      <defs>
        <linearGradient id="snA" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ffffff" /><stop offset="1" stopColor="#fed7aa" /></linearGradient>
        <linearGradient id="snB" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#f97316" /><stop offset="1" stopColor="#e11d48" /></linearGradient>
      </defs>
      <circle cx="200" cy="205" r="178" fill="#fff" fillOpacity=".1" />
      <circle cx="200" cy="205" r="124" fill="#fff" fillOpacity=".12" />
      <g transform="translate(0 -6)">
        <path d="M58 292 L64 172 Q68 150 95 148 L150 140 Q176 202 236 222 Q336 238 354 292 Z" fill="url(#snA)" />
        <path d="M64 172 Q68 150 95 148 L150 140 L142 176 Q110 186 66 190 Z" fill="#fb923c" fillOpacity=".35" />
        <path d="M86 292 Q96 238 150 226 Q196 228 232 250 Q282 262 320 292 Z" fill="url(#snB)" fillOpacity=".92" />
        <g stroke="#f97316" strokeWidth="7" strokeLinecap="round"><path d="M164 176 L196 152" /><path d="M190 197 L222 173" /><path d="M214 212 L246 189" /></g>
        <path d="M50 292 H358 Q366 292 366 300 V314 Q366 330 350 330 H68 Q50 330 50 312 Z" fill="#ffffff" />
        <path d="M60 314 H356" stroke="#fdba74" strokeWidth="5" strokeLinecap="round" />
      </g>
      <g fill="#fff"><circle cx="78" cy="96" r="6" opacity=".8" /><circle cx="330" cy="82" r="8" opacity=".55" /><circle cx="212" cy="46" r="4" opacity=".75" /></g>
      <g stroke="#fff" strokeLinecap="round" strokeWidth="6" opacity=".6"><path d="M20 340 h40" /><path d="M340 350 h40" /></g>
    </svg>
  )
}

export function LampArt() {
  return (
    <svg viewBox="0 0 400 400" className="art" role="img" aria-label="Lamp illustration">
      <defs>
        <linearGradient id="lpA" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ffffff" /><stop offset="1" stopColor="#99f6e4" /></linearGradient>
        <linearGradient id="lpGlow" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fef08a" stopOpacity=".75" /><stop offset="1" stopColor="#fef08a" stopOpacity="0" /></linearGradient>
      </defs>
      <circle cx="200" cy="205" r="178" fill="#fff" fillOpacity=".1" />
      <path d="M128 176 L272 176 L338 352 H62 Z" fill="url(#lpGlow)" />
      <ellipse cx="200" cy="352" rx="92" ry="14" fill="#fff" fillOpacity=".9" />
      <ellipse cx="200" cy="348" rx="64" ry="9" fill="#14b8a6" fillOpacity=".5" />
      <rect x="194" y="176" width="12" height="170" rx="6" fill="url(#lpA)" />
      <path d="M168 84 H232 L282 178 H118 Z" fill="url(#lpA)" />
      <path d="M168 84 H232 L240 100 H160 Z" fill="#14b8a6" fillOpacity=".35" />
      <ellipse cx="200" cy="178" rx="82" ry="9" fill="#fef08a" />
      <g transform="translate(300 296)"><rect x="-20" y="0" width="40" height="52" rx="12" fill="#fff" fillOpacity=".92" /><path d="M0 0 C-4 -34 -22 -44 -34 -56 M0 0 C4 -40 20 -48 36 -60 M0 0 C0 -32 -4 -50 4 -70" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" /></g>
      <g fill="#fff"><circle cx="74" cy="100" r="6" opacity=".8" /><circle cx="334" cy="92" r="5" opacity=".6" /><circle cx="214" cy="44" r="4" opacity=".75" /></g>
    </svg>
  )
}
