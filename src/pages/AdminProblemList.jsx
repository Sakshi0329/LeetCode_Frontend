import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../utils/axiosClient";

function AdminProblemList() {
  const [problems, setProblems] = useState([]);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const { data } = await axiosClient.get("/problem/getAllProblem");
        setProblems(data);
      } catch (err) {
        console.error("Failed to fetch problems:", err);
      }
    };
    fetchProblems();
  }, []);

  // Map difficulty to badge colors
  const getDifficultyBadge = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-200 text-green-800";
      case "medium":
        return "bg-yellow-200 text-yellow-800";
      case "hard":
        return "bg-red-200 text-red-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">All Problems</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {problems.map((problem) => (
          <div
            key={problem._id}
            className="bg-base-100 border border-base-300 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-4 flex flex-col justify-between"
          >
            <div>
              <h3 className="text-lg font-semibold mb-2">{problem.title}</h3>
              <p className="text-sm text-gray-500 mb-2">{problem.description?.slice(0, 60)}...</p>
              <span
                className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${getDifficultyBadge(
                  problem.difficulty
                )}`}
              >
                {problem.difficulty}
              </span>
            </div>
            <div className="mt-4">
              <Link
                to={`/admin/update/${problem._id}`}
                className="btn btn-warning btn-sm w-full text-center"
              >
                Update
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminProblemList;
