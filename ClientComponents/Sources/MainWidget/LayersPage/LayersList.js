import React from 'react'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '@material-ui/core/Avatar'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import IconButton from '@material-ui/core/IconButton'
import FocusIcon from '@material-ui/icons/VisibilityRounded'
import { withStyles } from '@material-ui/core/styles'

function ListDisplay({ frameLayers, classes, focusLayer }) {
  if (!frameLayers.length) {
    return (
      <div className={classes.emptyListContainer}>
        <Typography className={classes.emptyLabelFont}>No Layers</Typography>
      </div>
    )
  }
  const layerItems = frameLayers.map((frameLayer, layerIndex) => {
    const layerIsNotLast = layerIndex !== frameLayers.length - 1
    const maybeDividerElement = layerIsNotLast ? (
      <Divider key={`divider-${layerIndex}`} variant="inset" />
    ) : null
    return [
      <ItemDisplayWithStyles
        key={`item-${layerIndex}`}
        focusLayer={focusLayer}
        _frameLayer={frameLayer}
        _layerIndex={layerIndex}
      />,
      maybeDividerElement
    ]
  })
  return (
    <div className={classes.listContainer}>
      <List>{layerItems}</List>
    </div>
  )
}

function ItemDisplay({ _layerIndex, classes, _frameLayer, focusLayer }) {
  return (
    <ListItem>
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
export default withStyles({
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
