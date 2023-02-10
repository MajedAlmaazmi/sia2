import { GetServerSideProps } from "next";
import React from "react";
import Link from "next/link";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
interface Imam {
  id: number;
  name: string;
  phone: string;
}

interface Props {
  imams: Imam[];
}

const ImamList: React.FC<Props> = ({ imams }) => {
  const router = useRouter();
  const { register, handleSubmit } = useForm({
    defaultValues: {
      type: router.query.type || "الكل",
    },
  });

  const onSubmit = (data) => {
    console.log(data);
    const { search, type } = data;
    const query = { ...router.query };

    if (search) {
      query.search = search;
    } else {
      delete query.search;
    }

    if (type !== "all") {
      query.type = type;
    } else {
      delete query.type;
    }

    router.push({
      pathname: "/imams",
      query,
    });
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= imams.totalPages; i++) {
      pageNumbers.push(
        <li key={i} className={imams.page == i ? "active" : ""}>
          <Link href={`/imams?page=${i}`}>{i}</Link>
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
          <h1 className="text-4xl mb-2 font-bold">الأئمة</h1>
          <Link
            className="bg-red-500 font-bold border-2 border-black rounded px-8 py-2"
            href="/imams/new"
          >
            إنشاء
          </Link>
        </div>
        {/* Table */}
        <div className="flex flex-col h-full">
          <div className="grow">
            <table className="w-full grow">
              <thead className="border">
                <tr className="text-right">
                  <th className="">الرقم المالي</th>
                  <th>الاسم</th>
                  <th>رقم الهاتف</th>

                  <th>المسجد</th>
                  <th>النوع</th>
                  <th>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {imams.data.map((imam) => (
                  <tr key={imam.id}>
                    <td>{imam.finId}</td>
                    <td>{imam.name}</td>
                    <td>{imam.phone}</td>
                    <td>{imam.mosque?.name ? imam.mosque.name : "-"}</td>
                    <td>{imam.type}</td>
                    <td>
                      <Link href={`/imams/${imam.id}`}>عرض</Link>{" "}
                      <Link href={`/imams/${imam.id}/edit`}>تعديل</Link>{" "}
                      <Link href={`/imams/${imam.id}/delete`}>حذف</Link>
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
                disabled={imams.page == 1}
                onClick={() => {
                  router.push(`imams?page=${parseInt(imams.page) - 1}`);
                }}
              >
                ˃
              </button>
              <ul>{renderPageNumbers()}</ul>
              <button
                disabled={imams.page == imams.totalPages}
                className=" mr-4"
                onClick={() => {
                  router.push(`imams?page=${parseInt(imams.page) + 1}`);
                }}
              >
                ˂
              </button>
            </div>
            <div className="text-sm">
              {imams.skip + 1} - {imams.skip + imams.data.length} من أصل
              {imams.totalImams} أئمة
            </div>
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
            <div>
              <p className="text-sm">النوع</p>
              <div>
                <input type="radio" value="الكل" {...register("type")} />
                <label>الكل</label>
                <input type="radio" value="محلي" {...register("type")} />
                <label>محلي</label>
                <input type="radio" value="هيئة" {...register("type")} />
                <label>هيئة</label>
              </div>
            </div>
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
  const { page = 1, search = "", type = "الكل" } = query;
  const params = {};
  if (search) {
    params.search = search;
  } else {
    delete params.search;
  }

  if (type !== "الكل") {
    params.type = type;
  } else {
    delete params.type;
  }
  const response = await axios.get(
    `https://sunset-nosy-toast.glitch.me/imams`,
    {
      params,
    }
  );

  const imams = response.data;
  return { props: { imams } };
};

export default ImamList;
