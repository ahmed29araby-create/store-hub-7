/**
 * Extracts a user-friendly Arabic error message from any error object.
 * Never shows raw technical messages like "Edge function returned a non-2xx status code".
 */
export function getErrorMessage(err: any, fallback = "حدث خطأ غير متوقع"): string {
  // Try to get message from various error shapes
  let msg = "";

  if (typeof err === "string") {
    msg = err;
  } else if (err?.message) {
    msg = err.message;
  } else if (err?.error) {
    msg = typeof err.error === "string" ? err.error : err.error?.message || "";
  }

  // Filter out technical messages
  if (
    !msg ||
    msg.includes("Edge function") ||
    msg.includes("non-2xx") ||
    msg.includes("FunctionsHttpError") ||
    msg.includes("Failed to fetch")
  ) {
    return fallback;
  }

  // Map common English errors to Arabic
  const errorMap: Record<string, string> = {
    "Super admin already exists": "حساب مسؤول المنصة موجود بالفعل",
    "Invalid login credentials": "البريد الإلكتروني أو كلمة المرور غير صحيحة",
    "User already registered": "البريد الإلكتروني مسجل بالفعل",
    "user_already_exists": "البريد الإلكتروني مسجل بالفعل",
    "Email not confirmed": "البريد الإلكتروني غير مؤكد",
    "No authorization header": "يرجى تسجيل الدخول أولاً",
    "Unauthorized": "غير مصرح بالدخول",
  };

  for (const [key, value] of Object.entries(errorMap)) {
    if (msg.includes(key)) return value;
  }

  return msg;
}
