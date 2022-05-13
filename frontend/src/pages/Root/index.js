import React, { useState, useEffect } from "react"
import Editor from "@monaco-editor/react"
import { Grid, Button } from "semantic-ui-react"

// contexts
import { FileProvider, useFile } from "../../contexts/useFile"

// components
// import { SideBar } from "../../components/Editor"
import SideBar from "../../components/Editor/SideBar"

// styles
import styles from "./styles.module.scss"

const Root = () => {
  const file = useFile()
  const [path, setPath] = useState("")
  const [content, setContent] = useState("")

  const onFileContentChange = (content) => {
    setContent(content)
  }

  useEffect(() => {
    if (!file) return
    if (file.file === null) return
    if (file.file.path === path) return

    setPath(file.file.path)
    setContent(file.file.content)
  }, [file])

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
              defaultLanguage="python"
              value={content}
              onChange={onFileContentChange}
              language="python"
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <div className={styles.saveButton}>
        <Button
          positive
          content="Save"
          onClick={() => file.saveFile(path, content)}
        />
      </div>
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
