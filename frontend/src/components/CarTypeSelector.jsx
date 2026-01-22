import { motion } from "framer-motion";
import { Car, Zap, Shield, Trophy } from "lucide-react";

const carClasses = [
  { 
    id: "all", 
    label: "All Classes", 
    icon: Trophy,
    color: "bg-gradient-to-r from-primary/20 to-secondary/20 border-primary/30",
    activeColor: "bg-gradient-to-r from-primary to-secondary text-primary-foreground",
    description: "View all"
  },
  { 
    id: "gtp", 
    label: "GTP (Hypercar)", 
    icon: Zap,
    color: "bg-black/40 border-white/30 text-white", 
    activeColor: "bg-black text-white border-white ring-2 ring-white/50",
    description: "Top Tier"
  },
  { 
    id: "lmp2", 
    label: "LMP2", 
    icon: Car,
    color: "bg-[#1E3D59]/40 border-[#3A5DAE]/30 text-[#3A5DAE]", 
    activeColor: "bg-[#3A5DAE] text-white ring-2 ring-[#3A5DAE]/50",
    description: "Prototype 2"
  },
  { 
    id: "gtd-pro", 
    label: "GTD PRO", 
    icon: Shield,
    color: "bg-[#5A1A1E]/40 border-[#CB333B]/30 text-[#CB333B]", 
    activeColor: "bg-[#CB333B] text-white ring-2 ring-[#CB333B]/50",
    description: "Pro GT"
  },
  { 
    id: "gtd", 
    label: "GTD", 
    icon: Shield,
    color: "bg-[#004D1A]/40 border-[#00B140]/30 text-[#00B140]", 
    activeColor: "bg-[#00B140] text-white ring-2 ring-[#00B140]/50",
    description: "Am GT"
  },
];

const CarTypeSelector = ({ selectedClass, setSelectedClass }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass-card p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-primary/10">
          <Car className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-racing text-lg text-foreground">Class Filter</h3>
          <p className="text-sm text-muted-foreground">Select Car Class</p>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2">
        {carClasses.map((carClass, index) => {
          const Icon = carClass.icon;
          const isActive = selectedClass === carClass.id;
          
          return (
            <motion.button
              key={carClass.id}
              onClick={() => setSelectedClass(carClass.id)}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`relative flex-1 min-w-[140px] p-6 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-3 ${
                isActive 
                  ? carClass.activeColor + " shadow-xl" 
                  : carClass.color + " hover:border-opacity-100"
              }`}
            >
              <Icon className="w-8 h-8" />
              <div className="text-center">
                <span className="font-racing text-lg block">{carClass.label}</span>
                <span className="text-xs opacity-70 block mt-1">{carClass.description}</span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};

export default CarTypeSelector;
