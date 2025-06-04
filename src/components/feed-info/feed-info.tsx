import { FC } from 'react';

import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';
import { useSelector } from '../../services/store';
import { RootState } from 'src/services/store';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  const dataFeeds = useSelector((state: RootState) => state.feedsReducer);

  // Если данные ещё не загружены
  if (!dataFeeds.data || !dataFeeds.data.orders) {
    return null; // или <p>Загрузка...</p>
  }

  const orders: TOrder[] = dataFeeds.data.orders;

  const feed = {
    total: Number(dataFeeds.data.total) || 0,
    totalToday: Number(dataFeeds.data.totalToday) || 0
  };

  const readyOrders = getOrders(orders, 'done');
  const pendingOrders = getOrders(orders, 'pending');

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed}
    />
  );
};
