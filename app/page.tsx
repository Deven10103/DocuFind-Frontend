"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, User } from "lucide-react"
import { motion } from "framer-motion"
import { getLibrary, queryText, getFileTitle, getKeywords } from "@/lib/api"

type RouteOption = "library" | "fileTitle" | "keywords" | "semantic"

export default function Home() {
  const [query, setQuery] = useState("")
  const [selectedRoute, setSelectedRoute] = useState<RouteOption>("library")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)

    try {
      let result
      switch (selectedRoute) {
        case "library":
          result = await getLibrary(query)
          break
        case "fileTitle":
          result = await getFileTitle(query)
          break
        case "keywords":
          result = await getKeywords(query)
          break
        case "semantic":
          result = await queryText(query)
          break
      }

      if (result) {
        localStorage.setItem("docuResult", JSON.stringify(result))
        router.push("/results")
      }
    } catch (error) {
      console.error("Failed fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-200 via-purple-100 to-white">
      {/* Header */}
      <header className="w-full flex justify-between items-center pl-8 pr-8 py-3 bg-white/40 backdrop-blur-md shadow-sm border-b border-indigo-300">
        <div className="flex items-center gap-2">
          <FileText className="text-indigo-700" size={24} />
          <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">DocuFind</h1>
        </div>
        <div className="flex items-center gap-8">
          <button className="text-indigo-800 font-semibold border-b-2 border-indigo-800 pb-1 transition">Search</button>
          <button className="text-gray-700 hover:text-indigo-700 border-b-2 border-transparent hover:border-indigo-700 pb-1 transition">Upload</button>
          <button className="text-gray-700 hover:text-indigo-700 border-b-2 border-transparent hover:border-indigo-700 pb-1 transition">Library</button>
          <User className="text-gray-700 hover:text-indigo-700 transition" size={22} />
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow p-6 max-w-4xl mx-auto flex flex-col gap-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8 }}
          className="w-full text-center"
        >
          <div className="flex justify-center items-center gap-3 mb-6">
            <FileText className="text-indigo-800" size={55} />
            <h2 className="text-5xl sm:text-6xl font-extrabold text-indigo-800">DocuFind</h2>
          </div>

          <p className="text-md sm:text-lg text-gray-800 max-w-2xl mx-auto mb-10">
            Discover insights faster with DocuFind — a local semantic search engine tailor-made for researchers.
          </p>

          <h3 className="text-base sm:text-lg font-semibold text-indigo-700 mb-2">
            Explore your database with natural language queries
          </h3>
          <p className="text-sm text-gray-700 mb-8">
            Write a query or document ID to start your search.
          </p>

          <form 
            onSubmit={handleSubmit} 
            className="w-full max-w-xl mx-auto flex flex-col sm:flex-row items-center gap-4 mb-8"
          >
            <Input
              type="text"
              placeholder="Type your query..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-grow bg-white border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
            />
            <Button type="submit" className="bg-indigo-700 hover:bg-indigo-800 text-white px-6 py-3 transition transform hover:scale-105 hover:shadow-lg">
              {loading ? "Searching..." : "Search"}
            </Button>
          </form>

          <div className="flex flex-wrap justify-center gap-4">
            {["library", "fileTitle", "keywords", "semantic"].map((opt) => (
              <Button
                key={opt}
                variant="outline"
                onClick={() => setSelectedRoute(opt as RouteOption)}
                className={`px-4 py-2 text-xs transition duration-150 ease-out active:bg-indigo-200
                  ${selectedRoute === opt 
                    ? "bg-indigo-600 text-white scale-105 shadow-md pointer-events-none" 
                    : "text-gray-800 hover:bg-indigo-100 hover:text-indigo-700"}`}
              >
                {opt.charAt(0).toUpperCase() + opt.slice(1)}
              </Button>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  )
}
