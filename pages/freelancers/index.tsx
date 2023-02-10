import { GetServerSideProps } from "next";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";
import { useForm, useWatch } from "react-hook-form";

const FreelancerList: React.FC<> = ({ freelancers }) => {
  const router = useRouter();
  const { register, handleSubmit } = useForm({
    defaultValues: {
      search: router.query.search || "",
    },
  });

  const onSubmit = (data) => {
    const { search } = data;
    const query = { ...router.quer };

    if (search) {
      query.search = search;
    } else {
      delete query.search;
    }

    router.push({
      pathname: "/freelancers",
      query,
    });
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= freelancers.totalPages; i++) {
      pageNumbers.push(
        <li key={i} className={freelancers.page == i ? "active" : ""}>
          <Link href={`/freelancers?page=${i}`}>{i}</Link>
        </li>
      );
    }
    return pageNumbers;
  };

  return (
    <div className=" flex bg-gray-100 h-full">
      <div className="border-2 flex flex-col p-4 rounded  border-black mt-4 mb-6 mr-2 grow">
        {/* Header */}
        <div className="flex justify-between mb-4">
          <h1 className="text-4xl mb-2 font-bold">الأئمة البدلاء</h1>
          <Link
            className="bg-red-500 font-bold border-2 border-black rounded px-8 py-2"
            href="/freelancers/new"
          >
            إنشاء
          </Link>
        </div>

        <div className="flex flex-col h-full">
          <div className="grow">
            <table className="w-full grow">
              <thead className="border">
                <tr className="text-right">
                  <th>الرقم المالي</th>
                  <th>الاسم</th>
                  <th>رقم الهاتف</th>
                  <th>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {freelancers.data.map((freelancer) => (
                  <tr key={freelancer.id}>
                    <td>{freelancer.finId}</td>
                    <td>{freelancer.name}</td>
                    <td>{freelancer.phone}</td>
                    <td>
                      <Link href={`/freelancers/${freelancer.id}`}>عرض</Link>{" "}
                      <Link href={`/freelancers/${freelancer.id}/edit`}>
                        تعديل
                      </Link>{" "}
                      <Link href={`/freelancers/${freelancer.id}/delete`}>
                        حذف
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mx-auto">
          {/* Pagination */}
          <div className="flex justify-center">
            <button
              className=" ml-4"
              disabled={freelancers.page == 1}
              onClick={() => {
                router.push(
                  `freelancers?page=${parseInt(freelancers.page) - 1}`
                );
              }}
            >
              ˃
            </button>
            <ul>{renderPageNumbers()}</ul>
            <button
              disabled={freelancers.page == freelancers.totalPages}
              className=" mr-4"
              onClick={() => {
                router.push(
                  `freelancers?page=${parseInt(freelancers.page) + 1}`
                );
              }}
            >
              ˂
            </button>
          </div>
          <div className="text-sm">
            {freelancers.skip + 1} -{" "}
            {freelancers.skip + freelancers.data.length} من أصل
            {freelancers.totalFreelancers} أئمة بدلاء
          </div>
        </div>
      </div>

      <div className="mx-4">
        <div className="border-2 flex flex-col p-4 rounded  border-black mt-4 mb-6 mr-2">
          <h2 className="text-lg mb-2">فرز</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <label className="text-sm">البحث</label>
            <input
              className="border border-2 border-black"
              type="search"
              {...register("search")}
            />

            <button type="submit">بحث</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async ({
  query,
}) => {
  const response = await axios.get(
    `https://sunset-nosy-toast.glitch.me/freelancers`
  );
  const freelancers = response.data;
  return { props: { freelancers } };
};

export default FreelancerList;
