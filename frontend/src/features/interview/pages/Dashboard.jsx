import { useEffect, useState } from 'react';
import { useAuth } from '../../auth/hooks/useAuth.js';
import {
  generateInterviewReport,
  getInterviewReport,
  getInterviewReports,
} from '../services/interview.api.js';
import './dashboard.scss';

const emptyForm = {
  resume: '',
  selfDescription: '',
  jobDescription: '',
};

function Dashboard() {
  const { user, handleLogout } = useAuth();
  const [theme, setTheme] = useState(() => localStorage.getItem('dashboard-theme') || 'light');
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState(null);
  const [report, setReport] = useState(null);
  const [reports, setReports] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const hasResume = Boolean(file || form.resume.trim());
  const resumeLength = file ? Math.round(file.size / 1024) : form.resume.trim().length;
  const selfLength = form.selfDescription.trim().length;
  const jobLength = form.jobDescription.trim().length;
  const completedFields = [
    hasResume,
    Boolean(selfLength),
    Boolean(jobLength),
  ].filter(Boolean).length;
  const readiness = Math.round((completedFields / 3) * 100);
  const canSubmit = hasResume && selfLength && jobLength;
  const readinessLabel = readiness === 100 ? 'Ready to generate' : readiness >= 67 ? 'Almost there' : 'Needs a bit more';

  useEffect(() => {
    localStorage.setItem('dashboard-theme', theme);
  }, [theme]);

  useEffect(() => {
    let isMounted = true;

    async function loadReports() {
      setHistoryLoading(true);
      try {
        const reportHistory = await getInterviewReports();
        if (isMounted) {
          setReports(reportHistory);
        }
      } catch (err) {
        console.error('Unable to load report history:', err);
      } finally {
        if (isMounted) {
          setHistoryLoading(false);
        }
      }
    }

    loadReports();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0] || null;
    setFile(selectedFile);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!canSubmit) {
      setError('Add a resume, your background, and the job description before generating a report.');
      return;
    }

    setSubmitting(true);
    setError('');
    setReport(null);

    try {
      const generatedReport = await generateInterviewReport({
        ...form,
        file,
      });
      setReport(generatedReport);
      const reportHistory = await getInterviewReports();
      setReports(reportHistory);
    } catch (err) {
      setError(err?.message || 'Unable to generate report');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSelectReport = async (reportId) => {
    setError('');
    try {
      const selectedReport = await getInterviewReport(reportId);
      setReport(selectedReport);
    } catch (err) {
      setError(err?.message || 'Unable to load report');
    }
  };

  return (
    <main className={`dashboard-page ${theme === 'dark' ? 'theme-dark' : 'theme-light'}`}>
      <div className="dashboard-shell">
        <header className="topbar">
          <div className="brand-lockup">
            <span className="brand-mark">
              <img src="/interview-master-logo.svg" alt="" />
            </span>
            <div>
              <p className="eyebrow">Interview Master</p>
              <h1>Interview prep workspace</h1>
            </div>
          </div>

          <div className="account-cluster">
            <div className="theme-toggle" aria-label="Theme">
              <button
                type="button"
                className={theme === 'light' ? 'active' : ''}
                onClick={() => setTheme('light')}
              >
                Bright
              </button>
              <button
                type="button"
                className={theme === 'dark' ? 'active' : ''}
                onClick={() => setTheme('dark')}
              >
                Dark
              </button>
            </div>
            <span className="user-pill">{user?.name || user?.email || 'Account'}</span>
            <button type="button" className="secondary-action" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>

        <section className="hero-console">
          <div className="hero-copy">
            <p className="eyebrow">Prepare with context</p>
            <h2>Turn your resume and job description into a focused practice plan.</h2>
            <p>
              Add the role, your background, and a resume. The report will help you spot
              likely questions, weak areas, and the next things worth practicing.
            </p>
          </div>

          <div className="signal-dial-wrap" aria-label={`Input readiness ${readiness}%`}>
            <div className="signal-core" style={{ '--score': `${readiness * 3.6}deg` }}>
              <strong>{readiness}%</strong>
              <span>{readinessLabel}</span>
            </div>
          </div>
        </section>

        <section className="summary-strip" aria-label="Preparation status">
          <StatusCard label="Readiness" value={`${readiness}%`} meta={readinessLabel} tone="blue" />
          <StatusCard label="Resume" value={hasResume ? 'Added' : 'Missing'} meta={hasResume ? `${resumeLength} ${file ? 'KB' : 'chars'}` : 'Upload or paste'} tone={hasResume ? 'green' : 'amber'} />
          <StatusCard label="Job description" value={jobLength ? 'Added' : 'Empty'} meta={jobLength ? `${jobLength} chars` : 'Paste the role'} tone={jobLength ? 'violet' : 'slate'} />
          <StatusCard label="Report" value={report ? 'Ready' : submitting ? 'Generating' : 'Not started'} meta={report ? 'Review below' : 'Complete inputs first'} tone={report ? 'green' : 'slate'} />
        </section>

        <section className="workspace">
          <div className="left-rail">
            <form className="report-form" onSubmit={handleSubmit}>
              <div className="panel-heading">
                <div>
                  <p className="eyebrow">Your inputs</p>
                  <h2>Build the report</h2>
                </div>
                <span className="progress-pill">{completedFields}/3 ready</span>
              </div>

              <div className="readiness-meter" aria-hidden="true">
                <span style={{ width: `${readiness}%` }} />
              </div>

              <fieldset className="form-section">
                <legend>Resume</legend>
                <label className={`upload-zone ${file ? 'has-file' : ''}`}>
                  <input type="file" accept="application/pdf" onChange={handleFileChange} />
                  <span className="upload-icon">PDF</span>
                  <span>
                    <strong>{file ? file.name : 'Upload resume PDF'}</strong>
                    <small>{file ? `${Math.round(file.size / 1024)} KB selected` : 'PDF up to 5 MB'}</small>
                  </span>
                </label>

                {file && (
                  <button type="button" className="text-action" onClick={() => setFile(null)}>
                    Remove file
                  </button>
                )}

                <label className="field">
                  <span>Resume text</span>
                  <textarea
                    name="resume"
                    value={form.resume}
                    onChange={handleChange}
                    placeholder="Paste resume text if you are not uploading a PDF."
                    rows="6"
                  />
                  <small>{form.resume.trim().length} characters</small>
                </label>
              </fieldset>

              <fieldset className="form-section">
                <legend>Position fit</legend>
                <label className="field">
                  <span>About you</span>
                  <textarea
                    name="selfDescription"
                    value={form.selfDescription}
                    onChange={handleChange}
                    placeholder="Summarize your background, strengths, target role, and what you want to emphasize."
                    rows="5"
                    required
                  />
                  <small>{form.selfDescription.trim().length} characters</small>
                </label>

                <label className="field">
                  <span>Job description</span>
                  <textarea
                    name="jobDescription"
                    value={form.jobDescription}
                    onChange={handleChange}
                    placeholder="Paste the full job description, including responsibilities and requirements."
                    rows="7"
                    required
                  />
                  <small>{form.jobDescription.trim().length} characters</small>
                </label>
              </fieldset>

              <div className="signal-checklist" aria-label="Input readiness checklist">
                <InputCheck label="Resume" active={hasResume} />
                <InputCheck label="Self profile" active={Boolean(selfLength)} />
                <InputCheck label="Role brief" active={Boolean(jobLength)} />
              </div>

              {error && <p className="form-error">{error}</p>}

              <button type="submit" className="primary-action" disabled={submitting || !canSubmit}>
                {submitting ? 'Generating report...' : 'Generate interview report'}
              </button>
            </form>

            <ReportHistory
              loading={historyLoading}
              reports={reports}
              activeReportId={report?._id || report?.id}
              onSelectReport={handleSelectReport}
            />
          </div>

          <aside className="report-panel" aria-live="polite">
            {submitting && <ReportLoading />}
            {!submitting && !report && <EmptyReport readiness={readiness} />}
            {!submitting && report && <ReportView report={report} />}
          </aside>
        </section>
      </div>
    </main>
  );
}

function InputCheck({ label, active }) {
  return (
    <span className={`input-check ${active ? 'active' : ''}`}>
      <span aria-hidden="true" />
      {label}
    </span>
  );
}

function StatusCard({ label, value, meta, tone }) {
  return (
    <article className={`status-card ${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{meta}</small>
    </article>
  );
}

function ReportHistory({ loading, reports, activeReportId, onSelectReport }) {
  return (
    <section className="history-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Saved reports</p>
          <h2>Recent history</h2>
        </div>
        <span className="progress-pill">{reports.length}</span>
      </div>

      {loading && <p className="history-empty">Loading reports...</p>}

      {!loading && reports.length === 0 && (
        <p className="history-empty">Generated reports will be saved here automatically.</p>
      )}

      {!loading && reports.length > 0 && (
        <div className="history-list">
          {reports.map((savedReport) => {
            const reportId = savedReport.id || savedReport._id;
            return (
              <button
                type="button"
                className={`history-item ${activeReportId === reportId ? 'active' : ''}`}
                key={reportId}
                onClick={() => onSelectReport(reportId)}
              >
                <span>{new Date(savedReport.createdAt).toLocaleDateString()}</span>
                <strong>{savedReport.matchScore}% match</strong>
                <small>{savedReport.jobDescription.slice(0, 92)}...</small>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}

function EmptyReport({ readiness }) {
  return (
    <div className="empty-report">
      <div className="empty-visual" style={{ '--score': `${readiness * 3.6}deg` }}>
        <div className="radar-ring">
          <span />
          <span />
          <span />
        </div>
      </div>
      <h2>Your report will appear here</h2>
      <p>
        Your tailored prep plan will include a match score, likely interview questions,
        skill gaps, and focused preparation tips.
      </p>
      <div className="empty-progress">
        <span style={{ width: `${readiness}%` }} />
      </div>
    </div>
  );
}

function ReportLoading() {
  return (
    <div className="report-loading">
      <div className="loading-dial">
        <span />
      </div>
      <div className="loading-header">
        <span />
        <span />
      </div>
      {[0, 1, 2, 3].map((item) => (
        <div className="skeleton-card" key={item}>
          <span />
          <span />
          <span />
        </div>
      ))}
    </div>
  );
}

function ReportView({ report }) {
  const score = Math.max(0, Math.min(Number(report.matchScore) || 0, 100));
  const questionCount = (report.technicalQuestions?.length || 0) + (report.behavioralQuestions?.length || 0);
  const gapCount = report.skillGapAnalysis?.length || 0;
  const tipCount = report.preparationTips?.length || 0;

  return (
    <div className="report-content">
      <div className="score-row">
        <div>
          <p className="eyebrow">Match Score</p>
          <h2>{score >= 75 ? 'Strong alignment' : score >= 50 ? 'Promising fit' : 'Needs focused prep'}</h2>
          <p>Use the sections below to prioritize the highest-value preparation work.</p>
          <div className="report-metrics">
            <span>{questionCount} questions</span>
            <span>{gapCount} gaps</span>
            <span>{tipCount} actions</span>
          </div>
        </div>
        <div className="score-ring" style={{ '--score': `${score * 3.6}deg` }}>
          <strong>{score}%</strong>
          <span>fit index</span>
        </div>
      </div>

      <ReportSection title="Technical Questions" label="Role depth" items={report.technicalQuestions} />
      <ReportSection title="Behavioral Questions" label="Story bank" items={report.behavioralQuestions} />

      <section className="report-section">
        <div className="section-title">
          <span>Gap focus</span>
          <h2>Skill Gaps</h2>
        </div>
        <div className="gap-grid">
          {report.skillGapAnalysis?.map((item) => (
            <article className="gap-card" key={`${item.skill}-${item.gapDescription}`}>
              <h3>{item.skill}</h3>
              <p>{item.gapDescription}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="report-section">
        <div className="section-title">
          <span>Next actions</span>
          <h2>Preparation Tips</h2>
        </div>
        <ul className="tips-list">
          {report.preparationTips?.map((item) => (
            <li key={item.tip}>{item.tip}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function ReportSection({ title, label, items = [] }) {
  return (
    <section className="report-section">
      <div className="section-title">
        <span>{label}</span>
        <h2>{title}</h2>
      </div>
      <div className="report-list">
        {items.map((item, index) => (
          <article className="question-card" key={item.question}>
            <span className="question-number">{String(index + 1).padStart(2, '0')}</span>
            <h3>{item.question}</h3>
            <dl>
              <div>
                <dt>Intention</dt>
                <dd>{item.intention}</dd>
              </div>
              <div>
                <dt>Answer angle</dt>
                <dd>{item.answer}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Dashboard;
