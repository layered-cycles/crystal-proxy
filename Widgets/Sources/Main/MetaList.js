import React from 'react'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import { withStyles } from '@material-ui/core/styles'
import MetaSection from './MetaSection'

function ListDisplay({
  classes,
  serviceUrl,
  updateServiceUrl,
  frameDimensions,
  updateFrameDimensions,
  updateFrameSchema
}) {
  return (
    <div className={classes.listContainer}>
      <MetaSection title="Frame">
        <TextField
          value={frameDimensions.width}
          onChange={changeEvent =>
            updateFrameDimensions({
              ...frameDimensions,
              width: Number(changeEvent.target.value)
            })
          }
          type="number"
          variant="outlined"
          margin="normal"
          label="Width"
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
          type="number"
          variant="outlined"
          margin="normal"
          label="Height"
          fullWidth
        />
      </MetaSection>
      <MetaSection title="Service">
        <TextField
          value={serviceUrl}
          onChange={changeEvent => updateServiceUrl(changeEvent.target.value)}
          variant="outlined"
          margin="normal"
          label="URL"
          placeholder="http://localhost:3000"
          fullWidth
        />
        <input
          className={classes.hiddenFileInput}
          id="load-schema-button"
          type="file"
          onChange={changeEvent => {
            const sourceFile = changeEvent.target.files[0]
            const sourceReader = new FileReader()
            sourceReader.readAsText(sourceFile, 'UTF-8')
            sourceReader.onload = sourceLoadedEvent =>
              updateFrameSchema(sourceLoadedEvent.target.result)
          }}
        />
        <label htmlFor="load-schema-button">
          <Button variant="outlined" size="large" fullWidth>
            Load Schema
          </Button>
        </label>
      </MetaSection>
    </div>
  )
}

export default withStyles({
  listContainer: {
    flex: '1 1 auto',
    overflow: 'scroll'
  },
  hiddenFileInput: {
    display: 'none'
  }
})(ListDisplay)
