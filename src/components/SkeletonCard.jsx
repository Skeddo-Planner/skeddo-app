import { C } from "../constants/brand";

/* ─── Shimmer animation via inline keyframes ─── */
const shimmerKeyframes = `
@keyframes skeddo-shimmer {
  0% { background-position: -200px 0; }
  100% { background-position: 200px 0; }
}`;

const shimmerBg = {
  background: `linear-gradient(90deg, ${C.border}00 0%, ${C.border} 50%, ${C.border}00 100%)`,
  backgroundSize: "200px 100%",
  animation: "skeddo-shimmer 1.4s ease-in-out infinite",
  borderRadius: 6,
};

function ShimmerBlock({ width = "100%", height = 14, style = {} }) {
  return (
    <div
      style={{
        ...shimmerBg,
        width,
        height,
        ...style,
      }}
    />
  );
}

/** A skeleton placeholder that mimics a program card while data loads */
export default function SkeletonCard() {
  return (
    <>
      {/* Inject keyframes once */}
      <style>{shimmerKeyframes}</style>
      <div
        style={{
          background: C.white,
          borderRadius: 14,
          padding: "14px 16px",
          marginBottom: 10,
          border: `1px solid ${C.border}`,
        }}
      >
        {/* Category badge */}
        <ShimmerBlock width={70} height={10} style={{ marginBottom: 8 }} />
        {/* Title */}
        <ShimmerBlock width="80%" height={16} style={{ marginBottom: 6 }} />
        {/* Provider */}
        <ShimmerBlock width="50%" height={12} style={{ marginBottom: 12 }} />
        {/* Meta row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: 10,
            borderTop: `1px solid ${C.border}`,
          }}
        >
          <ShimmerBlock width={80} height={12} />
          <ShimmerBlock width={50} height={12} />
        </div>
      </div>
    </>
  );
}

/** Render multiple skeleton cards at once */
export function SkeletonList({ count = 6 }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <SkeletonCard key={i} />
      ))}
    </>
  );
}
