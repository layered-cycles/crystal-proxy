import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import TextField from '@material-ui/core/TextField'
import DialogActions from '@material-ui/core/DialogActions'
import Button from '@material-ui/core/Button'
import { WidgetContext } from '../setupAndRenderWidget'

function DialogDisplay({
  open,
  onExited,
  layerIndex,
  frameLayerString,
  updateFrameLayerString,
  cancelUpdateLayer,
  acceptUpdateLayer
}) {
  return (
    <Dialog open={open} onExited={onExited}>
      <DialogTitle>Layer - {layerIndex + 1}</DialogTitle>
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
        <Button color="primary" onClick={cancelUpdateLayer}>
          Cancel
        </Button>
        <Button color="primary" onClick={acceptUpdateLayer}>
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
  }
  return Instance
}

export default applyDialogBehavior(DialogDisplay)
