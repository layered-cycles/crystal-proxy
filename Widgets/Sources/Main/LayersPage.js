import React from 'react'
import LayersHeader from './LayersHeader'
import LayersList from './LayersList'
import CreateLayerDialog from './CreateLayerDialog'
import { withStyles } from '@material-ui/core/styles'
import UpdateLayerDialog from './UpdateLayerDialog'

const DisplayMode = {
  CREATE: 'CREATE__DISPLAY_MODE',
  UPDATE: 'UPDATE__DISPLAY_MODE',
  LIST: 'LIST__DISPLAY_MODE'
}

function PageDisplay({
  displayMode,
  resetDisplayMode,
  activeLayerIndex,
  activeFrameLayer,
  classes,
  enterMetaPage,
  createLayer,
  updateLayer
}) {
  let dialogContent = null
  switch (displayMode) {
    case DisplayMode.CREATE:
      dialogContent = <CreateLayerDialog onExited={resetDisplayMode} />
      break
    case DisplayMode.UPDATE:
      dialogContent = (
        <UpdateLayerDialog
          onExited={resetDisplayMode}
          layerIndex={activeLayerIndex}
          frameLayer={activeFrameLayer}
        />
      )
      break
  }
  return (
    <div className={classes.pageContainer}>
      <LayersHeader enterMetaPage={enterMetaPage} createLayer={createLayer} />
      <LayersList updateLayer={updateLayer} />
      {dialogContent}
    </div>
  )
}

function applyPageBehavior(Component) {
  class Instance extends React.Component {
    state = {
      displayMode: DisplayMode.LIST,
      activeLayerIndex: null,
      activeFrameLayer: null
    }

    render() {
      return (
        <Component
          enterMetaPage={this.props.enterMetaPage}
          displayMode={this.state.displayMode}
          activeLayerIndex={this.state.activeLayerIndex}
          activeFrameLayer={this.state.activeFrameLayer}
          resetDisplayMode={this.resetDisplayMode.bind(this)}
          createLayer={this.createLayer.bind(this)}
          updateLayer={this.updateLayer.bind(this)}
        />
      )
    }

    resetDisplayMode() {
      this.setState({
        displayMode: DisplayMode.LIST,
        activeFrameLayer: null
      })
    }

    createLayer() {
      this.setState({
        displayMode: DisplayMode.CREATE
      })
    }

    updateLayer({ nextActiveFrameLayer, nextActiveLayerIndex }) {
      this.setState({
        displayMode: DisplayMode.UPDATE,
        activeFrameLayer: nextActiveFrameLayer,
        activeLayerIndex: nextActiveLayerIndex
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
