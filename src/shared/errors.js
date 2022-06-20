class BadRequestError extends Error {
	/**
   * @param {*} message
   * @param {{frontendOperationCode: string, frontendOperationValue: *}|undefined} extra
   */
	constructor(message, extra) {
		super(message || 'bad request');
		if (message?.stack) {
			this.secondaryStack = this.stack;
			this.stack = message.stack;
		}

		this.status = 400;
		this.extra = extra;
	}
}

class UnauthorizedError extends Error {
	/**
   * @param {*} message
   * @param {{frontendOperationCode: string, frontendOperationValue: *}|undefined} extra
   */
	constructor(message, extra) {
		// Redirect to the login page.
		super(message || 'unauthorized');
		if (message?.stack) {
			this.secondaryStack = this.stack;
			this.stack = message.stack;
		}

		this.status = 401;
		this.extra = extra;
	}
}

class ForbiddenError extends Error {
	/**
   * @param {*} message
   * @param {{frontendOperationCode: string, frontendOperationValue: *}|undefined} extra
   */
	constructor(message, extra) {
		super(message || 'permission denied');
		if (message?.stack) {
			this.secondaryStack = this.stack;
			this.stack = message.stack;
		}

		this.status = 403;
		this.extra = extra;
	}
}

class NotFoundError extends Error {
	/**
   * @param {*} message
   * @param {{frontendOperationCode: string, frontendOperationValue: *}|undefined} extra
   */
	constructor(message, extra) {
		super(message || 'resource not found');
		if (message?.stack) {
			this.secondaryStack = this.stack;
			this.stack = message.stack;
		}

		this.status = 404;
		this.extra = extra;
	}
}

class ConflictError extends Error {
	/**
   * @param {*} message
   * @param {{frontendOperationCode: string, frontendOperationValue: *}|undefined} extra
   */
	constructor(message, extra) {
		super(message || 'conflict');
		if (message?.stack) {
			this.secondaryStack = this.stack;
			this.stack = message.stack;
		}

		this.status = 409;
		this.extra = extra;
	}
}

class UnprocessableEntityError extends Error {
	/**
   * @param {*} message
   * @param {{frontendOperationCode: string, frontendOperationValue: *}|undefined} extra
   */
	constructor(message, extra) {
		super(message || 'unprocessable entity');
		if (message?.stack) {
			this.secondaryStack = this.stack;
			this.stack = message.stack;
		}

		this.status = 422;
		this.extra = extra;
	}
}

class TooManyRequestsError extends Error {
	/**
   * @param {*} message
   * @param {{frontendOperationCode: string, frontendOperationValue: *}|undefined} extra
   */
	constructor(message, extra) {
		super(message || 'too many requests');
		if (message?.stack) {
			this.secondaryStack = this.stack;
			this.stack = message.stack;
		}

		this.status = 429;
		this.extra = extra;
	}
}

class MainProcessError extends Error {
	/**
   * @param {*} message
   * @param {{frontendOperationCode: string, frontendOperationValue: *}|undefined} extra
   */
	constructor(message, extra) {
		super(message || 'main process error');
		if (message?.stack) {
			this.secondaryStack = this.stack;
			this.stack = message.stack;
		}

		this.status = 500;
		this.extra = extra;
	}
}

module.exports = {
	BadRequestError,
	UnauthorizedError,
	ForbiddenError,
	NotFoundError,
	ConflictError,
	UnprocessableEntityError,
	TooManyRequestsError,
	MainProcessError,
};
