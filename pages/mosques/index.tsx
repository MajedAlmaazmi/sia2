import { GetServerSideProps } from "next";
import React, { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

interface Imam {
  id: number;
  name: string;
  phone: string;
}

interface Mosque {
  id: number;
  name: string;
  imams: Imam[];
}

interface Props {
  mosques: Mosque[];
}

const MosqueList: React.FC<Props> = ({ mosques }) => {
  const router = useRouter();
  const { register, handleSubmit } = useForm({
    defaultValues: {
      type: router.query.type || "الكل",
    },
  });
  const onSubmit = (data) => {
    console.log(data);
    const { search, numberOfImams } = data;
    const query = { ...router.query };

    if (search) {
      query.search = search;
    } else {
      delete query.search;
    }

    if (numberOfImams != "all") {
      query.numberOfImams = numberOfImams;
    } else {
      delete query.numberOfImams;
    }

    router.push({
      pathname: "/mosques",
      query,
    });

    // const params = {};
    // if (data.search) {
    //   params.search = data.search;
    // }
    // if (data.type !== "الكل") {
    //   params.type = data.type;
    // }
    // axios
    //   .get("https://sunset-nosy-toast.glitch.me/imams", { params })
    //   .then((response) => {
    //     console.log(response.data);
    //     // handle API response
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //     // handle API error
    //   });
    // handle form submission
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= mosques.totalPages; i++) {
      pageNumbers.push(
        <li key={i} className={mosques.page == i ? "active" : ""}>
          <Link href={`/mosques?page=${i}`}>{i}</Link>
        </li>
      );
    }
    return pageNumbers;
  };

  return (
    <div className="flex bg-gray-100 h-full">
      <div className="border-2 flex flex-col p-4 rounded  border-black mt-4 mb-6 mr-2 grow">
        <div className="flex justify-between mb-4">
          <h1 className="text-4xl mb-2 font-bold">المساجد</h1>
          <Link
            className="bg-red-500 font-bold border-2 border-black rounded px-8 py-2"
            href="/mosques/new"
          >
            إنشاء
          </Link>
        </div>
        <div className="flex flex-col h-full">
          <div className="grow">
            <table className="w-full grow">
              <thead className="border">
                <tr className="text-right">
                  <th>الرقم التعريفي</th>
                  <th>الاسم</th>
                  <th>الأئمة</th>
                  <th>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {mosques.data.map((mosque) => (
                  <tr key={mosque.id}>
                    <td>{mosque.id}</td>
                    <td>{mosque.name}</td>
                    <td>
                      <ul>
                        {mosque.imams.map((imam) => {
                          return <li>{imam.name}</li>;
                        })}
                      </ul>
                    </td>
                    <td>
                      <Link href={`/mosques/${mosque.id}`}>عرض</Link>{" "}
                      <Link href={`/mosques/${mosque.id}/edit`}>تعديل</Link>{" "}
                      <Link href={`/mosques/${mosque.id}/delete`}>حذف</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mx-auto">
            <div className="flex justify-center">
              {/* Pagination */}

              <button
                className=" ml-4"
                disabled={mosques.page == 1}
                onClick={() => {
                  router.push(`mosques?page=${parseInt(mosques.page) - 1}`);
                }}
              >
                ˃
              </button>
              <ul>{renderPageNumbers()}</ul>
              <button
                className=" mr-4"
                disabled={mosques.page == mosques.totalPages}
                onClick={() => {
                  router.push(`mosques?page=${parseInt(mosques.page) + 1}`);
                }}
              >
                ˂
              </button>
            </div>
            <div className="text-sm">
              {mosques.skip + 1} - {mosques.skip + mosques.data.length} من أصل
              {mosques.totalImams} مساجد
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
              <label className="text-sm">عدد الأئمة</label>
              <div>
                <input
                  type="radio"
                  {...register("numberOfImams")}
                  value="all"
                  id="imam-0"
                />
                <label htmlFor="imam-0">الكل</label>
              </div>
              <div>
                <input
                  type="radio"
                  {...register("numberOfImams")}
                  value="1"
                  id="imam-1"
                />
                <label htmlFor="imam-1">1</label>
              </div>
              <div>
                <input
                  type="radio"
                  {...register("numberOfImams")}
                  value="2"
                  id="imam-2"
                />
                <label htmlFor="imam-2">2</label>
              </div>
              <div>
                <input
                  type="radio"
                  {...register("numberOfImams")}
                  value="0"
                  id="imam-0"
                />
                <label htmlFor="imam-0">لا يوجد</label>
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
  const { page = 1, search = "", numberOfImams } = query;

  const params = { page };
  if (search) {
    params.search = search;
  } else {
    delete params.search;
  }

  if (numberOfImams) {
    params.numberOfImams = numberOfImams;
  } else {
    delete params.numberOfImams;
  }
  console.log({
    params,
  });
  const response = await axios.get(
    `https://sunset-nosy-toast.glitch.me/mosques`,
    {
      params,
    }
  );

  const mosques = response.data;
  return { props: { mosques } };
};

export default MosqueList;
