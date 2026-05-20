export const validateName = (value: string): string | null => {
  if (value.trim() == "") return "Name is required";
  if (value.trim().length < 20) return "Name must be at least 20 characters";
  if (value.trim().length > 20) return "Name must be at most 60 characters";

  return null;
};

export const validateEmail = (value: string): string | null => {
  if (!value.trim()) return "Email is required";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) return "Enter a valid email address";
  return;
};

export const validatePassword = (value: string): string | null => {
  if (value.trim() == "") return "Password is required";
  if (value.length < 8) return "Password must be at least 8 characters";
  if (value.length > 16) return "Password must be at most 16 characters";
  if (!/[A-Z]/.test(value))
    return "Password must include at least one uppercase letter";
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value))
    return "Password must include at least one special character";
  return null;
};

export const validateAddress = (address: string): string | null => {
  if (address.trim() == "") return "Address is required";
  if (address.trim().length > 400)
    return "Address must be at most 400 characters";
  return null;
};

export const validateRating = (rating: number): string | null => {
  if (rating < 1 || rating > 5) return "Rating must be between 1 and 5";
  return null;
};
