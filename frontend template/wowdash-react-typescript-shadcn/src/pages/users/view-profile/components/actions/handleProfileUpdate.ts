export async function handleProfileUpdate(formData: FormData) {
  formData.get("name");
  formData.get("email");
  formData.get("number");
  formData.get("department");
  formData.get("designation");
  formData.get("language");
  formData.get("desc");
}
