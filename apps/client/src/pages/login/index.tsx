import { useIntl } from "react-intl";

import brand from "@/assets/brand.svg";
import { BrandName, ProductName } from "@/configs/constants";

import LoginForm from "./components/login-form";

export function LoginPage() {
  const intl = useIntl();

  return (
    <section className="w-full h-[100vh] p-6 bg-nord-snow-1 box-border min-h-2xl min-w-5xl">
      <div className="flex h-full bg-white rd-1 shadow">
        <div className="flex-basis-[50%] flex flex-col justify-center items-end">
          <div>
            <img className="w-40 op-80" src={brand} />
          </div>
          <div>
            <h1 className="text-8 c-nord-frost-3"> {BrandName} </h1>
          </div>
        </div>
        <div className="flex-basis-[50%] flex flex-col justify-center mx-32">
          <div className="flex-basis-[40%] flex flex-col justify-end items-start c-nord-polar-0">
            <div className="text-5 mb-8">
              {intl.formatMessage({ id: "welcome" })}
              <span className="ml-1 c-nord-frost-3 font-600">{ProductName}</span>
            </div>
            <h1 className="text-8">{intl.formatMessage({ id: "login" })}</h1>
          </div>
          <div className="flex-auto w-90">
            <LoginForm intl={intl} />
          </div>
        </div>
      </div>
    </section>
  );
}
