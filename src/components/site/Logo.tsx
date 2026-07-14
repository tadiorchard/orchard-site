import logo from "@/assets/orchard-logo.png";

export function Logo({
  className = "",
  variant = "default",
}: {
  className?: string;
  variant?: "default" | "light";
}) {
  return (
    <div className={`inline-flex items-center ${className}`}>
      <img
        src={logo}
        alt="Orchard — Deeply Rooted In Health"
        className={`h-10 w-auto ${variant === "light" ? "brightness-0 invert" : ""}`}
      />
    </div>
  );
}
