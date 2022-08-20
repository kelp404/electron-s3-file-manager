class BaseError extends Error {
	constructor(message) {
		super(message instanceof Error ? `${message}` : message?.message);

		if (message?.stack) {
			this.stack = message.stack;
		}

		if (message?.secondaryStack) {
			this.secondaryStack = message.secondaryStack;
		}

		if (message?.status) {
			this.status = message.status;
		}

		if (message?.extra) {
			this.extra = message.extra;
		}
	}

	toJSON() {
		return {
			message: this.message,
			secondaryStack: this.secondaryStack,
			stack: this.stack,
			status: this.status,
			extra: this.extra,
		};
	}
}

class BadRequestError extends BaseError {
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

class UnauthorizedError extends BaseError {
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

class ForbiddenError extends BaseError {
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

class NotFoundError extends BaseError {
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

class ConflictError extends BaseError {
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

class UnprocessableEntityError extends BaseError {
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

class TooManyRequestsError extends BaseError {
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

class MainProcessError extends BaseError {
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
	BaseError,
	BadRequestError,
	UnauthorizedError,
	ForbiddenError,
	NotFoundError,
	ConflictError,
	UnprocessableEntityError,
	TooManyRequestsError,
	MainProcessError,
};
