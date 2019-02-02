import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import TextField from '@material-ui/core/TextField'
import DialogActions from '@material-ui/core/DialogActions'
import Button from '@material-ui/core/Button'
import { WidgetContext } from '../setupAndRenderWidget'

const LAYER_JSON_TEMPLATE = `{
    type: "Foo",
    inputs: {

    }
}`

function DialogDisplay({
  open,
  onExited,
  frameLayerJson,
  updateFrameLayerJson,
  cancelNewLayer,
  acceptNewLayer
}) {
  return (
    <Dialog open={open} onExited={onExited}>
      <DialogTitle>New Layer</DialogTitle>
      <DialogContent>
        <TextField
          value={frameLayerJson}
          onChange={changeEvent =>
            updateFrameLayerJson(changeEvent.target.value)
          }
          rows={12}
          type="text"
          spellCheck="false"
          margin="normal"
          variant="outlined"
          label="JSON"
          fullWidth
          multiline
        />
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={cancelNewLayer}>
          Cancel
        </Button>
        <Button color="primary" onClick={acceptNewLayer}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  )
}

function applyDialogBehavior(Component) {
  class Instance extends React.Component {
    static contextType = WidgetContext

    state = {
      open: true,
      frameLayerJson: LAYER_JSON_TEMPLATE
    }

    render() {
      return (
        <Component
          onExited={this.props.onExited}
          open={this.state.open}
          frameLayerJson={this.state.frameLayerJson}
          updateFrameLayerJson={this.updateFrameLayerJson.bind(this)}
          cancelNewLayer={this.cancelNewLayer.bind(this)}
          acceptNewLayer={this.acceptNewLayer.bind(this)}
        />
      )
    }

    updateFrameLayerJson(nextFrameLayerJson) {
      this.setState({
        frameLayerJson: nextFrameLayerJson
      })
    }

    cancelNewLayer() {
      this.setState({
        open: false
      })
    }

    acceptNewLayer() {
      this.setState({
        open: false
      })
      const newFrameLayer = new Function(
        `return ${this.state.frameLayerJson}`
      )()
      this.context.postUserMessage({
        type: 'PUSH_FRAME_LAYER',
        payload: { newFrameLayer }
      })
    }
  }
  return Instance
}

export default applyDialogBehavior(DialogDisplay)
