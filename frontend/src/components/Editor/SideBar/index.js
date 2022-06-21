import React, { useEffect } from "react"
import { List } from "semantic-ui-react"

// contexts
import { useFile } from "../../../contexts/useFile"

// styles
import styles from "./styles.module.scss"

const TreeNode = ({ data, path }) => {
  const file = useFile()

  if (!data) return <></>
  const { type, name } = data
  const basePath = path.concat(`${name}`)

  if (type === "directory") {
    return (
      <List.Item>
        <List.Icon name="folder" />
        <List.Content>
          <List.Description>{data.name}</List.Description>
          <List.List>
            {data.children.map((node) => (
              <TreeNode data={node} path={`${basePath}/`} />
            ))}
          </List.List>
        </List.Content>
      </List.Item>
    )
  } else if (type === "file") {
    return (
      <List.Item
        className={styles.fileItem}
        onClick={() => file.fetchFile(basePath)}>
        <List.Icon name="file" />
        <List.Content>
          <List.Description>{name}</List.Description>
        </List.Content>
      </List.Item>
    )
  }
}

export const SideBar = (props) => {
  const file = useFile()

  useEffect(() => {
    if (!file) return
    if (file.files) return

    file.fetchFiles("./")
  }, [file])

  if (file.files?.name === null) {
    return <div>Now Loading...</div>
  }

  return (
    <div className={styles.fileList}>
      <List {...props}>
        <List.Item>
          <List.Icon name="folder" />
          <List.Content>
            <List.Description>{file.files?.name}</List.Description>
            <List.List>
              {file.files?.children.map((node) => (
                <TreeNode data={node} path="" />
              ))}
            </List.List>
          </List.Content>
        </List.Item>
        {/* {file.files?.children.map((file) => (
          <TreeNode data={file.files} path="" />
        ))} */}
      </List>
    </div>
  )
}

export default SideBar
