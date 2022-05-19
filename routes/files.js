
const { Router } = require('express')

const { getFiles, getListFiles } = require('../controllers/files')

const router = Router()

router.get('/data', getFiles)
router.get('/list', getListFiles)

module.exports = router
