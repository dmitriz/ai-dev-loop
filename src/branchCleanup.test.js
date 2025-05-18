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
    it('identifies branches merged into main while excluding only main and master', () => {
      // Mock git branch --merged main output with various branches
      const mockExecFn = jest.fn().mockReturnValue(
        '  branch1\n* main\n  master\n  develop\n  feature/123\n  release'
      );
      
      const result = branchCleanup.identifyMergedBranches(mockExecFn);
      
      // Verify it called our mock with the correct git command
      expect(mockExecFn).toHaveBeenCalledWith('git branch --merged main');
      
      // Verify it correctly identifies ALL branches for deletion EXCEPT main and master
      expect(result).toContain('branch1');
      expect(result).toContain('feature/123');
      expect(result).toContain('develop');
      expect(result).toContain('release');
      expect(result).not.toContain('main');
      expect(result).not.toContain('master');
    });

    it('outputs nothing when no branches to delete', () => {
      // Mock git branch output with only main and master
      const mockExecFn = jest.fn().mockReturnValue('* main\n  master');
      const result = branchCleanup.identifyMergedBranches(mockExecFn);
      
      // Should return empty array when only main/master exist
      expect(result.length).toBe(0);
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
  });

  // Test suite verification - ensure all required functions are exported
  describe('Required Functions', () => {
    it('exports identifyMergedBranches and deleteBranch functions', () => {
      // These are the essential functions for branch deletion
      expect(typeof branchCleanup.identifyMergedBranches).toBe('function');
      expect(typeof branchCleanup.deleteBranch).toBe('function');
    });
  });
});
