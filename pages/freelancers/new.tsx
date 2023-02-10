import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

type FormValues = {
  name: string;
  phone: string;
};

const schema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
});

type Imam = {
  id: number;
  name: string;
  phone: string;
  finId: "";
};

function CreateFreelancerPage() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      phone: "",
      finId: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log(data);
    // Send the form data to the API to create a new mosque
    fetch("https://sunset-nosy-toast.glitch.me/freelancers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        // Do something with the new mosque data
      })
      .catch((error) => {
        // Handle any errors that occur during the API request
        console.error(error);
      });
  };

  const handleFormSubmit: SubmitHandler<FormValues> = (data) => {
    onSubmit(data);
  };

  return (
    <div className="border-2 flex flex-col p-4 rounded  border-black mt-4 mb-6 ml-4 mr-2 grow">
      <h1 className="text-4xl mb-4 font-bold">إنشاء أمام بديل جديد</h1>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
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
}

export default CreateFreelancerPage;
