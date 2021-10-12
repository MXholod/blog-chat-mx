const express = require('express');
const router = express.Router();
const passport = require('passport');
const authCabinetAdmin = passport.authenticate('jwt-cabinet-admin', {session: false});
const { getAllStatistics } = require('./../controllers/chart-statistics');


// '/api/chart_statistics/all_statistics'
router.get('/all_statistics', authCabinetAdmin, getAllStatistics);

module.exports = router;
