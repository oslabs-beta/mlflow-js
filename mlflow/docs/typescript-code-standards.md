# TypeScript Code Standards

## File Structure and Naming
- Use PascalCase for class files (e.g., `ModelRegistryClient.ts`)
- Use camelCase for utility files (e.g., `apiRequest.ts`)
- Use kebab-case for directory names (e.g., `model-registry`)

## Imports and Exports
- Use named exports for utilities and interfaces
- Use default exports for main classes
- Group and sort imports:
  1. External libraries
  2. Internal modules
  3. Relative imports
- Within each group, sort alphabetically
- For imports from other modules, use the path aliases defined in tsconfig.json
- For imports within the same directory, use relative imports

## Naming Conventions
- PascalCase for classes and interfaces
- camelCase for methods, variables, and functions
- UPPER_SNAKE_CASE for constants

## Documentation
- Use JSDoc comments for classes, methods, and functions
- Include parameter descriptions, return types, and thrown exceptions
- Example:
  ```typescript
  /**
   * Creates a new registered model.
   * @param {string} name - The name of the model to register
   * @param {RegisteredModelTag[]} [tags] - Optional tags for the model
   * @param {string} [description] - Optional description for the model
   * @returns {Promise<RegisteredModel>} The created registered model object
   * @throws {ApiError} If the API request fails
   */
  ```

## Error Handling
- For simple API calls, use the ApiError class:
  ```typescript
 if (!response.ok) {
  throw new ApiError(
    `Error: ${data.message || response.statusText}`,
    response.status
  );
}
  ```
- For complex functions, use try/catch blocks:
  ```typescript
try {
  // complex operation
} catch (error) {
  if (error instanceof ApiError) {
    console.error(`API Error (${error.statusCode}): ${error.message}`);
  } else {
    console.error('An unexpected error occurred:', error);
  }
}
  ```

## Asynchronous Code
- Use async/await for asynchronous operations

## Type Annotations
- Use TypeScript type annotations consistently
- Create interfaces for complex object structures
- Use generics where appropriate

## Class and Method Structure
- Utilize TypeScript features like access modifiers (public, private)
- Use method signatures with proper TypeScript types

## Formatting
- Use 2 spaces for indentation
- Use single quotes for strings
- Add semicolons at the end of statements

## Consistency
- Maintain consistent style and patterns throughout the codebase
- When in doubt, follow the existing patterns in the project

