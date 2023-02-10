// pages/[id].tsx

import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function ImamDetailsPage({ freelancer }) {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <div className="border-2 flex flex-col p-4 rounded border-black mt-4 mb-6 ml-4 mr-2 grow">
      <h1 className="text-4xl mb-2 font-bold mb-4">{freelancer.name}</h1>
      <div class="flex flex-col space-y-4 mb-6">
        <div class="flex flex-col">
          <span class="text-lg font-medium mb-2">رقم الهاتف</span>
          <p class="text-gray-700">{freelancer.phone}</p>
        </div>

        <div class="flex flex-col">
          <span class="text-lg font-medium mb-2">الرقم المالي</span>
          <p class="text-gray-700">{freelancer.finId}</p>
        </div>
      </div>

      <h1 className="text-2xl mb-2 font-bold mb-4">المناوبات</h1>
      <table>
        <thead>
          <tr>
            <th>رقم الإجازة</th>
            <th>تاريخ البداية</th>
            <th>تاريخ النهاية</th>
            <th>السبب</th>
            <th>الإمام</th>
          </tr>
        </thead>
        <tbody>
          {freelancer.assignments.map((assignment, index) => (
            <tr key={assignment.id}>
              <td>{index + 1}</td>
              <td>{assignment.startDate.split("T")[0]}</td>
              <td>{assignment.endDate.split("T")[0]}</td>
              <td>{assignment.request.reason}</td>
              <td>
                {assignment.request.imam?.name
                  ? assignment.request.imam?.name
                  : "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const id = params?.id;
  const res = await fetch(
    `https://sunset-nosy-toast.glitch.me/freelancers/${id}`
  );
  const freelancer = await res.json();

  return {
    props: { freelancer },
  };
};
