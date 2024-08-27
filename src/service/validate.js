export const validatePhone = (phone) => {
   const phonePattern = /^[0-9]{10,11}$/;
   return phonePattern.test(phone);
};