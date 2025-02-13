import { z } from "zod";

// Common validation rules that can be reused
const nameSchema = z
  .string()
  .min(1, "Name is required")
  .max(20, "Name must be less than 20 characters")
  .regex(/^[a-zA-Z\s-]+$/, "Name can only contain letters, spaces, and hyphens");

const emailSchema = z
  .string()
  .email("Invalid email address")
  .max(50, "Email must be less than 50 characters")
  .refine((email) => email.endsWith("@gmail.com") || email.endsWith("@hotmail.com") || email.endsWith("@outlook.com") || email.endsWith("@yahoo.com"), {
    message: "Please use a valid email provider (gmail.com, hotmail.com, outlook.com, yahoo.com)",
  });

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .max(50, "Password must be less than 50 characters")
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, 
    "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character");

const phoneSchema = z
  .string()
  .regex(
    /^(3|70|71|76|78|79|81)\d{6}$/,
    "Please enter a valid Lebanese phone number (e.g., 3 123456)"
  );

const subjectsSchema = z
  .array(z.string())
  .min(1, "Select at least one subject")
  .max(5, "You can select up to 5 subjects");

const availabilitySchema = z.object({
  days: z.array(z.string()).min(1, "Select at least one day"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
}).refine(
  (data) => {
    if (!data.startTime || !data.endTime) return true;
    return data.startTime < data.endTime;
  },
  {
    message: "End time must be after start time",
    path: ["endTime"],
  }
);

export const studentSignupSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  phoneNumber: phoneSchema,
  educationLevel: z
    .string()
    .min(1, "Education level is required")
    .refine(
      (val) => ["High School", "University", "Graduate"].includes(val),
      "Please select a valid education level"
    ),
  school: z
    .string()
    .min(1, "School/Institution is required")
    .max(50, "School name must be less than 50 characters"),
  subjects: subjectsSchema,
  goals: z
    .string()
    .min(10, "Please provide at least 10 characters describing your goals")
    .max(500, "Goals description must be less than 500 characters")
    .optional(),
  agreedToTerms: z
    .boolean({
      required_error: "You must agree to the Terms of Service",
    })
    .refine((val) => val === true, {
      message: "You must agree to the Terms of Service",
    }),
});

export const teacherSignupSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  password: passwordSchema,
  education: z
    .string()
    .min(1, "Education level is required")
    .max(100, "Education details must be less than 100 characters")
    .refine(
      (val) => ["Bachelor's", "Master's", "PhD", "Other"].includes(val),
      "Please select a valid education level"
    ),
  certifications: z
    .string()
    .max(200, "Certifications must be less than 200 characters")
    .optional()
    .transform((val) => val || undefined),
  experience: z
    .string()
    .regex(/^\d+$/, "Experience must be a number")
    .refine(
      (val) => parseInt(val) >= 0 && parseInt(val) <= 50,
      "Experience must be between 0 and 50 years"
    ),
  subjects: subjectsSchema,
  otherSubjects: z
    .string()
    .max(100, "Other subjects must be less than 100 characters")
    .optional()
    .transform((val) => val || undefined),
  availability: availabilitySchema,
});