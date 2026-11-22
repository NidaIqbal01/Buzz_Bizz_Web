
type BeeLogoProps = {
  size?: number;
  showText?: boolean;
  light?: boolean;
};

export default function BeeLogo({
  size = 42,
  showText = true,
  light = false,
}: BeeLogoProps) {
  const textColor = light ? "#FFFFFF" : "#38372e";

  return (
    <div className="bee-logo">
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Buzz Bizz bee logo"
        role="img"
      >
        {/* Wings */}
        <ellipse
          cx="35"
          cy="29"
          rx="17"
          ry="12"
          transform="rotate(-32 35 29)"
          fill="#F2D8D1"
          stroke="#B77F83"
          strokeWidth="3"
        />
        <ellipse
          cx="65"
          cy="29"
          rx="17"
          ry="12"
          transform="rotate(32 65 29)"
          fill="#DDE8CF"
          stroke="#9E9C81"
          strokeWidth="3"
        />

        {/* Bee body */}
        <ellipse
          cx="50"
          cy="55"
          rx="29"
          ry="23"
          fill="#F5E9AC"
          stroke="#766C49"
          strokeWidth="3"
        />

        {/* Body stripes */}
        <path
          d="M34 37 Q44 55 34 73"
          stroke="#766C49"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <path
          d="M51 33 Q62 55 51 77"
          stroke="#766C49"
          strokeWidth="7"
          strokeLinecap="round"
        />

        {/* Head */}
        <circle
          cx="76"
          cy="49"
          r="13"
          fill="#F5E9AC"
          stroke="#766C49"
          strokeWidth="3"
        />

        {/* Eyes */}
        <circle cx="80" cy="46" r="2.5" fill="#38372e" />

        {/* Smile */}
        <path
          d="M79 54 Q84 58 87 53"
          stroke="#766C49"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Antennae */}
        <path
          d="M72 37 Q65 25 59 26 M82 37 Q87 25 93 27"
          stroke="#766C49"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Stinger */}
        <path
          d="M21 55 L10 60 L22 65"
          fill="#B77F83"
          stroke="#766C49"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Tiny shine */}
        <circle cx="29" cy="49" r="3" fill="white" opacity=".8" />
      </svg>

      {showText && (
        <div className="bee-logo-text">
          <strong style={{ color: textColor }}>Buzz Bizz</strong>
          <small>Your Business, Simplified.</small>
        </div>
      )}
    </div>
  );
}
