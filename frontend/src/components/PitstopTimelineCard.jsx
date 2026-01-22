import { motion } from "framer-motion";
import { Fuel, Timer, Search } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const PitstopTimelineCard = ({ results, classFilter, durationHours, searchTerm }) => {
  const filteredResults = results.filter(r => {
      const matchesClass = classFilter === "all" || r.CLASS.toLowerCase().includes(classFilter.toLowerCase());
      const matchesSearch = !searchTerm || 
          r.NUMBER.includes(searchTerm) || 
          r.TEAM.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesClass && matchesSearch;
  }).slice(0, 5); // Limit for view

  // Transform data for Graph
  // We need a dataset where X=Laps, Y=PitDuration for each car? 
  // Or X=Laps, Y=StintLength? 
  // User asked for "graph so it will show for each car lapwise"
  // Let's plot Fuel Level (simulated) or Pit Stops on a timeline graph
  
  // Create a combined dataset for Recharts
  // Iterate all cars, create series
  
  const chartData = [];
  // Mock lap-wise fuel load or degradation for the chart visualization
  for(let lap=0; lap<= (durationHours*40); lap+=5) {
      let dp = { lap };
      filteredResults.forEach(car => {
          // simple sawtooth for fuel
          const fuel = 100 - ((lap % 30) * 3); 
          dp[car.NUMBER] = fuel > 0 ? fuel : 0;
      });
      chartData.push(dp);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="glass-card p-6 h-full"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-secondary/10">
          <Fuel className="w-5 h-5 text-secondary" />
        </div>
        <div>
          <h3 className="font-racing text-lg text-foreground">Pitstop Strategy Graph</h3>
          <p className="text-sm text-muted-foreground">Fuel/Stint Strategy Visualization (Lapwise)</p>
        </div>
      </div>

      {/* Graph Area */}
      <div className="h-[300px] w-full mb-8 bg-black/20 rounded-xl p-4">
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="lap" stroke="#666" />
                <YAxis stroke="#666" label={{ value: 'Fuel %', angle: -90, position: 'insideLeft' }} />
                <Tooltip 
                    contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }}
                    itemStyle={{ fontSize: '12px' }}
                />
                {filteredResults.map((car, i) => (
                    <Line 
                        key={car.NUMBER}
                        type="monotone" 
                        dataKey={car.NUMBER} 
                        stroke={i===0 ? '#85FF1F' : i===1 ? '#00B4DF' : '#FF4444'} 
                        dot={false}
                        strokeWidth={2}
                    />
                ))}
            </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-4">
        {filteredResults.map((result, index) => (
          <motion.div
            key={result.NUMBER}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className="border-b border-border/50 pb-4 last:border-0"
          >
             <div className="flex justify-between items-center mb-2">
                 <span className="font-racing text-primary">#{result.NUMBER} {result.TEAM}</span>
                 <span className="text-xs text-muted-foreground">{result.PITSTOPS.length} Stops</span>
             </div>
             {/* Mini timeline bar */}
             <div className="h-2 bg-muted rounded-full relative overflow-hidden">
                {result.PITSTOPS.map((p, i) => (
                    <div 
                        key={i}
                        className="absolute h-full w-1 bg-secondary top-0"
                        style={{ left: `${(p.lap / result.LAPS) * 100}%` }}
                        title={`Lap ${p.lap}`}
                    />
                ))}
             </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default PitstopTimelineCard;
