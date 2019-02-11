import React from 'react'
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '@material-ui/core/Avatar'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import IconButton from '@material-ui/core/IconButton'
import FocusIcon from '@material-ui/icons/VisibilityRounded'
import Divider from '@material-ui/core/Divider'
import { withStyles } from '@material-ui/core/styles'

function ListDisplay({ _layerItems, classes }) {
  if (!_layerItems.length) {
    return (
      <div className={classes.emptyListContainer}>
        <Typography className={classes.emptyLabelFont}>No Layers</Typography>
      </div>
    )
  }
  return (
    <div className={classes.listContainer}>
      <List>{_layerItems}</List>
    </div>
  )
}

function ItemDisplay({ _layerIndex, classes, _frameLayer, focusLayer }) {
  return (
    <ListItem key={_layerIndex}>
      <ListItemAvatar>
        <Avatar className={classes.layerIndex}>{_layerIndex}</Avatar>
      </ListItemAvatar>
      <ListItemText disableTypography>
        <Typography className={classes.typeText}>{_frameLayer.type}</Typography>
      </ListItemText>
      <ListItemSecondaryAction>
        <IconButton
          onClick={() =>
            focusLayer({
              nextFocusedLayer: {
                index: _layerIndex,
                value: _frameLayer
              }
            })
          }
        >
          <FocusIcon className={classes.focusIcon} />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  )
}

function applyListBehavior(DisplayComponent) {
  class Instance extends React.Component {
    render() {
      const layerItems = this.props.frameLayers.map(
        (frameLayer, layerIndex) => {
          const layerIsNotLast =
            layerIndex !== this.props.frameLayers.length - 1
          const maybeDividerElement = layerIsNotLast ? (
            <Divider key={`divider-${layerIndex}`} variant="inset" />
          ) : null
          return [
            <ItemDisplayWithStyles
              focusLayer={this.props.focusLayer}
              _frameLayer={frameLayer}
              _layerIndex={layerIndex}
            />,
            maybeDividerElement
          ]
        }
      )
      return <DisplayComponent _layerItems={layerItems} />
    }
  }
  return Instance
}

const ItemDisplayWithStyles = withStyles(theme => ({
  focusIcon: {
    color: theme.palette.primary.main
  },
  layerIndex: {
    color: theme.palette.text.primary,
    backgroundColor: 'transparent',
    fontWeight: 500,
    marginLeft: '-1px'
  },
  typeText: {
    fontWeight: 300,
    fontSize: '16px'
  }
}))(ItemDisplay)
const ListDisplayWithStyles = withStyles({
  emptyLabelFont: {
    fontSize: '16px',
    fontFamily: 'Roboto',
    fontStyle: 'italic',
    fontWeight: 400
  },
  emptyListContainer: {
    flex: '1 0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  listContainer: {
    flex: '1 1 auto',
    overflow: 'scroll'
  }
})(ListDisplay)
export default applyListBehavior(ListDisplayWithStyles)
