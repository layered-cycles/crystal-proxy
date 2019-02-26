const CrystalService = {
  loadFrameSchema: ({ serviceUrl, schemaSource }) =>
    new Promise((resolve, reject) => {
      _Crystal.loadFrameSchema(serviceUrl, schemaSource, responseCode => {
        if (responseCode === 200) {
          resolve()
        } else {
          reject()
        }
      })
    })
}

export default CrystalService
