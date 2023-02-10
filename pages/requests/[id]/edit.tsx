import React from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

interface RequestForm {
  startDate: Date;
  endDate: Date;
  reason: string;
}

const schema = yup.object().shape({
  startDate: yup.date().required("Start date is required"),
  endDate: yup.date().required("End date is required"),
  reason: yup.string().required("Reason is required"),
});

const NewRequestPage: React.FC = ({ imams, request, freelancers }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RequestForm>({
    defaultValues: {
      ...request,
      freelancerId: request?.assignments[0]?.freelancerId,
    },
    validationSchema: schema,
  });

  const status = watch("status");
  const imamId = watch("imamId");
  const freelancerId = watch("freelancerId");

  const selectedImam = imams.data.find((imam) => {
    return imam.id === parseInt(imamId);
  });

  const selectedFreelancer = freelancers.data.find((freelancer) => {
    return freelancer.id === parseInt(freelancerId);
  });

  const onSubmit = (data: RequestForm) => {
    fetch(`https://sunset-nosy-toast.glitch.me/requests/${request.id}`, {
      method: "PUT",
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

  return (
    <div className="border-2 flex flex-col p-4 rounded  border-black mt-4 mb-6 ml-4 mr-2 grow">
      <h1 className="text-4xl mb-4 font-bold">تعديل الإجازة</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="text-sm block" htmlFor="name">
            اسم الإمام
          </label>
          <select
            className="border border-2 border-black"
            {...register(`imamId`, {
              required: true,
            })}
          >
            <option value="" disabled selected>
              اختر الإمام
            </option>
            {imams.data.map((imam) => (
              <option key={imam.id} value={imam.id}>
                {imam.name} ({imam.finId})
              </option>
            ))}
          </select>
          {errors.imamId && <span>{errors.imamId.message}</span>}
        </div>
        {selectedImam && (
          <div className="border-2 flex flex-col p-4 rounded border-black mt-4 mb-6 ml-4 mr-2 grow">
            <h1 className="text-4xl mb-2 font-bold mb-4">
              {selectedImam.name}
            </h1>
            <div class="flex flex-col space-y-4 mb-6">
              <div class="flex flex-col">
                <span class="text-lg font-medium mb-2">رقم الهاتف</span>
                <p class="text-gray-700">{selectedImam.phone}</p>
              </div>

              <div class="flex flex-col">
                <span class="text-lg font-medium mb-2">المسجد</span>
                <p class="text-gray-700">
                  {selectedImam.mosque?.name ? selectedImam.mosque.name : "-"}
                </p>
              </div>

              <div class="flex flex-col">
                <span class="text-lg font-medium mb-2">الرقم المالي</span>
                <p class="text-gray-700">{selectedImam.finId}</p>
              </div>

              <div class="flex flex-col">
                <span class="text-lg font-medium mb-2">النوع</span>
                <p class="text-gray-700">{selectedImam.type}</p>
              </div>
            </div>
          </div>
        )}

        <div className="mb-4">
          <label className="text-sm block" htmlFor="startDate">
            تاريخ البدء
          </label>
          <input
            className="border border-2 border-black"
            type="date"
            name="startDate"
            id="startDate"
            {...register("startDate")}
            aria-invalid={errors.startDate ? "true" : "false"}
          />
          {errors.startDate && <span>{errors.startDate.message}</span>}
        </div>

        <div className="mb-4">
          <label className="text-sm block" htmlFor="startDate">
            تاريخ الانتهاء
          </label>
          <input
            className="border border-2 border-black"
            type="date"
            name="startDate"
            id="startDate"
            {...register("endDate")}
            aria-invalid={errors.endDate ? "true" : "false"}
          />
          {errors.endDate && <span>{errors.endDate.message}</span>}
        </div>

        <div className="mb-4">
          <label className="text-sm block" htmlFor="reason">
            السبب
          </label>
          <textarea
            className="border border-2 border-black"
            name="reason"
            id="reason"
            {...register("reason")}
            aria-invalid={errors.reason ? "true" : "false"}
          />
          {errors.reason && <span>{errors.reason.message}</span>}
        </div>

        <div className="mb-4">
          <label className="text-sm block" htmlFor="name">
            الحالة
          </label>
          <select
            className="border border-2 border-black"
            {...register(`status` as const, {
              required: true,
            })}
          >
            <option value="PENDING">قيد الانتظار</option>
            <option value="APPROVED">موافق</option>
            <option value="REJECTED">مرفوض</option>
          </select>
        </div>
        {status === "APPROVED" && (
          <div className="mb-4">
            <label className="text-sm block" htmlFor="freelancerId">
              الإمام البديل
            </label>
            <select
              {...register("freelancerId")}
              className="border border-2 border-black"
            >
              <option value="" disabled selected>
                اختر الإمام البديل
              </option>
              {freelancers.data.map((freelancer) => (
                <option key={freelancer.id} value={freelancer.id}>
                  {freelancer.name}
                </option>
              ))}
            </select>

            {selectedFreelancer && <div>{selectedFreelancer.phone}</div>}
          </div>
        )}
        {status === "REJECTED" && (
          <div className="mb-4">
            <label className="text-sm block" htmlFor="rejecredReason">
              سبب الرفض
            </label>
            <textarea
              className="border border-2 border-black"
              name="reason"
              id="reason"
              {...register("rejectedReason")}
              aria-invalid={errors.reason ? "true" : "false"}
            />
            {errors.rejecredReason && (
              <span>{errors.rejecredReason.message}</span>
            )}
          </div>
        )}
        <button type="submit">حفظ</button>
      </form>
    </div>
  );
};

export default NewRequestPage;

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const response = await fetch("https://sunset-nosy-toast.glitch.me/imams");
  const imams = await response.json();

  const { id } = context.query;

  const response1 = await fetch(
    `https://sunset-nosy-toast.glitch.me/requests/${id}`
  );
  const request = await response1.json();

  const freelancersRes = await fetch(
    `https://sunset-nosy-toast.glitch.me/freelancers`
  );
  const freelancers = await freelancersRes.json();

  return {
    props: {
      imams,
      freelancers,
      request: {
        ...request,
        startDate: request.startDate.split("T")[0],
        endDate: request.endDate.split("T")[0],
      },
    },
  };
};
