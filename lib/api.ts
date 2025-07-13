// lib/api.ts
export const ROOT_SERVER_URL = "http://127.0.0.1:8000"  

export async function getLibrary(libraryName: string) {
  const res = await fetch(`${ROOT_SERVER_URL}/library/${libraryName}`)
  return res.json()
}

export async function queryText(text: string) {
  const res = await fetch(`${ROOT_SERVER_URL}/query/${text}`)
  return res.json()
}

export async function getFileTitle(title: string) {
  // imaginary route for file title
  const res = await fetch(`${ROOT_SERVER_URL}/file_title/${title}`)
  return res.json()
}

export async function getKeywords(keywords: string) {
  // imaginary route for keywords
  const res = await fetch(`${ROOT_SERVER_URL}/keywords/${keywords}`)
  return res.json()
}
