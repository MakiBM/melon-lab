import { ExecutionResult } from 'graphql/execution/execute';
import { DocumentNode } from 'graphql/language/ast';
import $$observable from 'symbol-observable';
import * as MessageTypes from './message-types';

export interface Observer<T> {
  next?: (value: T) => void;
  error?: (error: Error) => void;
  complete?: () => void;
}

export interface Observable<T> {
  subscribe(
    observer: Observer<T>,
  ): {
    unsubscribe: () => void;
  };
}

export interface OperationOptions {
  query?: string | DocumentNode;
  variables?: Object;
  operationName?: string;
  [key: string]: any;
}

export type FormatedError = Error & {
  originalError?: any;
};

export interface Operation {
  options: OperationOptions;
  handler: (error: Error[], result?: any) => void;
}

export interface Operations {
  [id: string]: Operation;
}

export class SubscriptionClient {
  private operations: Operations;
  private channel: string;
  private messenger: any;
  private nextOperationId: number;

  constructor(options) {
    this.channel = options.channel;
    this.messenger = options.messenger;
    this.operations = {};
    this.nextOperationId = 0;

    this.messenger && this.messenger.on(`${this.channel}-res`, this.onMessage.bind(this));
  }

  public request(request: OperationOptions): Observable<ExecutionResult> {
    const getObserver = this.getObserver.bind(this);
    const executeOperation = this.executeOperation.bind(this);
    const unsubscribe = this.unsubscribe.bind(this);

    return {
      [$$observable]() {
        return this;
      },
      subscribe(
        observerOrNext:
          | (Observer<ExecutionResult>)
          | ((v: ExecutionResult) => void),
        onError?: (error: Error) => void,
        onComplete?: () => void,
      ) {
        const observer = getObserver(observerOrNext, onError, onComplete);
        const id = executeOperation(request, (error: Error[], result: any) => {
          if (error === null && result === null) {
            if (observer.complete) {
              observer.complete();
            }
          } else if (error) {
            if (observer.error) {
              observer.error(error[0]);
            }
          } else {
            if (observer.next) {
              observer.next(result);
            }
          }
        });

        return {
          unsubscribe: () => unsubscribe(id),
        };
      },
    };
  }

  private executeOperation(
    options: OperationOptions,
    handler: (error: Error[], result?: any) => void,
  ): string {
    const id = this.generateOperationId();
    this.operations[id] = { options: options, handler };
    this.sendMessage(id, MessageTypes.GQL_START, options);

    return id;
  }

  private getObserver<T>(
    observerOrNext: (Observer<T>) | ((v: T) => void),
    error?: (e: Error) => void,
    complete?: () => void,
  ) {
    if (typeof observerOrNext === 'function') {
      return {
        next: (v: T) => observerOrNext(v),
        error: (e: Error) => error && error(e),
        complete: () => complete && complete(),
      };
    }

    return observerOrNext;
  }

  private formatErrors(errors: any): FormatedError[] {
    if (Array.isArray(errors)) {
      return errors;
    }

    // TODO  we should not pass ValidationError to callback in the future.
    // ValidationError
    if (errors && errors.errors) {
      return this.formatErrors(errors.errors);
    }

    if (errors && errors.message) {
      return [errors];
    }

    return [
      {
        name: 'FormatedError',
        message: 'Unknown error',
        originalError: errors,
      },
    ];
  }

  private sendMessage(id: string, type: string, payload: any) {
    this.messenger.send(`${this.channel}-req`, id, type, payload);
  }

  private generateOperationId(): string {
    return String(++this.nextOperationId);
  }

  private onMessage(event, id, type, payload) {
    switch (type) {
      case MessageTypes.GQL_COMPLETE:
        if (this.operations[id]) {
          this.operations[id].handler(null, null);
          delete this.operations[id];
        }
        break;

      case MessageTypes.GQL_ERROR:
        if (this.operations[id]) {
          this.operations[id].handler(this.formatErrors(payload), null);
          delete this.operations[id];
        }
        break;

      case MessageTypes.GQL_DATA:
        if (this.operations[id]) {
          const parsedPayload = !payload.errors
            ? payload
            : { ...payload, errors: this.formatErrors(payload.errors) };
          this.operations[id].handler(null, parsedPayload);
        }
        break;

      default:
        throw new Error('Invalid message type!');
    }
  }

  private unsubscribe(id: string) {
    if (this.operations[id]) {
      delete this.operations[id];
      this.sendMessage(id, MessageTypes.GQL_STOP, undefined);
    }
  }
}
