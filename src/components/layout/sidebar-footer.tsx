"use client";

import { useUIStore } from "@/stores/ui-store";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const STORAGE_PERCENT = 62;
const STORAGE_USED = "24,8 Go";
const STORAGE_TOTAL = "40 Go";

const RADIUS = 42;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const USED_OFFSET = CIRCUMFERENCE - (STORAGE_PERCENT / 100) * CIRCUMFERENCE;

export function SidebarFooter() {
  const collapsed = useUIStore((state) => state.sidebarCollapsed);

  if (collapsed) {
    return (
      <TooltipProvider delayDuration={100}>
        <div className="border-t border-white/6 p-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl transition-colors hover:bg-white/6"
                aria-label={`Stockage : ${STORAGE_PERCENT}% utilise`}
              >
                <DonutChart size={40} strokeWidth={4} showLabel sizeLabel="xs" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={12}>
              <p className="font-semibold">Stockage utilise</p>
              <p className="text-xs opacity-80">
                {STORAGE_USED} / {STORAGE_TOTAL}
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    );
  }

  return (
    <div className="border-t border-white/6 px-4 pb-5 pt-5">
      <p className="mb-4 text-[13px] font-medium text-white/85">
        Stockage utilise
      </p>

      <div className="mb-4 flex justify-center">
        <DonutChart size={130} strokeWidth={7} showLabel />
      </div>

      <p className="mb-3 text-center text-[15px] font-semibold text-white">
        {STORAGE_USED}{" "}
        <span className="text-white/40">/</span>{" "}
        <span className="text-white/70">{STORAGE_TOTAL}</span>
      </p>

      <div className="flex justify-center">
        <button className="text-[13px] font-medium text-[#4A9EFF] transition-colors hover:text-[#6BB0FF]">
          Voir le detail
        </button>
      </div>
    </div>
  );
}

interface DonutChartProps {
  size: number;
  strokeWidth: number;
  showLabel?: boolean;
  sizeLabel?: "xs" | "sm" | "md";
}

function DonutChart({ size, strokeWidth, showLabel, sizeLabel = "md" }: DonutChartProps) {
  const radius = RADIUS;
  const circumference = CIRCUMFERENCE;
  const offset = USED_OFFSET;

  const labelSizes = {
    xs: "text-[10px]",
    sm: "text-xs",
    md: "text-[22px]",
  };

  const secondaryStart = (STORAGE_PERCENT / 100) * circumference;
  const secondaryLength = circumference * 0.08;
  const secondaryOffset = circumference - secondaryStart - secondaryLength;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        className="-rotate-90"
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
      >
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
        />

        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke="#FFCD11"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700 ease-out"
        />

        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke="#4A9EFF"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${secondaryLength} ${circumference - secondaryLength}`}
          strokeDashoffset={secondaryOffset}
          className="transition-all duration-700 ease-out"
        />
      </svg>

      {showLabel && (
        <span
          className={`absolute inset-0 flex items-center justify-center font-bold text-white ${labelSizes[sizeLabel]}`}
        >
          {STORAGE_PERCENT}%
        </span>
      )}
    </div>
  );
}