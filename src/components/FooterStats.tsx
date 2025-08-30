import React from 'react';
import { Panel } from '../models/schema';

export default function FooterStats({ panels }: { panels: Panel[] }) {
  const total = panels.reduce((sum, p) => sum + p.timeSeconds, 0);
  return <div className="footer-stats">Total seconds: {total.toFixed(1)}</div>;
}
