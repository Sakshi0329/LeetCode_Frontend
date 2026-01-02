import { useState, useEffect } from "react";
import axiosClient from "../utils/axiosClient";

const SubmissionHistory = ({ problemId }) => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get(
          `/problem/submittedProblem/${problemId}`
        );
        setSubmissions(response.data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch submission history");
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [problemId]);

  const getStatusColor = (status) => {
    switch (status) {
      case "accepted":
        return "badge-success";
      case "wrong":
        return "badge-error";
      case "error":
        return "badge-warning";
      case "pending":
        return "badge-info";
      default:
        return "badge-neutral";
    }
  };

  const formatMemory = (memory) =>
    memory < 1024 ? `${memory} kB` : `${(memory / 1024).toFixed(2)} MB`;

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleString();

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  /* ---------------- ERROR ---------------- */
  if (error) {
    return (
      <div className="alert alert-error shadow-lg my-4">
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">
         Submission History
      </h2>

      {/* ---------------- EMPTY STATE ---------------- */}
      {submissions.length === 0 ? (
        <div className="alert alert-info shadow-md">
          <span>No submissions found for this problem</span>
        </div>
      ) : (
        <>
          {/* ---------------- TABLE ---------------- */}
          <div className="overflow-x-auto rounded-xl border border-base-300 shadow-sm">
            <table className="table table-zebra w-full">
              <thead className="bg-base-200 text-base font-semibold">
                <tr>
                  <th>#</th>
                  <th>Language</th>
                  <th>Status</th>
                  <th>Runtime</th>
                  <th>Memory</th>
                  <th>Test Cases</th>
                  <th>Submitted</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {submissions.map((sub, index) => (
                  <tr
                    key={sub._id}
                    className="hover:bg-base-200 transition"
                  >
                    <td>{index + 1}</td>

                    <td className="font-mono text-sm">
                      {sub.language}
                    </td>

                    <td>
                      <span
                        className={`badge ${getStatusColor(
                          sub.status
                        )}`}
                      >
                        {sub.status.toUpperCase()}
                      </span>
                    </td>

                    <td className="font-mono text-sm">
                      {sub.runtime}s
                    </td>

                    <td className="font-mono text-sm">
                      {formatMemory(sub.memory)}
                    </td>

                    <td className="font-mono text-sm">
                      {sub.testCasesPassed}/{sub.testCasesTotal}
                    </td>

                    <td className="text-sm">
                      {formatDate(sub.createdAt)}
                    </td>

                    <td>
                      <button
                        className="btn btn-sm btn-outline"
                        onClick={() =>
                          setSelectedSubmission(sub)
                        }
                      >
                        View Code
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-3 text-sm text-gray-500 text-right">
            Showing {submissions.length} submissions
          </p>
        </>
      )}

      {/* ---------------- MODAL ---------------- */}
      {selectedSubmission && (
        <div className="modal modal-open">
          <div className="modal-box max-w-5xl">
            <h3 className="font-bold text-xl mb-4">
              📄 Submission Details
            </h3>

            <div className="flex flex-wrap gap-2 mb-4">
              <span
                className={`badge ${getStatusColor(
                  selectedSubmission.status
                )}`}
              >
                {selectedSubmission.status}
              </span>
              <span className="badge badge-outline">
                Runtime: {selectedSubmission.runtime}s
              </span>
              <span className="badge badge-outline">
                Memory:{" "}
                {formatMemory(selectedSubmission.memory)}
              </span>
              <span className="badge badge-outline">
                Passed:{" "}
                {selectedSubmission.testCasesPassed}/
                {selectedSubmission.testCasesTotal}
              </span>
            </div>

            {selectedSubmission.errorMessage && (
              <div className="alert alert-error mb-4">
                <span>{selectedSubmission.errorMessage}</span>
              </div>
            )}

            <pre className="bg-neutral text-neutral-content rounded-lg p-4 overflow-x-auto text-sm">
              <code>{selectedSubmission.code}</code>
            </pre>

            <div className="modal-action">
              <button
                className="btn btn-primary"
                onClick={() =>
                  setSelectedSubmission(null)
                }
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmissionHistory;
