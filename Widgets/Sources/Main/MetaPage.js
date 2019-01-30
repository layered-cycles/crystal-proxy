import React from 'react'
import MetaHeader from './MetaHeader'
import { withStyles } from '@material-ui/core/styles'

function PageDisplay({ classes, leaveMetaPage }) {
  return (
    <div className={classes.pageContainer}>
      <MetaHeader leaveMetaPage={leaveMetaPage} />
    </div>
  )
}

export default withStyles({
  pageContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100vw',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column'
  }
})(PageDisplay)
