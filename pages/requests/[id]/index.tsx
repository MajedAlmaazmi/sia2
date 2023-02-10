import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";


function PopUpWindow({ status, freelancers, showPopup, setShowPopup }) {
  const router = useRouter();
  console.log(status);
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm({
  });
  const handleHidePopup = () => {
    setShowPopup(false);
  };
  const onSubmit = (data) => {
    console.log({...data, status});
    fetch(
      `https://sunset-nosy-toast.glitch.me/requests/${router.query.id}/status`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({...data, status}),
      }
    )
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
    <>
      {showPopup && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center">
          <div className="absolute top-0 left-0 w-full h-full bg-gray-900 opacity-50"></div>
          <div className="bg-white rounded-lg w-3/4 md:w-1/2 lg:w-1/3 z-50 overflow-y-auto">
            <button
              className="absolute top-0 right-0 mt-2 mr-2"
              onClick={handleHidePopup}
            >
              X
            </button>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col space-y-4 mb-6">
                {status === "REJECTED" && (
                  <div className="flex flex-col">
                    <span className="text-lg font-medium mb-2"> سبب الرفض</span>
                    <input
                      type="text"
                      placeholder="السبب"
                      {...register("reason")}
                    />
                  </div>
                )}

                {status === "APPROVED" && (
                  <div className="flex flex-col">
                    <span className="text-lg font-medium mb-2">
                      {" "}
                      الرجاء إختيار الإمام البديل
                    </span>
                    <select {...register("freelancerId")}>
                      {freelancers.data.map((freelancer) => (
                        <option key={freelancer.id} value={freelancer.id}>
                          {freelancer.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default function MosqueDetailsPage({ request, freelancers }) {
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(false);
  const [status, setStatus] = useState();
  const handleShowPopup = () => {
    setShowPopup(true);
  };

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <div className="border-2 flex flex-col p-4 rounded border-black mt-4 mb-6 ml-4 mr-2 grow">
      <h1 className="text-4xl mb-2 font-bold mb-4">الإجازة {request.id}</h1>

      <div class="flex flex-col space-y-4 mb-6">
        <div class="flex flex-col">
          <span class="text-lg font-medium mb-2">اسم الإمام</span>
          <p class="text-gray-700">{request.imam.name}</p>
        </div>
      </div>

      <div class="flex flex-col space-y-4 mb-6">
        <div class="flex flex-col">
          <span class="text-lg font-medium mb-2">رقم هاتف الإمام</span>
          <p class="text-gray-700">{request.imam.phone}</p>
        </div>
      </div>

      <div class="flex flex-col space-y-4 mb-6">
        <div class="flex flex-col">
          <span class="text-lg font-medium mb-2">تاريخ التقديم</span>
          <p class="text-gray-700">{request.createdAt.split("T")[0]}</p>
        </div>
      </div>

      <div class="flex flex-col space-y-4 mb-6">
        <div class="flex flex-col">
          <span class="text-lg font-medium mb-2">تاريخ بدء الإجازة</span>
          <p class="text-gray-700">{request.startDate.split("T")[0]}</p>
        </div>
      </div>

      <div class="flex flex-col space-y-4 mb-6">
        <div class="flex flex-col">
          <span class="text-lg font-medium mb-2">تاريخ نهاية الإجازة</span>
          <p class="text-gray-700">{request.endDate.split("T")[0]}</p>
        </div>
      </div>
      <div class="flex flex-col space-y-4 mb-6">
        <div class="flex flex-col">
          <span class="text-lg font-medium mb-2">حالة الطلب</span>
          <p class="text-gray-700">{request.status}</p>
        </div>
      </div>

      {request.status === "APPROVED" && (
        <div class="flex flex-col space-y-4 mb-6">
          <div class="flex flex-col">
            <span class="text-lg font-medium mb-2">اسم الإمام البديل</span>
            <p class="text-gray-700">
              {request.assignments[0].freelancer.name}
            </p>
          </div>

          <div class="flex flex-col">
            <span class="text-lg font-medium mb-2">رقم الإمام البديل</span>
            <p class="text-gray-700">
              {request.assignments[0].freelancer.phone}
            </p>
          </div>
        </div>
      )}

      {request.status === "REJECTED" && (
        <div class="flex flex-col space-y-4 mb-6">
          <div class="flex flex-col">
            <span class="text-lg font-medium mb-2"> سبب الرفض</span>
            <p class="text-gray-700">{request.rejectedReason}</p>
          </div>
        </div>
      )}

      {/* {request.status === "PENDING" && (
        <div class="flex flex-col space-y-4 mb-6">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label>
                <input type="radio" value="APPROVED" {...register("value")} />
                Approved
              </label>
              {watchReason === "APPROVED" && (
                <select {...register("freelancerId")}>
                  {freelancers.data.map((freelancer) => (
                    <option key={freelancer.id} value={freelancer.id}>
                      {freelancer.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div>
              <label>
                <input type="radio" value="REJECTED" {...register("value")} />
                Rejected
              </label>
            </div>
            <div>
              {watchReason === "REJECTED" && (
                <input
                  type="text"
                  placeholder="السبب"
                  {...register("reason")}
                />
              )}
            </div>
            <button type="submit">Submit</button>
          </form>
        </div>
      )} */}
      {request.status === "PENDING" && (
        <div>
          <button
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
          onClick={() => {
            setStatus("APPROVED");
            handleShowPopup();
          }}
        >
          موافق
        </button>

        <button
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
          onClick={() => {
            setStatus("REJECTED");
            handleShowPopup();
          }}
        >
          رفض
        </button>
      </div>
      )}
    

      <PopUpWindow
        status={status}
        showPopup={showPopup}
        freelancers={freelancers}
        setShowPopup={setShowPopup}
      />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const id = params?.id;
  const res = await fetch(`https://sunset-nosy-toast.glitch.me/requests/${id}`);
  const request = await res.json();

  const freelancersRes = await fetch(
    `https://sunset-nosy-toast.glitch.me/freelancers?startDate=${request.startDate.split("T")[0]}&&endDate=${request.endDate.split("T")[0]}`
  );
  const freelancers = await freelancersRes.json();

  return {
    props: { request, freelancers },
  };
};
