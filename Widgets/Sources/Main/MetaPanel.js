import React from 'react'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { withStyles } from '@material-ui/core/styles'

function PanelDisplay({ classes, expanded, onToggle, title, children }) {
  return (
    <ExpansionPanel
      className={classes.expansionPanel}
      expanded={expanded}
      elevation={0}
      onChange={onToggle}
      square
    >
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="subtitle1">{title}</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails className={classes.panelContent}>
        {children}
      </ExpansionPanelDetails>
    </ExpansionPanel>
  )
}

export default withStyles({
  expansionPanel: {
    backgroundColor: 'transparent'
  },
  panelContent: {
    display: 'flex',
    flexDirection: 'column'
  }
})(PanelDisplay)
