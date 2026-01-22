import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileJson, Check, AlertCircle, X } from "lucide-react";

const validatePracticeSchema = (data) => {
  const requiredFields = ["CarNumber", "Team", "Driver", "LapTime", "Session"];
  const errors = [];
  
  if (!Array.isArray(data)) {
    return ["Data must be an array of entries"];
  }

  data.forEach((entry, index) => {
    requiredFields.forEach(field => {
      if (!(field in entry)) {
        errors.push(`Entry ${index + 1}: Missing field "${field}"`);
      }
    });
  });

  return errors;
};

const validateQualifyingSchema = (data) => {
  const requiredFields = ["CarNumber", "QualPos", "BestLap", "Driver"];
  const errors = [];
  
  if (!Array.isArray(data)) {
    return ["Data must be an array of entries"];
  }

  data.forEach((entry, index) => {
    requiredFields.forEach(field => {
      if (!(field in entry)) {
        errors.push(`Entry ${index + 1}: Missing field "${field}"`);
      }
    });
  });

  return errors;
};

const UploadCard = ({ onFilesUploaded, uploadedFiles }) => {
  const [dragActive, setDragActive] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const data = JSON.parse(reader.result);
          let errors = [];
          let type = "unknown";

          // Detect file type and validate
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
            if (Array.isArray(data) && data[0]) {
              if ("Session" in data[0]) {
                type = "practice";
                errors = validatePracticeSchema(data);
              } else if ("QualPos" in data[0]) {
                type = "qualifying";
                errors = validateQualifyingSchema(data);
              }
            }
          }

          const newFile = {
            name: file.name,
            data,
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
            errors: ["Invalid JSON format"],
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
