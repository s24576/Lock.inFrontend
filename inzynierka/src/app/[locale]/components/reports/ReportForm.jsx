import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/componentsShad/ui/dialog";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import addReport from "../../api/report/addReport";
import useAxios from "../../hooks/useAxios";
import { useMutation } from "react-query";

const ReportForm = ({ objectType, objectId }) => {
  const [selectedReason, setSelectedReason] = useState("");
  const [comment, setComment] = useState("");

  const axiosInstance = useAxios();

  const handleReasonChange = (event) => {
    setSelectedReason(event.target.value);
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const { mutateAsync: addNewReport } = useMutation(
    () =>
      addReport(axiosInstance, {
        objectId,
        objectType,
        selectedReason,
        message: comment,
      }),
    {
      onError: (error) => {
        console.error("Error creating report:", error);
      },
    }
  );

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await addNewReport();
    } catch (error) {
      console.error("Error submitting report:", error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger className="text-[32px] hover:text-gray-400">
        <AiOutlineExclamationCircle />
      </DialogTrigger>
      <DialogContent className="bg-oxford-blue">
        <DialogTitle className="font-semibold">Report</DialogTitle>
        {objectId && objectType && (
          <p>
            Report {objectType} with id {objectId}
          </p>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-y-2">
          <p>Select a reason:</p>
          <label>
            <input
              type="radio"
              name="reason"
              value="spam"
              checked={selectedReason === "spam"}
              onChange={handleReasonChange}
            />
            Spam
          </label>
          <label>
            <input
              type="radio"
              name="reason"
              value="abuse"
              checked={selectedReason === "abuse"}
              onChange={handleReasonChange}
            />
            Abuse
          </label>
          <label>
            <input
              type="radio"
              name="reason"
              value="other"
              checked={selectedReason === "other"}
              onChange={handleReasonChange}
            />
            Other
          </label>
          <textarea
            name="comment"
            placeholder="Add a comment"
            value={comment}
            onChange={handleCommentChange}
            className="w-full p-2 border border-gray-300 rounded-md text-black"
          />
          <div className="flex gap-x-3 justify-center">
            <DialogClose asChild>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
              >
                Submit
              </button>
            </DialogClose>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReportForm;
