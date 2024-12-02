// app/(docs)/architecture/page.tsx


export default function ArchitecturePage() {
  return (
    <div className="prose max-w-none">
      <h1>Application Architecture</h1>

      <section>
        <h2>Tech Stack</h2>
        <ul data-ai="tech-stack">
          <li data-name="next">
            Next.js App Router Architecture
            <ul>
              <li>Server-first approach with React Server Components</li>
              <li>Route groups for feature isolation</li>
              <li>Streaming and Suspense for performance</li>
            </ul>
          </li>
          <li data-name="ui">
            UI Framework
            <ul>
              <li>Tailwind CSS for styling</li>
              <li>shadcn/ui component library</li>
              <li>Responsive design patterns</li>
            </ul>
          </li>
        </ul>
      </section>

      <section>
        <h2>Route Groups</h2>
        <div data-ai="route-groups">
          <div className="group" data-name="(auth)">
            <h3 className="purpose">Authentication Routes</h3>
            <ul className="rules">
              <li>Implement OAuth providers</li>
              <li>Handle session management</li>
              <li>Protect sensitive routes</li>
            </ul>
          </div>
          {/* More route groups */}
        </div>
      </section>

      <section>
        <h2>Component Patterns</h2>
        <div data-ai="component-patterns">
          <div className="pattern" data-name="Page Components">
            <ul className="rules">
              <li>Use server components as default</li>
              <li>Implement proper suspense boundaries</li>
              <li>Handle loading and error states</li>
            </ul>
          </div>
          {/* More patterns */}
        </div>
      </section>

      {/* More sections */}
    </div>
  );
}