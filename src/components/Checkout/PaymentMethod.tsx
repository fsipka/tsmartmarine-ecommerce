"use client";
import React, { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { PaymentType } from "@/types/order";
import { loadStripe, StripeCardElement, Stripe } from "@stripe/stripe-js";

interface PaymentMethodProps {
  paymentType: PaymentType;
  onChange: (type: PaymentType) => void;
  onStripeReady?: (cardElement: StripeCardElement | null, stripe: Stripe | null) => void;
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const PaymentMethod: React.FC<PaymentMethodProps> = ({ paymentType, onChange, onStripeReady }) => {
  const t = useTranslations();
  const cardElementRef = useRef<StripeCardElement | null>(null);
  const cardContainerRef = useRef<HTMLDivElement>(null);
  const stripeInstanceRef = useRef<Stripe | null>(null);

  useEffect(() => {
    let isMounted = true;
    let elements: any = null;
    let cardElement: StripeCardElement | null = null;

    const initializeStripe = async () => {
      if (paymentType === PaymentType.CreditCard) {
        // Check if already initialized
        if (cardElementRef.current) {
          if (onStripeReady && stripeInstanceRef.current) {
            onStripeReady(cardElementRef.current, stripeInstanceRef.current);
          }
          return;
        }

        // Wait for DOM to be ready
        await new Promise(resolve => setTimeout(resolve, 100));

        if (!isMounted || !cardContainerRef.current) {
          return;
        }

        const stripe = await stripePromise;
        stripeInstanceRef.current = stripe;

        if (!stripe) {
          console.error('Stripe failed to load!');
          return;
        }

        if (stripe && !cardElementRef.current && isMounted) {
          elements = stripe.elements();
          cardElement = elements.create('card', {
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                fontFamily: '"Inter", sans-serif',
                '::placeholder': {
                  color: '#aab7c4',
                },
                padding: '12px',
              },
              invalid: {
                color: '#fa755a',
                iconColor: '#fa755a',
              },
            },
            hidePostalCode: true,
          });

          cardElement.mount(cardContainerRef.current);
          cardElementRef.current = cardElement;

          if (onStripeReady && isMounted) {
            onStripeReady(cardElement, stripe);
          }
        }
      }
    };

    initializeStripe();

    return () => {
      isMounted = false;
      if (cardElementRef.current && paymentType !== PaymentType.CreditCard) {
        cardElementRef.current.unmount();
        cardElementRef.current = null;
      }
    };
  }, [paymentType]);

  return (
    <div className="bg-white shadow-1 rounded-[10px] mt-7.5">
      <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
        <h3 className="font-medium text-xl text-dark">{t("checkout.paymentMethod")}</h3>
      </div>

      <div className="p-4 sm:p-8.5">
        <div className="flex flex-col gap-3">
          <label
            htmlFor="bank"
            className="flex cursor-pointer select-none items-center gap-4"
          >
            <div className="relative">
              <input
                type="radio"
                name="payment"
                id="bank"
                className="sr-only"
                checked={paymentType === PaymentType.BankTransfer}
                onChange={() => onChange(PaymentType.BankTransfer)}
              />
              <div
                className={`flex h-4 w-4 items-center justify-center rounded-full ${
                  paymentType === PaymentType.BankTransfer
                    ? "border-4 border-blue"
                    : "border border-gray-4"
                }`}
              ></div>
            </div>

            <div
              className={`rounded-md border-[0.5px] py-3.5 px-5 ease-out duration-200 hover:bg-gray-2 hover:border-transparent hover:shadow-none ${
                paymentType === PaymentType.BankTransfer
                  ? "border-transparent bg-gray-2"
                  : " border-gray-4 shadow-1"
              }`}
            >
              <div className="flex items-center">
                <div className="pr-2.5">
                  <Image src="/images/checkout/bank.svg" alt="bank" width={29} height={12}/>
                </div>

                <div className="border-l border-gray-4 pl-2.5">
                  <p>{t("checkout.directBankTransfer")}</p>
                </div>
              </div>
            </div>
          </label>

          <label
            htmlFor="creditCard"
            className="flex cursor-pointer select-none items-center gap-4"
          >
            <div className="relative">
              <input
                type="radio"
                name="payment"
                id="creditCard"
                className="sr-only"
                checked={paymentType === PaymentType.CreditCard}
                onChange={() => onChange(PaymentType.CreditCard)}
              />
              <div
                className={`flex h-4 w-4 items-center justify-center rounded-full ${
                  paymentType === PaymentType.CreditCard
                    ? "border-4 border-blue"
                    : "border border-gray-4"
                }`}
              ></div>
            </div>

            <div
              className={`rounded-md border-[0.5px] py-3.5 px-5 ease-out duration-200 hover:bg-gray-2 hover:border-transparent hover:shadow-none min-w-[240px] ${
                paymentType === PaymentType.CreditCard
                  ? "border-transparent bg-gray-2"
                  : " border-gray-4 shadow-1"
              }`}
            >
              <div className="flex items-center gap-3">
                <svg width="32" height="24" viewBox="0 0 32 24" fill="none">
                  <rect width="32" height="24" rx="4" fill="#635BFF"/>
                  <path d="M13.8 9.6h4.4v4.8h-4.4V9.6z" fill="#fff"/>
                </svg>

                <div className="border-l border-gray-4 pl-2.5">
                  <p>{t("checkout.creditCardStripe")}</p>
                </div>
              </div>
            </div>
          </label>

          {/* Stripe Card Element */}
          {paymentType === PaymentType.CreditCard && (
            <div className="mt-4 p-4 border border-gray-3 rounded-md bg-gray-1">
              <div
                ref={cardContainerRef}
                className="p-3 bg-white rounded border border-gray-3"
              />
              <p className="text-xs text-gray-4 mt-2">
                {t("checkout.paymentSecure")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentMethod;
