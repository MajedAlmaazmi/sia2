// pages/imams/[id]/delete.tsx

import { useRouter } from "next/router";
import { useEffect } from "react";

export default function DeleteImamPage() {
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    async function deleteImam() {
      await fetch(`https://sunset-nosy-toast.glitch.me/mosques/${id}`, {
        method: "DELETE",
      });
      router.push("/mosques");
    }

    if (id) {
      deleteImam();
    }
  }, [id]);

  return <div>Deleting Imam...</div>;
}
