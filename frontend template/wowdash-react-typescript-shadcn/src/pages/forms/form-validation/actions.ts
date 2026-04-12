export async function formAction(formData: FormData) {
    formData.get("firstName");
    formData.get("lastName");
    formData.get("email");
    formData.get("phone");
    formData.get("password");
}
