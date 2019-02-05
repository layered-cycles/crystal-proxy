import React from 'react'
import setupAndRenderWidget from '../setupAndRenderWidget'
import LayersPage from './LayersPage'
import MetaPage from './MetaPage'

const DisplayMode = {
  LAYERS: 'LAYERS__DISPLAY_MODE',
  META: 'META__DISPLAY_MODE'
}

const MainWidget = applyWidgetBehavior(WidgetDisplay)
setupAndRenderWidget(MainWidget)

function WidgetDisplay({
  displayMode,
  enterMetaPage,
  frameLayers,
  frameDimensions,
  leaveMetaPage,
  serviceUrl
}) {
  switch (displayMode) {
    case DisplayMode.LAYERS:
      return (
        <LayersPage enterMetaPage={enterMetaPage} frameLayers={frameLayers} />
      )
    case DisplayMode.META:
      return (
        <MetaPage
          frameDimensions={frameDimensions}
          leaveMetaPage={leaveMetaPage}
          serviceUrl={serviceUrl}
        />
      )
  }
}

function applyWidgetBehavior(Component) {
  class Instance extends React.Component {
    state = {
      displayMode: DisplayMode.LAYERS
    }

    render() {
      return (
        <Component
          frameDimensions={this.props.frameDimensions}
          frameLayers={this.props.frameLayers}
          serviceUrl={this.props.serviceUrl}
          displayMode={this.state.displayMode}
          enterMetaPage={this.enterMetaPage.bind(this)}
          leaveMetaPage={this.leaveMetaPage.bind(this)}
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
  Instance.selectWidgetState = ({
    frameDimensions,
    frameLayers,
    serviceUrl
  }) => ({
    frameDimensions,
    frameLayers,
    serviceUrl
  })
  Instance.getDefaultState = () => ({
    frameLayers: []
  })
  return Instance
}
