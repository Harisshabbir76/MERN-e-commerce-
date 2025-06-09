import { useEffect } from 'react';
import { trackEvent } from '../utils/tracking';

export default function useTracking(eventName, dependencies = [], metadata) {
  useEffect(() => {
    trackEvent(eventName, metadata);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
}