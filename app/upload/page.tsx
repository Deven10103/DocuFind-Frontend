"use client" // line 1

import { useState } from "react" // line 3
import { useRouter } from "next/navigation" // line 4
import { motion } from "framer-motion" // line 5
import axios from "axios" // line 6
import {
  User,
  FileText,
  FileJson2,
  FileTextIcon,
  FileType,
  File,
  Network,
  SearchCode
} from "lucide-react" // line 15

export default function UploadPage() { // line 17
  const [step, setStep] = useState(1) // line 18
  const [files, setFiles] = useState<File[]>([]) // line 19
  const [uploadProgress, setUploadProgress] = useState(0) // line 20
  const [dbProgress, setDbProgress] = useState(0) // line 21
  const [statusText, setStatusText] = useState("") // line 22
  const [error, setError] = useState(false) // line 23
  const router = useRouter() // line 24

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => { // line 26
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
      setUploadProgress(0)
      setError(false)
    }
  }

  const handleUpload = async () => { // line 33
    if (files.length === 0) return
    setError(false)
    setStatusText("Uploading files...")
    const formData = new FormData()
    files.forEach(file => formData.append("files", file))

    try {
      await axios.post("http://127.0.0.1:8000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            setUploadProgress(progress)
          } else {
            setUploadProgress(100)
          }
        }
      })
      setStep(2)
    } catch (err) {
      console.error(err)
      setError(true)
    }
  }

  const handleCreateDb = async () => { // line 56
    try {
      setError(false)
      setDbProgress(0)
      setStatusText("Generating vector embeddings...")

      await axios.get("http://127.0.0.1:8000/process_pdfs")
      setDbProgress(33)
      setStatusText("Generating vector index...")

      await axios.get("http://127.0.0.1:8000/create_index")
      setDbProgress(66)
      setStatusText("Collecting file metadata...")

      await axios.get("http://127.0.0.1:8000/fetch_metadata")
      setDbProgress(100)
      setStatusText("")

      setStep(3)
    } catch (err) {
      console.error(err)
      setError(true)
    }
  }

  const getFileIcon = (fileName: string) => { // line 80
    if (fileName.endsWith(".pdf")) return <FileText className="text-red-500" size={20} />
    if (fileName.endsWith(".json")) return <FileJson2 className="text-emerald-500" size={20} />
    if (fileName.endsWith(".txt") || fileName.endsWith(".md")) return <FileTextIcon className="text-gray-600" size={20} />
    if (fileName.endsWith(".csv") || fileName.endsWith(".xml")) return <FileType className="text-indigo-500" size={20} />
    return <File className="text-gray-500" size={20} />
  }

  return ( // line 87
    <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-purple-100 to-white flex flex-col">
      <header className="w-full flex justify-between items-center pl-8 pr-8 py-3 bg-white/40 backdrop-blur-md shadow-sm border-b border-indigo-300">
        <div className="flex items-center gap-2">
          <FileText className="text-indigo-700" size={24} />
          <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">DocuFind</h1>
        </div>
        <div className="flex items-center gap-8">
          <button 
            onClick={() => router.push("/")}
            className="text-gray-700 hover:text-indigo-700 border-b-2 border-transparent hover:border-indigo-700 pb-1 transition"
          >
            Search
          </button>
          <button 
            className="text-indigo-800 font-semibold border-b-2 border-indigo-800 pb-1 transition"
          >
            Upload
          </button>
          <button 
            onClick={() => router.push("/libraries")}
            className="text-gray-700 hover:text-indigo-700 border-b-2 border-transparent hover:border-indigo-700 pb-1 transition"
          >
            Library
          </button>
          <User className="text-gray-700 hover:text-indigo-700 transition" size={22} />
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white/60 backdrop-blur-lg border border-indigo-300 rounded-2xl shadow-xl w-full max-w-2xl p-10 min-h-[500px] flex flex-col justify-between gap-6"
        >
          <div className="flex justify-between items-center mb-6"> {/* line 121 */}
            <div className={`flex flex-col items-center ${step >=1 ? 'text-indigo-700' : 'text-gray-400'}`}>
              <FileText size={28} />
              <span className="text-xs mt-1">Upload PDFs</span>
            </div>
            <div className={`flex-1 h-1 mx-2 rounded-full ${step >=2 ? 'bg-indigo-600' : 'bg-gray-300'}`} />
            <div className={`flex flex-col items-center ${step >=2 ? 'text-indigo-700' : 'text-gray-400'}`}>
              <FileJson2 size={28} />
              <span className="text-xs mt-1">Create DB</span>
            </div>
            <div className={`flex-1 h-1 mx-2 rounded-full ${step >=3 ? 'bg-indigo-600' : 'bg-gray-300'}`} />
            <div className={`flex flex-col items-center ${step >=3 ? 'text-indigo-700' : 'text-gray-400'}`}>
              <FileTextIcon size={28} />
              <span className="text-xs mt-1">Start Searching</span>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center text-center flex-grow"> {/* line 134 */}
            {error && (
              <div className="flex flex-col items-center justify-center">
                <h2 className="text-[12xl] font-bold text-red-700 mb-4">Error !</h2>
              </div>
            )}

            {!error && step === 1 && files.length === 0 && (
              <>
                <h2 className="text-6xl font-bold text-indigo-800 mb-4">Upload !</h2>
                <p className="text-sm text-gray-700 mb-6">
                  Upload only text files or PDFs. (pdf, txt, md, csv, json, xml)
                </p>
              </>
            )}
            {!error && step === 1 && files.length > 0 && (
              <div className="w-full max-w-md mx-auto space-y-2 text-left">
                {files.map((file, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm border-b border-gray-300 pb-1">
                    {getFileIcon(file.name)}
                    <span>{file.name}</span>
                    <span className="text-gray-500 ml-auto">{(file.size/1024).toFixed(2)} KB</span>
                  </div>
                ))}
              </div>
            )}

            {!error && step === 2 && (
              <>
                <h2 className="text-4xl font-bold text-indigo-800 mb-6">Create Vector Database</h2>
                <Network size={96} className="text-indigo-700 mb-4" />
                <p className="text-sm text-gray-700 max-w-md text-center">
                  Generating your database. Please wait, it might take some time.
                </p>
              </>
            )}

            {!error && step === 3 && (
              <>
                <h2 className="text-[2.5rem] font-bold text-indigo-800 leading-tight mb-4">
                  Start Semantic<br/>Search
                </h2>
                <SearchCode size={72} className="text-indigo-700 mb-4" />
                <p className="text-sm text-gray-700 max-w-md text-center">
                  Leverage semantic search to unlock insights from your documents.
                </p>
              </>
            )}
          </div>

          <div className="w-full max-w-md mx-auto mb-4 space-y-2"> {/* line 168 */}
            {step === 1 && uploadProgress > 0 && uploadProgress < 100 && (
              <>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 animate-pulse"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <div className="flex justify-center text-sm text-gray-700">{statusText}</div>
              </>
            )}
            {step === 2 && dbProgress > 0 && dbProgress < 100 && (
              <>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 animate-pulse"
                    style={{ width: `${dbProgress}%` }}
                  />
                </div>
                <div className="flex justify-center text-sm text-gray-700">{statusText}</div>
              </>
            )}
          </div>

          <div className="flex gap-4 w-full max-w-xs mx-auto"> {/* line 188 */}
            {step === 1 && !error && (
              <>
                <input 
                  type="file" 
                  accept=".pdf,.txt,.md,.csv,.json,.xml"
                  multiple 
                  onChange={handleFileSelect} 
                  className="hidden"
                  id="file-upload"
                />
                <label 
                  htmlFor="file-upload" 
                  className="flex-1 cursor-pointer bg-indigo-700 hover:bg-indigo-800 text-white px-6 py-3 rounded-lg transition shadow-md text-center"
                >
                  Select Files
                </label>
                <button
                  onClick={handleUpload}
                  className="flex-1 bg-indigo-700 hover:bg-indigo-800 text-white px-6 py-3 rounded-lg transition shadow-md"
                >
                  Upload
                </button>
              </>
            )}
            {step === 1 && error && (
              <button
                onClick={() => {
                  setError(false)
                  setFiles([])
                  setUploadProgress(0)
                }}
                className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition shadow-md"
              >
                Retry
              </button>
            )}
            {step === 2 && !error && (
              <button
                onClick={handleCreateDb}
                className="w-full bg-indigo-700 hover:bg-indigo-800 text-white px-6 py-3 rounded-lg transition shadow-md"
              >
                Create Database
              </button>
            )}
            {step === 2 && error && (
              <button
                onClick={() => {
                  setError(false)
                  setDbProgress(0)
                }}
                className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition shadow-md"
              >
                Retry
              </button>
            )}
            {step === 3 && (
              <button
                onClick={() => router.push("/")}
                className="w-full bg-indigo-700 hover:bg-indigo-800 text-white px-6 py-3 rounded-lg transition shadow-md"
              >
                Search
              </button>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  )
} // line 229
