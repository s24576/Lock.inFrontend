import React from "react";
import { useQuery } from "react-query";
import getReports from "../../api/admin/getReports";
import useAxios from "../../hooks/useAxios";

const AdminPanel = () => {
  const axiosInstance = useAxios();

  const {
    refetch: refetchReports,
    data: reportsData,
    error: reportsError,
    isLoading: reportsIsLoading,
  } = useQuery("reportsData", () => getReports(axiosInstance), {
    refetchOnWindowFocus: false,
  });

  return (
    <div className="p-[70px] min-h-screen flex flex-col justify-center items-center">
      <p>Admin Panel</p>

      <p>All reports:</p>
      <div className="flex flex-col gap-y-4 mt-3">
        {reportsData &&
          reportsData.content.map((report, key) => {
            return (
              <div key={key}>
                <p>{report.author}</p>
                <p>Message : {report.message}</p>
                <p>Type : {report.objectType}</p>
                <p>Resolved? {report.closed ? "Yes" : "No"}</p>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default AdminPanel;
