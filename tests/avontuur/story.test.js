import { describe, it, expect } from 'vitest';
import { STORIES, getStory, getNode, isEnding } from '../../js/avontuur/game/story.js';
import { ACTIVITIES } from '../../js/avontuur/game/state.js';
import { getPuzzle } from '../../js/dots/game/puzzles.js';

describe('story catalog', () => {
  it('has unique story ids, each with a title and emoji', () => {
    const ids = STORIES.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const story of STORIES) {
      expect(story.title.length).toBeGreaterThan(0);
      expect(story.emoji.length).toBeGreaterThan(0);
      expect(getStory(story.id)).toBe(story);
    }
  });

  it('includes a story with a sliding puzzle', () => {
    expect(STORIES.some((s) => s.activities.includes('slide'))).toBe(true);
  });
});

describe.each(STORIES.map((s) => [s.id, s]))('story %s', (_, story) => {
  const nodes = Object.values(story.nodes);

  it('starts at an existing node and uses known activities', () => {
    expect(getNode(story, story.start)).toBeDefined();
    expect(story.activities.length).toBeGreaterThan(0);
    for (const type of story.activities) expect(ACTIVITIES).toContain(type);
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
        expect(getNode(story, choice.next), `${node.id} → ${choice.next}`).toBeDefined();
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
      const pictures = node.choices.map((c) => getNode(story, c.next).picture);
      expect(new Set(pictures).size, node.id).toBe(pictures.length);
    }
  });

  it('reaches every node from the start, and every path ends within 5 steps', () => {
    const seen = new Set();
    const walk = (id, depth) => {
      expect(depth, `path too long at ${id}`).toBeLessThanOrEqual(5);
      seen.add(id);
      getNode(story, id).choices.forEach((c) => walk(c.next, depth + 1));
    };
    walk(story.start, 1);
    expect([...seen].sort()).toEqual(Object.keys(story.nodes).sort());
  });

  it('has several different endings', () => {
    expect(nodes.filter(isEnding).length).toBeGreaterThanOrEqual(4);
  });
});

describe('the rhyming story of Noor and Mo', () => {
  const noor = getStory('noor');

  it('tells every step as a verse of four lines', () => {
    for (const node of Object.values(noor.nodes)) {
      expect(node.text.split('\n'), node.id).toHaveLength(4);
    }
  });

  it('goes through the kitchen, getting dressed and a present', () => {
    const kitchen = ['taart', 'koekjes', 'appels'];
    const clothes = ['jurk', 'trui'];
    const walk = (id, path) => {
      const node = getNode(noor, id);
      if (isEnding(node)) {
        expect(path.some((n) => kitchen.includes(n)), path.join(' → ')).toBe(true);
        expect(path.some((n) => clothes.includes(n)), path.join(' → ')).toBe(true);
        return;
      }
      node.choices.forEach((c) => walk(c.next, [...path, c.next]));
    };
    walk(noor.start, [noor.start]);
  });
});
