import { motion } from "framer-motion";
import { Download, FileJson, FileText, Copy, Check } from "lucide-react";
import { useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";

const ExportButtons = ({ data, filename = "race-predictions" }) => {
  const [copied, setCopied] = useState(false);

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportCSV = () => {
    if (!Array.isArray(data) || data.length === 0) return;
    try {
        const flatData = data.map(row => ({
            Position: row.POSITION,
            Number: row.NUMBER,
            Team: row.TEAM,
            Class: row.CLASS,
            Laps: row.LAPS,
            Gap: row.GAP_FIRST
        }));
        
        const headers = Object.keys(flatData[0]);
        const csvContent = [
        headers.join(","),
        ...flatData.map((row) =>
            headers.map((header) => {
            const value = row[header];
            if (typeof value === "string" && (value.includes(",") || value.includes('"'))) {
                return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
            }).join(",")
        ),
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${filename}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } catch(e) {
        console.error("CSV Export Error", e);
    }
  };

  const exportPDF = () => {
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text("IMEC-S3 v1.2 Race Analysis Report", 14, 22);
      doc.setFontSize(11);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);
      
      const tableColumn = ["Pos", "#", "Class", "Team", "Laps", "Gap", "Best Lap"];
      const tableRows = [];

      data.forEach(ticket => {
        const ticketData = [
          ticket.POSITION,
          ticket.NUMBER,
          ticket.CLASS,
          ticket.TEAM,
          ticket.LAPS,
          ticket.GAP_FIRST,
          ticket.FL_TIME
        ];
        tableRows.push(ticketData);
      });

      doc.autoTable(tableColumn, tableRows, { startY: 40 });
      doc.save(`${filename}.pdf`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="glass-card p-6 h-full"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-blue-500/10">
          <Download className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h3 className="font-racing text-lg text-foreground">Export Results</h3>
          <p className="text-sm text-muted-foreground">Download predictions</p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <motion.button onClick={exportJSON} className="racing-button-secondary w-full flex justify-center gap-2">
            <FileJson className="w-4 h-4" /> JSON
        </motion.button>
        <motion.button onClick={exportCSV} className="racing-button-secondary w-full flex justify-center gap-2">
            <FileText className="w-4 h-4" /> CSV
        </motion.button>
        <motion.button onClick={exportPDF} className="racing-button w-full flex justify-center gap-2">
            <Download className="w-4 h-4" /> PDF Report
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ExportButtons;
