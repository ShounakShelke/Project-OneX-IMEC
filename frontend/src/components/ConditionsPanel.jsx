import { motion } from "framer-motion";
import { Gauge, Timer } from "lucide-react";

const ConditionsPanel = ({
  trackCondition,
  setTrackCondition,
  weather,
  setWeather,
  durationHours,
  setDurationHours
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="glass-card p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-secondary/10">
          <Gauge className="w-5 h-5 text-secondary" />
        </div>
        <div>
          <h3 className="font-racing text-lg text-foreground">Race Conditions</h3>
          <p className="text-sm text-muted-foreground">Inputs with animations</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Texts Inputs */}
        <div className="space-y-4">
             <div className="relative group">
                <label className="text-xs font-racing text-muted-foreground ml-1">Track Condition</label>
                <input 
                    type="text" 
                    value={trackCondition}
                    onChange={(e) => setTrackCondition(e.target.value)}
                    className="w-full bg-input border border-border rounded-lg px-4 py-3 text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none group-hover:border-primary/50"
                    placeholder="e.g. Dry, Wet..."
                />
             </div>
             <div className="relative group">
                <label className="text-xs font-racing text-muted-foreground ml-1">Weather Forecast</label>
                <input 
                    type="text" 
                    value={weather}
                    onChange={(e) => setWeather(e.target.value)}
                    className="w-full bg-input border border-border rounded-lg px-4 py-3 text-foreground focus:ring-2 focus:ring-secondary focus:border-transparent transition-all outline-none group-hover:border-secondary/50"
                    placeholder="e.g. Sunny, Rain..."
                />
             </div>
        </div>

        {/* Duration */}
        <div className="bg-muted/10 rounded-xl p-4 border border-white/5">
            <label className="text-sm font-medium text-muted-foreground mb-3 block">
                <Timer className="w-4 h-4 inline mr-2" />
                Race Duration
            </label>
            <div className="flex items-center gap-4">
                 <input 
                    type="number"
                    value={durationHours}
                    onChange={(e) => setDurationHours(parseFloat(e.target.value))}
                    className="w-24 bg-background border border-border rounded-lg px-3 py-2 text-xl font-racing text-center"
                 />
                 <div className="flex gap-2">
                    <button onClick={()=>setDurationHours(durationHours)} className="px-3 py-1 rounded bg-primary text-primary-foreground text-sm font-bold">Hr</button>
                    <button onClick={()=>setDurationHours(durationHours/60)} className="px-3 py-1 rounded bg-muted text-muted-foreground text-sm hover:bg-muted/80">Min</button>
                 </div>
            </div>
            
            <input 
              type="range" 
              min="0.5" 
              max="30" 
              step="0.5"
              value={durationHours}
              onChange={(e) => setDurationHours(parseFloat(e.target.value))}
              className="w-full accent-primary mt-4"
            />
        </div>
      </div>
    </motion.div>
  );
};

export default ConditionsPanel;
