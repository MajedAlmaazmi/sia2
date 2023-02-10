// pages/[id].tsx

import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Imam } from "../../types/imam";

type Props = {
  imam: Imam;
};

export default function ImamDetailsPage({ imam }: Props) {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <div className="border-2 flex flex-col p-4 rounded border-black mt-4 mb-6 ml-4 mr-2 grow">
      <h1 className="text-4xl mb-2 font-bold mb-4">{imam.name}</h1>
      <div class="flex flex-col space-y-4 mb-6">
        <div class="flex flex-col">
          <span class="text-lg font-medium mb-2">رقم الهاتف</span>
          <p class="text-gray-700">{imam.phone}</p>
        </div>

        <div class="flex flex-col">
          <span class="text-lg font-medium mb-2">المسجد</span>
          <p class="text-gray-700">
            {imam.mosque?.name ? imam.mosque.name : "-"}
          </p>
        </div>

        <div class="flex flex-col">
          <span class="text-lg font-medium mb-2">الرقم المالي</span>
          <p class="text-gray-700">{imam.finId}</p>
        </div>

        <div class="flex flex-col">
          <span class="text-lg font-medium mb-2">النوع</span>
          <p class="text-gray-700">{imam.type}</p>
        </div>
      </div>

      <h1 className="text-2xl mb-2 font-bold mb-4">الإجازات</h1>
      <table>
        <thead>
          <tr>
            <th>رقم الإجازة</th>
            <th>تاريخ البداية</th>
            <th>تاريخ النهاية</th>
            <th>السبب</th>
            <th>البديل</th>
            <th>الحالة</th>
          </tr>
        </thead>
        <tbody>
          {imam.requests.map((request, index) => (
            <tr key={request.id}>
              <td>{index + 1}</td>
              <td>{request.startDate.split("T")[0]}</td>
              <td>{request.endDate.split("T")[0]}</td>
              <td>{request.reason}</td>
              <td>
                {request.assignments[0]?.freelancer?.name
                  ? request.assignments[0].freelancer.name
                  : "-"}
              </td>
              <td>{request.confirm ? "Confirmed" : "Pending"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const id = params?.id;
  const res = await fetch(`https://sunset-nosy-toast.glitch.me/imams/${id}`);
  const imam = await res.json();

  return {
    props: { imam },
  };
};
