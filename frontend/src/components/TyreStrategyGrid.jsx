import { motion } from "framer-motion";
import { Circle, TrendingDown, Activity } from "lucide-react";

// Same helpers as before
const getCompoundColor = (compound) => {
  const lowerCompound = compound.toLowerCase();
  if (lowerCompound.includes("soft")) return { bg: "bg-red-500", border: "border-red-500", text: "text-red-400" };
  if (lowerCompound.includes("medium")) return { bg: "bg-yellow-500", border: "border-yellow-500", text: "text-yellow-400" };
  if (lowerCompound.includes("hard")) return { bg: "bg-white", border: "border-white", text: "text-white" };
  if (lowerCompound.includes("inter")) return { bg: "bg-green-500", border: "border-green-500", text: "text-green-400" };
  if (lowerCompound.includes("wet")) return { bg: "bg-blue-500", border: "border-blue-500", text: "text-blue-400" };
  return { bg: "bg-gray-500", border: "border-gray-500", text: "text-gray-400" };
};

const SingleTyreStrategyCard = ({ carNumber, team, strategy, carClass }) => {
  const totalStints = strategy.reduce((acc, s) => acc + s.stints, 0);

  return (
    <motion.div
        className="glass-card p-4 cursor-pointer group h-full flex flex-col hover:border-primary/50 transition-colors"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="font-racing text-lg text-primary">#{carNumber}</span>
          <span className="text-xs text-muted-foreground truncate max-w-[120px]">{team}</span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-racing">
          {totalStints} stints
        </span>
      </div>

      <div className="space-y-3 flex-grow">
        {strategy.map((tyre, index) => {
          const colors = getCompoundColor(tyre.compound);
          const widthPercent = (tyre.stints / totalStints) * 100;

          return (
            <motion.div key={index} className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${colors.bg}`} />
                  <span className={`text-sm font-medium ${colors.text}`}>{tyre.compound}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{tyre.stints} laps</span>
                </div>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div className={`h-full ${colors.bg} rounded-full`} style={{ width: `${widthPercent}%`, opacity: 0.7 }} />
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

const TyreStrategyGrid = ({ results, classFilter, searchTerm }) => {
  const filteredResults = results.filter(r => {
    const matchesClass = classFilter === "all" || r.CLASS.toLowerCase().includes(classFilter.toLowerCase());
    const matchesSearch = !searchTerm || 
        r.NUMBER.includes(searchTerm) || 
        r.TEAM.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesClass && matchesSearch;
  }).slice(0, 6);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="glass-card p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-red-500/10">
          <Circle className="w-5 h-5 text-red-400" />
        </div>
        <div>
          <h3 className="font-racing text-lg text-foreground">Tyre Strategy</h3>
          <p className="text-sm text-muted-foreground">Compound selection</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredResults.map((result, index) => (
          <SingleTyreStrategyCard
              key={result.NUMBER}
              carNumber={result.NUMBER}
              team={result.TEAM}
              strategy={result.TYRE_STRATEGY}
              carClass={result.CLASS}
            />
        ))}
      </div>
    </motion.div>
  );
};

export default TyreStrategyGrid;
