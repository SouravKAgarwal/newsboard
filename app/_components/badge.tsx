export default function Badge({
  children = "New",
  className = "",
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-sm font-semibold shadow-sm transition-transform duration-300 cursor-pointer ${className}`}
      style={{
        border: "2px solid transparent",
        background:
          "linear-gradient(#ffffff,#ffffff) padding-box, linear-gradient(90deg, red, green, blue, yellow) border-box",
        backgroundSize: "200% 100%",
        transition: "transform .3s ease, background-position .6s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundPosition = "100% 0";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundPosition = "0 0";
      }}
    >
      {children}
    </span>
  );
}
