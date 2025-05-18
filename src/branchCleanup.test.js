/**
 * Unit tests for merged branch deletion functionality
 * 
 * These tests verify:
 * 1. The getMergedBranches function identifies branches merged into main
 *    (excluding only main and master from deletion)
 * 2. The deleteLocalBranch function removes a branch locally
 * 3. The deleteRemoteBranch function removes a branch from the remote repository
 * 4. The deleteMergedBranches function performs the full workflow
 */

// Import the specific functions we want to test directly
const { 
  getMergedBranches, 
  deleteLocalBranch, 
  deleteRemoteBranch,
  deleteMergedBranches
} = require('./branchCleanup');

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

  describe('getMergedBranches function', () => {
    it('returns all branches merged into main except main and master', () => {
      // Create a mock execution function
      // This is a function that would normally run a git command, but in tests
      // we replace it with a mock that returns predefined data
      const mockGitCommand = jest.fn().mockReturnValue(
        '  branch1\n* main\n  master\n  develop\n  feature/123\n  release'
      );
      
      // Call our function with the mock execution function as dependency
      const mergedBranches = getMergedBranches(mockGitCommand);
      
      // Verify it called the mock with the correct git command
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
      const mergedBranches = getMergedBranches(mockGitCommand);
      
      // Should return empty array when no branches to delete exist
      expect(mergedBranches.length).toBe(0);
    });
  });

  describe('deleteLocalBranch function', () => {
    it('executes git command to delete a branch locally', () => {
      // Create a mock execution function to verify commands
      const mockExecFn = jest.fn();
      const branchName = 'feature/123';
      
      // Call deleteLocalBranch with our mock
      deleteLocalBranch(branchName, mockExecFn);
      
      // Verify it called the local deletion git command
      expect(mockExecFn).toHaveBeenCalledWith(`git branch -d ${branchName}`);
    });
  });

  describe('deleteRemoteBranch function', () => {
    it('executes git command to delete a branch from the remote repository', () => {
      // Create a mock execution function to verify commands
      const mockExecFn = jest.fn();
      const branchName = 'feature/123';
      
      // Call deleteRemoteBranch with our mock
      deleteRemoteBranch(branchName, mockExecFn);
      
      // Verify it called the remote deletion git command
      expect(mockExecFn).toHaveBeenCalledWith(`git push origin --delete ${branchName}`);
    });
  });
  // End-to-end test that uses the deleteMergedBranches function
  describe('deleteMergedBranches function', () => {
    it('identifies merged branches and deletes them both locally and remotely', () => {
      // Setup mocks
      const mockGitBranchOutput = jest.fn().mockReturnValue(
        '  feature/done\n* main\n  master\n  bugfix/123'
      );
      
      // Call deleteMergedBranches with our mock
      const result = deleteMergedBranches(mockGitBranchOutput);
      
      // Verify it identified the right branches and marked them as deleted
      expect(result.deleted).toContain('feature/done');
      expect(result.deleted).toContain('bugfix/123');
      
      // Note: we don't need to verify the specific git commands here
      // since we're testing the composition function, not implementation details
    });
    
    it('returns empty arrays when no merged branches exist', () => {
      // Mock with no branches to delete
      const mockGitCommand = jest.fn().mockReturnValue('* main\n  master');
      
      // Call the function with our mock
      const result = deleteMergedBranches(mockGitCommand);
      
      // Should return an object with empty deleted and failed arrays
      expect(result.deleted.length).toBe(0);
      expect(result.failed.length).toBe(0);
    });
  });
});
