import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import TextField from '@material-ui/core/TextField'
import DialogActions from '@material-ui/core/DialogActions'
import Button from '@material-ui/core/Button'
import { WidgetContext } from '../setupAndRenderWidget'

const LAYER_STRING_TEMPLATE = `{
    type: "Foo",
    inputs: {

    }
}`

function DialogDisplay({
  open,
  onExited,
  frameLayerString,
  updateFrameLayerString,
  cancelNewLayer,
  acceptNewLayer
}) {
  return (
    <Dialog open={open} onExited={onExited}>
      <DialogTitle>New Layer</DialogTitle>
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
        <Button onClick={cancelNewLayer} color="primary">
          Cancel
        </Button>
        <Button onClick={acceptNewLayer} color="primary">
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
      frameLayerString: LAYER_STRING_TEMPLATE
    }

    render() {
      return (
        <Component
          onExited={this.props.onExited}
          open={this.state.open}
          frameLayerString={this.state.frameLayerString}
          updateFrameLayerString={this.updateFrameLayerString.bind(this)}
          cancelNewLayer={this.cancelNewLayer.bind(this)}
          acceptNewLayer={this.acceptNewLayer.bind(this)}
        />
      )
    }

    updateFrameLayerString(nextFrameLayerString) {
      this.setState({
        frameLayerString: nextFrameLayerString
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
        `return ${this.state.frameLayerString}`
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
