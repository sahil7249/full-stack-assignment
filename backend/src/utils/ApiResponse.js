class ApiResponse {
    constructor(statusCode,message,data=null) {
        this.success = true,
        this.statusCode = statusCode || 200,
        this.message = message,
        this.data = data
    }
}

export default ApiResponse  