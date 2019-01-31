import React from 'react'
import TextField from '@material-ui/core/TextField'
import { withStyles } from '@material-ui/core/styles'
import MetaPanel from './MetaPanel'

function ListDisplay({
  classes,
  serviceExpanded,
  toggleServicePanel,
  serviceUrl,
  updateServiceUrl,
  dimensionsExpanded,
  toggleDimensionsPanel,
  schemaExpanded,
  toggleSchemaPanel
}) {
  return (
    <div className={classes.listContainer}>
      <MetaPanel
        expanded={serviceExpanded}
        onToggle={toggleServicePanel}
        title="Service"
      >
        <TextField
          value={serviceUrl}
          onChange={changeEvent => updateServiceUrl(changeEvent.target.value)}
          label="URL"
          variant="outlined"
          margin="dense"
          placeholder="http://localhost:3000"
          required
          fullWidth
        />
      </MetaPanel>
      <MetaPanel
        expanded={dimensionsExpanded}
        onToggle={toggleDimensionsPanel}
        title="Dimensions"
      />
      <MetaPanel
        expanded={schemaExpanded}
        onToggle={toggleSchemaPanel}
        title="Schema"
      />
    </div>
  )
}

function applyListBehavior(Component) {
  class Instance extends React.Component {
    state = {
      serviceExpanded: false,
      dimensionsExpanded: false,
      schemaExpanded: false
    }

    render() {
      return (
        <Component
          serviceUrl={this.props.serviceUrl}
          updateServiceUrl={this.props.updateServiceUrl}
          serviceExpanded={this.state.serviceExpanded}
          dimensionsExpanded={this.state.dimensionsExpanded}
          toggleServicePanel={this.toggleServicePanel.bind(this)}
          toggleDimensionsPanel={this.toggleDimensionsPanel.bind(this)}
          toggleSchemaPanel={this.toggleSchemaPanel.bind(this)}
        />
      )
    }

    toggleServicePanel() {
      this.setState({
        serviceExpanded: !this.state.serviceExpanded
      })
    }

    toggleDimensionsPanel() {
      this.setState({
        dimensionsExpanded: !this.state.dimensionsExpanded
      })
    }

    toggleSchemaPanel() {
      this.setState({
        schemaExpanded: !this.state.schemaExpanded
      })
    }
  }
  return Instance
}

const ListDisplayWithStyles = withStyles({
  listContainer: {
    flex: '1 1 auto',
    overflow: 'scroll'
  }
})(ListDisplay)
export default applyListBehavior(ListDisplayWithStyles)
