import React, { useState, useEffect } from 'react';
import {
  GridModel,
  WorkedExample,
  NumberLine,
  BarModel,
  PlaceValueChart,
  ColumnMethod,
  AngleDiagram,
  BusStopDiagram,
  RectangleDiagram,
  CuboidDiagram,
  LShapeDiagram,
  SentenceDisplay,
  LetterTiles,
  AlphabetLine,
  CodeTable,
  SequenceChain,
  AnalogyDisplay,
  WordChipsDisplay,
  SDTTriangle,
  AngleDisplay,
  QuadShape,
  ParallelLines,
  ExteriorAngle,
  RegularPolygon,
  FunctionMachine,
  LineGraph,
  TriangleAreaDiagram,
  ParallelogramDiagram,
  CoordinateGrid,
  VennDiagram
} from './microLessons/visuals';

// Registry of all available visual components
const COMPONENTS = {
  GridModel,
  WorkedExample,
  NumberLine,
  BarModel,
  PlaceValueChart,
  ColumnMethod,
  AngleDiagram,
  BusStopDiagram,
  RectangleDiagram,
  CuboidDiagram,
  LShapeDiagram,
  SentenceDisplay,
  LetterTiles,
  AlphabetLine,
  CodeTable,
  SequenceChain,
  AnalogyDisplay,
  WordChipsDisplay,
  SDTTriangle,
  AngleDisplay,
  QuadShape,
  ParallelLines,
  ExteriorAngle,
  RegularPolygon,
  FunctionMachine,
  LineGraph,
  TriangleAreaDiagram,
  ParallelogramDiagram,
  CoordinateGrid,
  VennDiagram
};

// URL format:
//   ?diagram-viewer=true&component=AngleDisplay&props=BASE64_JSON
//
// props is a base64-encoded JSON object, e.g.:
//   btoa(JSON.stringify({ angle: 45, label: "ABC" }))
//
// If props is omitted, the component renders with no props.
// You can also pass props as plain JSON (not base64) via &json=URL_ENCODED_JSON

export default function DiagramViewer() {
  const [error, setError] = useState(null);

  const params = new URLSearchParams(window.location.search);
  const componentName = params.get('component');
  const propsB64 = params.get('props');
  const propsJson = params.get('json');
  const bg = params.get('bg') || 'white';

  // Parse props
  let parsedProps = {};
  try {
    if (propsB64) {
      parsedProps = JSON.parse(atob(propsB64));
    } else if (propsJson) {
      parsedProps = JSON.parse(decodeURIComponent(propsJson));
    }
  } catch (e) {
    if (!error) setError(`Failed to parse props: ${e.message}`);
  }

  // Look up component
  const Component = componentName ? COMPONENTS[componentName] : null;

  useEffect(() => {
    document.title = componentName
      ? `Diagram: ${componentName}`
      : 'Diagram Viewer';
  }, [componentName]);

  // No component specified — show index
  if (!componentName) {
    return (
      <div style={{ padding: 32, fontFamily: 'system-ui, sans-serif', maxWidth: 600 }}>
        <h1 style={{ fontSize: 20, marginBottom: 16 }}>Diagram Viewer</h1>
        <p style={{ color: '#666', marginBottom: 16 }}>
          Add <code>?diagram-viewer=true&component=NAME</code> to render a component.
        </p>
        <h2 style={{ fontSize: 16, marginBottom: 8 }}>Available components:</h2>
        <ul style={{ lineHeight: 1.8 }}>
          {Object.keys(COMPONENTS).map(name => (
            <li key={name}>
              <a href={`?diagram-viewer=true&component=${name}`}
                 style={{ color: '#7C3AED' }}>
                {name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // Unknown component
  if (!Component) {
    return (
      <div style={{ padding: 32, fontFamily: 'system-ui, sans-serif', color: '#c00' }}>
        <h1 style={{ fontSize: 20 }}>Unknown component: {componentName}</h1>
        <p>Available: {Object.keys(COMPONENTS).join(', ')}</p>
      </div>
    );
  }

  // Render error
  if (error) {
    return (
      <div style={{ padding: 32, fontFamily: 'system-ui, sans-serif', color: '#c00' }}>
        <h1 style={{ fontSize: 20 }}>Error</h1>
        <p>{error}</p>
      </div>
    );
  }

  // Render the component
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: bg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 32
    }}>
      <div>
        <Component {...parsedProps} />
      </div>
    </div>
  );
}
