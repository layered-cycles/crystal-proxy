import React from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import MetaIcon from '@material-ui/icons/DetailsRounded'
import { withStyles } from '@material-ui/core/styles'

function HeaderDisplay({ classes, leaveMetaPage }) {
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          className={classes.backButton}
          onClick={() => leaveMetaPage()}
          color="inherit"
        >
          <MetaIcon fontSize="large" />
        </IconButton>
      </Toolbar>
    </AppBar>
  )
}

export default withStyles({
  backButton: {
    marginLeft: '-10px',
    paddingTop: '14px',
    paddingBottom: '10px'
  }
})(HeaderDisplay)
