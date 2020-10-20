const { Router } = require('express')
const { createComment } = require('./../controllers/comment')
const router = Router()

// /api/comment
router.post('/', createComment)

module.exports = router
