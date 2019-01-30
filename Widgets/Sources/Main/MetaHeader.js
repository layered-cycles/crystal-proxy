import React from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import BackIcon from '@material-ui/icons/ArrowBack'
import Typography from '@material-ui/core/Typography'
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
          <BackIcon fontSize="large" />
        </IconButton>
        <Typography
          variant="h6"
          color="inherit"
          className={classes.titleContainer}
        >
          Meta
        </Typography>
      </Toolbar>
    </AppBar>
  )
}

export default withStyles({
  titleContainer: {
    flexGrow: 1
  },
  backButton: {
    marginLeft: -10,
    marginRight: 6
  }
})(HeaderDisplay)
