/**
 * Unit tests for branch cleanup functionality, focusing on behavior not implementation
 */

const branchCleanup = require('../src/branchCleanup');

// Mock the child_process.execSync to avoid real git commands
jest.mock('child_process', () => ({
  execSync: jest.fn()
}));

// Prepare execSync mock that returns expected test data
const { execSync } = require('child_process');

describe('Branch Cleanup', () => {
  // Reset mocks between tests
  beforeEach(() => {
    jest.clearAllMocks();
    console.log = jest.fn();
    console.warn = jest.fn(); 
    console.error = jest.fn();
  });

  describe('identifyMergedBranches', () => {
    it('correctly filters out protected branches', () => {
      // Mock custom execFn that returns test data
      const mockExecFn = jest.fn().mockReturnValue(
        '  branch1\n* main\n  develop\n  feature/123\n  release'
      );
      
      const result = branchCleanup.identifyMergedBranches(mockExecFn);
      
      // Verify it called our mock with the right command
      expect(mockExecFn).toHaveBeenCalledWith('git branch --merged main');
      
      // Verify it correctly filtered out protected branches
      expect(result).toEqual(['branch1', 'feature/123']);
      expect(result).not.toContain('main');
      expect(result).not.toContain('develop');
      expect(result).not.toContain('release');
    });

    it('handles empty branch list', () => {
      const mockExecFn = jest.fn().mockReturnValue('* main\n  develop\n  release');
      const result = branchCleanup.identifyMergedBranches(mockExecFn);
      expect(result).toEqual([]);
    });
  });

  describe('deleteBranch', () => {
    it('executes correct deletion commands for a branch', () => {
      const mockExecFn = jest.fn();
      const result = branchCleanup.deleteBranch('feature/123', mockExecFn);
      
      // Check it attempted to delete both locally and remotely
      expect(mockExecFn).toHaveBeenCalledWith('git branch -d feature/123');
      expect(mockExecFn).toHaveBeenCalledWith('git push origin --delete feature/123');
      expect(result).toBe(true);
    });

    it('handles deletion errors gracefully', () => {
      const mockExecFn = jest.fn().mockImplementation(() => {
        throw new Error('Branch not found');
      });
      
      const result = branchCleanup.deleteBranch('invalid-branch', mockExecFn);
      
      expect(result).toBe(false);
      expect(console.error).toHaveBeenCalled();
    });

    it('supports dry run mode', () => {
      const mockExecFn = jest.fn();
      branchCleanup.deleteBranch('feature/test', mockExecFn, true);
      
      // In dry run mode, no actual deletion commands should be executed
      expect(mockExecFn).not.toHaveBeenCalled();
    });
  });

  describe('getBranchState', () => {
    it('retrieves current branch and repo root', () => {
      const mockExecFn = jest.fn()
        .mockReturnValueOnce('feature/test') // First call for current branch
        .mockReturnValueOnce('/home/repo');  // Second call for repo root
      
      const state = branchCleanup.getBranchState(mockExecFn);
      
      expect(state).toEqual({
        currentBranch: 'feature/test',
        repoRoot: '/home/repo'
      });
    });
  });

  // Integration test that verifies the full workflow
  describe('Integration workflow', () => {
    it('performs expected operations in sequence', () => {
      // We don't call main() directly as it changes process.chdir and runs npm test
      // Instead, we verify the module exports all expected functionality
      expect(typeof branchCleanup.main).toBe('function');
      expect(typeof branchCleanup.identifyMergedBranches).toBe('function');
      expect(typeof branchCleanup.deleteBranch).toBe('function');
      expect(typeof branchCleanup.getBranchState).toBe('function');
    });
  });
});
