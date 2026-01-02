import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import axiosClient from "../utils/axiosClient";

const UpdateProblem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset, control } = useForm({
    defaultValues: {
      title: "",
      description: "",
      difficulty: "easy",
      tags: "",
      visibleTestCases: [],
      hiddenTestCases: [],
      referenceSolution: [],
    },
  });

  const { fields: visibleFields, append: appendVisible, remove: removeVisible } =
    useFieldArray({ control, name: "visibleTestCases" });

  useEffect(() => {
    if (!id) return;

    const fetchProblem = async () => {
      try {
        setLoading(true);
        const { data } = await axiosClient.get(`/problem/problemById/${id}`);

        reset({
          ...data,
          visibleTestCases: data.visibleTestCases || [],
          hiddenTestCases: data.hiddenTestCases || [],
          referenceSolution: data.referenceSolution || [],
        });
      } catch (err) {
        console.error(err);
        alert("Failed to load problem");
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [id, reset]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await axiosClient.put(`/problem/update/${id}`, data);
      alert("Problem updated successfully");
      navigate("/admin"); // back to problem list
    } catch (err) {
      console.error(err);
      alert(err?.response?.data || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Update Problem</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          placeholder="Title"
          className="input input-bordered w-full"
          {...register("title")}
        />
        <textarea
          placeholder="Description"
          className="textarea textarea-bordered w-full"
          rows={5}
          {...register("description")}
        />
        <select className="select select-bordered w-full" {...register("difficulty")}>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <input
          placeholder="Tags"
          className="input input-bordered w-full"
          {...register("tags")}
        />

        {/* Visible Test Cases */}
        <div>
          <h2>Visible Test Cases</h2>
          {visibleFields?.map((field, index) => (
            <div key={field.id} className="flex gap-2 mb-2">
              <input
                placeholder="Input"
                className="input input-bordered"
                {...register(`visibleTestCases.${index}.input`)}
              />
              <input
                placeholder="Output"
                className="input input-bordered"
                {...register(`visibleTestCases.${index}.output`)}
              />
              <button
                type="button"
                onClick={() => removeVisible(index)}
                className="btn btn-error btn-sm"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => appendVisible({ input: "", output: "" })}
            className="btn btn-outline btn-sm"
          >
            + Add Test Case
          </button>
        </div>

        <button type="submit" className="btn btn-primary w-full mt-4">
          Update Problem
        </button>
      </form>
    </div>
  );
};

export default UpdateProblem;
