// app/(docs)/content/clusters/page.tsx
import { Suspense } from 'react';


import { ClusterView } from './_components/ClusterView';
import { ClusterSkeleton } from './_components/ClusterSkeleton';

import { makeExtensionRequest } from '@/lib/api';
import { getProjectConfig } from '@/.ai/config';
import { checkContentPrerequisites } from '@/lib/content';
import { PageHeader } from '../../brand/_components/PageHeader';
import { Cluster } from './types';

export interface ClusterWithCounts extends Omit<Cluster, 'keywords' | 'briefs'> {
    _count: {
        keywords: number;
        briefs: number;
    }
}
async function getClusters(projectId: string) {
  const res = await makeExtensionRequest(
    `/api/extension/ai-projects/${projectId}/content/clusters`,
    { method: 'GET' }
  );
  return res.json();
}

export default async function ClustersPage() {
  const config = getProjectConfig();
  if (!config) return null;

  const prerequisites = await checkContentPrerequisites(config.projectId);
  const clusters = await getClusters(config.projectId);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <PageHeader
        heading="Content Clusters"
        description="Generate and manage your content topic clusters"
      />


    </div>
  );
}