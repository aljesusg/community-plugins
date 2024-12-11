import { TimeRange } from '@backstage-community/plugin-kiali-common';
import { HistoryManager } from '../../app/History';

export const retrieveTimeRange = (): TimeRange => {
  const urlBounds = HistoryManager.getTimeBounds();
  const urlRangeDuration = HistoryManager.getRangeDuration();

  return {
    from: urlBounds?.from,
    to: urlBounds?.to,
    rangeDuration: urlRangeDuration
  };
};
