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
  frameDimensions,
  updateFrameDimensions,
  schemaExpanded,
  toggleSchemaPanel
}) {
  console.log(frameDimensions)
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
      >
        <TextField
          value={frameDimensions.width}
          onChange={changeEvent =>
            updateFrameDimensions({
              ...frameDimensions,
              width: Number(changeEvent.target.value)
            })
          }
          label="Width"
          variant="outlined"
          margin="dense"
          type="number"
          placeholder="512"
          required
          fullWidth
        />
        <TextField
          value={frameDimensions.height}
          onChange={changeEvent =>
            updateFrameDimensions({
              ...frameDimensions,
              height: Number(changeEvent.target.value)
            })
          }
          label="Height"
          variant="outlined"
          margin="normal"
          type="number"
          placeholder="512"
          required
          fullWidth
        />
      </MetaPanel>
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
          frameDimensions={this.props.frameDimensions}
          updateFrameDimensions={this.props.updateFrameDimensions}
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
