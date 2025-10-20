import React from "react";
import SingleOrder from "./SingleOrder";
import { Order } from "@/lib/api/services/order.service";
import { useTranslations } from "next-intl";

interface OrdersProps {
  orders: Order[];
}

const Orders = ({ orders }: OrdersProps) => {
  const t = useTranslations();
  return (
    <>
      <div className="w-full overflow-x-auto">
        <div className="min-w-[770px]">
          {/* <!-- order item --> */}
          {orders.length > 0 && (
            <div className="items-center justify-between py-4.5 px-7.5 hidden md:flex ">
              <div className="min-w-[111px]">
                <p className="text-custom-sm text-dark">{t("common.orders")}</p>
              </div>
              <div className="min-w-[175px]">
                <p className="text-custom-sm text-dark">{t("account.date")}</p>
              </div>

              <div className="min-w-[128px]">
                <p className="text-custom-sm text-dark">{t("account.status")}</p>
              </div>

              <div className="min-w-[128px]">
                <p className="text-custom-sm text-dark">{t("account.payment")}</p>
              </div>

              <div className="min-w-[100px]">
                <p className="text-custom-sm text-dark">{t("account.items")}</p>
              </div>

              <div className="min-w-[113px]">
                <p className="text-custom-sm text-dark">{t("account.total")}</p>
              </div>

              <div className="min-w-[113px]">
                <p className="text-custom-sm text-dark">{t("common.action")}</p>
              </div>
            </div>
          )}
          {orders.length > 0 ? (
            orders.map((orderItem, key) => (
              <SingleOrder key={key} orderItem={orderItem} smallView={false} />
            ))
          ) : (
            <p className="py-9.5 px-4 sm:px-7.5 xl:px-10">
              {t("account.noOrders")}
            </p>
          )}
        </div>

        {orders.length > 0 &&
          orders.map((orderItem, key) => (
            <SingleOrder key={key} orderItem={orderItem} smallView={true} />
          ))}
      </div>
    </>
  );
};

export default Orders;
