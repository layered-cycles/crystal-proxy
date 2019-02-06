const CrystalService = {
  loadFrameSchema: ({ serviceUrl, schemaSource }) =>
    new Promise((resolve, reject) => {
      _CrystalService.loadFrameSchema(
        serviceUrl,
        schemaSource,
        responseCode => {
          if (responseCode === 200) {
            resolve()
          } else {
            reject()
          }
        }
      )
    })
}

export default CrystalService
