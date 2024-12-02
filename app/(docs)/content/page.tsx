// app/(docs)/content/page.tsx
import { Suspense } from 'react';
import { getProjectConfig } from '../../../.ai/config';

import { ContentView } from './_components/ContentView';
import { ContentSkeleton } from './_components/ContentSkeleton';

import { makeExtensionRequest } from '@/lib/api';
import { PageHeader } from '../brand/_components/PageHeader';
import { checkContentPrerequisites } from '@/lib/content';

async function getContentStrategy(projectId: string) {
  const res = await makeExtensionRequest(
    `/api/extension/ai-projects/${projectId}/content/strategy`,
    {
      method: 'GET',
    }
  );

  return res.json();
}

async function getClusters(projectId: string) {
  const res = await makeExtensionRequest(
    `/api/extension/ai-projects/${projectId}/content/clusters`,
    {
      method: 'GET',
    }
  );

  return res.json();
}

export default async function ContentPage() {
  const config = getProjectConfig();
  if (!config) return null;

  const prerequisites = await checkContentPrerequisites(config.projectId);
  const [strategy, clusters] = await Promise.all([
    getContentStrategy(config.projectId),
    getClusters(config.projectId)
  ]);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <PageHeader
        heading="Content Strategy"
        description="Plan and create your content strategy"
      />

      <Suspense fallback={<ContentSkeleton />}>
        <ContentView
          strategy={strategy}
          clusters={clusters || []}
          projectId={config.projectId}
          prerequisites={prerequisites}
        />
      </Suspense>
    </div>
  );
}