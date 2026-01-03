
// Extend the Express namespace
declare global {
  namespace Express {
    // Extend the Request interface to include your custom property
    interface Request {
      // Define 'userId' as an optional string property
      // Use 'string | undefined' or just 'string' if a middleware guarantees its presence
      userId?: string; 
    }
  }
}

// This line is needed if you are using the file as a module (with imports/exports)
export {};