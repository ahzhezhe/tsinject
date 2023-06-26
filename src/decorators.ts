import { Container } from './Container';
import { MetadataKey, ParamInjections } from './internal-types';
import { InjectableOptions, InjectableToken, InjectableValue, Require, Scope, Token } from './types';

/**
 * Register injectable values and/or tokens.
 */
export const Register = (tokens: [token: Token, injectable: InjectableValue<any, any> | InjectableToken<any, any>][]): ClassDecorator => () => {
  tokens.forEach(([token, injectable]) => Container.register(token as any, injectable as any));
};

/**
 * Register this class as injectable class.
 * Default scope is singleton.
 */
export const Injectable = (options?: InjectableOptions): ClassDecorator => target => {
  Container.register(target as any, {
    class: target as any,
    scope: options?.scope || Scope.SINGLETON
  });
};

/**
 * Inject injectable to this parameter.
 * Default require exactly one injectable.
 */
export const Inject = (token: Token, require = Require.ONE): ParameterDecorator => (target, _, paramIndex) => {
  const injections: ParamInjections = Reflect.getOwnMetadata(MetadataKey.INJECT, target) || new Map();
  injections.set(paramIndex, { token, require });
  Reflect.defineMetadata(MetadataKey.INJECT, injections, target);
};

const buildInject = (require: Require) => (token: Token) => Inject(token, require);

/**
 * Inject exactly one injectable.
 */
export const InjectOne = buildInject(Require.ONE);

/**
 * Inject the first registered injectable.
 */
export const InjectAny = buildInject(Require.ANY);

/**
 * Inject exactly one injectable or `undefined` if no injectable is registered.
 */
export const InjectOneOrNone = buildInject(Require.ONE_OR_NONE);

/**
 * Inject the first registered injectable or `undefined` if no injectable is registered.
 */
export const InjectAnyOrNone = buildInject(Require.ANY_OR_NONE);

/**
 * Inject all injectables, requires at least one injectable.
 */
export const InjectAll = buildInject(Require.ALL);

/**
 * Inject all injectables, could be empty array if no injectable is registered.
 */
export const InjectAllOrNone = buildInject(Require.ALL_OR_NONE);
