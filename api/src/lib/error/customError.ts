class CustomError extends Error {
  status: string;

  constructor(message: string, public statusCode: number) {
    super(message);
    this.status = statusCode >= 400 && statusCode < 500 ? "fail" : "error";
    Error.captureStackTrace(this, this.constructor);
  }
}

export default CustomError;
