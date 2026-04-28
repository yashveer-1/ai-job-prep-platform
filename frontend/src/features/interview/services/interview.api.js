import { api } from '../../../services/api.js';

export async function generateInterviewReport({
  resume,
  file,
  selfDescription,
  jobDescription,
}) {
  try {
    const formData = new FormData();

    if (file) {
      formData.append('file', file);
    }

    if (resume) {
      formData.append('resume', resume);
    }

    formData.append('selfDescription', selfDescription);
    formData.append('jobDescription', jobDescription);

    const response = await api.post('/interview', formData);
    return response.data.report;
  } catch (error) {
    throw error.response?.data || { message: 'Unable to generate report' };
  }
}

export async function getInterviewReports() {
  try {
    const response = await api.get('/interview');
    return response.data.reports;
  } catch (error) {
    throw error.response?.data || { message: 'Unable to fetch reports' };
  }
}

export async function getInterviewReport(id) {
  try {
    const response = await api.get(`/interview/${id}`);
    return response.data.report;
  } catch (error) {
    throw error.response?.data || { message: 'Unable to fetch report' };
  }
}
