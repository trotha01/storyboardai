declare module 'react' {
  export function useState<T = any>(initial?: T): [T, (v: T) => void];
  export const useEffect: any;
  export const useRef: any;
  export const createElement: any;
  export const Fragment: any;
  export default any;
}
declare module 'react/jsx-runtime' {
  export const jsx: any;
  export const jsxs: any;
  export const Fragment: any;
}
declare module 'react-dom';
declare module 'react-dom/client';
declare module 'zustand';
declare module 'zustand/middleware';
declare module 'localforage';
declare module 'jszip';
declare module 'jspdf';
declare module 'html2canvas';
declare module 'vite/client';
declare module 'zod' {
  export const z: any;
  namespace z {
    export type infer<T> = any;
  }
}

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}
