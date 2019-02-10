import React from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import ChangeHistoryIcon from '@material-ui/icons/ChangeHistoryRounded'
import AddIcon from '@material-ui/icons/AddRounded'
import { withStyles } from '@material-ui/core/styles'

function HeaderDisplay({ classes, enterMetaPage, focusLayer, layersLength }) {
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          className={classes.metaButton}
          onClick={enterMetaPage}
          color="inherit"
        >
          <ChangeHistoryIcon fontSize="large" />
        </IconButton>
        <div className={classes.buttonSpacer} />
        <IconButton
          onClick={() =>
            focusLayer({
              nextFocusedLayer: {
                index: layersLength,
                isNew: true,
                value: {
                  type: 'Foo',
                  inputs: {}
                }
              }
            })
          }
          color="inherit"
        >
          <AddIcon fontSize="large" />
        </IconButton>
      </Toolbar>
    </AppBar>
  )
}

export default withStyles({
  buttonSpacer: {
    flexGrow: 1
  },
  metaButton: {
    marginLeft: '-10px'
  }
})(HeaderDisplay)
