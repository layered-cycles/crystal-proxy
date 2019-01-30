import React from 'react'
import LayersHeader from './LayersHeader'
import { withStyles } from '@material-ui/core/styles'

function PageDisplay({ classes, enterMetaPage }) {
  return (
    <div className={classes.pageContainer}>
      <LayersHeader enterMetaPage={enterMetaPage} />
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
