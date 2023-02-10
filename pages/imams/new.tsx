import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

type FormValues = {
  name: string;
  phone: string;
};

const schema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  phone: Yup.string()
    .required("Phone is required")
    .matches(/^\d{10}$/, "Invalid phone number"),
});

interface NewImamFormProps {
  onSubmit: (data: FormValues) => void;
}

import NewImamForm from "../../components/NewImamForm";
type FormValues = {
  name: string;
  phone: string;
};
function CreateImamPage({ mosques }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
  });

  const handleNewImamSubmit = (data: FormValues) => {
    // Send the form data to the API to create a new Imam
    fetch("https://sunset-nosy-toast.glitch.me/imams", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        // Do something with the new Imam data
      })
      .catch((error) => {
        // Handle any errors that occur during the API request
        console.error(error);
      });
  };

  return (
    <div className="border-2 flex flex-col p-4 rounded  border-black mt-4 mb-6 ml-4 mr-2 grow">
      <h1 className="text-4xl mb-4 font-bold">إنشاء أمام جديد</h1>
      <form onSubmit={handleSubmit(handleNewImamSubmit)}>
        <div className="mb-4">
          <label className="text-sm block" htmlFor="name">
            الاسم
          </label>
          <input
            className="border border-2 border-black"
            type="text"
            {...register("name")}
          />
          {errors.name && <span>{errors.name.message}</span>}
        </div>
        <div className="mb-4">
          <label className="text-sm block" htmlFor="phone">
            رقم الهاتف
          </label>
          <input
            className="border border-2 border-black"
            type="text"
            {...register("phone")}
          />
          {errors.phone && <span>{errors.phone.message}</span>}
        </div>
        <div className="mb-4">
          <label className="text-sm block" htmlFor="type">
            النوع
          </label>
          <input type="radio" value="محلي" {...register("type")} />
          <label>محلي</label>
          <input type="radio" value="هيئة" {...register("type")} />
          <label>هيئة</label>
          {errors.type && <span>{errors.type.message}</span>}
        </div>

        <div className="mb-4">
          <label className="text-sm block" htmlFor="finId">
            الرقم المالي
          </label>
          <input
            className="border border-2 border-black"
            type="text"
            {...register("finId")}
          />
          {errors.finId && <span>{errors.finId.message}</span>}
        </div>

        <div className="mb-4">
          <label className="text-sm block" htmlFor="finId">
            المسجد
          </label>
          <select
            {...register(`mosqueId`, {
              required: true,
            })}
          >
            {mosques.data.map((mosque) => (
              <option key={mosque.id} value={mosque.id}>
                {mosque.name}
              </option>
            ))}
          </select>
          {errors.mosqueId && <span>{errors.mosqueId.message}</span>}
        </div>

        <button type="submit">حفظ</button>
      </form>
    </div>
  );
}

export default CreateImamPage;
export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const { id } = context.query;
  const response = await fetch(`https://sunset-nosy-toast.glitch.me/mosques`);
  const mosques = await response.json();
  return { props: { mosques } };
};
