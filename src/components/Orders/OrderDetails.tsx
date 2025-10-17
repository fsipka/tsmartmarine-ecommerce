import React from "react";
import { Order } from "@/lib/api/services/order.service";

interface OrderDetailsProps {
  order: Order;
}

const OrderDetails = ({ order }: OrderDetailsProps) => {
  // Format date
  const orderDate = order.createdDate
    ? new Date(order.createdDate).toLocaleDateString('tr-TR')
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

  // Format total
  const formattedTotal = order.totalAmount
    ? `$${order.totalAmount.toFixed(2)}`
    : '$0.00';

  return (
    <>
      <div className="items-center justify-between py-4.5 px-7.5 hidden md:flex ">
        <div className="min-w-[113px]">
          <p className="text-custom-sm text-dark">Order</p>
        </div>
        <div className="min-w-[113px]">
          <p className="text-custom-sm text-dark">Date</p>
        </div>

        <div className="min-w-[113px]">
          <p className="text-custom-sm text-dark">Status</p>
        </div>

        <div className="min-w-[113px]">
          <p className="text-custom-sm text-dark">Items</p>
        </div>

        <div className="min-w-[113px]">
          <p className="text-custom-sm text-dark">Total</p>
        </div>
      </div>

      <div className="items-center justify-between border-t border-gray-3 py-5 px-7.5 hidden md:flex">
        <div className="min-w-[111px]">
          <p className="text-custom-sm text-red">
            {order.code}
          </p>
        </div>
        <div className="min-w-[175px]">
          <p className="text-custom-sm text-dark">
            {orderDate}
          </p>
        </div>

        <div className="min-w-[128px]">
          <p
            className={`inline-block text-custom-sm py-0.5 px-2.5 rounded-[30px] ${getStatusClass(order.orderStatus)}`}
          >
            {getStatusDisplay(order.orderStatus)}
          </p>
        </div>

        <div className="min-w-[113px]">
          <p className="text-custom-sm text-dark">
            {order.orderItemCount} items
          </p>
        </div>

        <div className="min-w-[113px]">
          <p className="text-custom-sm text-dark font-medium">
            {formattedTotal}
          </p>
        </div>
      </div>

      <div className="px-7.5 py-4 w-full border-t border-gray-3">
        <div className="mb-4">
          <p className="font-bold text-dark mb-1">Description:</p>
          <p className="text-custom-sm text-dark">{order.description || 'No description'}</p>
        </div>

        {order.shippingAddress && (
          <div className="mb-4">
            <p className="font-bold text-dark mb-1">Shipping Address:</p>
            <p className="text-custom-sm text-dark">{order.shippingAddress}</p>
          </div>
        )}

        {order.billingAddress && (
          <div className="mb-4">
            <p className="font-bold text-dark mb-1">Billing Address:</p>
            <p className="text-custom-sm text-dark">{order.billingAddress}</p>
          </div>
        )}

        <div className="mb-4">
          <p className="font-bold text-dark mb-2">Order Items:</p>
          <div className="space-y-2">
            {order.orderItems && order.orderItems.length > 0 ? (
              order.orderItems.map((item) => {
                const itemName = item.accessory?.name || item.sparePart?.name || item.service?.name || 'Unknown Item';
                const itemCode = item.accessory?.code || item.sparePart?.code || '-';
                const price = item.unitPrice || item.accessory?.salePrice || item.sparePart?.salePrice || 0;
                const quantity = item.quantity || 1;
                const lineTotal = item.lineTotal || (price * quantity);

                return (
                  <div key={item.id} className="flex justify-between items-center border-b border-gray-2 pb-2">
                    <div className="flex-1">
                      <p className="text-custom-sm text-dark font-medium">{itemName}</p>
                      <p className="text-xs text-gray-5">Code: {itemCode}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-custom-sm text-dark">Qty: {quantity}</p>
                      <p className="text-custom-sm text-dark font-medium">${lineTotal.toFixed(2)}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-custom-sm text-gray-5">No items</p>
            )}
          </div>
        </div>

        {order.discountAmount > 0 && (
          <div className="flex justify-between py-2 border-t border-gray-3">
            <p className="text-custom-sm text-dark font-medium">Discount:</p>
            <p className="text-custom-sm text-red">-${order.discountAmount.toFixed(2)}</p>
          </div>
        )}

        <div className="flex justify-between py-2 border-t border-gray-3">
          <p className="text-sm text-dark font-bold">Total Amount:</p>
          <p className="text-sm text-dark font-bold">{formattedTotal}</p>
        </div>
      </div>
    </>
  );
};

export default OrderDetails;
