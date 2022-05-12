import React, { useEffect } from "react"
import { List } from "semantic-ui-react"

// contexts
import { useFile } from "../../../contexts/useFile"

// styles
import styles from "./styles.module.scss"

const TreeNode = ({ data }) => {
  const file = useFile()

  if (!data) return <></>
  const { type, path, name } = data

  if (type === "directory") {
    return (
      <List.Item>
        <List.Icon name="folder" />
        <List.Content>
          <List.Description>{data.path}</List.Description>
          <List.List>
            {data.children.map((node) => (
              <TreeNode data={node} />
            ))}
          </List.List>
        </List.Content>
      </List.Item>
    )
  } else if (type === "file") {
    return (
      <List.Item
        className={styles.clickable}
        onClick={() => file.fetchFile(path)}>
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

  return (
    <List {...props}>
      <TreeNode data={file.files} />
    </List>
  )
}

export default SideBar
