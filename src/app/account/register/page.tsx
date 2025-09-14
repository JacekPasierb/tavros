"use client";

import {ErrorMessage, Field, Form, Formik} from "formik";
import {useRouter} from "next/navigation";
import React from "react";
import * as Yup from "yup";

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  marketingOptIn: boolean;
}

const RegisterPage = () => {
  const router = useRouter();

  const initialValues: FormValues = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    marketingOptIn: false,
  };

  const RegisterSchema = Yup.object({
    firstName: Yup.string().min(2).required(),
    lastName: Yup.string().min(2).required(),
    email: Yup.string().email().required(),
    password: Yup.string().min(8, "Min 8 znaków").required(),
    marketingOptIn: Yup.boolean(),
  });

  const handleSubmit = async (values: FormValues) => {
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(values),
      });

      if (res.status === 201) {
        // opcja B: jak wolisz – przekieruj na /login z komunikatem
        router.push("/account/login?registered=1");
      } else if (res.status === 409) {
        alert("Ten email jest już zajęty.");
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data?.message || "Nie udało się utworzyć konta.");
      }
    } catch (err) {
      console.error(err);
      alert("Błąd sieci. Spróbuj ponownie.");
    }
  };

  return (
    <section className="container mx-auto py-2">
      <Formik
        initialValues={initialValues}
        validationSchema={RegisterSchema}
        onSubmit={handleSubmit}
      >
        {({isSubmitting}) => (
          <Form className="max-w-md mx-auto space-y-4 p-6  rounded-lg bg-white ">
            <h1 className="text-2xl font-bold text-center">Register</h1>

            <div>
              <label htmlFor="firstName" className="block text-sm font-medium">
                First Name
              </label>
              <Field
                type="text"
                name="firstName"
                className="mt-1 w-full rounded border p-2"
                placeholder="John"
              />
              <ErrorMessage
                name="firstName"
                component="div"
                className="text-sm text-red-500"
              />
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium">
                Last Name
              </label>
              <Field
                type="text"
                name="lastName"
                className="mt-1 w-full rounded border p-2"
                placeholder="Walker"
              />
              <ErrorMessage
                name="lastName"
                component="div"
                className="text-sm text-red-500"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <Field
                type="email"
                name="email"
                className="mt-1 w-full rounded border p-2"
                placeholder="john@gmail.com"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-sm text-red-500"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <Field
                type="password"
                name="password"
                className="mt-1 w-full rounded border p-2"
                placeholder="********"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-sm text-red-500"
              />
            </div>

            <label className="flex items-start gap-3 rounded-md bg-zinc-50 p-3">
              <Field
                type="checkbox"
                name="marketingOptIn"
                className="mt-1 h-4 w-4 rounded border-zinc-300"
              />
              <span className="text-sm text-zinc-700">
                I’d like to receive email updates with exclusive offers, new
                launches and sale early access.
              </span>
            </label>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded bg-black py-2 text-white font-semibold hover:bg-gray-800 transition"
            >
              {false ? "Creating..." : "Create my account"}
            </button>
          </Form>
        )}
      </Formik>
    </section>
  );
};

export default RegisterPage;
