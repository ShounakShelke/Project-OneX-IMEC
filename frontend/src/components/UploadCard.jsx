import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileJson, Check, AlertCircle, X } from "lucide-react";

const validatePracticeSchema = (data) => {
  const entries = Array.isArray(data) ? data : (data.classification || []);
  const errors = [];
  
  if (!Array.isArray(entries) || entries.length === 0) {
    return ["Data must be an array of entries or contain a classification array"];
  }

  // Check for at least some common fields (flexible for old and new formats)
  const entry = entries[0];
  const commonFields = ["CarNumber", "number", "Team", "team", "Driver", "drivers", "LapTime", "time"];
  const hasSomeFields = commonFields.some(field => field in entry);

  if (!hasSomeFields) {
    errors.push("Entry 1: Missing core fields (Number, Team, Driver, or Time)");
  }

  return errors;
};

const validateQualifyingSchema = (data) => {
  const entries = Array.isArray(data) ? data : (data.classification || []);
  const errors = [];
  
  if (!Array.isArray(entries) || entries.length === 0) {
    return ["Data must be an array of entries or contain a classification array"];
  }

  // Check for at least some common fields
  const entry = entries[0];
  const commonFields = ["CarNumber", "number", "QualPos", "position", "BestLap", "time", "Driver", "drivers"];
  const hasSomeFields = commonFields.some(field => field in entry);

  if (!hasSomeFields) {
    errors.push("Entry 1: Missing core fields (Number, Position, Driver, or Time)");
  }

  return errors;
};

const UploadCard = ({ onFilesUploaded, uploadedFiles }) => {
  const [dragActive, setDragActive] = useState(false);

  const parseCSV = (csv) => {
    const lines = csv.split("\n").filter(l => l.trim());
    if (lines.length === 0) return [];
    
    // Simple CSV parser that handles basic quoted strings (enough for IMSA data)
    const headers = lines[0].split(",").map(h => h.trim().replace(/^"|"$/g, ''));
    return lines.slice(1).map(line => {
      const values = line.split(",").map(v => v.trim().replace(/^"|"$/g, ''));
      const obj = {};
      headers.forEach((h, i) => {
        obj[h] = values[i];
      });
      return obj;
    });
  };

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const isCSV = file.name.toLowerCase().endsWith(".csv");
          const data = isCSV ? parseCSV(reader.result) : JSON.parse(reader.result);
          
          let errors = [];
          let type = "unknown";

          // Detect file type and validate
          const entries = Array.isArray(data) ? data : (data.classification || []);
          
          if (file.name.toLowerCase().includes("practice")) {
            type = "practice";
            errors = validatePracticeSchema(data);
          } else if (file.name.toLowerCase().includes("qualifying") || file.name.toLowerCase().includes("qual")) {
            type = "qualifying";
            errors = validateQualifyingSchema(data);
          } else if (file.name.toLowerCase().includes("race")) {
            type = "race-results";
            errors = [];
          } else {
            // Auto-detect based on content
            if (Array.isArray(entries) && entries[0]) {
              const entry = entries[0];
              if ("Session" in entry || ("session" in data && !isCSV)) {
                type = "practice";
                errors = validatePracticeSchema(data);
              } else if ("QualPos" in entry || (!isCSV && "classification" in data && file.name.toLowerCase().includes("qual"))) {
                type = "qualifying";
                errors = validateQualifyingSchema(data);
              }
            }
          }

          const newFile = {
            name: file.name,
            data: entries,
            type,
            valid: errors.length === 0,
            errors,
          };

          onFilesUploaded([...uploadedFiles, newFile]);
        } catch (e) {
          const newFile = {
            name: file.name,
            data: null,
            type: "invalid",
            valid: false,
            errors: ["Failed to parse file content"],
          };
          onFilesUploaded([...uploadedFiles, newFile]);
        }
      };
      reader.readAsText(file);
    });
  }, [onFilesUploaded, uploadedFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/json": [".json"],
      "text/csv": [".csv"],
    },
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
  });

  const removeFile = (index) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    onFilesUploaded(newFiles);
  };

  const getTypeBadge = (type) => {
    switch (type) {
      case "practice": return "bg-primary/20 text-primary border-primary/30";
      case "qualifying": return "bg-secondary/20 text-secondary border-secondary/30";
      case "race-results": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-primary/10">
          <Upload className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-racing text-lg text-foreground">Data Upload</h3>
          <p className="text-sm text-muted-foreground">Upload practice, qualifying, or race data (JSON)</p>
        </div>
      </div>

      <motion.div
        className={`upload-zone ${isDragActive || dragActive ? "upload-zone-active" : ""}`}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-4">
            <motion.div
            animate={isDragActive ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
            transition={{ duration: 0.2 }}
            className="p-4 rounded-full bg-primary/10"
          >
            <FileJson className="w-8 h-8 text-primary" />
          </motion.div>
          <div className="text-center">
            <p className="text-foreground font-medium">
              {isDragActive ? "Drop files here" : "Drag & drop JSON files"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              or click to browse
            </p>
          </div>
          </div>
        </div>
      </motion.div>

      {/* Uploaded files list */}
      <AnimatePresence>
        {uploadedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 space-y-3"
          >
            {uploadedFiles.map((file, index) => (
              <motion.div
                key={`${file.name}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center justify-between p-3 rounded-xl border ${
                  file.valid 
                    ? "bg-card/50 border-border" 
                    : "bg-destructive/10 border-destructive/30"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${file.valid ? "bg-primary/10" : "bg-destructive/10"}`}>
                    {file.valid ? (
                      <Check className="w-4 h-4 text-primary" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-destructive" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">{file.name}</span>
                      <span className={`px-2 py-0.5 text-xs rounded-full border font-racing ${getTypeBadge(file.type)}`}>
                        {file.type}
                      </span>
                    </div>
                    {!file.valid && file.errors.length > 0 && (
                      <p className="text-xs text-destructive mt-1">
                        {file.errors[0]}
                      </p>
                    )}
                    {file.valid && file.data && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {Array.isArray(file.data) ? `${file.data.length} entries` : "Valid JSON"}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default UploadCard;
