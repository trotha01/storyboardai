export async function openaiChat(apiKey: string, payload: any) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error('OpenAI chat error');
  }
  return res.json();
}

function dataUrlToBlob(dataUrl: string) {
  const [meta, b64] = dataUrl.split(',');
  const match = meta.match(/data:(.*);base64/);
  const mime = match ? match[1] : 'image/png';
  const bin = atob(b64);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return new Blob([arr], { type: mime });
}

export async function generateImage(opts: {
  apiKey: string;
  model: string;
  prompt: string;
  size?: string;
  mode?: 'txt2img' | 'img2img' | 'edit';
  initImageDataUrl?: string;
  maskDataUrl?: string;
  seed?: number;
}) {
  const {
    apiKey,
    model,
    prompt,
    size = '1536x1024',
    mode = 'txt2img',
    initImageDataUrl,
    maskDataUrl,
    seed, // accepted but ignored; OpenAI image endpoints don't support seeds
  } = opts;

  if (mode === 'txt2img') {
    const res = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ model, prompt, size }),
    });
    if (!res.ok) throw new Error('OpenAI image error');
    const json = await res.json();
    const b64 = json.data[0].b64_json;
    return { dataUrl: `data:image/png;base64,${b64}` };
  }

  // img2img or edit
  const form = new FormData();
  form.append('model', model);
  form.append('prompt', prompt);
  form.append('size', size);
  if (initImageDataUrl) form.append('image', dataUrlToBlob(initImageDataUrl));
  if (maskDataUrl) form.append('mask', dataUrlToBlob(maskDataUrl));

  const res = await fetch('https://api.openai.com/v1/images/edits', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}` },
    body: form,
  });
  if (!res.ok) throw new Error('OpenAI image edit error');
  const json = await res.json();
  const b64 = json.data[0].b64_json;
  return { dataUrl: `data:image/png;base64,${b64}` };
}
