import React from 'react'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '@material-ui/core/Avatar'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import IconButton from '@material-ui/core/IconButton'
import LaunchIcon from '@material-ui/icons/Launch'
import Divider from '@material-ui/core/Divider'
import { withStyles } from '@material-ui/core/styles'
import { WidgetContext } from '../setupAndRenderWidget'

function ListDisplay({ classes, layerItems }) {
  return (
    <div className={classes.listContainer}>
      <List>{layerItems}</List>
    </div>
  )
}

function ItemDisplay({ classes, layerIndex, frameLayer, updateLayer }) {
  return (
    <ListItem key={layerIndex}>
      <ListItemAvatar>
        <Avatar className={classes.layerIndex}>{layerIndex + 1}</Avatar>
      </ListItemAvatar>
      <ListItemText primary={frameLayer.type} />
      <ListItemSecondaryAction>
        <IconButton
          onClick={updateLayer.bind(null, {
            nextActiveFrameLayer: frameLayer,
            nextActiveLayerIndex: layerIndex
          })}
        >
          <LaunchIcon className={classes.launchIcon} />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  )
}

function applyListBehavior(Component) {
  class Instance extends React.Component {
    static contextType = WidgetContext

    render() {
      const frameLayers = this.context.widgetState.frameLayers
      const layerItems = frameLayers.map((layer, layerIndex) => {
        const layerIsNotLast = layerIndex !== frameLayers.length - 1
        const dividerElement = layerIsNotLast ? (
          <Divider variant="inset" key={`divider-${layerIndex}`} />
        ) : null
        return [
          <ItemDisplayWithStyles
            updateLayer={this.props.updateLayer}
            frameLayer={layer}
            layerIndex={layerIndex}
          />,
          dividerElement
        ]
      })
      return <Component layerItems={layerItems} />
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
const ItemDisplayWithStyles = withStyles(theme => ({
  layerIndex: {
    color: theme.palette.primary.dark,
    backgroundColor: 'transparent'
  },
  launchIcon: {
    color: theme.palette.primary.dark
  }
}))(ItemDisplay)
export default applyListBehavior(ListDisplayWithStyles)
