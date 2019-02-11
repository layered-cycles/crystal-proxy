import React from 'react'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import { withStyles } from '@material-ui/core/styles'
import MetaSection from './MetaSection'

function ListDisplay({
  classes,
  serviceUrl,
  updateFrameDimensions,
  frameDimensions,
  updateServiceUrl,
  downloadFrameImage,
  updateFrameSchema
}) {
  return (
    <div className={classes.listContainer}>
      <MetaSection title="Frame">
        <TextField
          inputProps={{
            max: '2048',
            min: '256'
          }}
          onBlur={() => {
            if (frameDimensions.width < 256 || frameDimensions.width > 2048) {
              updateFrameDimensions({
                nextFrameDimensions: {
                  ...frameDimensions,
                  width: frameDimensions.width < 256 ? 256 : 2048
                }
              })
            }
          }}
          onChange={changeEvent =>
            updateFrameDimensions({
              nextFrameDimensions: {
                ...frameDimensions,
                width: Number(changeEvent.target.value)
              }
            })
          }
          value={frameDimensions.width}
          label="Width"
          margin="normal"
          type="number"
          variant="outlined"
          fullWidth
        />
        <TextField
          inputProps={{
            max: '2048',
            min: '256'
          }}
          onBlur={() => {
            if (frameDimensions.height < 256 || frameDimensions.height > 2048) {
              updateFrameDimensions({
                nextFrameDimensions: {
                  ...frameDimensions,
                  height: frameDimensions.height < 256 ? 256 : 2048
                }
              })
            }
          }}
          onChange={changeEvent =>
            updateFrameDimensions({
              nextFrameDimensions: {
                ...frameDimensions,
                height: Number(changeEvent.target.value)
              }
            })
          }
          value={frameDimensions.height}
          label="Height"
          margin="normal"
          type="number"
          variant="outlined"
          fullWidth
        />
        <Button
          className={classes.actionButton}
          onClick={() => downloadFrameImage()}
          margin="normal"
          size="large"
          variant="outlined"
          fullWidth
        >
          Download Image
        </Button>
      </MetaSection>
      <MetaSection title="Service">
        <TextField
          value={serviceUrl}
          onChange={changeEvent =>
            updateServiceUrl({
              nextServiceUrl: changeEvent.target.value
            })
          }
          label="URL"
          margin="normal"
          placeholder="http://localhost:3000"
          variant="outlined"
          fullWidth
        />
        <input
          className={classes.hiddenFileInput}
          onChange={changeEvent => {
            const sourceFile = changeEvent.target.files[0]
            const sourceReader = new FileReader()
            sourceReader.readAsText(sourceFile, 'UTF-8')
            sourceReader.onload = sourceLoadedEvent =>
              updateFrameSchema({
                nextSchemaSource: sourceLoadedEvent.target.result
              })
          }}
          id="load-schema-button"
          type="file"
          value=""
        />
        <label htmlFor="load-schema-button">
          <Button
            className={classes.actionButton}
            size="large"
            variant="outlined"
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
  hiddenFileInput: {
    display: 'none'
  },
  listContainer: {
    flex: '1 1 auto',
    overflow: 'scroll'
  }
})(ListDisplay)
