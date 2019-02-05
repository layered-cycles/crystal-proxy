import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import MetaHeader from './MetaHeader'
import MetaList from './MetaList'
import { WidgetContext } from '../setupAndRenderWidget'

function PageDisplay({
  classes,
  leaveMetaPage,
  serviceUrl,
  updateServiceUrl,
  frameDimensions,
  updateFrameDimensions,
  updateFrameSchema
}) {
  return (
    <div className={classes.pageContainer}>
      <MetaHeader leaveMetaPage={leaveMetaPage} />
      <MetaList
        serviceUrl={serviceUrl}
        updateServiceUrl={updateServiceUrl}
        frameDimensions={frameDimensions}
        updateFrameDimensions={updateFrameDimensions}
        updateFrameSchema={updateFrameSchema}
      />
    </div>
  )
}

function applyPageBehavior(Component) {
  class Instance extends React.Component {
    static contextType = WidgetContext

    render() {
      return (
        <Component
          serviceUrl={this.props.serviceUrl}
          frameDimensions={this.props.frameDimensions}
          leaveMetaPage={this.props.leaveMetaPage}
          updateServiceUrl={this.updateServiceUrl.bind(this)}
          updateFrameDimensions={this.updateFrameDimensions.bind(this)}
          updateFrameSchema={this.updateFrameSchema.bind(this)}
        />
      )
    }

    updateServiceUrl(nextServiceUrl) {
      this.context.postUserMessage({
        type: 'UPDATE_SERVICE_URL',
        payload: { nextServiceUrl }
      })
    }

    updateFrameDimensions(nextFrameDimensions) {
      this.context.postUserMessage({
        type: 'UPDATE_FRAME_DIMENSIONS',
        payload: { nextFrameDimensions }
      })
    }

    updateFrameSchema(nextSchemaSource) {
      this.context.postUserMessage({
        type: 'UPDATE_FRAME_SCHEMA',
        payload: { nextSchemaSource }
      })
    }
  }
  return Instance
}

const PageDisplayWithStyles = withStyles(theme => ({
  pageContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100vw',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column'
  },
  textField: {
    width: '100%'
  }
}))(PageDisplay)

export default applyPageBehavior(PageDisplayWithStyles)
