import React from 'react'
import TextField from '@material-ui/core/TextField'
import { withStyles } from '@material-ui/core/styles'
import MetaHeader from './MetaHeader'
import { WidgetContext } from '../setupAndRenderWidget'

function PageDisplay({ classes, leaveMetaPage, serviceUrl, updateServiceUrl }) {
  return (
    <div className={classes.pageContainer}>
      <MetaHeader leaveMetaPage={leaveMetaPage} />
      <TextField
        label="Service URL"
        placeholder="http://localhost:3000"
        margin="normal"
        variant="outlined"
        className={classes.textField}
        value={serviceUrl}
        onChange={changeEvent => updateServiceUrl(changeEvent.target.value)}
        autoFocus={serviceUrl === ''}
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
          serviceUrl={this.context.widgetState.serviceUrl}
          leaveMetaPage={this.props.leaveMetaPage}
          updateServiceUrl={this.updateServiceUrl.bind(this)}
        />
      )
    }

    updateServiceUrl(nextServiceUrl) {
      this.context.postUserMessage({
        type: 'UPDATE_SERVICE_URL',
        payload: { nextServiceUrl }
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
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  }
}))(PageDisplay)

export default applyPageBehavior(PageDisplayWithStyles)
