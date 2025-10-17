import React, { useState } from "react";
import OrderActions from "./OrderActions";
import OrderModal from "./OrderModal";
import { Order } from "@/lib/api/services/order.service";

interface SingleOrderProps {
  orderItem: Order;
  smallView: boolean;
}

const SingleOrder = ({ orderItem, smallView }: SingleOrderProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  const toggleEdit = () => {
    setShowEdit(!showEdit);
  };

  const toggleModal = (status: boolean) => {
    setShowDetails(status);
    setShowEdit(status);
  };

  // Format order number
  const orderNumber = orderItem.code || `#${orderItem.id}`;

  // Format date
  const orderDate = orderItem.createdDate
    ? new Date(orderItem.createdDate).toLocaleDateString('tr-TR')
    : '-';

  // Get order status display
  const getStatusDisplay = (status: number) => {
    switch (status) {
      case 0:
        return 'Pending';
      case 1:
        return 'Processing';
      case 2:
        return 'Delivered';
      case 3:
        return 'On-Hold';
      default:
        return 'Unknown';
    }
  };

  const statusDisplay = getStatusDisplay(orderItem.orderStatus);

  // Get status color classes
  const getStatusClass = (status: number) => {
    switch (status) {
      case 2:
        return 'text-green bg-green-light-6';
      case 3:
        return 'text-red bg-red-light-6';
      case 1:
        return 'text-yellow bg-yellow-light-4';
      default:
        return 'text-gray-5 bg-gray-2';
    }
  };

  // Get payment status display
  const getPaymentStatusDisplay = (paymentStatus: string | null) => {
    if (!paymentStatus) return 'Unpaid';
    return paymentStatus === 'Paid' ? 'Paid' : 'Unpaid';
  };

  // Get payment status color classes
  const getPaymentStatusClass = (paymentStatus: string | null) => {
    if (paymentStatus === 'Paid') {
      return 'text-green bg-green-light-6';
    }
    return 'text-orange bg-orange-light';
  };

  const paymentStatusDisplay = getPaymentStatusDisplay(orderItem.paymentStatus);

  // Item count
  const itemCount = orderItem.orderItemCount || orderItem.orderItems?.length || 0;

  // Format total with currency symbol
  const formattedTotal = orderItem.totalAmount
    ? `$${orderItem.totalAmount.toFixed(2)}`
    : '$0.00';

  return (
    <>
      {!smallView && (
        <div className="items-center justify-between border-t border-gray-3 py-5 px-7.5 hidden md:flex">
          <div className="min-w-[111px]">
            <p className="text-custom-sm text-red">
              {orderNumber}
            </p>
          </div>
          <div className="min-w-[175px]">
            <p className="text-custom-sm text-dark">{orderDate}</p>
          </div>

          <div className="min-w-[128px]">
            <p
              className={`inline-block text-custom-sm py-0.5 px-2.5 rounded-[30px] ${getStatusClass(orderItem.orderStatus)}`}
            >
              {statusDisplay}
            </p>
          </div>

          <div className="min-w-[128px]">
            <p
              className={`inline-block text-custom-sm py-0.5 px-2.5 rounded-[30px] ${getPaymentStatusClass(orderItem.paymentStatus)}`}
            >
              {paymentStatusDisplay}
            </p>
          </div>

          <div className="min-w-[100px]">
            <p className="text-custom-sm text-dark">{itemCount} items</p>
          </div>

          <div className="min-w-[113px]">
            <p className="text-custom-sm text-dark font-medium">{formattedTotal}</p>
          </div>

          <div className="flex gap-5 items-center">
            <OrderActions
              toggleDetails={toggleDetails}
              toggleEdit={toggleEdit}
            />
          </div>
        </div>
      )}

      {smallView && (
        <div className="block md:hidden">
          <div className="py-4.5 px-7.5 border-b border-gray-3">
            <div className="mb-2">
              <p className="text-custom-sm text-dark">
                <span className="font-bold pr-2">Order:</span> {orderNumber}
              </p>
            </div>
            <div className="mb-2">
              <p className="text-custom-sm text-dark">
                <span className="font-bold pr-2">Date:</span> {orderDate}
              </p>
            </div>

            <div className="mb-2">
              <p className="text-custom-sm text-dark">
                <span className="font-bold pr-2">Status:</span>{" "}
                <span
                  className={`inline-block text-custom-sm py-0.5 px-2.5 rounded-[30px] ${getStatusClass(orderItem.orderStatus)}`}
                >
                  {statusDisplay}
                </span>
              </p>
            </div>

            <div className="mb-2">
              <p className="text-custom-sm text-dark">
                <span className="font-bold pr-2">Payment:</span>{" "}
                <span
                  className={`inline-block text-custom-sm py-0.5 px-2.5 rounded-[30px] ${getPaymentStatusClass(orderItem.paymentStatus)}`}
                >
                  {paymentStatusDisplay}
                </span>
              </p>
            </div>

            <div className="mb-2">
              <p className="text-custom-sm text-dark">
                <span className="font-bold pr-2">Items:</span> {itemCount} items
              </p>
            </div>

            <div className="mb-2">
              <p className="text-custom-sm text-dark">
                <span className="font-bold pr-2">Total:</span> <span className="font-medium">{formattedTotal}</span>
              </p>
            </div>

            <div className="">
              <p className="text-custom-sm text-dark flex items-center">
                <span className="font-bold pr-2">Actions:</span>{" "}
                <OrderActions
                  toggleDetails={toggleDetails}
                  toggleEdit={toggleEdit}
                />
              </p>
            </div>
          </div>
        </div>
      )}

      <OrderModal
        showDetails={showDetails}
        showEdit={showEdit}
        toggleModal={toggleModal}
        order={orderItem}
      />
    </>
  );
};

export default SingleOrder;
