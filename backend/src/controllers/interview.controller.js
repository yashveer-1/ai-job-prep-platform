const { PDFParse } = require('pdf-parse');
const { generateInterviewReport } = require('../services/ai.service');
const InterviewReport = require('../models/interviewReport.model');

function summarizeReport(reportDocument) {
  return {
    id: reportDocument._id,
    matchScore: reportDocument.matchScore,
    jobDescription: reportDocument.jobDescription,
    createdAt: reportDocument.createdAt,
    updatedAt: reportDocument.updatedAt,
  };
}

const interviewController = {
  generateReport: async (req, res) => {
    try {
      let resumeText = '';

      // Handle PDF file (memory storage)
      if (req.file) {
        const parser = new PDFParse({ data: req.file.buffer });
        const result = await parser.getText();
        resumeText = result.text;
      }

      const { selfDescription, jobDescription, resume } = req.body;

      // Allow both file or text input
      const finalResume = resumeText || resume;

      if (!finalResume) {
        return res.status(400).json({
          message: 'Resume (file or text) is required'
        });
      }

      if (!selfDescription || !jobDescription) {
        return res.status(400).json({
          message: 'selfDescription and jobDescription are required'
        });
      }

      const report = await generateInterviewReport({
        resume: finalResume,
        selfDescription,
        jobDescription
      });

      const savedReport = await InterviewReport.create({
        ...report,
        resume: finalResume,
        selfDescription,
        jobDescription,
        user: req.user.userId
      });

      res.status(201).json({ report: savedReport });

    } catch (error) {
      console.error('Error generating interview report:', error);
      res.status(500).json({
        message: 'Server error',
        error: error.message
      });
    }
  },

  generateReportWithoutFile: async (req, res) => {
    try {
      const { resume, selfDescription, jobDescription } = req.body;

      if (!resume) {
        return res.status(400).json({
          message: 'Resume text is required'
        });
      }

      if (!selfDescription || !jobDescription) {
        return res.status(400).json({
          message: 'selfDescription and jobDescription are required'
        });
      }

      const report = await generateInterviewReport({
        resume,
        selfDescription,
        jobDescription
      });

      const savedReport = await InterviewReport.create({
        ...report,
        resume,
        selfDescription,
        jobDescription,
        user: req.user.userId
      });

      res.status(201).json({ report: savedReport });

    } catch (error) {
      console.error('Error generating interview report:', error);
      res.status(500).json({
        message: 'Server error',
        error: error.message
      });
    }
  },

  getReports: async (req, res) => {
    try {
      const reports = await InterviewReport.find({ user: req.user.userId })
        .sort({ createdAt: -1 })
        .limit(20);

      res.json({ reports: reports.map(summarizeReport) });
    } catch (error) {
      console.error('Error fetching interview reports:', error);
      res.status(500).json({
        message: 'Server error',
        error: error.message
      });
    }
  },

  getReportById: async (req, res) => {
    try {
      const report = await InterviewReport.findOne({
        _id: req.params.id,
        user: req.user.userId
      });

      if (!report) {
        return res.status(404).json({ message: 'Report not found' });
      }

      res.json({ report });
    } catch (error) {
      console.error('Error fetching interview report:', error);
      res.status(500).json({
        message: 'Server error',
        error: error.message
      });
    }
  }
};

module.exports = interviewController;
