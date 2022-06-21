import React, { createContext, useContext, useEffect, useState } from "react"
import { http, responseHandler } from "../utils/http"

const Context = createContext([])

export const FileProvider = ({ children }) => {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(false)

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

  const saveFile = (path, content) => {
    return new Promise((resolve, reject) => {
      http
        .post("/save", { path, content })
        .then(responseHandler)
        .then((data) => {
          resolve(data.data)
        })
        .catch((data) => {
          console.error(data)
          reject(data.message)
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
    saveFile,

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
