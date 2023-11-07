import { BrandName } from "@/configs/constants";
import brand from "@/assets/brand.svg";
import { useIntl } from "react-intl";

export default function WelcomePage() {
  const intl = useIntl();

  return (
    <section
      id="empty-route-placeholder"
      className="w-full h-full flex items-center justify-center select-none"
    >
      <div className="text-center c-nord-frost-3 filter-grayscale-40 op-70">
        <img className="w-8em" src={brand} />
        <h1 className="text-6 my-2">
          { intl.formatMessage({ id: "welcome-page-hello" }, { brand: BrandName })}
        </h1>
        <p className="text-5">{ intl.formatMessage({ id: "welcome-page-tip" })}</p>
      </div>
    </section>
  );
}