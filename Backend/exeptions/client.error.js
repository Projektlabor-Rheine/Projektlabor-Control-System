class ClientError extends Error {
    constructor(res, message, httpCode = 500) {
        super(message);
        this.status = httpCode;
        res.status(httpCode).send({
            message: message
        });
    }
}

export default ClientError;