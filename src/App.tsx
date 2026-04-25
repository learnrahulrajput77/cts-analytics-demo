import { useState } from 'react';
import { CUSTOMERS } from '@/data/customers';
import { Sidebar, type TabId } from '@/components/layout/Sidebar';
import { Layout } from '@/components/layout/Layout';
import { OverviewPage } from '@/pages/OverviewPage';
import { SegmentationPage } from '@/pages/SegmentationPage';
import { SimulatorPage } from '@/pages/SimulatorPage';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  return (
    <>
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <Layout>
        {activeTab === 'overview'     && <OverviewPage     customers={CUSTOMERS} />}
        {activeTab === 'segmentation' && <SegmentationPage customers={CUSTOMERS} />}
        {activeTab === 'simulator'    && <SimulatorPage    customers={CUSTOMERS} />}
      </Layout>
    </>
  );
}
