import React, { useState } from 'react';
import TopBar from '../components/TopBar';
import StoryboardTable from '../components/StoryboardTable';
import EditorSidebar from '../components/EditorSidebar';
import NewProjectForm from '../components/NewProjectForm';
import FooterStats from '../components/FooterStats';
import { useStore } from '../state/useStore';
import { exportPdf } from '../lib/pdf';

export default function Home() {
  const [apiKey, setApiKey] = useState('');
  const [selectedId, setSelectedId] = useState<string>();
  const [showNew, setShowNew] = useState(false);
  const project = useStore((s) => s.project);
  const setProject = useStore((s) => s.setProject);
  const updatePanel = useStore((s) => s.updatePanel);

  const selectedPanel = project?.panels.find((p) => p.id === selectedId);

  return (
    <div className="app">
      <TopBar
        apiKey={apiKey}
        setApiKey={setApiKey}
        onNew={() => setShowNew(true)}
        onSave={() => project && console.log('save', project)}
        onLoad={() => console.log('load')}
        onExportPdf={() => {
          const element = document.querySelector('table');
          if (element) exportPdf(element as HTMLElement);
        }}
      />
      {showNew && (
        <NewProjectForm
          onCreate={(p) => {
            setProject(p);
            setShowNew(false);
          }}
        />
      )}
      {project && (
        <>
          <StoryboardTable
            panels={project.panels}
            onSelect={(p) => setSelectedId(p.id)}
            selectedId={selectedId}
          />
          <FooterStats panels={project.panels} />
          {selectedPanel && (
            <EditorSidebar
              panel={selectedPanel}
              onChange={(p) => updatePanel(p)}
            />
          )}
        </>
      )}
    </div>
  );
}
