import React from 'react'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'

function SectionDisplay({ classes, title, children }) {
  return (
    <ExpansionPanel
      className={classes.expansionPanel}
      elevation={0}
      expanded
      square
    >
      <ExpansionPanelSummary>
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
    backgroundColor: 'transparent',
    marginTop: 0,
    marginBottom: 0
  },
  panelContent: {
    display: 'flex',
    flexDirection: 'column'
  }
})(SectionDisplay)
