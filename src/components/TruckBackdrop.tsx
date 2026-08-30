/**
 * Flat side-view delivery truck, drawn inline so it themes with `currentColor`
 * and needs no image asset. Purely decorative — always aria-hidden. The parent
 * controls size, colour and opacity via utility classes.
 */
export function TruckBackdrop({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 640 300"
      className={className}
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      {/* road */}
      <line
        x1="8"
        y1="256"
        x2="632"
        y2="256"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.5"
      />

      {/* cargo box */}
      <rect
        x="24"
        y="70"
        width="356"
        height="150"
        rx="10"
        stroke="currentColor"
        strokeWidth="7"
      />
      {/* box side panel line + door seams */}
      <line
        x1="24"
        y1="150"
        x2="380"
        y2="150"
        stroke="currentColor"
        strokeWidth="4"
        opacity="0.6"
      />
      <line
        x1="150"
        y1="70"
        x2="150"
        y2="220"
        stroke="currentColor"
        strokeWidth="4"
        opacity="0.5"
      />
      <line
        x1="270"
        y1="70"
        x2="270"
        y2="220"
        stroke="currentColor"
        strokeWidth="4"
        opacity="0.5"
      />

      {/* cab */}
      <path
        d="M380 220V96c0-6 4-10 10-10h74c5 0 9 2 12 6l52 66c2 3 3 6 3 10v42c0 6-4 10-10 10H380Z"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinejoin="round"
      />
      {/* windshield */}
      <path
        d="M462 92l40 52h-58c-6 0-10-4-10-10V96c0-6 4-10 10-10h18Z"
        fill="currentColor"
        opacity="0.18"
      />
      {/* headlight */}
      <rect
        x="626"
        y="196"
        width="6"
        height="20"
        rx="3"
        fill="currentColor"
        opacity="0.7"
      />

      {/* wheels */}
      {[150, 470].map((cx) => (
        <g key={cx}>
          <circle
            cx={cx}
            cy="234"
            r="34"
            stroke="currentColor"
            strokeWidth="8"
          />
          <circle cx={cx} cy="234" r="10" fill="currentColor" opacity="0.7" />
        </g>
      ))}

      {/* wordmark on the box */}
      <text
        x="202"
        y="132"
        textAnchor="middle"
        fontSize="46"
        fontWeight="800"
        letterSpacing="2"
        fill="currentColor"
        opacity="0.8"
        fontFamily="var(--font-geist-sans), system-ui, sans-serif"
      >
        GEPARCO
      </text>
    </svg>
  );
}
