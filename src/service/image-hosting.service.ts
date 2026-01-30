const IMAGE_HOSTING_API = `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_HOSTING_KEY}`;

export const imageHostingService = {
     async uploadImage(file: File) {
          const formData = new FormData();
          formData.append("image", file);

          try {
               const res = await fetch(IMAGE_HOSTING_API, {
                    method: "POST",
                    body: formData,
               });

               const data = await res.json();

               if (!res.ok || !data.success) {
                    throw new Error("Image upload failed");
               }

               return {
                    ok: true,
                    url: data.data.display_url as string,
               };
          } catch (error) {
               console.error("Image upload error:", error);
               return {
                    ok: false,
                    url: null,
               };
          }
     },
};
