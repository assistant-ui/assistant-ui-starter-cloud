"use client";

import { useControllableState } from "@radix-ui/react-use-controllable-state";
import { useMessagePartReasoning, TextMessagePartProvider } from "@assistant-ui/react";
import { BrainIcon, ChevronDownIcon } from "lucide-react";
import {
  createContext,
  memo,
  type FC,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { MarkdownText } from "@/components/assistant-ui/markdown-text";
import { cn } from "@/lib/utils";

const AUTO_CLOSE_DELAY = 1000;
const MS_IN_SECOND = 1000;

type ReasoningContextValue = {
  isStreaming: boolean;
  isOpen: boolean;
  duration: number;
  setIsOpen: (open: boolean) => void;
};

const ReasoningContext = createContext<ReasoningContextValue | null>(null);

const useReasoningContext = () => {
  const context = useContext(ReasoningContext);
  if (!context) {
    throw new Error("Reasoning components must be used within Reasoning");
  }
  return context;
};

const getThinkingMessage = (isStreaming: boolean, duration: number) => {
  if (isStreaming || duration === 0) {
    return <p>Thinking...</p>;
  }

  if (Number.isNaN(duration)) {
    return <p>Thought for a few seconds</p>;
  }

  return <p>Thought for {duration} seconds</p>;
};

const ReasoningComponent: FC = () => {
  const { text, status } = useMessagePartReasoning();

  const isStreaming = status.type === "running";
  const [isOpen, setIsOpen] = useControllableState({
    defaultProp: true,
  });
  const [duration, setDuration] = useControllableState<number>({
    defaultProp: 0,
  });

  const [hasAutoClosed, setHasAutoClosed] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);

  const { fallbackText, hasReasoning } = useMemo(() => {
    const trimmed = text.trim();
    if (trimmed.length === 0) {
      return {
        fallbackText: isStreaming
          ? "The model is still working through its reasoning."
          : "No reasoning was provided for this response.",
        hasReasoning: false,
      } as const;
    }

    return {
      fallbackText: "",
      hasReasoning: true,
    } as const;
  }, [isStreaming, text]);

  useEffect(() => {
    if (isStreaming) {
      setIsOpen(true);
      setHasAutoClosed(false);
      setDuration(0);

      if (startTime === null) {
        setStartTime(Date.now());
      }

      return;
    }

    if (startTime !== null) {
      const elapsedSeconds = Math.ceil((Date.now() - startTime) / MS_IN_SECOND);
      setDuration(elapsedSeconds);
      setStartTime(null);
    }
  }, [isStreaming, setIsOpen, setDuration, startTime]);

  useEffect(() => {
    if (isStreaming || !isOpen || hasAutoClosed) {
      return;
    }

    const timer = setTimeout(() => {
      setIsOpen(false);
      setHasAutoClosed(true);
    }, AUTO_CLOSE_DELAY);

    return () => {
      clearTimeout(timer);
    };
  }, [hasAutoClosed, isOpen, isStreaming, setIsOpen]);

  const contextValue = useMemo<ReasoningContextValue>(
    () => ({
      isStreaming,
      isOpen: Boolean(isOpen),
      duration,
      setIsOpen: (open: boolean) => {
        setIsOpen(open);
      },
    }),
    [duration, isOpen, isStreaming, setIsOpen],
  );

  return (
    <ReasoningContext.Provider value={contextValue}>
      <Collapsible
        className={cn("aui-reasoning-root w-full")}
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open);
        }}
      >
        <ReasoningTrigger className="aui-reasoning-trigger" />
        <ReasoningContent
          className="aui-reasoning-content"
          rawText={text}
          fallbackText={fallbackText}
          hasReasoning={hasReasoning}
        />
      </Collapsible>
    </ReasoningContext.Provider>
  );
};

export const Reasoning = memo(ReasoningComponent);
Reasoning.displayName = "Reasoning";

type ReasoningTriggerProps = {
  className?: string;
};

const ReasoningTriggerComponent: FC<ReasoningTriggerProps> = ({ className }) => {
  const { isStreaming, isOpen, duration } = useReasoningContext();

  return (
    <CollapsibleTrigger
      className={cn(
        "flex w-full items-center gap-2 text-muted-foreground text-sm transition-colors hover:text-foreground",
        className,
      )}
    >
      <BrainIcon className="size-4" />
      {getThinkingMessage(isStreaming, duration)}
      <ChevronDownIcon
        className={cn(
          "size-4 transition-transform",
          isOpen ? "rotate-180" : "rotate-0",
        )}
      />
    </CollapsibleTrigger>
  );
};

const ReasoningTrigger = memo(ReasoningTriggerComponent);
ReasoningTrigger.displayName = "ReasoningTrigger";

type ReasoningContentProps = {
  className?: string;
  rawText: string;
  fallbackText: string;
  hasReasoning: boolean;
};

const ReasoningContentComponent: FC<ReasoningContentProps> = ({
  className,
  rawText,
  fallbackText,
  hasReasoning,
}) => {
  const { isStreaming } = useReasoningContext();

  return (
    <>
      <style jsx global>{`
        @keyframes reasoning-slide-down {
          from {
            height: 0;
            opacity: 0;
          }

          to {
            height: var(--radix-collapsible-content-height);
            opacity: 1;
          }
        }

        @keyframes reasoning-slide-up {
          from {
            height: var(--radix-collapsible-content-height);
            opacity: 1;
          }

          to {
            height: 0;
            opacity: 0;
          }
        }
      `}</style>
      <CollapsibleContent
        forceMount
        className={cn(
          "mt-4 overflow-hidden text-sm text-muted-foreground outline-none",
          "data-[state=open]:animate-[reasoning-slide-down_250ms_ease]",
          "data-[state=closed]:animate-[reasoning-slide-up_200ms_ease_forwards]",
          className,
        )}
      >
        <div className="aui-reasoning-text leading-relaxed">
          {hasReasoning ? (
            <TextMessagePartProvider
              text={rawText}
              isRunning={isStreaming}
            >
              <MarkdownText />
            </TextMessagePartProvider>
          ) : (
            <p>{fallbackText}</p>
          )}
        </div>
      </CollapsibleContent>
    </>
  );
};

const ReasoningContent = memo(ReasoningContentComponent);
ReasoningContent.displayName = "ReasoningContent";
