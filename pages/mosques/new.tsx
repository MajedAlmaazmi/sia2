import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

type FormValues = {
  name: string;
  imams: [{ id: number }];
};

const schema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
});

type Imam = {
  id: number;
  name: string;
  phone: string;
};

function CreateMosquePage({ imams }) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      imams: [],
    },
  });
  const { fields, append, remove } = useFieldArray({
    name: "imams",
    control,
  });

  const onSubmit = (data: FormValues) => {
    console.log(data.imams);
    // Send the form data to the API to create a new mosque
    fetch("https://sunset-nosy-toast.glitch.me/mosques", {
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
      <h1 className="text-4xl mb-4 font-bold">إنشاء مسجد جديد</h1>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
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

        <div>
          <button type="button" onClick={() => append({ id: "" })}>
            اضافة أمام
          </button>
          {fields.map((field, index) => {
            return (
              <div key={field.id}>
                <section className={"section"} key={field.id}>
                  <select
                    {...register(`imams.${index}.id` as const, {
                      required: true,
                    })}
                  >
                    {imams.data.map((imam) => (
                      <option key={imam.id} value={imam.id}>
                        {imam.name}
                      </option>
                    ))}
                  </select>
                  <button type="button" onClick={() => remove(index)}>
                    حذف
                  </button>
                </section>
              </div>
            );
          })}
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default CreateMosquePage;

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const response = await fetch("https://sunset-nosy-toast.glitch.me/imams");
  const imams = await response.json();
  return { props: { imams } };
};
