import React, { useState, useEffect } from "react"
import { Message, TransitionablePortal } from "semantic-ui-react"
import styles from "./styles.module.scss"

export const TransitionMessage = (props) => {
  const [open, setOpen] = useState(false)
  const { success, error, header, content } = props
  const messageProps = {
    success,
    error,
    header,
    content,
  }
  const { duration } = props

  useEffect(() => {
    setOpen(true)
    setTimeout(() => setOpen(false), duration || 2500)
  }, [])

  return (
    <TransitionablePortal closeOnTriggerClick openOnTriggerClick open={open}>
      <div className={styles.message}>
        <Message floating {...messageProps} />
      </div>
    </TransitionablePortal>
  )
}

export default TransitionMessage