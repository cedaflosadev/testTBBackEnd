const { response } = require('express')
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args))

const getHeaders = async () => {
  const Headers = (await import('node-fetch')).Headers
  var myHeaders = new Headers(myHeaders) // eslint-disable-line no-use-before-define
  myHeaders.append('accept', 'application/json')
  myHeaders.append('authorization', 'Bearer aSuperSecretKey')

  const requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  }
  return requestOptions
}

const getFilesInit = async () => {
  const filesData = []
  await fetch(`${process.env.URL_BASE_EXTERNAL}v1/secret/files`, await getHeaders())
    .then(response => response.text())
    .then(result => {
      if (result) {
        JSON.parse(result).files.forEach(element => {
          filesData.push(element)
        })
      }
    })
    .catch(error => console.log('error', error))
  return filesData
}

const getFileByName = async (fileName) => {
  let responseData
  await fetch(`${process.env.URL_BASE_EXTERNAL}v1/secret/file/${fileName}`, await getHeaders())
    .then(response => response.text())
    .then(result => {
      if (result.includes('status')) return false

      responseData = {
        file: fileName,
        lines: []
      }
      const separarString = (value) => value.split(/\r\n|\r|\n/, -1)
      const separadoSucess = separarString(result)
      for (const lines of separadoSucess) {
        if (lines.split(',', -1)[1] && lines.split(',', -1)[2] && lines.split(',', -1)[3]) { // Quitar if si quiero campos vacios
          responseData.lines.push({
            text: lines.split(',', -1)[1] ?? '',
            number: lines.split(',', -1)[2] ?? '',
            hex: lines.split(',', -1)[3] ?? ''
          })
        }
      }
    })
    .catch(error => console.log('error', error))
  // Quitar if, si quiero file sin lineas
  responseData?.lines?.shift()
  if (responseData?.lines?.length === 0) return false

  return responseData
}

const getFilesInitDetail = async (filesData) => {
  const ContentElements = []
  for (const file of filesData) {
    const DataToAdd = await getFileByName(file)

    if (DataToAdd) ContentElements.push(DataToAdd)
  }
  return ContentElements
}

const getFiles = async (req, res = response) => {
  let filesData = []
  let ContentElements = []
  let FilterElement = []
  if (req.query.fileName === undefined) {
    filesData = await getFilesInit()
    ContentElements = await getFilesInitDetail(filesData)
    return res.status(200).json(
      ContentElements
    )
  } else {
    filesData = await getFilesInit()
    ContentElements = await getFilesInitDetail(filesData)
    FilterElement = ContentElements.filter((element) => { return element.file === req.query.fileName })

    if (FilterElement.length === 0) {
      return res.status(404).json({
        msg: 'File not found'
      })
    } else {
      return res.status(200).json(
        FilterElement
      )
    }
  }
}

const getListFiles = async (req, res = response) => {
  const fileTitles = []

  await fetch(`${process.env.URL_BASE}files/data`, await getHeaders())
    .then(response => response.text())
    .then(result => {
      if (result) {
        JSON.parse(result).forEach(element => {
          fileTitles.push(element.file)
        })
      }
    })
    .catch(error => console.log('error', error))

  return res.status(200).json({ files: fileTitles })
}

module.exports = {
  getFiles,
  getListFiles
}
