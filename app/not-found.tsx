import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "404 - Page Not Found",
  description: "The page you are looking for does not exist.",
};

export default function NotFound() {
  return (
    <div className="flex items-center justify-center p-4 md:p-8">
      <div className="relative w-full max-w-2xl bg-[#F4F1EA] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <div className="p-8 md:p-16 text-center space-y-8 text-[#1C1C1C]">
          <div className="space-y-2 border-b-2 border-[#1C1C1C] pb-8">
            <h1 className="font-serif text-4xl md:text-6xl font-black tracking-tighter uppercase">
              Page Not Found
            </h1>
          </div>

          <div className="space-y-6 max-w-md mx-auto">
            <p className="font-serif text-lg leading-relaxed">
              The article or page you are looking for seems to have been
              archived, moved, or never existed in our records.
            </p>

            <div className="pt-4">
              <Link
                href="/"
                className="inline-block px-8 py-3 bg-[#1C1C1C] text-[#F4F1EA] font-bold tracking-wide uppercase text-sm hover:bg-gray-800 transition-colors"
              >
                Return to Front Page
              </Link>
            </div>
          </div>
        </div>

        <div
          className="absolute -bottom-3 left-0 w-full h-6 overflow-hidden"
          style={{ filter: "drop-shadow(0px 4px 2px rgba(0,0,0,0.3))" }}
        >
          <svg
            viewBox="0 0 1200 24"
            preserveAspectRatio="none"
            className="w-full h-full text-[#F4F1EA] fill-current transform rotate-180"
            style={{ display: "block" }}
          >
            <path d="M0 0V24H1200V0L1182.95 19.6364L1163.64 2.18182L1146.59 19.6364L1127.27 0L1109.09 19.6364L1090.91 0L1072.73 19.6364L1054.55 2.18182L1036.36 19.6364L1018.18 0L1000 19.6364L981.818 0L963.636 19.6364L945.455 0L927.273 19.6364L909.091 2.18182L890.909 19.6364L872.727 0L854.545 19.6364L836.364 0L818.182 19.6364L800 2.18182L781.818 19.6364L763.636 0L745.455 19.6364L727.273 0L709.091 19.6364L690.909 2.18182L672.727 19.6364L654.545 0L636.364 19.6364L618.182 0L600 19.6364L581.818 0L563.636 19.6364L545.455 2.18182L527.273 19.6364L509.091 0L490.909 19.6364L472.727 0L454.545 19.6364L436.364 2.18182L418.182 19.6364L400 0L381.818 19.6364L363.636 0L345.455 19.6364L327.273 2.18182L309.091 19.6364L290.909 0L272.727 19.6364L254.545 0L236.364 19.6364L218.182 2.18182L200 19.6364L181.818 0L163.636 19.6364L145.455 0L127.273 19.6364L109.091 2.18182L90.9091 19.6364L72.7273 0L54.5455 19.6364L36.3636 0L18.1818 19.6364L0 0Z" />
          </svg>
        </div>
      </div>
    </div>
  );
}
