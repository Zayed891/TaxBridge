"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Upload, CheckCircle, AlertCircle, FileText, X } from "lucide-react";
import { TransactionService } from "@/lib/transactions";
import { AuthService } from "@/lib/auth";

interface UploadResult {
  imported: number;
  errors: number;
  errorDetails: Array<{ row: number; error: string }>;
}

export default function CSVUpload() {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Check if user is authenticated
    if (!AuthService.isAuthenticated()) {
      alert('Please log in first to upload transactions.');
      return;
    }

    setUploadedFile(file);
    setIsUploading(true);
    setUploadProgress(0);
    setUploadResult(null);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      // Use the TransactionService
      const response = await TransactionService.importFromCSV(file);
      
      setUploadProgress(100);
      setTimeout(() => {
        if (response.success && response.data) {
          setUploadResult({
            imported: response.data.imported,
            errors: response.data.errors,
            errorDetails: response.data.errorDetails || []
          });
        } else {
          setUploadResult({
            imported: 0,
            errors: 1,
            errorDetails: [{ row: 1, error: response.error?.message || 'Upload failed' }]
          });
        }
        setIsUploading(false);
      }, 500);
      
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadResult({
        imported: 0,
        errors: 1,
        errorDetails: [{ row: 1, error: 'Upload failed. Please check your connection.' }]
      });
      setIsUploading(false);
    }

    clearInterval(progressInterval);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/csv': ['.csv']
    },
    maxFiles: 1
  });

  const resetUpload = () => {
    setUploadedFile(null);
    setUploadResult(null);
    setUploadProgress(0);
    setIsUploading(false);
  };

  return (
    <Card className="border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Upload className="h-6 w-6 text-blue-600" />
          <span>Import Transactions</span>
        </CardTitle>
        <p className="text-slate-600 dark:text-slate-400">
          Upload your CSV file from exchanges like Coinbase, Binance, or Kraken
        </p>
      </CardHeader>
      
      <CardContent>
        {!uploadedFile && !uploadResult && (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer
              ${isDragActive 
                ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20' 
                : 'border-slate-300 dark:border-slate-600 hover:border-blue-400'
              }`}
          >
            <input {...getInputProps()} suppressHydrationWarning />
            <Upload className={`h-12 w-12 mx-auto mb-4 ${isDragActive ? 'text-blue-600' : 'text-slate-400'}`} />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
              {isDragActive ? 'Drop your CSV file here' : 'Drag & drop your CSV file'}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              or click to browse files
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Choose File
            </Button>
          </div>
        )}

        {uploadedFile && isUploading && (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
              Uploading {uploadedFile.name}
            </h3>
            <div className="max-w-md mx-auto">
              <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 mb-2">
                <span>Processing...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          </div>
        )}

        {uploadResult && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Upload Complete
              </h3>
              <Button variant="ghost" size="sm" onClick={resetUpload}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div>
                  <p className="font-semibold text-green-800 dark:text-green-200">
                    {uploadResult.imported} Transactions
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    Successfully imported
                  </p>
                </div>
              </div>

              {uploadResult.errors > 0 && (
                <div className="flex items-center space-x-3 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <AlertCircle className="h-8 w-8 text-orange-600" />
                  <div>
                    <p className="font-semibold text-orange-800 dark:text-orange-200">
                      {uploadResult.errors} Errors
                    </p>
                    <p className="text-sm text-orange-600 dark:text-orange-400">
                      Validation issues found
                    </p>
                  </div>
                </div>
              )}
            </div>

            {uploadResult.errorDetails && uploadResult.errorDetails.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2">
                  Error Details:
                </h4>
                <div className="max-h-40 overflow-y-auto space-y-2">
                  {uploadResult.errorDetails.map((error, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-red-50 dark:bg-red-900/20 rounded">
                      <Badge variant="destructive" className="text-xs">
                        Row {error.row}
                      </Badge>
                      <p className="text-sm text-red-700 dark:text-red-300 flex-1">
                        {error.error}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-center mt-6">
              <Button onClick={resetUpload} variant="outline">
                Upload Another File
              </Button>
            </div>
          </div>
        )}

        <div className="mt-6 text-sm text-slate-600 dark:text-slate-400 space-y-2">
          <p>✅ <strong>Supported exchanges:</strong> Coinbase, Binance, Kraken, Custom</p>
          <p>📄 <strong>Required format:</strong> CSV with date, type, fromAsset, toAsset, fromAmount, toAmount, price, fees, exchange</p>
          <div className="flex items-center space-x-4">
            <Button variant="link" className="p-0 h-auto text-blue-600">
              Download sample CSV
            </Button>
            <Button variant="link" className="p-0 h-auto text-blue-600">
              View format guide
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
