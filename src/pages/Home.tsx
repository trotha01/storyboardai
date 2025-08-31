import React, { useState } from 'react';
import TopBar from '../components/TopBar';
import StoryboardRow from '../components/StoryboardRow';
import EditorSidebar from '../components/EditorSidebar';
import NewProjectForm from '../components/NewProjectForm';
import FooterStats from '../components/FooterStats';
import { useStore } from '../state/useStore';
import { exportPdf } from '../lib/pdf';
import { postProcessImage } from '../lib/imagePost';
import type { Panel } from '../models/schema';
import { generatePanelImage } from '../lib/panels';

export default function Home() {
  const [apiKey, setApiKey] = useState('');
  const [selectedId, setSelectedId] = useState();
  const [showNew, setShowNew] = useState(false);
  const project = useStore((s: any) => s.project);
  const setProject = useStore((s: any) => s.setProject);
  const updatePanel = useStore((s: any) => s.updatePanel);
  const useTurnaroundsBase = useStore((s: any) => s.useTurnaroundsBase);
  const setUseTurnaroundsBase = useStore((s: any) => s.setUseTurnaroundsBase);

  const selectedPanel = project?.panels.find((p) => p.id === selectedId);

  const generateImages = async () => {
    if (!project) return;
    for (let i = 0; i < project.panels.length; i++) {
      await generateImage(project.panels[i], project.panels[i - 1]);
    }
  };
  const generateImage = async (panel: Panel, prev?: Panel) => {
    if (!project) return;
    try {
      const res = await generatePanelImage(
        project,
        apiKey,
        panel,
        prev,
        useTurnaroundsBase
      );
      const processed = await postProcessImage(res.dataUrl);
      updatePanel({ ...panel, imageDataUrl: processed });
    } catch (e) {
      console.error(e);
    }
  };

  // keyboard shortcuts
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        generateImages();
      } else if (e.key.toLowerCase() === 'g') {
        e.preventDefault();
        const p = selectedPanel;
        if (p) {
          const idx = project?.panels.findIndex((x: Panel) => x.id === p.id) || 0;
          generateImage(p, project?.panels[idx - 1]);
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (!project) return;
        const currentIdx = project.panels.findIndex((p) => p.id === selectedId);
        const next = project.panels[currentIdx + 1];
        if (next) setSelectedId(next.id);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (!project) return;
        const currentIdx = project.panels.findIndex((p) => p.id === selectedId);
        const prev = project.panels[currentIdx - 1];
        if (prev) setSelectedId(prev.id);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [generateImages, generateImage, selectedId, selectedPanel, project]);

  return (
    <div className="app">
      <TopBar
        apiKey={apiKey}
        setApiKey={setApiKey}
        onNew={() => setShowNew(true)}
        onSave={() => project && console.log('save', project)}
        onLoad={() => console.log('load')}
        onExportPdf={() => {
          const element = document.querySelector('section');
          if (element)
            exportPdf(
              element as HTMLElement,
              project?.projectTitle,
              project?.styleBible.world
            );
        }}
        onGenerateImages={generateImages}
        hasProject={!!project}
        useTurnaroundsBase={useTurnaroundsBase}
        setUseTurnaroundsBase={setUseTurnaroundsBase}
      />
      {showNew && (
        <NewProjectForm
          apiKey={apiKey}
          onCreate={(p) => {
            setProject(p);
            setShowNew(false);
          }}
        />
      )}
      {project && (
        <>
          <section className="mx-auto max-w-6xl px-4 py-6 space-y-4">
            {project.panels.map((row) => (
              <StoryboardRow
                key={row.id}
                row={row}
                onGenerate={(p) => {
                  const idx = project.panels.findIndex((x) => x.id === p.id);
                  return generateImage(p, project.panels[idx - 1]);
                }}
                onChange={(p) => updatePanel(p)}
                onSelect={() => setSelectedId(row.id)}
              />
            ))}
          </section>
          <FooterStats panels={project.panels} />
          {selectedPanel && (
            <EditorSidebar
              panel={selectedPanel}
              onChange={(p) => updatePanel(p)}
              onGenerate={(p) => {
                const idx = project.panels.findIndex((x) => x.id === p.id);
                generateImage(p, project.panels[idx - 1]);
              }}
            />
          )}
        </>
      )}
    </div>
  );
}
