
export class ApiResponse<T> {
  public success: boolean;
  public message: string;
  public data: T | null;
  public error?: any;
  public timestamp?: Date;

  constructor(success: boolean, message: string, data: T | null = null, error: any = null) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.error = error;
    if(process.env.NODE_ENV !== 'test'){
    this.timestamp = new Date();}
  }
  
  static success<T>(data: T, message: string = "Operation successful"): ApiResponse<T> {
    return new ApiResponse<T>(true, message, data);
  }

  static error(message: string, errorDetails?: any): ApiResponse<null> {
    return new ApiResponse<null>(false, message, null, errorDetails);
  }
}