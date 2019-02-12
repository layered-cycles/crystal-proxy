import React from 'react'
import setupAndRenderMainWidget from '../setupAndRenderMainWidget.js'
import LayersPage from './LayersPage/index.js'
import MetaPage from './MetaPage/index.js'

const DisplayMode = {
  LAYERS: 'LAYERS__DISPLAY_MODE',
  META: 'META__DISPLAY_MODE'
}

const MainWidget = applyMainBehavior(MainDisplay)
setupAndRenderMainWidget(MainWidget)

function MainDisplay({
  _displayMode,
  _enterMetaPage,
  frameLayers,
  frameDimensions,
  _leaveMetaPage,
  serviceUrl
}) {
  switch (_displayMode) {
    case DisplayMode.LAYERS:
      return (
        <LayersPage enterMetaPage={_enterMetaPage} frameLayers={frameLayers} />
      )
    case DisplayMode.META:
      return (
        <MetaPage
          frameDimensions={frameDimensions}
          leaveMetaPage={_leaveMetaPage}
          serviceUrl={serviceUrl}
        />
      )
  }
}

function applyMainBehavior(DisplayComponent) {
  class Instance extends React.Component {
    state = {
      displayMode: DisplayMode.LAYERS
    }

    render() {
      return (
        <DisplayComponent
          frameDimensions={this.props.frameDimensions}
          frameLayers={this.props.frameLayers}
          serviceUrl={this.props.serviceUrl}
          _displayMode={this.state.displayMode}
          _enterMetaPage={this.enterMetaPage.bind(this)}
          _leaveMetaPage={this.leaveMetaPage.bind(this)}
        />
      )
    }

    enterMetaPage() {
      this.setState({
        displayMode: DisplayMode.META
      })
    }

    leaveMetaPage() {
      this.setState({
        displayMode: DisplayMode.LAYERS
      })
    }
  }
  Instance.selectState = ({ frameDimensions, frameLayers, serviceUrl }) => ({
    frameDimensions,
    frameLayers,
    serviceUrl
  })
  Instance.getDefaultState = () => ({
    frameLayers: []
  })
  return Instance
}
