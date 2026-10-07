import React, { useEffect, useRef, useState } from "react";
import { BackspaceIcon, ChevronLeftIcon, ChevronRightIcon, TrashIcon, XMarkIcon, ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/solid";
import { MAX_STEPS } from "../utils/share";

const PAGE_SIZE = 8; // The J-6 shows 8 steps per page, 8 pages (64 steps).

const ToolButton = ({ onClick, label, title, active, disabled, danger, children }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    title={title ?? label}
    aria-label={title ?? label}
    aria-pressed={active}
    className={`h-8 min-w-8 px-2 rounded-md text-[11px] font-black tracking-wide flex items-center justify-center gap-1 transition-colors disabled:opacity-30
      ${active ? "bg-tertiary text-primary" : danger ? "bg-secondary text-primary" : "bg-notes text-accent hover:bg-accent hover:text-primary"}`}
  >
    {children}
  </button>
);

const StepStrip = ({ steps, resolveChord, playingStep, recording, setRecording, onHold, onRest, onUndo, onClear, onRemove, onMove, onStepPress }) => {
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const previousLength = useRef(steps.length);

  const pageCount = Math.min(MAX_STEPS / PAGE_SIZE, Math.floor(Math.min(steps.length, MAX_STEPS - 1) / PAGE_SIZE) + 1);

  // Follow new steps as they are added, and the playhead while playing.
  useEffect(() => {
    if (steps.length > previousLength.current) setPage(Math.floor(Math.min(steps.length, MAX_STEPS - 1) / PAGE_SIZE));
    previousLength.current = steps.length;
    if (selected !== null && selected >= steps.length) setSelected(null);
    setPage((p) => Math.min(p, pageCount - 1));
  }, [steps.length, selected, pageCount]);

  useEffect(() => {
    if (playingStep !== null) setPage(Math.floor(playingStep / PAGE_SIZE));
  }, [playingStep]);

  useEffect(() => {
    if (!confirmClear) return undefined;
    const timer = setTimeout(() => setConfirmClear(false), 3000);
    return () => clearTimeout(timer);
  }, [confirmClear]);

  const handleClear = () => {
    if (!steps.length) return;
    if (confirmClear) {
      onClear();
      setSelected(null);
      setConfirmClear(false);
    } else setConfirmClear(true);
  };

  const labelFor = (step) => {
    if (step.type === "hold") return "HOLD";
    if (step.type === "rest") return "REST";
    return resolveChord(step.bank, step.key)?.name ?? "?";
  };

  const slots = Array.from({ length: PAGE_SIZE }, (_, i) => page * PAGE_SIZE + i);

  return (
    <div className="flex flex-col gap-2 bg-primary rounded-xl p-2 min-w-0">
      <div className="flex items-center gap-1">
        <ToolButton
          onClick={() => setRecording(!recording)}
          active={recording}
          title={recording ? "Recording: tapping a chord adds a step" : "Not recording: tapping a chord only plays it"}
        >
          <span className={`w-2 h-2 rounded-full ${recording ? "bg-primary" : "bg-secondary"}`} />
          REC
        </ToolButton>
        <ToolButton
          onClick={onHold}
          disabled={!steps.length || steps.length >= MAX_STEPS}
          title="HOLD: extend the previous step (tie)"
        >
          HOLD
        </ToolButton>
        <ToolButton
          onClick={onRest}
          disabled={steps.length >= MAX_STEPS}
          title="Add a silent step"
        >
          REST
        </ToolButton>
        <ToolButton
          onClick={onUndo}
          disabled={!steps.length}
          title="Remove last step"
        >
          <BackspaceIcon className="w-4 h-4" />
        </ToolButton>
        <ToolButton
          onClick={handleClear}
          disabled={!steps.length}
          danger={confirmClear}
          title={confirmClear ? "Tap again to clear every step" : "Clear all steps"}
        >
          {confirmClear ? "CLEAR?" : <TrashIcon className="w-4 h-4" />}
        </ToolButton>

        <div className="ml-auto flex items-center gap-1">
          {selected !== null ? (
            <>
              <ToolButton
                onClick={() => {
                  onMove(selected, -1);
                  setSelected(Math.max(0, selected - 1));
                }}
                disabled={selected === 0}
                title="Move step earlier"
              >
                <ArrowLeftIcon className="w-4 h-4" />
              </ToolButton>
              <ToolButton
                onClick={() => {
                  onMove(selected, 1);
                  setSelected(Math.min(steps.length - 1, selected + 1));
                }}
                disabled={selected === steps.length - 1}
                title="Move step later"
              >
                <ArrowRightIcon className="w-4 h-4" />
              </ToolButton>
              <ToolButton
                onClick={() => {
                  onRemove(selected);
                  setSelected(null);
                }}
                title="Delete this step"
              >
                <XMarkIcon className="w-4 h-4" />
              </ToolButton>
            </>
          ) : (
            <span className="hidden sm:inline text-[11px] font-bold text-accent/80 px-1">
              {steps.length}/{MAX_STEPS}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-stretch gap-1">
        <button
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page === 0}
          aria-label="Previous step page"
          className="hidden sm:flex w-6 rounded-md text-accent disabled:opacity-20 items-center justify-center"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </button>
        <ol className="grid grid-cols-8 gap-1 flex-1 min-w-0">
          {slots.map((index) => {
            const step = steps[index];
            const isNext = index === steps.length && recording;
            if (!step) {
              return (
                <li
                  key={`empty-${index}`}
                  className={`h-11 rounded-md border border-dashed flex items-center justify-center text-[10px] font-bold
                    ${isNext ? "border-tertiary text-tertiary" : "border-accent/30 text-accent/40"}`}
                >
                  {index + 1}
                </li>
              );
            }
            const isPlaying = playingStep === index;
            const isSelected = selected === index;
            return (
              <li
                key={`step-${step.id}`}
                className="min-w-0"
              >
                <button
                  onClick={() => {
                    setSelected(isSelected ? null : index);
                    if (step.type === "chord") onStepPress(step);
                  }}
                  aria-label={`Step ${index + 1}: ${labelFor(step)}`}
                  title={labelFor(step)}
                  aria-pressed={isSelected}
                  className={`w-full h-11 rounded-md flex flex-col items-center justify-center px-0.5 leading-none overflow-hidden
                    ${isPlaying ? "bg-tertiary text-primary" : step.type === "chord" ? "bg-accent text-primary" : "bg-notes text-accent"}
                    ${isSelected ? "ring-2 ring-tertiary ring-offset-2 ring-offset-primary" : ""}`}
                >
                  <span className="text-[9px] font-bold opacity-70">{index + 1}</span>
                  <span className={`w-full truncate text-center font-black tracking-tight ${step.type === "chord" ? "text-[10px] sm:text-[11px]" : "text-[9px]"}`}>
                    {labelFor(step)}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
        <button
          onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
          disabled={page >= pageCount - 1}
          aria-label="Next step page"
          className="hidden sm:flex w-6 rounded-md text-accent disabled:opacity-20 items-center justify-center"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </button>
      </div>
      {pageCount > 1 && (
        <div className="flex justify-center gap-0.5 -my-1">
          {Array.from({ length: pageCount }, (_, p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              aria-label={`Step page ${p + 1}`}
              className="px-1 py-1.5"
            >
              <span className={`block h-1.5 rounded-full transition-all ${p === page ? "w-5 bg-tertiary" : "w-1.5 bg-accent/50"}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default StepStrip;
