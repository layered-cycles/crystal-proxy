import React from 'react'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/ClearRounded'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import TextField from '@material-ui/core/TextField'
import DialogActions from '@material-ui/core/DialogActions'
import BackoutChangesIcon from '@material-ui/icons/ArrowBackIosRounded'
import ForwardChangesIcon from '@material-ui/icons/ArrowForwardIosRounded'
import { withStyles } from '@material-ui/core/styles'
import { WIDGET_CONTEXT } from '../../setupAndRenderWidget'

function DialogDisplay({
  layerIsNotNew,
  _deleteLayer,
  classes,
  unfocusLayer,
  _open,
  layerIndex,
  _updateJsonValueString,
  _jsonValueString,
  _backoutLayerChanges,
  _forwardLayerChanges
}) {
  let maybeDeleteButton = null
  if (layerIsNotNew) {
    maybeDeleteButton = (
      <IconButton onClick={_deleteLayer}>
        <DeleteIcon className={classes.actionIcon} />
      </IconButton>
    )
  }
  return (
    <Dialog onExited={unfocusLayer} open={_open}>
      <DialogTitle>{layerIndex}</DialogTitle>
      <DialogContent>
        <TextField
          onChange={changeEvent =>
            _updateJsonValueString({
              nextJsonValueString: changeEvent.target.value
            })
          }
          rows={13}
          value={_jsonValueString}
          helperText="json"
          label="Layer"
          margin="dense"
          spellCheck="false"
          type="text"
          variant="outlined"
          fullWidth
          multiline
        />
      </DialogContent>
      <DialogActions>
        {maybeDeleteButton}
        <div className={classes.buttonSpacer} />
        <IconButton onClick={_backoutLayerChanges}>
          <BackoutChangesIcon className={classes.actionIcon} />
        </IconButton>
        <IconButton onClick={_forwardLayerChanges}>
          <ForwardChangesIcon className={classes.actionIcon} />
        </IconButton>
      </DialogActions>
    </Dialog>
  )
}

function applyDialogBehavior(DisplayComponent) {
  class Instance extends React.Component {
    static contextType = WIDGET_CONTEXT

    constructor(props) {
      super(props)
      this.state = {
        jsonValueString: JSON.stringify(props.focusedLayer.value, null, 3),
        open: true
      }
    }

    render() {
      return (
        <DisplayComponent
          layerIndex={this.props.focusedLayer.index}
          layerIsNotNew={!this.props.focusedLayer.isNew}
          unfocusLayer={this.props.unfocusLayer}
          _jsonValueString={this.state.jsonValueString}
          _open={this.state.open}
          _backoutLayerChanges={this.backoutLayerChanges.bind(this)}
          _deleteLayer={this.deleteLayer.bind(this)}
          _forwardLayerChanges={this.forwardLayerChanges.bind(this)}
          _updateJsonValueString={this.updateJsonValueString.bind(this)}
        />
      )
    }

    backoutLayerChanges() {
      this.setState({
        open: false
      })
    }

    deleteLayer() {
      this.setState({
        open: false
      })
      this.context.postUserMessage({
        type: 'UPDATE_FRAME_LAYER',
        payload: {
          nextIndex: this.props.focusedLayer.index,
          nextLayer: undefined
        }
      })
    }

    forwardLayerChanges() {
      this.setState({
        open: false
      })
      this.context.postUserMessage({
        type: 'UPDATE_FRAME_LAYER',
        payload: {
          nextIndex: this.props.focusedLayer.index,
          nextLayer: JSON.parse(this.state.jsonValueString)
        }
      })
    }

    updateJsonValueString({ nextJsonValueString }) {
      this.setState({
        jsonValueString: nextJsonValueString
      })
    }
  }
  return Instance
}

const DialogDisplayWithStyles = withStyles(theme => ({
  actionIcon: {
    color: theme.palette.primary.main
  },
  buttonSpacer: {
    flex: '1 0 auto'
  }
}))(DialogDisplay)
export default applyDialogBehavior(DialogDisplayWithStyles)
