import React from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import ChangeHistoryIcon from '@material-ui/icons/ChangeHistory'
import Typography from '@material-ui/core/Typography'
import AddIcon from '@material-ui/icons/Add'
import { withStyles } from '@material-ui/core/styles'

function HeaderDisplay({ classes, enterMetaPage, createLayer }) {
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          color="inherit"
          className={classes.metaButton}
          onClick={enterMetaPage}
        >
          <ChangeHistoryIcon fontSize="large" />
        </IconButton>
        <Typography
          variant="h6"
          color="inherit"
          className={classes.titleContainer}
        >
          Crystal
        </Typography>
        <IconButton color="inherit" onClick={createLayer}>
          <AddIcon fontSize="large" />
        </IconButton>
      </Toolbar>
    </AppBar>
  )
}

export default withStyles({
  titleContainer: {
    flexGrow: 1
  },
  metaButton: {
    marginLeft: -10,
    marginRight: 6
  }
})(HeaderDisplay)
