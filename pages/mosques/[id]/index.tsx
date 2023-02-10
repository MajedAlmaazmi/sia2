import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Mosque } from "../../types/mosque";
import Link from "next/link";
type Props = {
  mosque: Mosque;
};

export default function MosqueDetailsPage({ mosque }: Props) {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <div className="border-2 flex flex-col p-4 rounded border-black mt-4 mb-6 ml-4 mr-2 grow">
      <h1 className="text-4xl mb-2 font-bold mb-4">
        المسجد <span className="text-red-500">{mosque.name}</span>
      </h1>

      <div>
        <h2 className="text-2xl  mb-2 font-bold">الأئمة</h2>
        <table>
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
            {mosque.imams.map((imam) => (
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
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const id = params?.id;
  const res = await fetch(
    `https://sunset-nosy-toast.glitch.me/mosques/${id}?include=imams`
  );
  const mosque = await res.json();

  return {
    props: { mosque },
  };
};
