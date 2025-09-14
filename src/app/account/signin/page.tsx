import {Suspense} from "react";
import SignInForm from "./SigninForm";

export default function SigninPage() {
  return (
    <Suspense fallback={<div>Ładowanie...</div>}>
      <SignInForm />
    </Suspense>
  );
}
