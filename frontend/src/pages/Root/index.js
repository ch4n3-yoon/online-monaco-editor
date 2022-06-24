import React, { useState, useEffect } from "react"
import Editor from "@monaco-editor/react"
import { Grid, Button } from "semantic-ui-react"

// contexts
import { FileProvider, useFile } from "../../contexts/useFile"

// components
// import { SideBar } from "../../components/Editor"
import SideBar from "../../components/Editor/SideBar"
import TransitionMessage from "../../components/TransitionMessage"

// styles
import styles from "./styles.module.scss"

const Root = () => {
  const file = useFile()
  const [path, setPath] = useState("")
  const [content, setContent] = useState("")
  const [language, setLanguage] = useState("")

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [fail, setFail] = useState(false)
  const [message, setMessage] = useState("")

  const onFileContentChange = (content) => {
    setContent(content)
  }

  const onClick = () => {
    setLoading(true)

    file
      .saveFile(path, content)
      .then(() => {
        setSuccess(true)

        setMessage(`${path}를 저장했습니다.`)
        setTimeout(() => {
          setSuccess(false)
          setLoading(false)
        }, 3000)
      })
      .catch(() => {
        setFail(true)
        setMessage("저장하지 못했습니다")

        setTimeout(() => {
          setFail(false)
          setLoading(false)
        }, 3000)
      })
  }

  useEffect(() => {
    if (!file) return
    if (file.file === null) return
    if (file.file?.path === path) return

    setPath(file.file?.path)
    setContent(file.file?.content)

    console.log(file.file)
  }, [file])

  useEffect(() => {
    if (!path) return
    if (!path.includes(".")) return
    const extension = path.split(".").pop().toLowerCase()
    if (extension === "py") {
      setLanguage("python")
    } else if (extension === "js") {
      setLanguage("javascript")
    } else if (extension === "c") {
      setLanguage("c")
    } else if (extension === "cpp") {
      setLoading("cpp")
    } else if (extension === "php") {
      setLanguage("php")
    }
  }, [path])

  return (
    <div>
      <Grid stackable columns={2}>
        <Grid.Row>
          <Grid.Column width={4}>
            <SideBar />
          </Grid.Column>
          <Grid.Column width={12}>
            <Editor
              theme="vs-dark"
              height="100vh"
              width="100%"
              value={content}
              onChange={onFileContentChange}
              language={language}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <div className={styles.saveButton}>
        <Button positive loading={loading} content="Save" onClick={onClick} />
      </div>
      {fail && (
        <TransitionMessage
          error
          header="FAILED"
          content={message}
          duration={2000}
        />
      )}
      {success && (
        <TransitionMessage
          success
          header="SUCCESS"
          content={message}
          duration={2000}
        />
      )}
    </div>
  )
}

const WrappedRoot = () => {
  return (
    <FileProvider>
      <Root />
    </FileProvider>
  )
}

export default WrappedRoot
