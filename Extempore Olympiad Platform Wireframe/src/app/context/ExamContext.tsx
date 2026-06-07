import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type RoundNumber = 1 | 2 | 3;

export interface RoundConfig {
  round: RoundNumber;
  name: string;
  subtitle: string;
  marks: number;
  prepSeconds: number;
  speakSeconds: number;
  topic: string;
}

export const ROUND_CONFIG: Record<RoundNumber, RoundConfig> = {
  1: {
    round: 1,
    name: "Warm Up",
    subtitle: "Warm-Up Round",
    marks: 20,
    prepSeconds: 30,
    speakSeconds: 60,
    topic: "How I became President of America for 1 day.",
  },
  2: {
    round: 2,
    name: "Creative",
    subtitle: "Creative Round",
    marks: 30,
    prepSeconds: 45,
    speakSeconds: 60,
    topic: "A world where animals can talk — what changes first?",
  },
  3: {
    round: 3,
    name: "Challenge",
    subtitle: "Challenge Round",
    marks: 50,
    prepSeconds: 60,
    speakSeconds: 60,
    topic: "Use these words: galaxy, whisper, bridge, courage.",
  },
};

interface ExamContextValue {
  grade: string;
  setGrade: (grade: string) => void;
  currentRound: RoundNumber;
  recordings: Partial<Record<RoundNumber, Blob>>;
  saveRecording: (round: RoundNumber, blob: Blob) => void;
  advanceToNextRound: () => void;
  getRoundConfig: (round?: RoundNumber) => RoundConfig;
  isLastRound: boolean;
}

const ExamContext = createContext<ExamContextValue | null>(null);

export function ExamProvider({ children }: { children: ReactNode }) {
  const [grade, setGrade] = useState("");
  const [currentRound, setCurrentRound] = useState<RoundNumber>(1);
  const [recordings, setRecordings] = useState<
    Partial<Record<RoundNumber, Blob>>
  >({});

  const saveRecording = useCallback((round: RoundNumber, blob: Blob) => {
    setRecordings((prev) => ({ ...prev, [round]: blob }));
  }, []);

  const advanceToNextRound = useCallback(() => {
    setCurrentRound((prev) => {
      if (prev >= 3) return prev;
      return (prev + 1) as RoundNumber;
    });
  }, []);

  const getRoundConfig = useCallback(
    (round: RoundNumber = currentRound) => ROUND_CONFIG[round],
    [currentRound]
  );

  const value = useMemo(
    () => ({
      grade,
      setGrade,
      currentRound,
      recordings,
      saveRecording,
      advanceToNextRound,
      getRoundConfig,
      isLastRound: currentRound === 3,
    }),
    [
      grade,
      currentRound,
      recordings,
      saveRecording,
      advanceToNextRound,
      getRoundConfig,
    ]
  );

  return (
    <ExamContext.Provider value={value}>{children}</ExamContext.Provider>
  );
}

export function useExam() {
  const context = useContext(ExamContext);
  if (!context) {
    throw new Error("useExam must be used within ExamProvider");
  }
  return context;
}
