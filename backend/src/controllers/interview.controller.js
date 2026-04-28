const { PDFParse } = require('pdf-parse');
const { generateInterviewReport } = require('../services/ai.service');

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

      res.json({ report });

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

      res.json({ report });

    } catch (error) {
      console.error('Error generating interview report:', error);
      res.status(500).json({
        message: 'Server error',
        error: error.message
      });
    }
  }
};

module.exports = interviewController;