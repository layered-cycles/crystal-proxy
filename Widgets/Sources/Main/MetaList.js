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
  downloadFrameImage,
  updateFrameSchema
}) {
  return (
    <div className={classes.listContainer}>
      <MetaSection title="Frame">
        <TextField
          onChange={changeEvent =>
            updateFrameDimensions({
              ...frameDimensions,
              width: Number(changeEvent.target.value)
            })
          }
          onBlur={() => {
            if (frameDimensions.width < 256 || frameDimensions.width > 2048) {
              updateFrameDimensions({
                ...frameDimensions,
                width: frameDimensions.width < 256 ? 256 : 2048
              })
            }
          }}
          value={frameDimensions.width}
          inputProps={{
            min: '256',
            max: '2048'
          }}
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
          onBlur={() => {
            if (frameDimensions.height < 256 || frameDimensions.height > 2048) {
              updateFrameDimensions({
                ...frameDimensions,
                height: frameDimensions.height < 256 ? 256 : 2048
              })
            }
          }}
          inputProps={{
            min: '256',
            max: '2048'
          }}
          type="number"
          variant="outlined"
          margin="normal"
          label="Height"
          fullWidth
        />
        <Button
          className={classes.actionButton}
          onClick={() => downloadFrameImage()}
          variant="outlined"
          size="large"
          margin="normal"
          fullWidth
        >
          Download Image
        </Button>
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
          value=""
          onChange={changeEvent => {
            const sourceFile = changeEvent.target.files[0]
            const sourceReader = new FileReader()
            sourceReader.readAsText(sourceFile, 'UTF-8')
            sourceReader.onload = sourceLoadedEvent =>
              updateFrameSchema(sourceLoadedEvent.target.result)
          }}
        />
        <label htmlFor="load-schema-button">
          <Button
            className={classes.actionButton}
            variant="outlined"
            size="large"
            fullWidth
          >
            Load Schema
          </Button>
        </label>
      </MetaSection>
    </div>
  )
}

export default withStyles({
  actionButton: {
    marginTop: '16px'
  },
  listContainer: {
    flex: '1 1 auto',
    overflow: 'scroll'
  },
  hiddenFileInput: {
    display: 'none'
  }
})(ListDisplay)
