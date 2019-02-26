import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import LayerDialog from './LayerDialog'
import LayersHeader from './LayersHeader'
import LayersList from './LayersList'

function PageDisplay({
  _maybeFocusedLayer,
  _unfocusLayer,
  classes,
  enterMetaPage,
  _focusLayer,
  frameLayers
}) {
  let maybeDialogContent = null
  if (_maybeFocusedLayer) {
    maybeDialogContent = (
      <LayerDialog
        focusedLayer={_maybeFocusedLayer}
        unfocusLayer={_unfocusLayer}
      />
    )
  }
  return (
    <div className={classes.pageContainer}>
      <LayersHeader
        enterMetaPage={enterMetaPage}
        focusLayer={_focusLayer}
        layersLength={frameLayers.length}
      />
      <LayersList focusLayer={_focusLayer} frameLayers={frameLayers} />
      {maybeDialogContent}
    </div>
  )
}

function applyPageBehavior(DisplayComponent) {
  class Instance extends React.Component {
    state = {
      maybeFocusedLayer: null
    }

    render() {
      return (
        <DisplayComponent
          enterMetaPage={this.props.enterMetaPage}
          frameLayers={this.props.frameLayers}
          _maybeFocusedLayer={this.state.maybeFocusedLayer}
          _focusLayer={this.focusLayer.bind(this)}
          _unfocusLayer={this.unfocusLayer.bind(this)}
        />
      )
    }

    focusLayer({ nextFocusedLayer }) {
      this.setState({
        maybeFocusedLayer: {
          isNew: false,
          ...nextFocusedLayer
        }
      })
    }

    unfocusLayer() {
      this.setState({
        maybeFocusedLayer: null
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
