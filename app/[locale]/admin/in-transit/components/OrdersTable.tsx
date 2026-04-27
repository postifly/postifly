'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import EditOrderModal from './EditOrderModal';
import DeleteOrderModal from './DeleteOrderModal';
import { useLocale } from 'next-intl';

type Order = {
  id: string;
  type: string;
  status: string;
  totalAmount: number;
  currency: string; 
  weight: string;
  smsSent: boolean;
  notes: string | null;
  createdAt: string;
  userId?: string;
  user: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
  };
};

type OrdersTableProps = {
  orders: Order[];
  onOrderRemoved?: (orderId: string) => void;
  onOrderUpdated?: (order: Order) => void;
};

export default function OrdersTable({ orders: initialOrders, onOrderRemoved, onOrderUpdated }: OrdersTableProps) {
  const locale = useLocale();
  const isEn = locale === 'en';
  const isRu = locale === 'ru';
  const t = {
    inTransit: isRu ? 'В пути' : isEn ? 'In transit' : 'გზაში',
    warehouse: isRu ? 'Прибыла' : isEn ? 'Arrived' : 'ჩამოსული',
    stopped: isRu ? 'Остановлена' : isEn ? 'Stopped' : 'გაჩერებული',
    delivered: isRu ? 'Выдана' : isEn ? 'Delivered' : 'გაცემული',
    pending: isRu ? 'Склад' : isEn ? 'Warehouse' : 'საწყობი',
    cancelled: isRu ? 'Отменена' : isEn ? 'Cancelled' : 'გაუქმებული',
    statusUpdateError: isRu ? 'Ошибка при обновлении статуса' : isEn ? 'Failed to update status' : 'სტატუსის განახლებისას მოხდა შეცდომა',
    genericError: isRu ? 'Произошла ошибка. Пожалуйста, попробуйте снова.' : isEn ? 'An error occurred. Please try again.' : 'დაფიქსირდა შეცდომა. გთხოვთ სცადოთ თავიდან.',
    user: isRu ? 'Пользователь' : isEn ? 'User' : 'მომხმარებელი',
    type: isRu ? 'Тип' : isEn ? 'Type' : 'ტიპი',
    weight: isRu ? 'Вес' : isEn ? 'Weight' : 'წონა',
    status: isRu ? 'Статус' : isEn ? 'Status' : 'სტატუსი',
    amount: isRu ? 'Сумма' : isEn ? 'Amount' : 'თანხა',
    date: isRu ? 'Дата' : isEn ? 'Date' : 'თარიღი',
    actions: isRu ? 'Действия' : isEn ? 'Actions' : 'მოქმედებები',
    noOrders: isRu ? 'Заказов пока нет.' : isEn ? 'No orders yet.' : 'ჯერ არცერთი Order არ არის.',
    edit: isRu ? 'Изменить' : isEn ? 'Edit' : 'ცვლილება',
    delete: isRu ? 'Удалить' : isEn ? 'Delete' : 'წაშლა',
  } as const;
  const statusOptions = [
    { value: 'in_transit', label: t.inTransit },
    { value: 'warehouse', label: t.warehouse },
    { value: 'stopped', label: t.stopped },
    { value: 'delivered', label: t.delivered },
    { value: 'pending', label: t.pending },
    { value: 'cancelled', label: t.cancelled },
  ];

  const router = useRouter();
  // Use prop directly - OrdersManager handles all state management
  const orders = initialOrders;
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [deletingOrder, setDeletingOrder] = useState<Order | null>(null);

  // Log when component renders with new orders
  useEffect(() => {
    console.log('[OrdersTable] Component rendered with orders:', orders.length, 'Order IDs:', orders.map(o => o.id));
  }, [orders]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    setError('');

    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || t.statusUpdateError);
        return;
      }

      // Refresh server components to get latest data
      router.refresh();

      // Notify parent component - OrdersManager will handle state updates
      if (newStatus !== 'in_transit') {
        if (onOrderRemoved) {
          onOrderRemoved(orderId);
        }
      } else {
        // Update order in parent component
        const updatedOrder = orders.find(o => o.id === orderId);
        if (updatedOrder && onOrderUpdated) {
          onOrderUpdated({ ...updatedOrder, status: newStatus });
        }
      }
    } catch {
      setError(t.genericError);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleOrderUpdated = (updatedOrder: Order) => {
    // Refresh server components to get latest data
    router.refresh();
    
    // Notify parent component - OrdersManager will handle state updates
    if (updatedOrder.status !== 'in_transit') {
      if (onOrderRemoved) {
        onOrderRemoved(updatedOrder.id);
      }
    } else {
      if (onOrderUpdated) {
        onOrderUpdated(updatedOrder);
      }
    }
  };

  const handleOrderDeleted = (orderId: string) => {
    // Refresh server components to get latest data
    router.refresh();
    
    // Notify parent component - OrdersManager will handle state updates
    if (onOrderRemoved) {
      onOrderRemoved(orderId);
    }
  };

  return (
    <>
      {error ? (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3">
          <p className="text-[16px] text-red-800">{error}</p>
        </div>
      ) : null}
      <div className="overflow-x-auto rounded-2xl border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-[16px] md:text-[18px] font-semibold text-black">{t.user}</th>
              <th className="px-4 py-2 text-left text-[16px] md:text-[18px] font-semibold text-black">{t.type}</th>
              <th className="px-4 py-2 text-left text-[16px] md:text-[18px] font-semibold text-black">{t.weight}</th>
              <th className="px-4 py-2 text-left text-[16px] md:text-[18px] font-semibold text-black">{t.status}</th>
              <th className="px-4 py-2 text-left text-[16px] md:text-[18px] font-semibold text-black">{t.amount}</th>
              <th className="px-4 py-2 text-left text-[16px] md:text-[18px] font-semibold text-black">{t.date}</th>
              <th className="px-4 py-2 text-left text-[16px] md:text-[18px] font-semibold text-black">{t.actions}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-[16px] text-gray-600">
                  {t.noOrders}
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-[16px] text-black">
                    {order.user.email}
                    {(order.user.firstName || order.user.lastName) && (
                      <span className="block text-sm text-black">
                        {order.user.firstName} {order.user.lastName}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-[16px] text-black">{order.type}</td>
                  <td className="px-4 py-2 text-[16px] text-black">{order.weight || '—'}</td>
                  <td className="px-4 py-2 text-[16px]">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      disabled={updatingId === order.id}
                      className="rounded-md border border-gray-300 bg-white px-2 py-1 text-[16px] text-black focus:outline-none focus:ring-2 focus:ring-black disabled:opacity-50"
                    >
                      {statusOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-2 text-[16px] text-black">
                    {order.totalAmount.toFixed(2)} {order.currency || 'GEL'}
                  </td>
                  <td className="px-4 py-2 text-[16px] text-black">{order.createdAt}</td>
                  <td className="px-4 py-2 text-[16px]">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingOrder({ ...order, userId: order.userId || order.user.id })}
                        className="rounded-md bg-blue-600 px-3 py-1 text-[14px] font-medium text-white hover:bg-blue-700"
                      >
                        {t.edit}
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingOrder(order)}
                        className="rounded-md bg-red-600 px-3 py-1 text-[14px] font-medium text-white hover:bg-red-700"
                      >
                        {t.delete}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <EditOrderModal
        isOpen={!!editingOrder}
        onClose={() => setEditingOrder(null)}
        order={editingOrder}
        onOrderUpdated={handleOrderUpdated}
      />

      <DeleteOrderModal
        isOpen={!!deletingOrder}
        onClose={() => setDeletingOrder(null)}
        order={deletingOrder}
        onOrderDeleted={handleOrderDeleted}
      />
    </>
  );
}
