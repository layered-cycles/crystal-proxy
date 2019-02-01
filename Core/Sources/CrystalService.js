const CrystalService = {
  loadFrameSchema: ({ serviceUrl, schemaSource }) =>
    new Promise(resolve => {
      _CrystalService.loadFrameSchema(serviceUrl, schemaSource, () => resolve())
    })
}

export default CrystalService
