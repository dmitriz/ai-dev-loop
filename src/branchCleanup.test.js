/**
 * Unit tests for merged branch deletion functionality
 * 
 * These tests verify that the branchCleanup module correctly:
 * 1. Identifies branches that have been merged into main
 * 2. Deletes identified branches both locally and remotely
 * 3. Only excludes main and master branches from deletion
 */

const branchCleanup = require('./branchCleanup');

// Mock the child_process.execSync to avoid real git commands during tests
jest.mock('child_process', () => ({
  execSync: jest.fn()
}));

// Import the mocked execSync function
const { execSync } = require('child_process');

describe('Merged Branch Deletion Utility', () => {
  // Reset mocks between tests
  beforeEach(() => {
    jest.clearAllMocks();
    console.log = jest.fn();
    console.warn = jest.fn(); 
    console.error = jest.fn();
  });

  describe('identifyMergedBranches', () => {
    it('identifies branches merged into main while excluding specific branches', () => {
      // Mock git branch --merged main output with various branches
      const mockExecFn = jest.fn().mockReturnValue(
        '  branch1\n* main\n  develop\n  feature/123\n  release'
      );
      
      const result = branchCleanup.identifyMergedBranches(mockExecFn);
      
      // Verify it called our mock with the correct git command
      expect(mockExecFn).toHaveBeenCalledWith('git branch --merged main');
      
      // Verify it correctly identifies branches for deletion while excluding specific ones
      expect(result).toEqual(['branch1', 'feature/123']);
      expect(result).not.toContain('main');
      expect(result).not.toContain('develop');
      expect(result).not.toContain('release');
    });

    it('returns empty array when no merged branches exist', () => {
      // Mock git branch output with only excluded branches
      const mockExecFn = jest.fn().mockReturnValue('* main\n  develop\n  release');
      const result = branchCleanup.identifyMergedBranches(mockExecFn);
      
      // Should return empty array when no merged branches exist (or only excluded branches)
      expect(result).toEqual([]);
    });
  });

  describe('deleteBranch', () => {
    it('deletes a branch both locally and remotely', () => {
      const mockExecFn = jest.fn();
      const branchName = 'feature/123';
      const result = branchCleanup.deleteBranch(branchName, mockExecFn);
      
      // Verify it executes both local and remote deletion commands
      expect(mockExecFn).toHaveBeenCalledWith(`git branch -d ${branchName}`);
      expect(mockExecFn).toHaveBeenCalledWith(`git push origin --delete ${branchName}`);
      expect(result).toBe(true);
    });

    it('handles deletion errors gracefully without crashing', () => {
      // Mock a failure scenario (e.g., branch doesn't exist)
      const mockExecFn = jest.fn().mockImplementation(() => {
        throw new Error('Branch not found or cannot be deleted');
      });
      
      const result = branchCleanup.deleteBranch('invalid-branch', mockExecFn);
      
      // Function should return false on error and log the issue
      expect(result).toBe(false);
      expect(console.error).toHaveBeenCalled();
    });

    it('performs no actions when in dry run mode', () => {
      const mockExecFn = jest.fn();
      const dryRun = true;
      
      branchCleanup.deleteBranch('feature/test', mockExecFn, dryRun);
      
      // In dry run mode, no deletion commands should be executed
      expect(mockExecFn).not.toHaveBeenCalled();
    });
  });

  describe('getBranchState', () => {
    it('retrieves current branch name and repository root path', () => {
      // Mock the git commands to get current branch and repo root
      const mockExecFn = jest.fn()
        .mockReturnValueOnce('feature/test') // For git rev-parse --abbrev-ref HEAD
        .mockReturnValueOnce('/home/repo');  // For git rev-parse --show-toplevel
      
      const state = branchCleanup.getBranchState(mockExecFn);
      
      // Should return an object with currentBranch and repoRoot properties
      expect(state).toEqual({
        currentBranch: 'feature/test',
        repoRoot: '/home/repo'
      });
    });
  });

  // Test suite verification - ensure all required functions are exported
  describe('API Availability', () => {
    it('exports all required functions for branch deletion', () => {
      // Verify the module exports all functions needed for its operation
      expect(typeof branchCleanup.identifyMergedBranches).toBe('function');
      expect(typeof branchCleanup.deleteBranch).toBe('function');
      expect(typeof branchCleanup.getBranchState).toBe('function');
    });
  });
});
