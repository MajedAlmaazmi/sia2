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

export const NewImamForm: React.FC<NewImamFormProps> = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
  });

  const handleFormSubmit: SubmitHandler<FormValues> = (data) => {
    onSubmit(data);
  };

  return (
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

      <button type="submit">حفظ</button>
    </form>
  );
};
export default NewImamForm;
