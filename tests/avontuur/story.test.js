import { describe, it, expect } from 'vitest';
import { STORY, START_NODE, getNode, isEnding } from '../../js/avontuur/game/story.js';
import { getPuzzle } from '../../js/dots/game/puzzles.js';

const nodes = Object.values(STORY);

describe('story graph', () => {
  it('starts at an existing node', () => {
    expect(getNode(START_NODE)).toBeDefined();
  });

  it('every node has text and a picture with a cartoon drawing', () => {
    for (const node of nodes) {
      expect(node.text.length, node.id).toBeGreaterThan(20);
      const picture = getPuzzle(node.picture);
      expect(picture, node.id).toBeDefined();
      expect(picture.details.length, node.id).toBeGreaterThan(0);
    }
  });

  it('every choice leads to an existing node and has a label', () => {
    for (const node of nodes) {
      for (const choice of node.choices) {
        expect(getNode(choice.next), `${node.id} → ${choice.next}`).toBeDefined();
        expect(choice.label.length).toBeGreaterThan(0);
      }
    }
  });

  it('offers 2 or 3 choices at every step that is not an ending', () => {
    for (const node of nodes.filter((n) => !isEnding(n))) {
      expect(node.choices.length, node.id).toBeGreaterThanOrEqual(2);
      expect(node.choices.length, node.id).toBeLessThanOrEqual(3);
    }
  });

  it('choices at one step show different pictures', () => {
    for (const node of nodes) {
      const pictures = node.choices.map((c) => getNode(c.next).picture);
      expect(new Set(pictures).size, node.id).toBe(pictures.length);
    }
  });

  it('reaches every node from the start, and every path ends within 5 steps', () => {
    const seen = new Set();
    const walk = (id, depth) => {
      expect(depth, `path too long at ${id}`).toBeLessThanOrEqual(5);
      seen.add(id);
      getNode(id).choices.forEach((c) => walk(c.next, depth + 1));
    };
    walk(START_NODE, 1);
    expect([...seen].sort()).toEqual(Object.keys(STORY).sort());
  });

  it('has several different endings', () => {
    expect(nodes.filter(isEnding).length).toBeGreaterThanOrEqual(6);
  });
});
