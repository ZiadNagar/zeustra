import type { ReactElement } from "react";

type TechStackDiagramProps = {
  className?: string;
  opacity?: number;
  showCenterLogo?: boolean;
};

const TechStackDiagram = ({
  className = "",
  opacity = 0.8,
  showCenterLogo = true,
}: TechStackDiagramProps): ReactElement => {
  return (
    <div
      className={`absolute inset-0 pointer-events-none w-full h-full ${className}`}
    >
      <style>{`
        @keyframes heartPumpOut {
          0% {
            stroke-dashoffset: 100%;
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          50% {
            stroke-dashoffset: -50%;
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            stroke-dashoffset: -100%;
            opacity: 0;
          }
        }
        
        @keyframes heartPumpIn {
          0% {
            stroke-dashoffset: -100%;
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          50% {
            stroke-dashoffset: -50%;
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            stroke-dashoffset: 100%;
            opacity: 0;
          }
        }
        
        @keyframes cornerFlow {
          0% {
            stroke-dashoffset: 0%;
            opacity: 1;
          }
          100% {
            stroke-dashoffset: -100%;
            opacity: 1;
          }
        }
        
        /* Responsive stroke widths for better visibility on smaller screens */
        @media (max-width: 1280px) {
          .moving-light-path {
            stroke-width: 4 !important;
            opacity: 1 !important;
          }
        }
        
        @media (max-width: 768px) {
          .moving-light-path {
            stroke-width: 4 !important;
            opacity: 1 !important;
          }
        }
        
        @media (max-width: 480px) {
          .moving-light-path {
            stroke-width: 5 !important;
            opacity: 1 !important;
          }
        }
        
        /* Ensure moving lights are always visible */
        .moving-light-path {
          opacity: 1 !important;
        }
        
        @keyframes tubeGlow {
          0%, 100% {
            filter: drop-shadow(0 0 3px currentColor) drop-shadow(0 0 6px currentColor);
          }
          50% {
            filter: drop-shadow(0 0 4px currentColor) drop-shadow(0 0 8px currentColor);
          }
        }
        
        @keyframes tubeGlowBlue {
          0%, 100% {
            filter: drop-shadow(0 0 3px #00EEFF) drop-shadow(0 0 6px #4DB5FF);
          }
          50% {
            filter: drop-shadow(0 0 4px #00EEFF) drop-shadow(0 0 8px #4DB5FF);
          }
        }
        
        @keyframes tubeGlowGreen {
          0%, 100% {
            filter: drop-shadow(0 0 3px #5DC18E) drop-shadow(0 0 6px #70EDAE);
          }
          50% {
            filter: drop-shadow(0 0 4px #5DC18E) drop-shadow(0 0 8px #70EDAE);
          }
        }
        
        @keyframes tubeGlowYellow {
          0%, 100% {
            filter: drop-shadow(0 0 3px #FDBA74) drop-shadow(0 0 6px #FFD85C);
          }
          50% {
            filter: drop-shadow(0 0 4px #FDBA74) drop-shadow(0 0 8px #FFD85C);
          }
        }
      `}</style>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1664 847"
        className="absolute inset-0 overflow-hidden"
        style={{ pointerEvents: "none", opacity, zIndex: 30 }}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Filters from original SVG */}
          <filter
            id="filter0_d_1911_5051"
            x="888"
            y="404.5"
            width="490"
            height="45"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="4" />
            <feGaussianBlur stdDeviation="2" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_1911_5051"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_1911_5051"
              result="shape"
            />
          </filter>
          <filter
            id="filter1_d_1911_5051"
            x="261"
            y="404.5"
            width="506"
            height="45"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="4" />
            <feGaussianBlur stdDeviation="2" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_1911_5051"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_1911_5051"
              result="shape"
            />
          </filter>
          <filter
            id="filter2_d_1911_5051"
            x="802"
            y="0.5"
            width="45"
            height="338"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="4" />
            <feGaussianBlur stdDeviation="2" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_1911_5051"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_1911_5051"
              result="shape"
            />
          </filter>
          <filter
            id="filter3_d_1911_5051"
            x="803"
            y="513.5"
            width="45"
            height="333"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="4" />
            <feGaussianBlur stdDeviation="2" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_1911_5051"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_1911_5051"
              result="shape"
            />
          </filter>

          {/* Moving lights filters from Group 2222.svg */}
          <filter
            id="filter0_d_1911_5071"
            x="879"
            y="463"
            width="517"
            height="33"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset />
            <feGaussianBlur stdDeviation="7.5" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.0470588 0 0 0 0 0.54902 0 0 0 0 0.909804 0 0 0 1 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_1911_5071"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_1911_5071"
              result="shape"
            />
          </filter>
          <filter
            id="filter1_d_1911_5071"
            x="219"
            y="463"
            width="541"
            height="33"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset />
            <feGaussianBlur stdDeviation="7.5" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.0470588 0 0 0 0 0.54902 0 0 0 0 0.909804 0 0 0 1 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_1911_5071"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_1911_5071"
              result="shape"
            />
          </filter>
          <filter
            id="filter2_d_1911_5071"
            x="803"
            y="0.5"
            width="33"
            height="411"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset />
            <feGaussianBlur stdDeviation="7.5" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.0470588 0 0 0 0 0.54902 0 0 0 0 0.909804 0 0 0 1 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_1911_5071"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_1911_5071"
              result="shape"
            />
          </filter>
          <filter
            id="filter3_d_1911_5071"
            x="803"
            y="530.5"
            width="33"
            height="411"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset />
            <feGaussianBlur stdDeviation="7.5" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.0470588 0 0 0 0 0.54902 0 0 0 0 0.909804 0 0 0 1 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_1911_5071"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_1911_5071"
              result="shape"
            />
          </filter>
          <filter
            id="filter4_d_1911_5071"
            x="0.5"
            y="63.5"
            width="540"
            height="306"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset />
            <feGaussianBlur stdDeviation="6" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.193102 0 0 0 0 1 0 0 0 0 0.588482 0 0 0 1 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_1911_5071"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_1911_5071"
              result="shape"
            />
          </filter>
          <filter
            id="filter5_d_1911_5071"
            x="0.5"
            y="531.5"
            width="590"
            height="356"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset />
            <feGaussianBlur stdDeviation="6" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.193102 0 0 0 0 1 0 0 0 0 0.588482 0 0 0 1 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_1911_5071"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_1911_5071"
              result="shape"
            />
          </filter>
          <filter
            id="filter6_d_1911_5071"
            x="1112"
            y="63.5"
            width="540"
            height="306"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset />
            <feGaussianBlur stdDeviation="6" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 1 0 0 0 0 0.641585 0 0 0 0 0.267122 0 0 0 1 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_1911_5071"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_1911_5071"
              result="shape"
            />
          </filter>
          <filter
            id="filter7_d_1911_5071"
            x="1062"
            y="531.5"
            width="590"
            height="356"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset />
            <feGaussianBlur stdDeviation="6" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 1 0 0 0 0 0.641585 0 0 0 0 0.267122 0 0 0 1 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_1911_5071"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_1911_5071"
              result="shape"
            />
          </filter>

          {/* Gradients from original SVG */}
          <linearGradient
            id="paint0_linear_1911_5051"
            x1="892"
            y1="423"
            x2="1374"
            y2="423"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0.25" stopColor="#1A1A3A" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <linearGradient
            id="paint1_linear_1911_5051"
            x1="763"
            y1="423"
            x2="265"
            y2="423"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0.241848" stopColor="#1A1A3A" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <linearGradient
            id="paint2_linear_1911_5051"
            x1="824.5"
            y1="330.5"
            x2="824.5"
            y2="0.5"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0.173913" stopColor="#1A1A3A" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <linearGradient
            id="paint3_linear_1911_5051"
            x1="825.5"
            y1="513.5"
            x2="825.5"
            y2="838.5"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0.160326" stopColor="#1A1A3A" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <linearGradient
            id="paint4_linear_1911_5051"
            x1="-164"
            y1="436.5"
            x2="423.507"
            y2="55.844"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="white" stopOpacity="0" />
            <stop offset="1" stopColor="#16A249" />
          </linearGradient>
          <linearGradient
            id="paint5_linear_1911_5051"
            x1="1"
            y1="144.803"
            x2="478.5"
            y2="144.803"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#E5A734" stopOpacity="0" />
            <stop offset="1" stopColor="white" />
          </linearGradient>
          <linearGradient
            id="paint6_linear_1911_5051"
            x1="618.5"
            y1="838.5"
            x2="-114.708"
            y2="676.364"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="white" stopOpacity="0" />
            <stop offset="1" stopColor="#16A249" />
          </linearGradient>
          <linearGradient
            id="paint7_linear_1911_5051"
            x1="1"
            y1="678.803"
            x2="538.5"
            y2="678.803"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#E5A734" stopOpacity="0" />
            <stop offset="1" stopColor="white" />
          </linearGradient>
          <linearGradient
            id="paint8_linear_1911_5051"
            x1="1145"
            y1="-114"
            x2="1854.17"
            y2="242.56"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="white" stopOpacity="0" />
            <stop offset="1" stopColor="#E5A734" />
          </linearGradient>
          <linearGradient
            id="paint9_linear_1911_5051"
            x1="1663.5"
            y1="149.803"
            x2="1176"
            y2="149.803"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#E5A734" stopOpacity="0" />
            <stop offset="1" stopColor="white" />
          </linearGradient>
          <linearGradient
            id="paint10_linear_1911_5051"
            x1="1113"
            y1="883.5"
            x2="1910.76"
            y2="535.927"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="white" stopOpacity="0" />
            <stop offset="1" stopColor="#E5A734" />
          </linearGradient>
          <linearGradient
            id="paint11_linear_1911_5051"
            x1="1663.5"
            y1="683.803"
            x2="1156"
            y2="683.803"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#E5A734" stopOpacity="0" />
            <stop offset="1" stopColor="white" />
          </linearGradient>

          {/* Moving lights gradients from Group 2222.svg */}
          <linearGradient
            id="paint0_linear_1911_5071"
            x1="1382.93"
            y1="479.007"
            x2="1382.93"
            y2="480.589"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#00EEFF" />
            <stop offset="1" stopColor="#4DB5FF" />
          </linearGradient>
          <linearGradient
            id="paint1_linear_1911_5071"
            x1="747.023"
            y1="479.007"
            x2="747.023"
            y2="480.589"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#00EEFF" />
            <stop offset="1" stopColor="#4DB5FF" />
          </linearGradient>
          <linearGradient
            id="paint2_linear_1911_5071"
            x1="819.007"
            y1="13.9915"
            x2="820.589"
            y2="13.9921"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#00EEFF" />
            <stop offset="1" stopColor="#4DB5FF" />
          </linearGradient>
          <linearGradient
            id="paint3_linear_1911_5071"
            x1="819.007"
            y1="543.992"
            x2="820.589"
            y2="543.992"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#00EEFF" />
            <stop offset="1" stopColor="#4DB5FF" />
          </linearGradient>

          {/* Path definitions for moving lights - using the exact tube paths */}
          <path id="tube-right" d="M 824.5 404.5 L 1374 404.5" fill="none" />
          <path id="tube-left" d="M 824.5 404.5 L 265 404.5" fill="none" />
          <path id="tube-top" d="M 824.5 404.5 L 824.5 0.5" fill="none" />
          <path id="tube-bottom" d="M 824.5 404.5 L 824.5 838.5" fill="none" />
          <path
            id="tube-top-left"
            d="M 265 404.5 L 265 60 Q 265 22 303 22 L 478.5 22"
            fill="none"
          />
          <path
            id="tube-top-right"
            d="M 1374 404.5 L 1374 60 Q 1374 22 1336 22 L 1176 22"
            fill="none"
          />
          <path
            id="tube-bottom-left"
            d="M 265 404.5 L 265 748 Q 265 786 303 786 L 478.5 786"
            fill="none"
          />
          <path
            id="tube-bottom-right"
            d="M 1374 404.5 L 1374 748 Q 1374 786 1336 786 L 1176 786"
            fill="none"
          />
        </defs>

        {/* Original SVG content from the file */}
        <g filter="url(#filter0_d_1911_5051)">
          <path
            d="M892 404.5H1374V441.5H892V404.5Z"
            fill="url(#paint0_linear_1911_5051)"
            fillOpacity="0.5"
            shapeRendering="crispEdges"
          />
        </g>
        <g filter="url(#filter1_d_1911_5051)">
          <path
            d="M763 404.5H265V441.5H763V404.5Z"
            fill="url(#paint1_linear_1911_5051)"
            fillOpacity="0.5"
            shapeRendering="crispEdges"
          />
        </g>
        <g filter="url(#filter2_d_1911_5051)">
          <path
            d="M806 330.5V0.5H843V330.5H806Z"
            fill="url(#paint2_linear_1911_5051)"
            fillOpacity="0.5"
            shapeRendering="crispEdges"
          />
        </g>
        <g filter="url(#filter3_d_1911_5051)">
          <path
            d="M807 513.5V838.5H844V513.5H807Z"
            fill="url(#paint3_linear_1911_5051)"
            fillOpacity="0.5"
            shapeRendering="crispEdges"
          />
        </g>
        <path
          d="M478.5 0.5V40.5H56.8145C48.5614 40.5002 41.8592 47.1679 41.8154 55.4209L41 289.106L1 288.894L1.81543 55.208C1.97611 24.9469 26.5529 0.500195 56.8145 0.5H478.5Z"
          fill="url(#paint4_linear_1911_5051)"
          fillOpacity="0.1"
          stroke="url(#paint5_linear_1911_5051)"
          strokeOpacity="0.25"
        />
        <path
          d="M538.5 838.106V798.106H56.8145C48.5614 798.106 41.8592 791.439 41.8154 783.186L41 519.5L1 519.713L1.81543 783.398C1.97611 813.66 26.5529 838.106 56.8145 838.106H538.5Z"
          fill="url(#paint6_linear_1911_5051)"
          fillOpacity="0.1"
          stroke="url(#paint7_linear_1911_5051)"
          strokeOpacity="0.25"
        />
        <path
          d="M1176 0.5V40.5H1607.69C1615.94 40.5002 1622.64 47.1679 1622.68 55.4209L1623.5 299.106L1663.5 298.894L1662.68 55.208C1662.52 24.9469 1637.95 0.500195 1607.69 0.5H1176Z"
          fill="url(#paint8_linear_1911_5051)"
          fillOpacity="0.1"
          stroke="url(#paint9_linear_1911_5051)"
          strokeOpacity="0.25"
        />
        <path
          d="M1156 838.106V798.106H1607.69C1615.94 798.106 1622.64 791.439 1622.68 783.186L1623.5 529.5L1663.5 529.713L1662.68 783.398C1662.52 813.66 1637.95 838.106 1607.69 838.106H1156Z"
          fill="url(#paint10_linear_1911_5051)"
          fillOpacity="0.1"
          stroke="url(#paint11_linear_1911_5051)"
          strokeOpacity="0.25"
        />

        {/* Moving lights - using exact tube paths with fluid flow animations */}
        <g style={{ opacity: 1 }}>
          {/* Center cross moving lights - using exact tube paths */}
          <path
            d="M 824.5 420 L 1374 420"
            stroke="url(#paint0_linear_1911_5071)"
            strokeWidth="4"
            className="moving-light-path"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="30% 70%"
            filter="url(#filter0_d_1911_5071)"
            style={{
              animation: "cornerFlow 3s infinite, tubeGlowBlue 1.5s infinite",
              animationDelay: "0s, 0s",
              animationTimingFunction: "linear",
            }}
          />
          <path
            d="M 824.5 420 L 265 420"
            stroke="url(#paint1_linear_1911_5071)"
            strokeWidth="4"
            className="moving-light-path"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="30% 70%"
            filter="url(#filter1_d_1911_5071)"
            style={{
              animation: "cornerFlow 3s infinite, tubeGlowBlue 1.5s infinite",
              animationDelay: "0s, 0s",
              animationTimingFunction: "linear",
            }}
          />
          <path
            d="M 824.5 404.5 L 824.5 0.5"
            stroke="url(#paint2_linear_1911_5071)"
            strokeWidth="4"
            className="moving-light-path"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="30% 70%"
            filter="url(#filter2_d_1911_5071)"
            style={{
              animation: "cornerFlow 3s infinite, tubeGlowBlue 1.5s infinite",
              animationDelay: "0s, 0s",
              animationTimingFunction: "linear",
            }}
          />
          <path
            d="M 824.5 404.5 L 824.5 838.5"
            stroke="url(#paint3_linear_1911_5071)"
            strokeWidth="4"
            className="moving-light-path"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="30% 70%"
            filter="url(#filter3_d_1911_5071)"
            style={{
              animation: "cornerFlow 3s infinite, tubeGlowBlue 1.5s infinite",
              animationDelay: "0s, 0s",
              animationTimingFunction: "linear",
            }}
          />

          {/* Corner moving lights - using exact corner tube paths */}
          <path
            d="M 22 404.5 L 22 60 Q 22 22 60 22 L 478.5 22"
            stroke="#5DC18E"
            strokeWidth="4"
            className="moving-light-path"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="20% 80%"
            filter="url(#filter4_d_1911_5071)"
            style={{
              animation: "cornerFlow 3s infinite, tubeGlowGreen 1.5s infinite",
              animationDelay: "3s, 0s",
              animationTimingFunction: "linear",
            }}
          />
          <path
            d="M 22 404.5 L 22 748 Q 22 820 60 820 L 478.5 820"
            stroke="#5DC18E"
            strokeWidth="4"
            className="moving-light-path"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="20% 80%"
            filter="url(#filter5_d_1911_5071)"
            style={{
              animation: "cornerFlow 3s infinite, tubeGlowGreen 1.5s infinite",
              animationDelay: "3s, 0s",
              animationTimingFunction: "linear",
            }}
          />
          <path
            d="M 1642 404.5 L 1642 60 Q 1642 22 1604 22 L 1176 22"
            stroke="#FDBA74"
            strokeWidth="4"
            className="moving-light-path"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="20% 80%"
            filter="url(#filter6_d_1911_5071)"
            style={{
              animation: "cornerFlow 3s infinite, tubeGlowYellow 1.5s infinite",
              animationDelay: "3s, 0s",
              animationTimingFunction: "linear",
            }}
          />
          <path
            d="M 1642 404.5 L 1642 748 Q 1642 820 1604 820 L 1176 820"
            stroke="#FDBA74"
            strokeWidth="4"
            className="moving-light-path"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="20% 80%"
            filter="url(#filter7_d_1911_5071)"
            style={{
              animation: "cornerFlow 3s infinite, tubeGlowYellow 1.5s infinite",
              animationDelay: "3s, 0s",
              animationTimingFunction: "linear",
            }}
          />
        </g>
      </svg>

      {/* Center Logo (optional - can be disabled by parent) */}
      {showCenterLogo && (
        <div
          className="absolute inset-0 flex items-center justify-center min-w-0 min-h-0 overflow-hidden"
          style={{ zIndex: 40 }}
        >
          <img
            src="/assets/icons/home/diagram-main-card-icon.png"
            alt="Main Card Icon"
            className="w-32 h-32 md:h-52 md:w-52 shrink-0"
          />
        </div>
      )}
    </div>
  );
};

export default TechStackDiagram;
