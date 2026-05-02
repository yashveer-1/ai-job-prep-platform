const mongoose = require('mongoose');

/**
 * -job description
 * -rsume
 * -self description
 * 
 * -Technical questions
 * -Behavioral questions
 * -skill gap analysis
 * -preparation tips
 */
const technicalQuestionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    intention: { type: String, required: true },
    answer: { type: String, default: "" },   // ✅ FIX
}, { _id: false });

const behavioralQuestionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    intention: { type: String, required: true },
    answer: { type: String, default: "" },   // ✅ FIX
}, { _id: false });
const skillGapAnalysisSchema = new mongoose.Schema({
    skill: { type: String, required: true },
    gapDescription: { type: String, required: true },
}, { _id: false }); 
const preparationTipsSchema = new mongoose.Schema({
    tip: { type: String, required: true },
}, { _id: false });


const interviewReportSchema = new mongoose.Schema({
    jobDescription: { type: String, required: true },
    resume: { type: String, required: true },
    selfDescription: { type: String, required: true },
    matchScore: { type: Number, required: true },
    technicalQuestions: [technicalQuestionSchema],
    behavioralQuestions: [behavioralQuestionSchema],
    skillGapAnalysis: [skillGapAnalysisSchema],
    preparationTips: [preparationTipsSchema],
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

const InterviewReport = mongoose.model('InterviewReport', interviewReportSchema);

module.exports = InterviewReport;