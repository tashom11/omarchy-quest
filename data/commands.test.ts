import { describe, expect, it } from 'vitest';
import { buildableCommands, commands, commandsByWorld, splitIntoChunks, worldOrder } from './commands';

describe('commandsByWorld', () => {
  it('returns only commands belonging to the given world', () => {
    const windowsCommands = commandsByWorld('windows');
    expect(windowsCommands.length).toBeGreaterThan(0);
    expect(windowsCommands.every((c) => c.world === 'windows')).toBe(true);
  });
});

describe('splitIntoChunks', () => {
  it('splits on whitespace and trims', () => {
    expect(splitIntoChunks('omarchy theme set tokyo-night')).toEqual([
      'omarchy',
      'theme',
      'set',
      'tokyo-night',
    ]);
  });

  it('collapses repeated whitespace', () => {
    expect(splitIntoChunks('  Super +   Q  ')).toEqual(['Super', '+', 'Q']);
  });
});

describe('buildableCommands', () => {
  it('only includes commands whose answer has 2+ words', () => {
    const buildable = buildableCommands();
    expect(buildable.length).toBeGreaterThan(0);
    for (const command of buildable) {
      expect(splitIntoChunks(command.answer).length).toBeGreaterThanOrEqual(2);
    }
  });
});

describe('content integrity', () => {
  it('has a unique id for every command', () => {
    const ids = commands.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('has both fr and en text for every prompt and explanation', () => {
    for (const command of commands) {
      expect(command.prompt.fr.length).toBeGreaterThan(0);
      expect(command.prompt.en.length).toBeGreaterThan(0);
      expect(command.explanation.fr.length).toBeGreaterThan(0);
      expect(command.explanation.en.length).toBeGreaterThan(0);
    }
  });

  it('has exactly 3 distractors per command, none equal to the answer', () => {
    for (const command of commands) {
      expect(command.distractors).toHaveLength(3);
      expect(command.distractors).not.toContain(command.answer);
    }
  });

  it('covers every world in worldOrder with at least one command', () => {
    for (const world of worldOrder) {
      expect(commandsByWorld(world).length).toBeGreaterThan(0);
    }
  });
});
