import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ParallaxBackground from "../components/ParallaxBackground";
import RaceHeader from "../components/RaceHeader";
import UploadCard from "../components/UploadCard";
import ConditionsPanel from "../components/ConditionsPanel";
import CarTypeSelector from "../components/CarTypeSelector";
import ResultsTable from "../components/ResultsTable";
import PitstopTimelineCard from "../components/PitstopTimelineCard";
import TyreStrategyGrid from "../components/TyreStrategyGrid";
import ExportButtons from "../components/ExportButtons";
import { HelpCircle, X, ChevronRight, Search } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [trackCondition, setTrackCondition] = useState("");
  const [weather, setWeather] = useState("");
  const [durationHours, setDurationHours] = useState(6);
  const [selectedClass, setSelectedClass] = useState("all");
  const [predictions, setPredictions] = useState([]);
  const [isPredicting, setIsPredicting] = useState(false);
  const [predictionComplete, setPredictionComplete] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const runPrediction = useCallback(async () => {
    setIsPredicting(true);
    setPredictionComplete(false);
    
    // Prepare payload
    const practiceFile = uploadedFiles.find(f => f.type === "practice");
    const qualifyingFile = uploadedFiles.find(f => f.type === "qualifying");
    
    // Logic: Must have Practice & Qualifying
    if (!practiceFile || !qualifyingFile) {
        toast.error("Please upload both Practice and Qualifying data to run analysis.");
        setIsPredicting(false);
        return;
    }

    const payload = {
        practice: practiceFile ? practiceFile.data : [],
        qualifying: qualifyingFile ? qualifyingFile.data : [],
        race_details: {
            race_name: "IMSA Event",
            date: new Date().toISOString(),
            duration_hours: durationHours
        },
        track_conditions: trackCondition || "Dry",
        weather: weather || "Sunny",
        car_type: "all" 
    };

    try {
        const response = await fetch("http://localhost:8000/predict", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error("Prediction failed");
        }

        const data = await response.json();
        
        const mergedPredictions = data.predictions.map(pred => {
            const carNum = pred.NUMBER;
            return {
                ...pred,
                TYRE_STRATEGY: data.tyre_strategies[carNum]?.compound_sequence.map((comp, i) => ({
                    compound: comp, 
                    stints: data.tyre_strategies[carNum].expected_stints[i] || 1,
                    degradation: 0.1 
                })) || [],
                PITSTOPS: data.pitstop_strategies[carNum]?.pit_timestamps.map((ts, i) => ({
                    lap: Math.floor((i+1) * 30), 
                    duration: data.pitstop_strategies[carNum].pit_durations[i]
                })) || [],
                CONFIDENCE: data.confidence[carNum] || 0.8
            };
        });

        setPredictions(mergedPredictions);
        setPredictionComplete(true);
        toast.success("Analysis complete");

    } catch (e) {
      console.error("Failed to load predictions", e);
      toast.error("Analysis failed. Check Backend Connection.");
    } finally {
      setIsPredicting(false);
    }
  }, [uploadedFiles, durationHours, trackCondition, weather]);

  const hasValidData = uploadedFiles.some(f => f.valid);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden text-foreground">
      <ParallaxBackground />
      
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        <RaceHeader
          isLoading={false}
          isPredicting={isPredicting}
          onPredict={runPrediction}
          hasData={hasValidData}
          predictionComplete={predictionComplete}
          raceType={durationHours}
        />

        {/* Input Rows (Single Column Layout as requested) */}
        <div className="space-y-6 mb-8">
            <UploadCard 
                onFilesUploaded={setUploadedFiles}
                uploadedFiles={uploadedFiles}
            />
            
            <ConditionsPanel
                trackCondition={trackCondition}
                setTrackCondition={setTrackCondition}
                weather={weather}
                setWeather={setWeather}
                durationHours={durationHours}
                setDurationHours={setDurationHours}
            />
            
            <CarTypeSelector
                selectedClass={selectedClass}
                setSelectedClass={setSelectedClass}
            />
        </div>

        {/* Prediction Results */}
        <AnimatePresence>
          {predictionComplete && predictions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              {/* Search Bar for Results */}
              <div className="glass-card p-4 flex items-center gap-3">
                 <Search className="w-5 h-5 text-muted-foreground" />
                 <input 
                    type="text" 
                    placeholder="Search by Team or Car Number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-transparent border-none outline-none text-foreground w-full font-racing"
                 />
              </div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3"
              >
                <ChevronRight className="w-6 h-6 text-primary" />
                <h2 className="font-racing text-2xl text-foreground">Analysis Results</h2>
              </motion.div>

              <ResultsTable results={predictions} classFilter={selectedClass} searchTerm={searchTerm} />

              <div className="grid grid-cols-1 gap-6">
                 <PitstopTimelineCard 
                    results={predictions} 
                    classFilter={selectedClass} 
                    durationHours={durationHours}
                    searchTerm={searchTerm}
                 />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <TyreStrategyGrid results={predictions} classFilter={selectedClass} searchTerm={searchTerm} />
                </div>
                <div className="lg:col-span-1">
                    <ExportButtons data={predictions} filename={`imec-s3-results`} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 pt-8 border-t border-border text-center"
        >
          <div className="flex flex-col items-center gap-2">
            <p className="font-racing text-lg text-primary">
                AI Race Analyser
            </p>
            <p className="text-sm text-muted-foreground">
                Created by Shounak Shelke
            </p>
            <a 
                href="mailto:Shelkeshounak1@gmail.com" 
                className="text-xs text-secondary hover:underline mt-1"
            >
                contact: Shelkeshounak1@gmail.com
            </a>
          </div>
        </motion.footer>
      </div>

       <AnimatePresence>
          {showHelp && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowHelp(false)}
            >
              <div className="glass-card p-6 max-w-lg w-full">
                 <h2 className="font-racing text-xl mb-4">Help Guide</h2>
                 <p className="mb-2">1. Upload <b>Practice</b> AND <b>Qualifying</b> JSON data.</p>
                 <p className="mb-2">2. Enter Race Conditions and Duration.</p>
                 <p className="mb-2">3. Click <b>Run Analysis</b>.</p>
                 <button onClick={() => setShowHelp(false)} className="mt-4 p-2 bg-primary text-primary-foreground rounded w-full">Close</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <button
           onClick={() => setShowHelp(true)}
           className="fixed bottom-6 right-6 p-4 rounded-full glass-card border border-primary/30 hover:border-primary transition-colors z-50"
        >
           <HelpCircle className="w-6 h-6 text-primary" />
        </button>
    </div>
  );
};

export default Index;
