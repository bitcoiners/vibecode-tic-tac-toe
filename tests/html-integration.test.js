/**
 * HTML Integration Test - Validates JavaScript in HTML file
 */
describe('HTML Integration Tests', () => {
  const fs = require('fs');
  const path = require('path');
  
  test('HTML file should call registerLocalGameEngine (not setLocalEngine)', () => {
    // Read the HTML file
    const htmlContent = fs.readFileSync(
      path.join(__dirname, '../public/index.html'), 
      'utf8'
    );
    
    // Check method names
    const hasCorrectMethod = htmlContent.includes('registerLocalGameEngine');
    const hasIncorrectMethod = htmlContent.includes('setLocalEngine');
    
    // Debug info
    console.log('Found registerLocalGameEngine:', hasCorrectMethod);
    console.log('Found setLocalEngine:', hasIncorrectMethod);
    
    // REQUIREMENT 1: Should NOT have the incorrect method
    expect(hasIncorrectMethod).toBe(false);
    
    // REQUIREMENT 2: Should HAVE the correct method
    expect(hasCorrectMethod).toBe(true);
    
    // REQUIREMENT 3: Should call it correctly (not just mention it in comments)
    // Look for actual method calls (simplified check)
    const methodCallPattern = /gameSync\.registerLocalGameEngine\(/;
    expect(methodCallPattern.test(htmlContent)).toBe(true);
  });
});
