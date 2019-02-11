import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import MetaHeader from './MetaHeader'
import MetaList from './MetaList'
import { WIDGET_CONTEXT } from '../../setupAndRenderWidget'

function PageDisplay({
  classes,
  leaveMetaPage,
  _downloadFrameImage,
  frameDimensions,
  serviceUrl,
  _updateFrameDimensions,
  _updateFrameSchema,
  _updateServiceUrl
}) {
  return (
    <div className={classes.pageContainer}>
      <MetaHeader leaveMetaPage={leaveMetaPage} />
      <MetaList
        downloadFrameImage={_downloadFrameImage}
        frameDimensions={frameDimensions}
        serviceUrl={serviceUrl}
        updateFrameDimensions={_updateFrameDimensions}
        updateFrameSchema={_updateFrameSchema}
        updateServiceUrl={_updateServiceUrl}
      />
    </div>
  )
}

function applyPageBehavior(DisplayComponent) {
  class Instance extends React.Component {
    static contextType = WIDGET_CONTEXT

    render() {
      return (
        <DisplayComponent
          frameDimensions={this.props.frameDimensions}
          leaveMetaPage={this.props.leaveMetaPage}
          serviceUrl={this.props.serviceUrl}
          _downloadFrameImage={this.downloadFrameImage.bind(this)}
          _updateFrameDimensions={this.updateFrameDimensions.bind(this)}
          _updateFrameSchema={this.updateFrameSchema.bind(this)}
          _updateServiceUrl={this.updateServiceUrl.bind(this)}
        />
      )
    }

    downloadFrameImage() {
      this.context.postUserMessage({
        type: 'DOWNLOAD_FRAME_IMAGE'
      })
    }

    updateFrameDimensions({ nextFrameDimensions }) {
      this.context.postUserMessage({
        type: 'UPDATE_FRAME_DIMENSIONS',
        payload: { nextFrameDimensions }
      })
    }

    updateFrameSchema({ nextSchemaSource }) {
      this.context.postUserMessage({
        type: 'UPDATE_FRAME_SCHEMA',
        payload: { nextSchemaSource }
      })
    }

    updateServiceUrl({ nextServiceUrl }) {
      this.context.postUserMessage({
        type: 'UPDATE_SERVICE_URL',
        payload: { nextServiceUrl }
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
  },
  textField: {
    width: '100%'
  }
})(PageDisplay)
export default applyPageBehavior(PageDisplayWithStyles)
