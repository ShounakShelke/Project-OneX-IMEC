import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Check, Copy, ChevronDown } from "lucide-react";
import { useState } from "react";

const ResultsTable = ({ results, classFilter, searchTerm }) => {
  const [expandedRow, setExpandedRow] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const filteredResults = results.filter(r => {
    const matchesClass = classFilter === "all" || r.CLASS.toLowerCase().includes(classFilter.toLowerCase());
    const matchesSearch = !searchTerm || 
        r.NUMBER.includes(searchTerm) || 
        r.TEAM.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesClass && matchesSearch;
  });

  const getClassBadgeStyle = (carClass) => {
    const lowerClass = carClass.toLowerCase();
    if (lowerClass.includes("gtp") || lowerClass.includes("hypercar")) return "car-badge-hypercar";
    if (lowerClass.includes("lmp2")) return "car-badge-lmp2";
    if (lowerClass.includes("gtd pro")) return "car-badge-gtdpro";
    if (lowerClass.includes("gt") || lowerClass.includes("gtd")) return "car-badge-gtd";
    return "bg-muted text-muted-foreground";
  };

  const getPositionStyle = (position) => {
    if (position === 1) return "text-primary font-bold";
    if (position === 2) return "text-secondary font-bold";
    if (position === 3) return "text-orange-400 font-bold";
    return "text-foreground";
  };

  const copyToClipboard = async (result) => {
    await navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopiedId(result.NUMBER);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="glass-card overflow-hidden"
    >
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Trophy className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-racing text-lg text-foreground">Detailed Race Predictions</h3>
              <p className="text-sm text-muted-foreground">
                {filteredResults.length} cars • Sorted by predicted finish
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th className="w-16">POS</th>
              <th className="w-16">#</th>
              <th>Team / Vehicle</th>
              <th>Class</th>
              <th>Driver Info</th>
              <th className="text-right">Laps</th>
              <th className="text-right">Gap</th>
              <th className="text-right">Best Lap</th>
              <th className="text-center">Confidence</th>
              <th className="w-12"></th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {filteredResults.map((result, index) => (
                <motion.tr
                  key={result.NUMBER}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  className="group cursor-pointer"
                  onClick={() => setExpandedRow(expandedRow === index ? null : index)}
                >
                  <td>
                    <span className={`font-racing text-lg ${getPositionStyle(result.POSITION)}`}>
                      {result.POSITION === 1 && <Trophy className="w-4 h-4 inline mr-1 text-primary" />}
                      P{result.POSITION}
                    </span>
                  </td>
                  <td>
                    <span className="font-racing text-lg text-primary">#{result.NUMBER}</span>
                  </td>
                  <td>
                    <div>
                      <p className="font-medium text-foreground">{result.TEAM}</p>
                      <p className="text-xs text-muted-foreground">{result.VEHICLE}</p>
                    </div>
                  </td>
                  <td>
                    <span className={`car-badge ${getClassBadgeStyle(result.CLASS)}`}>
                      {result.CLASS}
                    </span>
                  </td>
                  <td>
                    <div className="text-sm">
                        <span className="text-foreground text-xs block truncate w-32">
                           {result.DRIVER1_FIRSTNAME}
                        </span>
                    </div>
                  </td>
                  <td className="text-right font-racing">{result.LAPS}</td>
                  <td className="text-right">
                    <span className={result.GAP_FIRST === "0.000" ? "text-primary font-bold" : "text-muted-foreground"}>
                      {result.GAP_FIRST}
                    </span>
                  </td>
                  <td className="text-right">
                    <div>
                      <p className="font-racing text-primary">{result.FL_TIME}</p>
                    </div>
                  </td>
                  <td className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <div className="w-12 h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${result.CONFIDENCE * 100}%` }}
                          transition={{ delay: index * 0.05 + 0.3, duration: 0.5 }}
                          className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                        />
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-1">
                        <ChevronDown className={`w-4 h-4 transition-transform ${expandedRow === index ? 'rotate-180' : ''}`} />
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default ResultsTable;
