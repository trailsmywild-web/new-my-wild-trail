import toast from "react-hot-toast";

export const submitContactForm = async (event) => {
  event.preventDefault();

  const formData = new FormData(event.target);
  formData.append("access_key", "acebff02-6c2e-4120-af81-ca4bc03aea5b");

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (data.success) {
      toast.success("Message sent successfully!");
      event.target.reset();
    } else {
      toast.error(data.message || "Something went wrong!");
    }

  } catch (error) {
    toast.error("Network error!");
  }
};
