import { GetServerSideProps } from "next";
import React from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  phone: yup.string().required("Phone is required"),
});

const EditFreelancer: React.FC<> = ({ freelancer }) => {
  console.log(freelancer);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<>({
    defaultValues: {
      finId: freelancer.finId,
      name: freelancer.name,
      phone: freelancer.phone,
    },
    // validationSchema: schema,
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    const response = await fetch(
      `https://sunset-nosy-toast.glitch.me/freelancers/${freelancer.id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );
    if (response.ok) {
      alert("Imam updated successfully");
    } else {
      alert("Error updating imam");
    }
  };

  return (
    <div className="border-2 flex flex-col p-4 rounded  border-black mt-4 mb-6 ml-4 mr-2 grow">
      <h1 className="text-4xl mb-4 font-bold">
        تعديل الأمام البديل {freelancer.name}
      </h1>
      <form onSubmit={handleSubmit(onSubmit)}>
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
        <button type="submit">حفظ</button>
      </form>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<> = async (context) => {
  const { id } = context.query;
  const response = await fetch(
    `https://sunset-nosy-toast.glitch.me/freelancers/${id}`
  );
  const freelancer = await response.json();
  return { props: { freelancer } };
};

export default EditFreelancer;
