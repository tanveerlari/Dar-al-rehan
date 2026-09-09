
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { products } from "../data";

export function ProductsSection() {
  const navigate = useNavigate();
  const [activeButton, setActiveButton] = useState(null);

  const handleClick = (e, item) => {
    e.preventDefault();

    // Prevent multiple clicks
    if (activeButton !== null) return;

    setActiveButton(item.id);

    // Let the fill animation complete
    setTimeout(() => {
      navigate(item.link);
    }, 350);
  };

  return (
    <div className="w-full">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-5 px-6 py-8 md:flex-row md:px-14">
        {products.map((item) => {
          const isActive = activeButton === item.id;

          return (
            <div
              key={item.id}
              className="flex flex-1 flex-col items-center justify-between gap-6 rounded-md border border-amber-600/60 bg-amber-50/30 p-8 md:flex-row"
            >
              <div className="text-center md:text-left">
                <h2 className="font-serif text-3xl tracking-wide text-neutral-800">
                  {item.title}
                </h2>

                <div className="mx-auto my-3 h-0.5 w-10 bg-amber-700 md:mx-0"></div>

                <p className="text-sm text-neutral-600">
                  {item.tagline}
                </p>

                <p className="mt-2 max-w-xs text-sm text-neutral-500">
                  {item.description}
                </p>

                <button
                  type="button"
                  disabled={isActive}
                  onClick={(e) => handleClick(e, item)}
                  className={`
                    group relative mt-6 inline-flex
                    items-center gap-3
                    overflow-hidden
                    rounded-full
                    border border-amber-700
                    px-8 py-3.5
                    text-xs font-medium tracking-wide
                    text-amber-700

                    transition-all duration-300
                    hover:scale-[1.02]
                    hover:shadow-[0_4px_18px_-4px_rgba(180,131,20,0.5)]

                    active:scale-95

                    ${isActive ? "cursor-default" : "cursor-pointer"}
                  `}
                >
                  {/* Background fill */}
                  <span
                    className={`
                      absolute inset-0
                      origin-left
                      bg-amber-700

                      transition-transform
                      duration-[350ms]
                      ease-in-out

                      ${
                        isActive
                          ? "translate-x-0"
                          : "-translate-x-full group-hover:translate-x-0"
                      }
                    `}
                  ></span>

                  {/* Button text */}
                  <span
                    className={`
                      relative z-10
                      transition-colors duration-200

                      ${
                        isActive
                          ? "text-white"
                          : "group-hover:text-white"
                      }
                    `}
                  >
                    {item.buttonText}
                  </span>

                  {/* Arrow */}
                  <ArrowRight
                    className={`
                      relative z-10
                      h-3.5 w-3.5

                      transition-all duration-300

                      ${
                        isActive
                          ? "translate-x-1 text-white"
                          : "group-hover:translate-x-1 group-hover:text-white"
                      }
                    `}
                  />
                </button>
              </div>

              <div>
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-auto max-w-[180px]"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

