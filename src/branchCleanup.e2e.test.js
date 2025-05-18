/**
 * End-to-End tests for branch deletion functionality
 * 
 * These tests verify the full workflow of deleting merged branches:
 * 1. Identifying branches that have been merged into main
 * 2. Deleting them both locally and remotely
 */

// Import the main deletion function
const { deleteMergedBranches } = require('./branchCleanup');

// Mock child_process.execSync to prevent real git commands during tests
jest.mock('child_process', () => ({
  execSync: jest.fn()
}));

// Import the mocked execSync for verification
const { execSync } = require('child_process');

describe('Branch Deletion End-to-End Workflow', () => {
  // Reset mocks between tests
  beforeEach(() => {
    jest.clearAllMocks();
    console.log = jest.fn();
    console.warn = jest.fn(); 
    console.error = jest.fn();
  });

  it('identifies and deletes multiple merged branches', () => {
    // Create a mock that returns several branches when listing merged branches
    const mockGitCommand = jest.fn()
      .mockReturnValueOnce('  feature/one\n* main\n  master\n  bugfix/123\n  hotfix/456');
    
    // Call the main deletion function with our mock
    const result = deleteMergedBranches(mockGitCommand);
    
    // Verify it identified all the merged branches except main and master
    expect(result.deleted).toContain('feature/one');
    expect(result.deleted).toContain('bugfix/123');
    expect(result.deleted).toContain('hotfix/456');
    expect(result.deleted.length).toBe(3);
  });

  it('handles repo with no merged branches', () => {
    // Mock a repo with only main and master branches
    const mockGitCommand = jest.fn()
      .mockReturnValueOnce('* main\n  master');
    
    // Call the deletion function
    const result = deleteMergedBranches(mockGitCommand);
    
    // Verify no branches were deleted
    expect(result.deleted.length).toBe(0);
    expect(result.failed.length).toBe(0);
    expect(console.log).toHaveBeenCalledWith('✔ No merged branches to delete.');
  });

  it('reports branches that failed to delete', () => {
    // Create a mock for git commands
    const mockGitCommand = jest.fn();
    
    // For the branch list command, return multiple branches
    mockGitCommand.mockReturnValueOnce('  feature/success\n  feature/fail\n* main\n  master');
    
    // Create a mock that will simulate success for one branch and failure for another
    const mockExecFn = jest.fn()
      // For feature/success: both local and remote succeed
      .mockImplementationOnce(() => true) // local delete success
      .mockImplementationOnce(() => true) // remote delete success
      // For feature/fail: local succeeds but remote fails
      .mockImplementationOnce(() => true) // local delete success
      .mockImplementationOnce(() => { throw new Error('Remote delete failed'); }); // remote delete fails
    
    // Replace the functions in the cleanupMergedBranches with our mocks
    const originalDeleteLocalBranch = require('./branchCleanup').deleteLocalBranch;
    const originalDeleteRemoteBranch = require('./branchCleanup').deleteRemoteBranch;
    
    require('./branchCleanup').deleteLocalBranch = jest.fn().mockImplementation(
      (branch) => mockExecFn()
    );
    
    require('./branchCleanup').deleteRemoteBranch = jest.fn().mockImplementation(
      (branch) => mockExecFn()
    );
    
    // Call the cleanup function with our branch list mock
    const result = cleanupMergedBranches(mockGitCommand);
    
    // Restore original functions
    require('./branchCleanup').deleteLocalBranch = originalDeleteLocalBranch;
    require('./branchCleanup').deleteRemoteBranch = originalDeleteRemoteBranch;
    
    // Verify results
    expect(result.deleted).toContain('feature/success');
    expect(result.failed).toContain('feature/fail');
    expect(result.deleted.length).toBe(1);
    expect(result.failed.length).toBe(1);
  });
  
  it('integrates with a git workflow to delete merged branches', () => {
    // Setup our mocks
    const mockExec = jest.fn();
    
    // Mock git branch to return merged branches
    mockExec.mockReturnValueOnce('  feature/completed\n  bugfix/merged\n* main\n  master');
    
    // Simulate the whole process
    const result = cleanupMergedBranches(mockExec);
    
    // Verify results
    expect(result.deleted.length).toBeGreaterThan(0);
    expect(result.deleted).toEqual(expect.arrayContaining(['feature/completed', 'bugfix/merged']));
  });
});
