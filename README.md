# StoryboardSmith Static

Experimental static SPA for generating and editing storyboard panels. Runs entirely client side and uses the user's OpenAI API key.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Usage

1. Enter your OpenAI API key in the top bar.
2. Click **New** to create a project. Provide a title, short description, and number of panels.
3. The app asks OpenAI to draft panel text and displays the result in the table.
4. When satisfied, press **Generate Images** in the top bar to create thumbnail sketches for each panel.
