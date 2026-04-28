const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const interviewController = require('../controllers/interview.controller');
const upload = require('../middlewares/file.middleware');

const interviewRouter = express.Router();

interviewRouter.get('/', authMiddleware, interviewController.getReports);
interviewRouter.get('/:id', authMiddleware, interviewController.getReportById);
interviewRouter.post('/', authMiddleware, upload.single('file'), interviewController.generateReport);


module.exports = interviewRouter;
