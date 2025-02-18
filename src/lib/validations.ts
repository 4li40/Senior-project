import { z } from "zod";

// Common validation rules
const nameSchema = z
  .string()
  .min(1, "Name is required")
  .max(50, "Name must be less than 50 characters")
  .regex(/^[a-zA-Z\s'-]+$/, "Name can only contain letters, spaces, apostrophes, and hyphens");

const emailSchema = z.string().email("Invalid email address").max(100, "Email must be less than 100 characters");

// Updated password schema
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .max(100, "Password must be less than 100 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character");

// Updated phone schema to allow 03, 81, 76, 71
const phoneSchema = z
  .string()
  .regex(/^(03|81|76|71)\d{6}$/, "Please enter a valid phone number starting with 03, 81, 76, or 71 followed by 6 digits");

const subjectsSchema = z.array(z.string()).min(1, "Select at least one subject");

const availabilitySchema = z.object({
  days: z.array(z.string()).min(1, "Select at least one day"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
}).refine((data) => data.startTime < data.endTime, {
  message: "End time must be after start time",
  path: ["endTime"],
});

export const studentSignupSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  phoneNumber: phoneSchema,
  educationLevel: z.string().min(1, "Education level is required"),
  school: z.string().min(1, "School/Institution is required"),
  subjects: subjectsSchema,
  goals: z.string().max(1000, "Goals description must be less than 1000 characters").optional(),
  agreedToTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the Terms of Service",
  }),
});

export const teacherSignupSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  password: passwordSchema,
  education: z.string().min(1, "Education level is required").max(100, "Education details must be less than 100 characters"),
  certifications: z.string().max(200, "Certifications must be less than 200 characters").optional(),
  experience: z.number().min(0, "Experience must be a positive number").max(50, "Experience must be 50 years or less"),
  subjects: subjectsSchema,
  otherSubjects: z.string().max(100, "Other subjects must be less than 100 characters").optional(),
  availability: availabilitySchema,
});
