import { Info } from "lucide-react";

export function BottleStylesBanner({ image }) {
  return (
    <div className="mx-auto max-w-[1440px] px-6 pb-10 md:px-14">
      <div className="mx-auto max-w-md overflow-hidden rounded-md border border-amber-200 sm:max-w-lg md:max-w-xl">
        <img src={image} alt="Available bottle styles" className="block h-auto w-full" />
      </div>
      <div className="mt-3 flex items-center justify-center gap-2 text-center">
        <Info className="h-4 w-4 flex-shrink-0 text-amber-700" />
        <p className="text-sm text-neutral-600">
          Available in multiple bottle colors — your order may arrive in any one of the
          styles shown above. Fragrance and quantity remain exactly the same.
        </p>
      </div>
    </div>
  );
}