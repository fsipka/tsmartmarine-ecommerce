"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { StripeCardElement, Stripe } from "@stripe/stripe-js";
import { useAppSelector } from "@/redux/store";
import { useDispatch } from "react-redux";
import { selectCartItems, selectTotalPrice, removeAllItemsFromCart } from "@/redux/features/cart-slice";
import { getSession, isSessionValid } from "@/lib/auth/session";
import { orderService } from "@/lib/api/services/order.service";
import { stripeService } from "@/lib/api/services/stripe.service";
import { formatPrice } from "@/lib/utils/format";
import {
  BillingDetails,
  ShippingDetails,
  PaymentType,
  OrderDto,
  OrderItemDto,
  OrderStatus,
  PaymentStatus
} from "@/types/order";
import Breadcrumb from "../Common/Breadcrumb";
import Billing from "./Billing";
import Shipping from "./Shipping";
import PaymentMethod from "./PaymentMethod";

const Checkout = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const cartItems = useAppSelector(selectCartItems);
  const totalPrice = useAppSelector(selectTotalPrice);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notes, setNotes] = useState("");
  const [stripeCardElement, setStripeCardElement] = useState<StripeCardElement | null>(null);
  const [stripeInstance, setStripeInstance] = useState<Stripe | null>(null);

  const [billingDetails, setBillingDetails] = useState<BillingDetails>({
    firstName: "",
    lastName: "",
    country: "",
    streetAddress: "",
    city: "",
    phone: "",
    email: "",
  });

  const [shippingDetails, setShippingDetails] = useState<ShippingDetails | null>(null);
  const [useDifferentAddress, setUseDifferentAddress] = useState(false);
  const [paymentType, setPaymentType] = useState<PaymentType>(PaymentType.BankTransfer);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = () => {
      const valid = isSessionValid();
      setIsAuthenticated(valid);

      if (!valid) {
        toast.error("Please login to proceed with checkout");
        setTimeout(() => {
          router.push("/signin");
        }, 2000);
      }
    };

    checkAuth();
  }, [router]);

  // Format address for API
  const formatAddress = (details: BillingDetails | ShippingDetails): string => {
    const parts = [
      details.streetAddress,
      details.apartment,
      details.city,
      details.state,
      details.country,
    ].filter(Boolean);
    return parts.join(", ");
  };

  // Map cart items to OrderItemDto
  const mapCartToOrderItems = (): OrderItemDto[] => {
    return cartItems.map(item => {
      const orderItem: OrderItemDto = {
        quantity: item.quantity,
        unitPrice: item.discountedPrice,
        lineTotal: item.discountedPrice * item.quantity,
      };

      // Set the correct ID field based on product type
      switch (item.type) {
        case 'yacht':
          orderItem.yachtId = item.id;
          break;
        case 'accessory':
          orderItem.accessoryId = item.id;
          break;
        case 'service':
          orderItem.serviceId = item.id;
          break;
        case 'spare-part':
          orderItem.sparePartId = item.id;
          break;
        default:
          // Default to accessoryId if type is not set
          orderItem.accessoryId = item.id;
      }

      return orderItem;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error("Please login to place an order");
      router.push("/signin");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    // Validate billing details
    if (!billingDetails.firstName || !billingDetails.lastName || !billingDetails.email ||
        !billingDetails.phone || !billingDetails.streetAddress || !billingDetails.city ||
        !billingDetails.country) {
      toast.error("Please fill in all required billing details");
      return;
    }

    // Validate shipping details if using different address
    if (useDifferentAddress && shippingDetails) {
      if (!shippingDetails.firstName || !shippingDetails.lastName ||
          !shippingDetails.streetAddress || !shippingDetails.city ||
          !shippingDetails.country) {
        toast.error("Please fill in all required shipping details");
        return;
      }
    }

    // Validate Stripe card if Credit Card payment is selected
    if (paymentType === PaymentType.CreditCard && !stripeCardElement) {
      toast.error("Please enter your card details");
      return;
    }

    setIsLoading(true);

    try {
      let paymentStatus = PaymentStatus.Unpaid;

      // Process Stripe payment if Credit Card is selected
      if (paymentType === PaymentType.CreditCard && stripeCardElement && stripeInstance) {
        try {
          // Create Payment Intent
          const clientSecret = await stripeService.createPaymentIntent(totalPrice, 'usd');

          // Confirm card payment using the same Stripe instance
          const { error: stripeError, paymentIntent } = await stripeInstance.confirmCardPayment(
            clientSecret,
            {
              payment_method: {
                card: stripeCardElement,
                billing_details: {
                  name: `${billingDetails.firstName} ${billingDetails.lastName}`,
                  email: billingDetails.email,
                  phone: billingDetails.phone,
                  address: {
                    line1: billingDetails.streetAddress,
                    line2: billingDetails.apartment || undefined,
                    city: billingDetails.city,
                    state: billingDetails.state || undefined,
                    country: 'TR', // Always use TR as country code
                  },
                },
              },
            }
          );

          if (stripeError) {
            throw new Error(stripeError.message || "Payment failed");
          }

          if (paymentIntent?.status === 'succeeded') {
            paymentStatus = PaymentStatus.Paid;
            toast.success("Payment successful!");
          }
        } catch (paymentError: any) {
          console.error("Stripe payment error:", paymentError);
          toast.error(paymentError.message || "Payment processing failed");
          setIsLoading(false);
          return;
        }
      }

      // Create order
      const orderDto: OrderDto = {
        description: notes || undefined,
        shippingAddress: useDifferentAddress && shippingDetails
          ? formatAddress(shippingDetails)
          : formatAddress(billingDetails),
        billingAddress: formatAddress(billingDetails),
        totalAmount: totalPrice,
        discountAmount: 0,
        orderStatus: OrderStatus.Pending,
        paymentType: paymentType,
        paymentStatus: paymentStatus,
        paymentDate: paymentStatus === PaymentStatus.Paid ? new Date().toISOString() : undefined,
        orderItems: mapCartToOrderItems(),
      };

      const createdOrder = await orderService.createFromCheckout(orderDto);

      // Clear cart after successful order
      dispatch(removeAllItemsFromCart());

      toast.success("Order placed successfully!");

      // Redirect to order success page
      setTimeout(() => {
        router.push('/order-success');
      }, 1500);
    } catch (error: any) {
      console.error("Order creation failed:", error);
      toast.error(error?.response?.data?.message || "Failed to place order. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading or redirect if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Authentication Required</h2>
          <p>Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Breadcrumb title={"Checkout"} pages={["checkout"]} />
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col lg:flex-row gap-7.5 xl:gap-11">
              {/* Checkout left */}
              <div className="lg:max-w-[670px] w-full">
                {/* Billing details */}
                <Billing
                  billingDetails={billingDetails}
                  onChange={setBillingDetails}
                />

                {/* Shipping address */}
                <Shipping
                  shippingDetails={shippingDetails}
                  onChange={setShippingDetails}
                  useDifferentAddress={useDifferentAddress}
                  onToggle={setUseDifferentAddress}
                />

                {/* Notes */}
                <div className="bg-white shadow-1 rounded-[10px] p-4 sm:p-8.5 mt-7.5">
                  <div>
                    <label htmlFor="notes" className="block mb-2.5">
                      Other Notes (optional)
                    </label>

                    <textarea
                      name="notes"
                      id="notes"
                      rows={5}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Notes about your order, e.g. special notes for delivery."
                      className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full p-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Checkout right */}
              <div className="max-w-[455px] w-full">
                {/* Order list box */}
                <div className="bg-white shadow-1 rounded-[10px]">
                  <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
                    <h3 className="font-medium text-xl text-dark">
                      Your Order
                    </h3>
                  </div>

                  <div className="pt-2.5 pb-8.5 px-4 sm:px-8.5">
                    {/* Title */}
                    <div className="flex items-center justify-between py-5 border-b border-gray-3">
                      <div>
                        <h4 className="font-medium text-dark">Product</h4>
                      </div>
                      <div>
                        <h4 className="font-medium text-dark text-right">
                          Subtotal
                        </h4>
                      </div>
                    </div>

                    {/* Product items */}
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between py-5 border-b border-gray-3"
                      >
                        <div>
                          <p className="text-dark">
                            {item.title} x {item.quantity}
                          </p>
                        </div>
                        <div>
                          <p className="text-dark text-right">
                            ${formatPrice(item.discountedPrice * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}

                    {/* Total */}
                    <div className="flex items-center justify-between pt-5">
                      <div>
                        <p className="font-medium text-lg text-dark">Total</p>
                      </div>
                      <div>
                        <p className="font-medium text-lg text-dark text-right">
                          ${formatPrice(totalPrice)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment box */}
                <PaymentMethod
                  paymentType={paymentType}
                  onChange={setPaymentType}
                  onStripeReady={(cardElement, stripe) => {
                    setStripeCardElement(cardElement);
                    setStripeInstance(stripe);
                  }}
                />

                {/* Checkout button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex justify-center font-medium text-white bg-blue py-3 px-6 rounded-md ease-out duration-200 hover:bg-blue-dark mt-7.5 ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isLoading ? "Processing..." : "Place Order"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default Checkout;
