import React, { useState } from 'react';
import TopBar from '../components/TopBar';
import StoryboardTable from '../components/StoryboardTable';
import EditorSidebar from '../components/EditorSidebar';
import NewProjectForm from '../components/NewProjectForm';
import FooterStats from '../components/FooterStats';
import { useStore } from '../state/useStore';
import { exportPdf } from '../lib/pdf';
import { openaiImage } from '../lib/openai';
import { postProcessImage } from '../lib/imagePost';

export default function Home() {
  const [apiKey, setApiKey] = useState('');
  const [selectedId, setSelectedId] = useState<string>();
  const [showNew, setShowNew] = useState(false);
  const project = useStore((s) => s.project);
  const setProject = useStore((s) => s.setProject);
  const updatePanel = useStore((s) => s.updatePanel);

  const selectedPanel = project?.panels.find((p) => p.id === selectedId);

  const buildImagePrompt = (panel: typeof project.panels[number]) =>
    `${panel.imagePrompt}\nAction/Dialogue: ${panel.actionDialogue}\nNotes: ${panel.notes}`;

  const generateImages = async () => {
    if (!project) return;
    for (const panel of project.panels) {
      await generateImage(panel);
    }
  };

  const generateImage = async (panel: typeof project.panels[number]) => {
    if (!project) return;
    try {
      const res = await openaiImage(apiKey, {
        model: project.imageModel,
        prompt: buildImagePrompt(panel),
        size: '1536x1024',
      });
      const b64 = res.data[0].b64_json;
      const dataUrl = `data:image/png;base64,${b64}`;
      const processed = await postProcessImage(dataUrl);
      updatePanel({ ...panel, imageDataUrl: processed });
    } catch (e) {
      console.error(e);
    }
  };

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
        onGenerateImages={generateImages}
        hasProject={!!project}
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
          <StoryboardTable
            panels={project.panels}
            onSelect={(p) => setSelectedId(p.id)}
            selectedId={selectedId}
            onGenerateImage={generateImage}
          />
          <FooterStats panels={project.panels} />
          {selectedPanel && (
            <EditorSidebar
              panel={selectedPanel}
              onChange={(p) => updatePanel(p)}
              onGenerate={generateImage}
            />
          )}
        </>
      )}
    </div>
  );
}
