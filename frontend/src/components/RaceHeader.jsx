import { motion, AnimatePresence } from "framer-motion";
import { Flag, Loader2, Zap, Timer, TrendingUp, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "@/components/theme-provider";

const RaceHeader = ({ isLoading, isPredicting, onPredict, hasData, predictionComplete, raceType }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 mb-8"
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Left side - Title and info */}
        <div className="flex items-center gap-4">
          <motion.div
            animate={{ 
              rotate: isPredicting ? 360 : 0,
              scale: isPredicting ? [1, 1.1, 1] : 1 
            }}
            transition={{ 
              rotate: { duration: 2, repeat: isPredicting ? Infinity : 0, ease: "linear" },
              scale: { duration: 0.5, repeat: isPredicting ? Infinity : 0 }
            }}
            className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30"
          >
            <Flag className="w-8 h-8 text-primary" />
          </motion.div>
          <div>
            <h1 className="font-racing text-2xl lg:text-3xl text-foreground">
              Project OneX IMSA
            </h1>
            <p className="text-muted-foreground mt-1">
              AI-Powered Race Strategy Analyst
            </p>
          </div>
        </div>

        {/* Center - Stats */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-sm">
            <Timer className="w-4 h-4 text-secondary" />
            <span className="text-muted-foreground">Duration:</span>
            <span className="font-racing text-secondary">{raceType} Hours</span>
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">Model:</span>
            <span className="font-racing text-primary">IMEC-S3 v1.2</span>
          </div>
        </div>

        {/* Right side - Buttons */}
        <div className="flex items-center gap-4">
            <button
               onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
               className="p-2 rounded-full border border-border bg-background hover:bg-muted transition-colors relative w-10 h-10 flex items-center justify-center"
            >
               <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 absolute" />
               <Moon className="h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 absolute" />
               <span className="sr-only">Toggle theme</span>
            </button>

            <motion.button
            onClick={onPredict}
            disabled={!hasData || isPredicting}
            whileHover={hasData && !isPredicting ? { scale: 1.05 } : {}}
            whileTap={hasData && !isPredicting ? { scale: 0.95 } : {}}
            className={`racing-button relative overflow-hidden ${
                !hasData || isPredicting 
                ? "opacity-50 cursor-not-allowed" 
                : "animate-pulse-neon"
            }`}
            >
            <AnimatePresence mode="wait">
                {isPredicting ? (
                <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                >
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Analysing...</span>
                </motion.div>
                ) : predictionComplete ? (
                <motion.div
                    key="complete"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                >
                    <Zap className="w-5 h-5" />
                    <span>Re-Analyze</span>
                </motion.div>
                ) : (
                <motion.div
                    key="ready"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                >
                    <Zap className="w-5 h-5" />
                    <span>Run Analysis</span>
                </motion.div>
                )}
            </AnimatePresence>
            </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default RaceHeader;
