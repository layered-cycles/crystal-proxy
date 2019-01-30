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

function WidgetDisplay({ displayMode, enterMetaPage, leaveMetaPage }) {
  switch (displayMode) {
    case DisplayMode.LAYERS:
      return <LayersPage enterMetaPage={enterMetaPage} />
    case DisplayMode.META:
      return <MetaPage leaveMetaPage={leaveMetaPage} />
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
  Instance.selectWidgetState = ({ serviceUrl }) => ({ serviceUrl })
  return Instance
}
