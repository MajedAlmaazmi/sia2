import { GetServerSideProps } from "next";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";
import { useForm, useWatch } from "react-hook-form";
import classNames from "classnames";
interface Imam {
  id: number;
  name: string;
  phone: string;
}

interface Request {
  id: number;
  startDate?: string;
  endDate?: string;
  reason?: string;
  confirm: boolean;
  createdAt: string;
  status: string;
  imam: Imam;
}

interface Props {
  requests: Request[];
}

const Status = ({ status }) => {
  const statusClasses = classNames(
    "text-center",
    "text-sm",
    "font-medium",
    "px-2",
    "py-1",
    {
      "bg-yellow-200 text-yellow-800": status === "PENDING",
      "bg-red-200 text-red-800": status === "REJECTED",
      "bg-green-200 text-green-800": status === "APPROVED",
    }
  );

  const getStatusText = () => {
    switch (status) {
      case "PENDING":
        return "قيد الانتظار".toUpperCase();
      case "REJECTED":
        return "مرفوض".toUpperCase();
      case "APPROVED":
        return "موافق".toUpperCase();
      default:
        return "";
    }
  };

  return <td className={statusClasses}>{getStatusText()}</td>;
};

const RequestList: React.FC<Props> = ({ requests }) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const status = useWatch({
    control,
    name: "status",
  });
  // console.log(router.query.status);

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= requests.totalPages; i++) {
      pageNumbers.push(
        <li key={i} className={requests.page == i ? "active" : ""}>
          <Link href={`/requests?page=${i}`}>{i}</Link>
        </li>
      );
    }
    return pageNumbers;
  };

  const calculateDaysDiff = (startDateStr, endDateStr) => {
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);
    const timeDiff = endDate.getTime() - startDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff;
  };

  return (
    <div className=" flex bg-gray-100 h-full">
      <div className="border-2 flex flex-col p-4 rounded  border-black mt-4 mb-6 mr-2 grow">
        {/* Header */}
        <div className="flex justify-between mb-4">
          <h1 className="text-4xl mb-2 font-bold">الإجازات</h1>
          <Link
            className="bg-red-500 font-bold border-2 border-black rounded px-8 py-2"
            href="/requests/new"
          >
            إنشاء
          </Link>
        </div>
        <div className="flex flex-col h-full">
          <div className="grow">
            <table className="w-full grow">
              <thead className="border">
                <tr className="text-right">
                  <th>المعرف</th>
                  <th>اسم الإمام</th>
                  <th>تاريخ البدء</th>
                  <th>تاريخ الانتهاء</th>
                  <th>عدد الأيام</th>
                  <th>السبب</th>
                  <th>الحالة</th>
                  <th>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {requests.data.map((request) => (
                  <tr key={request.id}>
                    <td>{request.id}</td>
                    <td>{request.imam.name}</td>
                    <td>{request.startDate.split("T")[0]}</td>
                    <td>{request.endDate.split("T")[0]}</td>
                    <td>
                      {calculateDaysDiff(request.startDate, request.endDate)}
                    </td>
                    <td>{request.reason}</td>
                    <Status status={request.status} />
                    <td>
                      <Link href={`/requests/${request.id}`}>عرض</Link>{" "}
                      <Link href={`/requests/${request.id}/edit`}>تعديل</Link>{" "}
                      <Link href={`/requests/${request.id}/delete`}>حذف</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mx-auto">
            {/* Pagination */}
            <div className="flex justify-center">
              <button
                className=" ml-4"
                disabled={requests.page == 1}
                onClick={() => {
                  router.push(`requests?page=${parseInt(requests.page) - 1}`);
                }}
              >
                ˃
              </button>
              <ul>{renderPageNumbers()}</ul>
              <button
                disabled={requests.page == requests.totalPages}
                className=" mr-4"
                onClick={() => {
                  router.push(`requests?page=${parseInt(requests.page) + 1}`);
                }}
              >
                ˂
              </button>
            </div>
            <div className="text-sm">
              {requests.skip + 1} - {requests.skip + requests.data.length} من
              أصل
              {requests.totalRequests} أجازات
            </div>
          </div>
        </div>
        {/* Search */}
        {/* <form>
        <div>
          <label>
            <input type="radio" value="ALL" {...register("status")} />
            ALL
          </label>
        </div>
        <div>
          <label>
            <input type="radio" value="PENDING" {...register("status")} />
            Pending
          </label>
        </div>
        <div>
          <label>
            <input type="radio" value="APPROVED" {...register("status")} />
            Approved
          </label>
        </div>
        <div>
          <label>
            <input type="radio" value="REJECTED" {...register("status")} />
            Rejected
          </label>
        </div>
      </form> */}
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async ({
  query,
}) => {
  const { page = 1, status, startDate, endDate } = query;
  const params = {};
  if (status) {
    params.status = status;
  }
  if (startDate && endDate) {
    params.startDate = startDate;
    params.endDate = endDate;
  }
  const response = await axios.get(
    `https://sunset-nosy-toast.glitch.me/requests`,
    {
      params: { ...params, page },
    }
  );
  const requests = response.data;
  return { props: { requests } };
};

export default RequestList;
