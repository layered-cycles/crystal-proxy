import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import LayerDialog from './LayerDialog'
import LayersHeader from './LayersHeader'
import LayersList from './LayersList'
import { WidgetContext } from '../setupAndRenderWidget'

function PageDisplay({
  _focusedLayer,
  _unfocusLayer,
  classes,
  enterMetaPage,
  _focusLayer,
  layersLength
}) {
  let dialogContent = null
  if (_focusedLayer) {
    dialogContent = (
      <LayerDialog focusedLayer={_focusedLayer} unfocusLayer={_unfocusLayer} />
    )
  }
  return (
    <div className={classes.pageContainer}>
      <LayersHeader
        enterMetaPage={enterMetaPage}
        focusLayer={_focusLayer}
        layersLength={layersLength}
      />
      <LayersList focusLayer={_focusLayer} />
      {dialogContent}
    </div>
  )
}

function applyPageBehavior(Component) {
  class Instance extends React.Component {
    static contextType = WidgetContext

    state = {
      focusedLayer: null
    }

    render() {
      return (
        <Component
          layersLength={this.context.widgetState.frameLayers.length}
          enterMetaPage={this.props.enterMetaPage}
          _focusedLayer={this.state.focusedLayer}
          _focusLayer={this.focusLayer.bind(this)}
          _unfocusLayer={this.unfocusLayer.bind(this)}
        />
      )
    }

    focusLayer({ nextFocusedLayer }) {
      this.setState({
        focusedLayer: {
          isNew: false,
          ...nextFocusedLayer
        }
      })
    }

    unfocusLayer() {
      this.setState({
        focusedLayer: null
      })
    }
  }
  return Instance
}

const PageDisplayWithStyles = withStyles({
  pageContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100vw',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column'
  }
})(PageDisplay)
export default applyPageBehavior(PageDisplayWithStyles)
