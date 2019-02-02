import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import DialogContent from '@material-ui/core/DialogContent'
import TextField from '@material-ui/core/TextField'
import DialogActions from '@material-ui/core/DialogActions'
import Button from '@material-ui/core/Button'
import { withStyles } from '@material-ui/core/styles'
import { WidgetContext } from '../setupAndRenderWidget'

function DialogDisplay({
  open,
  onExited,
  classes,
  layerIndex,
  deleteLayer,
  frameLayerString,
  updateFrameLayerString,
  cancelUpdateLayer,
  acceptUpdateLayer
}) {
  return (
    <Dialog open={open} onExited={onExited}>
      <DialogTitle className={classes.titleContainer} disableTypography>
        <Typography variant="h6">Layer: {layerIndex + 1}</Typography>
        <IconButton className={classes.deleteButton} onClick={deleteLayer}>
          <DeleteIcon className={classes.deleteIcon} />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <TextField
          value={frameLayerString}
          onChange={changeEvent =>
            updateFrameLayerString(changeEvent.target.value)
          }
          rows={12}
          type="text"
          spellCheck="false"
          margin="normal"
          variant="outlined"
          label="POJO"
          fullWidth
          multiline
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={cancelUpdateLayer} color="primary">
          Cancel
        </Button>
        <Button onClick={acceptUpdateLayer} color="primary">
          Update
        </Button>
      </DialogActions>
    </Dialog>
  )
}

function applyDialogBehavior(Component) {
  class Instance extends React.Component {
    static contextType = WidgetContext

    constructor(props) {
      super(props)
      this.state = {
        open: true,
        frameLayerString: JSON.stringify(props.frameLayer, null, 2)
      }
    }

    render() {
      return (
        <Component
          onExited={this.props.onExited}
          layerIndex={this.props.layerIndex}
          open={this.state.open}
          frameLayerString={this.state.frameLayerString}
          updateFrameLayerString={this.updateFrameLayerString.bind(this)}
          cancelUpdateLayer={this.cancelUpdateLayer.bind(this)}
          acceptUpdateLayer={this.acceptUpdateLayer.bind(this)}
          deleteLayer={this.deleteLayer.bind(this)}
        />
      )
    }

    updateFrameLayerString(nextFrameLayerString) {
      this.setState({
        frameLayerString: nextFrameLayerString
      })
    }

    cancelUpdateLayer() {
      this.setState({
        open: false
      })
    }

    acceptUpdateLayer() {
      this.setState({
        open: false
      })
      const updatedLayerIndex = this.props.layerIndex
      const updatedFrameLayer = new Function(
        `return ${this.state.frameLayerString}`
      )()
      this.context.postUserMessage({
        type: 'UPDATE_FRAME_LAYER',
        payload: {
          updatedLayerIndex,
          updatedFrameLayer
        }
      })
    }

    deleteLayer() {
      this.setState({
        open: false
      })
      this.context.postUserMessage({
        type: 'DELETE_FRAME_LAYER',
        payload: {
          layerIndex: this.props.layerIndex
        }
      })
    }
  }
  return Instance
}

const DialogDisplayWithStyles = withStyles(theme => ({
  titleContainer: {
    margin: 0,
    paddingTop: theme.spacing.unit * 2
  },
  deleteButton: {
    position: 'absolute',
    right: theme.spacing.unit,
    top: theme.spacing.unit
  },
  deleteIcon: {
    color: theme.palette.primary.dark
  }
}))(DialogDisplay)
export default applyDialogBehavior(DialogDisplayWithStyles)
