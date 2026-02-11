

// import React, { useEffect, useRef, useState } from "react";
// import Treks from "../Treks";

// export default function TrekkingDropdown({ isOpen, onNavigate }) {
//   const dropdownRef = useRef(null);
//   const [position, setPosition] = useState({ left: "50%", transform: "translateX(-50%)" });

//   // Constant right shift value (0.5cm ≈ 20px)
//   const RIGHT_SHIFT = 40;

//   useEffect(() => {
//     if (!isOpen || !dropdownRef.current) return;

//     const calculatePosition = () => {
//       const dropdown = dropdownRef.current;
//       const viewportWidth = window.innerWidth;

//       // Adjust dropdown width to account for the shift
//       const dropdownWidth = Math.min(1120, viewportWidth - 32 - RIGHT_SHIFT);

//       // Get the trigger button position
//       const trigger = dropdown.parentElement?.querySelector('button');
//       if (!trigger) return;

//       const triggerRect = trigger.getBoundingClientRect();
//       const triggerCenter = triggerRect.left + triggerRect.width / 2;

//       // Calculate ideal centered position with right shift applied
//       let leftPosition = triggerCenter - dropdownWidth / 2 + RIGHT_SHIFT;

//       // Check if dropdown would overflow left
//       if (leftPosition < 16) {
//         // Align to left edge with padding and right shift
//         setPosition({
//           left: "0",
//           transform: "translateX(0)",
//           marginLeft: `${16 + RIGHT_SHIFT}px`
//         });
//         return;
//       }

//       // Check if dropdown would overflow right
//       if (leftPosition + dropdownWidth > viewportWidth - 16) {
//         // Align to right edge with padding (no additional shift needed here)
//         setPosition({
//           left: "auto",
//           right: "0",
//           transform: "translateX(0)",
//           marginRight: "16px"
//         });
//         return;
//       }

//       // Center position with right shift applied
//       setPosition({
//         left: "50%",
//         transform: `translateX(calc(-50% + ${RIGHT_SHIFT}px))`
//       });
//     };

//     // Calculate on open and on resize
//     calculatePosition();
//     window.addEventListener("resize", calculatePosition);

//     // Small delay to ensure DOM is ready
//     const timer = setTimeout(calculatePosition, 50);

//     return () => {
//       window.removeEventListener("resize", calculatePosition);
//       clearTimeout(timer);
//     };
//   }, [isOpen]);

//   return (
//     <div
//       ref={dropdownRef}
//       className={`
//         absolute 
//         bg-white 
//         shadow-2xl 
//         border 
//         border-gray-200 
//         rounded-xl 
//         z-[100] 
//         transition-all 
//         duration-300 
//         ease-in-out 
//         ${isOpen 
//           ? "opacity-100 visible translate-y-0" 
//           : "opacity-0 invisible -translate-y-2"
//         }
//       `}
//       style={{
//         ...position,
//         width: `min(1120px, calc(100vw - 2rem - ${RIGHT_SHIFT}px))`,
//         maxHeight: "calc(80vh - 2rem)",
//         marginTop: "0.5rem",
//         pointerEvents: isOpen ? "auto" : "none",
//       }}
//     >
//       <div
//         className="px-4 py-4 sm:px-6 sm:py-5 md:px-8 md:py-6 overflow-y-auto overflow-x-hidden"
//         style={{
//           maxHeight: "calc(80vh - 2.5rem)",
//         }}
//       >
//         <Treks variant="grid" onNavigate={onNavigate} />
//       </div>

//       {/* Scrollbar Styles */}
//       <style dangerouslySetInnerHTML={{
//         __html: `
//           .overflow-y-auto::-webkit-scrollbar {
//             width: 6px;
//           }

//           .overflow-y-auto::-webkit-scrollbar-track {
//             background: #f7fafc;
//             border-radius: 10px;
//           }

//           .overflow-y-auto::-webkit-scrollbar-thumb {
//             background: #cbd5e0;
//             border-radius: 10px;
//           }

//           .overflow-y-auto::-webkit-scrollbar-thumb:hover {
//             background: #a0aec0;
//           }

//           @media (max-width: 640px) {
//             .overflow-y-auto::-webkit-scrollbar {
//               width: 4px;
//             }
//           }
//         `
//       }} />
//     </div>
//   );
// }



import React, { useEffect, useRef, useState } from "react";
import Treks from "../Treks";

export default function TrekkingDropdown({ isOpen, onNavigate }) {
  const dropdownRef = useRef(null);
  const [position, setPosition] = useState({ left: "0", transform: "none" });

  useEffect(() => {
    if (!isOpen || !dropdownRef.current) return;

    const calculatePosition = () => {
      const dropdown = dropdownRef.current;
      const parent = dropdown.parentElement;
      if (!parent) return;

      const viewportWidth = window.innerWidth;
      const parentRect = parent.getBoundingClientRect();
      const trigger = parent.querySelector('button');
      if (!trigger) return;

      const triggerRect = trigger.getBoundingClientRect();

      // Calculate dropdown width based on viewport
      const dropdownWidth = Math.min(1080, viewportWidth - 32);

      // Calculate the trigger's center relative to the viewport
      const triggerCenter = triggerRect.left + triggerRect.width / 2;

      // Calculate the ideal left position relative to the parent
      let leftVal = (triggerCenter - parentRect.left) - (dropdownWidth / 2);

      // Constraints: Ensure the dropdown stays within the viewport padding (16px)
      const minAllowedLeft = 16 - parentRect.left;
      const maxAllowedLeft = (viewportWidth - 16) - parentRect.left - dropdownWidth;

      // Clamp the left value
      if (leftVal < minAllowedLeft) leftVal = minAllowedLeft;
      if (leftVal > maxAllowedLeft) leftVal = maxAllowedLeft;

      setPosition({
        left: `${leftVal}px`,
        transform: "none"
      });
    };

    // Calculate on open and on resize
    calculatePosition();
    window.addEventListener("resize", calculatePosition);

    // Small delay to ensure DOM is ready and transitions are starting
    const timer = setTimeout(calculatePosition, 0);

    return () => {
      window.removeEventListener("resize", calculatePosition);
      clearTimeout(timer);
    };
  }, [isOpen]);

  return (
    <div
      ref={dropdownRef}
      className={`
        absolute 
        bg-white 
        shadow-2xl 
        border 
        border-gray-200 
        rounded-xl 
        z-[100] 
        transition-all 
        duration-300 
        ease-in-out 
        ${isOpen
          ? "opacity-100 visible translate-y-0"
          : "opacity-0 invisible -translate-y-2"
        }
      `}
      style={{
        ...position,
        width: "min(1080px, calc(100vw - 32px))",

        maxHeight: "calc(80vh - 2rem)",
        marginTop: "0.5rem",
        pointerEvents: isOpen ? "auto" : "none",
      }}
    >
      <div
        className="px-4 py-4 sm:px-6 sm:py-5 md:px-8 md:py-6 overflow-y-auto overflow-x-hidden"
        style={{
          maxHeight: "calc(80vh - 2.5rem)",
        }}
      >
        <Treks variant="grid" onNavigate={onNavigate} />
      </div>

      {/* Scrollbar Styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .overflow-y-auto::-webkit-scrollbar {
            width: 6px;
          }
          
          .overflow-y-auto::-webkit-scrollbar-track {
            background: #f7fafc;
            border-radius: 10px;
          }
          
          .overflow-y-auto::-webkit-scrollbar-thumb {
            background: #cbd5e0;
            border-radius: 10px;
          }
          
          .overflow-y-auto::-webkit-scrollbar-thumb:hover {
            background: #a0aec0;
          }
          
          @media (max-width: 640px) {
            .overflow-y-auto::-webkit-scrollbar {
              width: 4px;
            }
          }
        `
      }} />
    </div>
  );
}