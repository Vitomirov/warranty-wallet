// Functions for Standardized API Responses

// Standard success responses
export const sendSuccess = (res, data, status = 200) => {
  res.status(status).json(data);
};

// Standard error responses (logs internally)
export const sendError = (res, message, status = 500, errorDetails = null) => {
  console.error("API Error:", message, errorDetails);
  res.status(status).json({ message, error: errorDetails?.message || null });
};

// 404 Not Found responses
export const sendNotFound = (res, message = "Resource not found") => {
  sendError(res, message, 404);
};

// 400 Bad Request responses
export const sendBadRequest = (res, message = "Bad Request") => {
  sendError(res, message, 400);
};

// 401 Unauthorized responses
export const sendUnauthorized = (res, message = "Unauthorized") => {
  sendError(res, message, 401);
};

// 403 Forbidden responses
export const sendForbidden = (res, message = "Forbidden") => {
  sendError(res, message, 403);
};
