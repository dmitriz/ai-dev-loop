/**
 * Unit tests for merged branch deletion functionality
 * 
 * These tests verify:
 * 1. The identifyMergedBranches function correctly finds branches merged into main
 *    (excluding only main and master from deletion)
 * 2. The deleteBranch function correctly executes deletion commands
 *    for both local and remote branches
 */

// Import the specific functions we want to test directly
const { identifyMergedBranches, deleteBranch } = require('./branchCleanup');

// Mock child_process.execSync to prevent real git commands during tests
jest.mock('child_process', () => ({
  execSync: jest.fn()
}));

// Import the mocked execSync for verification
const { execSync } = require('child_process');

describe('Merged Branch Deletion Functions', () => {
  // Reset mocks between tests
  beforeEach(() => {
    jest.clearAllMocks();
    console.log = jest.fn();
    console.warn = jest.fn(); 
    console.error = jest.fn();
  });

  describe('identifyMergedBranches function', () => {
    it('returns all branches merged into main except main and master', () => {
      // Create a mock function that simulates 'git branch --merged main' command output
      // This mock returns a string with several branch names as if they were merged
      const mockGitCommand = jest.fn().mockReturnValue(
        '  branch1\n* main\n  master\n  develop\n  feature/123\n  release'
      );
      
      // Call our function with the mock
      const mergedBranches = identifyMergedBranches(mockGitCommand);
      
      // Verify the function called git with the correct command
      expect(mockGitCommand).toHaveBeenCalledWith('git branch --merged main');
      
      // Verify the function returns all branches except main and master
      expect(mergedBranches).toContain('branch1');
      expect(mergedBranches).toContain('feature/123');
      expect(mergedBranches).toContain('develop');
      expect(mergedBranches).toContain('release');
      expect(mergedBranches).not.toContain('main');
      expect(mergedBranches).not.toContain('master');
    });

    it('returns an empty array when only main and master branches exist', () => {
      // Mock returning only main and master branches
      const mockGitCommand = jest.fn().mockReturnValue('* main\n  master');
      
      // Call our function with the mock
      const mergedBranches = identifyMergedBranches(mockGitCommand);
      
      // Should return empty array when no branches to delete exist
      expect(mergedBranches.length).toBe(0);
    });
  });

  describe('deleteBranch function', () => {
    it('executes git commands to delete a branch both locally and remotely', () => {
      // Create a mock execution function to verify commands
      const mockExecFn = jest.fn();
      const branchName = 'feature/123';
      
      // Call deleteBranch with our mock
      deleteBranch(branchName, mockExecFn);
      
      // Verify it called the right git commands in sequence
      expect(mockExecFn).toHaveBeenCalledWith(`git branch -d ${branchName}`);
      expect(mockExecFn).toHaveBeenCalledWith(`git push origin --delete ${branchName}`);
    });
  });
  
  // End-to-end test that combines both functions
  describe('End-to-end branch deletion workflow', () => {
    it('identifies merged branches and deletes them', () => {
      // Setup mocks for both functions
      const mockGitBranchOutput = jest.fn().mockReturnValue(
        '  feature/done\n* main\n  master\n  bugfix/123'
      );
      const mockExecFn = jest.fn();
      
      // First get the merged branches
      const branchesToDelete = identifyMergedBranches(mockGitBranchOutput);
      
      // Then delete each one
      branchesToDelete.forEach(branch => {
        deleteBranch(branch, mockExecFn);
      });
      
      // Verify correct branches were identified
      expect(branchesToDelete).toEqual(['feature/done', 'bugfix/123']);
      
      // Verify deletion commands were executed for each branch
      expect(mockExecFn).toHaveBeenCalledWith('git branch -d feature/done');
      expect(mockExecFn).toHaveBeenCalledWith('git push origin --delete feature/done');
      expect(mockExecFn).toHaveBeenCalledWith('git branch -d bugfix/123');
      expect(mockExecFn).toHaveBeenCalledWith('git push origin --delete bugfix/123');
    });
  });
});
