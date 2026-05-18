import { api, hasAuthToken } from '../../../services/api.js';

let reportHistoryRequest = null;

function assertLoggedIn() {
  if (!hasAuthToken()) {
    throw { message: 'Please log in before generating a report.' };
  }
}

export async function generateInterviewReport({
  resume,
  file,
  selfDescription,
  jobDescription,
}) {
  try {
    assertLoggedIn();

    const formData = new FormData();

    if (file) {
      formData.append('resume', file);
    } else if (resume) {
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
    if (!hasAuthToken()) {
      return [];
    }

    reportHistoryRequest ??= api.get('/interview').finally(() => {
      reportHistoryRequest = null;
    });

    const response = await reportHistoryRequest;
    return response.data.reports;
  } catch (error) {
    if (error.response?.status === 401) {
      return [];
    }

    throw error.response?.data || { message: 'Unable to fetch reports' };
  }
}

export async function getInterviewReport(id) {
  try {
    assertLoggedIn();

    const response = await api.get(`/interview/${id}`);
    return response.data.report;
  } catch (error) {
    throw error.response?.data || { message: 'Unable to fetch report' };
  }
}
