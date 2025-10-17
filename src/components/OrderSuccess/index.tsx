"use client";
import React from "react";
import Breadcrumb from "../Common/Breadcrumb";
import Link from "next/link";

const OrderSuccess = () => {
  return (
    <>
      <Breadcrumb title={"Order Success"} pages={["Order Success"]} />
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="bg-white rounded-xl shadow-1 px-4 py-10 sm:py-15 lg:py-20 xl:py-25">
            <div className="text-center">
              {/* Success Icon */}
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-7.5">
                <svg
                  className="w-10 h-10 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              <h2 className="font-bold text-blue text-4xl lg:text-[45px] lg:leading-[57px] mb-5">
                Order Placed Successfully!
              </h2>

              <h3 className="font-medium text-dark text-xl sm:text-2xl mb-3">
                Thank you for your order
              </h3>

              <p className="max-w-[491px] w-full mx-auto mb-7.5">
                Your order has been successfully placed. We will send you a confirmation email shortly with your order details.
              </p>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 font-medium text-white bg-blue py-3 px-6 rounded-md ease-out duration-200 hover:bg-blue-dark"
                >
                  <svg
                    className="fill-current"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M16.6654 9.37502C17.0105 9.37502 17.2904 9.65484 17.2904 10C17.2904 10.3452 17.0105 10.625 16.6654 10.625H8.95703L8.95703 15C8.95703 15.2528 8.80476 15.4807 8.57121 15.5774C8.33766 15.6742 8.06884 15.6207 7.89009 15.442L2.89009 10.442C2.77288 10.3247 2.70703 10.1658 2.70703 10C2.70703 9.83426 2.77288 9.67529 2.89009 9.55808L7.89009 4.55808C8.06884 4.37933 8.33766 4.32586 8.57121 4.42259C8.80475 4.51933 8.95703 4.74723 8.95703 5.00002L8.95703 9.37502H16.6654Z"
                      fill=""
                    />
                  </svg>
                  Return to Home
                </Link>

                <Link
                  href="/my-account?tab=orders"
                  className="inline-flex items-center gap-2 font-medium text-blue bg-white border border-blue py-3 px-6 rounded-md ease-out duration-200 hover:bg-blue hover:text-white"
                >
                  <svg
                    className="fill-current"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M17.5 5.83333H2.5C2.15833 5.83333 1.875 5.55 1.875 5.20833C1.875 4.86667 2.15833 4.58333 2.5 4.58333H17.5C17.8417 4.58333 18.125 4.86667 18.125 5.20833C18.125 5.55 17.8417 5.83333 17.5 5.83333Z"
                      fill=""
                    />
                    <path
                      d="M16.25 17.0833H3.75C2.36667 17.0833 1.25 15.9667 1.25 14.5833V5.20833C1.25 4.86667 1.53333 4.58333 1.875 4.58333C2.21667 4.58333 2.5 4.86667 2.5 5.20833V14.5833C2.5 15.275 3.05833 15.8333 3.75 15.8333H16.25C16.9417 15.8333 17.5 15.275 17.5 14.5833V5.20833C17.5 4.86667 17.7833 4.58333 18.125 4.58333C18.4667 4.58333 18.75 4.86667 18.75 5.20833V14.5833C18.75 15.9667 17.6333 17.0833 16.25 17.0833Z"
                      fill=""
                    />
                    <path
                      d="M13.125 8.95833H6.875C6.53333 8.95833 6.25 8.675 6.25 8.33333C6.25 7.99167 6.53333 7.70833 6.875 7.70833H13.125C13.4667 7.70833 13.75 7.99167 13.75 8.33333C13.75 8.675 13.4667 8.95833 13.125 8.95833Z"
                      fill=""
                    />
                  </svg>
                  My Orders
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default OrderSuccess;
