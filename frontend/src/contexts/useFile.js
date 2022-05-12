import React, { createContext, useContext, useEffect, useState } from "react"
import { http, responseHandler } from "../utils/http"

const Context = createContext([])

export const FileProvider = ({ children }) => {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(false)

  const [article, setArticle] = useState(null)
  const [articles, setArticles] = useState(null)

  const [file, setFile] = useState(null)
  const [files, setFiles] = useState(null)

  const fetchFile = (path) => {
    return new Promise((resolve, reject) => {
      http
        .get("/cat", {
          params: { path },
        })
        .then(responseHandler)
        .then((data) => {
          setFile(data.data)
          resolve(data.data)
        })
        .catch((data) => {
          console.error(data)
        })
    })
  }

  const fetchFiles = () => {
    return new Promise((resolve, reject) => {
      http
        .get("/ls", {
          params: {
            path: "./",
          },
        })
        .then(responseHandler)
        .then((data) => {
          setFiles(data.data)
          resolve(data.data)
        })
        .catch((data) => {
          console.error(data)
        })
    })
  }

  const context = {
    loading,
    status,

    file,
    fetchFile,

    files,
    fetchFiles,
  }

  return <Context.Provider value={context}>{children}</Context.Provider>
}

export const useFile = () => {
  return useContext(Context)
}

export default {
  useFile,
  FileProvider,
}
