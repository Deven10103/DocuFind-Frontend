"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { FileText, User, File } from "lucide-react"

export default function ResultsPage() {
  const [data, setData] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const stored = localStorage.getItem("docuResult")
    if (stored) {
      setData(JSON.parse(stored))
    } else {
      router.push("/")
    }
  }, [router])

  const getPdfUrl = (doc: any) => `/static/${doc.source}`

  if (!data) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-200 via-purple-100 to-white">
      {/* Header */}
      <header className="w-full flex justify-between items-center px-6 sm:px-8 py-3 bg-white/40 backdrop-blur-md shadow-sm border-b border-indigo-300">
        <div className="flex items-center gap-2">
          <FileText className="text-indigo-700" size={24} />
          <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">DocuFind</h1>
        </div>
        <div className="flex items-center gap-6 sm:gap-8">
          <button onClick={() => router.push("/")} className="text-indigo-800 font-semibold border-b-2 border-indigo-800 pb-1 transition">Search</button>
          <button onClick={() => router.push("/upload")} className="text-gray-700 hover:text-indigo-700 border-b-2 border-transparent hover:border-indigo-700 pb-1 transition">Upload</button>
          <button onClick={() => router.push("/libraries")} className="text-gray-700 hover:text-indigo-700 border-b-2 border-transparent hover:border-indigo-700 pb-1 transition">Library</button>
          <User className="text-gray-700 hover:text-indigo-700 transition" size={22} />
        </div>
      </header>

      <main className="flex-grow p-6 max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">

        {/* Sidebar */}
        <aside className="w-full lg:w-64 p-4 bg-white/50 backdrop-blur rounded-xl shadow border border-indigo-200 h-fit">
          <h4 className="text-md font-semibold text-indigo-700 mb-4">Documents Referenced</h4>
          <div className="space-y-3 text-sm">
            {(data.docwise_responses || []).map((doc: any, idx: number) => (
              <div
                key={idx}
                onClick={() => window.open(getPdfUrl(doc), "_blank")}
                className="cursor-pointer font-semibold text-gray-800 bg-white/70 rounded-md px-3 py-2 shadow-sm hover:shadow-lg hover:bg-indigo-100 transition transform hover:scale-[1.02] break-words"
              >
                {doc.title || "Untitled Document"}
              </div>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 space-y-8">

          <Card className="p-8 shadow-lg border-indigo-300 bg-white/50 backdrop-blur rounded-xl space-y-4">
            <h2 className="text-2xl font-bold text-indigo-800">Overall Summary</h2>
            <p className="text-base font-semibold text-gray-800">Query: {data.question}</p>
            <p className="text-gray-800 text-base leading-relaxed break-words">{data.overall_response}</p>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(data.docwise_responses || []).map((doc: any, idx: number) => (
              <div
                key={idx}
                onClick={() => window.open(getPdfUrl(doc), "_blank")}
                className="p-6 bg-white/60 rounded-xl shadow border border-indigo-200 hover:shadow-lg transition transform hover:scale-[1.01] space-y-3 cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <File className="text-indigo-700" size={28} />
                  </div>
                  <div className="flex flex-col space-y-1 text-sm break-words">
                    <h5 className="text-lg font-bold text-gray-900">{doc.title || "Untitled Document"}</h5>
                    <p className="text-gray-700">
                      <strong>Authors:</strong> {(doc.authors && doc.authors.length > 0) ? doc.authors.join(", ") : "Unknown"}
                    </p>
                  </div>
                </div>
                <p className="text-gray-800 text-sm overflow-hidden line-clamp-3">
                  {doc.context}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
