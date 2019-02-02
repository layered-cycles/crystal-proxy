import React from 'react'
import LayersHeader from './LayersHeader'
import LayersList from './LayersList'
import CreateLayerDialog from './CreateLayerDialog'
import { withStyles } from '@material-ui/core/styles'

const DisplayMode = {
  CREATE: 'CREATE__DISPLAY_MODE',
  EDIT: 'EDIT__DISPLAY_MODE',
  LIST: 'LIST__DISPLAY_MODE'
}

function PageDisplay({
  displayMode,
  resetDisplayMode,
  classes,
  enterMetaPage,
  createLayer
}) {
  let dialogContent = null
  switch (displayMode) {
    case DisplayMode.CREATE:
      dialogContent = <CreateLayerDialog onExited={resetDisplayMode} />
      break
  }
  return (
    <div className={classes.pageContainer}>
      <LayersHeader enterMetaPage={enterMetaPage} createLayer={createLayer} />
      <LayersList />
      {dialogContent}
    </div>
  )
}

function applyPageBehavior(Component) {
  class Instance extends React.Component {
    state = {
      displayMode: DisplayMode.LIST
    }

    render() {
      return (
        <Component
          enterMetaPage={this.props.enterMetaPage}
          displayMode={this.state.displayMode}
          createLayer={this.createLayer.bind(this)}
          resetDisplayMode={this.resetDisplayMode.bind(this)}
        />
      )
    }

    createLayer() {
      this.setState({
        displayMode: DisplayMode.CREATE
      })
    }

    resetDisplayMode() {
      this.setState({
        displayMode: DisplayMode.LIST
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
