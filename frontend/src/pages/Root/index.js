import React, { useState, useEffect } from "react"
import Editor from "@monaco-editor/react"
import { Grid } from "semantic-ui-react"

// contexts
import { FileProvider, useFile } from "../../contexts/useFile"

// components
// import { SideBar } from "../../components/Editor"
import SideBar from "../../components/Editor/SideBar"

const Root = () => {
  const file = useFile()

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
              value={file.file || "// comment"}
              language="python"
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
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
