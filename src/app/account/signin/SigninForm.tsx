"use client";

import { ErrorMessage, Field, Form, Formik } from "formik";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import * as Yup from "yup";

interface FormValues {
  email: string;
  password: string;
}

export default function SignInForm() {
  const router = useRouter();
  const search = useSearchParams();
  const callbackUrl = search.get("callbackUrl") || "/account/myaccount";

  const initialValues: FormValues = { email: "", password: "" };

  const LoginSchema = Yup.object({
    email: Yup.string().email("Nieprawidłowy email").required("Wymagane"),
    password: Yup.string().min(8, "Min 8 znaków").required("Wymagane"),
  });

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting }: { setSubmitting: (x: boolean) => void }
  ) => {
    try {
      const res = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (!res) {
        alert("Brak odpowiedzi z serwera logowania.");
        return;
      }

      if (res.error) {
        alert("Błędny email lub hasło");
        return;
      }

      router.push(callbackUrl);
    } catch (e) {
      console.error(e);
      alert("Błąd logowania. Spróbuj ponownie.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="container mx-auto py-2">
      <Formik initialValues={initialValues} validationSchema={LoginSchema} onSubmit={handleSubmit}>
        {({ isSubmitting }) => (
          <Form className="max-w-md mx-auto space-y-4 p-6 rounded-lg bg-white">
            <h1 className="text-2xl font-bold text-center">Login</h1>

            <div>
              <label htmlFor="email" className="block text-sm font-medium">Email</label>
              <Field type="email" name="email" className="mt-1 w-full rounded border p-2" />
              <ErrorMessage name="email" component="div" className="text-sm text-red-500" />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium">Password</label>
              <Field type="password" name="password" autoComplete="current-password" className="mt-1 w-full rounded border p-2" />
              <ErrorMessage name="password" component="div" className="text-sm text-red-500" />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded bg-black py-2 text-white font-semibold hover:bg-gray-800 transition"
            >
              {isSubmitting ? "Loading..." : "Login my account"}
            </button>
          </Form>
        )}
      </Formik>
    </section>
  );
}
