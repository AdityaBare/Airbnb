class ExpressError extends Error {
    constructor(status, message) {
        super(message); // Pass message to Error constructor
        this.status = status;
        this.name = 'ExpressError'; // Optional: custom error name
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ExpressError);
        }
    }
}

module.exports = ExpressError;