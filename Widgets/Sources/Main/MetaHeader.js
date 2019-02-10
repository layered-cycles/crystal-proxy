import React from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import DetailsIcon from '@material-ui/icons/DetailsRounded'
import { withStyles } from '@material-ui/core/styles'

function HeaderDisplay({ classes, leaveMetaPage }) {
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          color="inherit"
          className={classes.backButton}
          onClick={leaveMetaPage}
        >
          <DetailsIcon fontSize="large" />
        </IconButton>
      </Toolbar>
    </AppBar>
  )
}

export default withStyles({
  titleContainer: {
    flexGrow: 1
  },
  backButton: {
    marginLeft: '-10px',
    paddingTop: '14px',
    paddingBottom: '10px'
  }
})(HeaderDisplay)
