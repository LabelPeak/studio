import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import brand from "@/assets/brand.svg";
import { useState } from "react";

export function LoginPage() {
  const [formState, setFormState] = useState<"login" | "register">("login");

  return (
    <section className="w-full h-[100vh] p-6 bg-nord-snow-1 box-border min-h-2xl min-w-5xl">
      <div className="flex h-full bg-white rd-1 shadow">
        <div className="flex-basis-[50%] flex flex-col justify-center items-end">
          <div>
            <img className="w-40 op-80" src={brand} />
          </div>
          <div>
            <h1 className="text-8 c-nord-frost-3">LabelPeak</h1>
          </div>
        </div>
        <div className="flex-basis-[50%] flex flex-col justify-center mx-32">
          <div className="flex-basis-[40%] flex flex-col justify-end items-start c-nord-polar-0">
            <div className="text-5 mb-8">
              Welcome back to {" "}
              <span className="c-nord-frost-3 font-600">LabelPeak</span>
            </div>
            <h1 className="text-8">
              {formState.charAt(0).toUpperCase() + formState.slice(1)}
            </h1>
          </div>
          <div className="flex-auto w-90">
            { formState === "login" ?
              <>
                <LoginForm />
                <div className="p-6 bg-nord-frost-3 bg-op-10 border-nord-frost-3 b-solid rd-1">
                  <span>New to LabelPeak?</span>
                  <a className="ml-1 cursor-pointer c-nord-frost-3" onClick={() => setFormState("register")}>Create an account</a>
                </div>
              </>:
              <>
                <RegisterForm />
                <div className="p-6 bg-nord-frost-3 bg-op-10 border-nord-frost-3 b-solid rd-1">
                  <span>Already have account?</span>
                  <a className="ml-1 cursor-pointer c-nord-frost-3" onClick={() => setFormState("login")}>Sign in</a>
                </div>
              </>
            }
          </div>
        </div>
      </div>
    </section>
  );
}