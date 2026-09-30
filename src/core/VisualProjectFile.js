const metadataMarker = 'ROBLOX_LUA_BUILDER_PROJECT_V1:';

function encodeUtf8Base64(value) {
  const bytes = new TextEncoder().encode(value);
  let binary = '';
  for (let offset = 0; offset < bytes.length; offset += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + 0x8000));
  }
  return btoa(binary);
}

function decodeUtf8Base64(value) {
  const binary = atob(value);
  const bytes = Uint8Array.from(binary, character => character.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function appendVisualProjectMetadata(code, tree, title = 'Untitled Script') {
  if (!Array.isArray(tree)) throw new TypeError('Project tree must be an array');

  const metadata = encodeUtf8Base64(JSON.stringify({ version: 1, title, tree }));
  return `${String(code).trimEnd()}\n\n--[[${metadataMarker}${metadata}]]\n`;
}

export function readVisualProjectMetadata(source) {
  const text = String(source);
  const pattern = new RegExp(`(?:^|\\n)--\\[\\[${metadataMarker}([A-Za-z0-9+/=]+)\\]\\]\\s*$`);
  const match = pattern.exec(text);
  if (!match) return null;

  const project = JSON.parse(decodeUtf8Base64(match[1]));
  if (!project || project.version !== 1 || !Array.isArray(project.tree)) {
    throw new TypeError('Unsupported visual project metadata');
  }

  return {
    code: text.slice(0, match.index).trimEnd(),
    title: typeof project.title === 'string' ? project.title : 'Untitled Script',
    tree: project.tree,
  };
}

export function normalizeVisualProjectTree(tree, definitions) {
  if (!Array.isArray(tree)) throw new TypeError('Project tree must be an array');

  function normalizeNode(node) {
    if (!node || typeof node !== 'object' || !definitions?.[node.type]) {
      throw new TypeError(`Invalid block type: ${node?.type || 'unknown'}`);
    }

    const properties = Object.fromEntries(Object.entries(node.properties || {}).map(([key, value]) => [
      key,
      value && typeof value === 'object' && value.id && value.type
        ? normalizeNode(value)
        : value,
    ]));
    const bodies = {};
    Object.entries(node.bodies || {}).forEach(([bodyId, body]) => {
      if (bodyId !== 'body' && Array.isArray(body)) bodies[bodyId] = body.map(normalizeNode);
    });
    const children = Array.isArray(node.children) ? node.children : node.bodies?.body;
    bodies.body = Array.isArray(children) ? children.map(normalizeNode) : [];

    return {
      ...node,
      id: typeof node.id === 'string' ? node.id : crypto.randomUUID(),
      definitionId: node.definitionId || node.type,
      properties,
      inputs: { ...properties },
      next: node.next ? normalizeNode(node.next) : null,
      bodies,
      children: bodies.body,
    };
  }

  return tree.map(normalizeNode);
}