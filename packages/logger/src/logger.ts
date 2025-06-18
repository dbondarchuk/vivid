import { headers } from "next/headers";
import pino from "pino";
import { cache } from "react";
import { getBaseLoggerFactory } from "./base-factory";

const _getLoggerFactory = cache(async () => {
  try {
    const headersList = await headers();
    return getBaseLoggerFactory(headersList.get("x-correlation-id"));
  } catch {
    return getBaseLoggerFactory();
  }
});

const promiseHandler: ProxyHandler<any> = {
  get: (target, prop) =>
    function () {
      if (target instanceof Promise) {
        let args = arguments;
        return target.then((o) => o[prop].apply(o, args));
      } else {
        let value = target[prop];
        return typeof value == "function" ? value.bind(target) : value;
      }
    },
};

export const getLoggerFactory = cache((moduleName: string) => {
  return (functionName?: string) => {
    const logger: pino.Logger = new Proxy(
      _getLoggerFactory().then((l) =>
        l.child(
          {},
          {
            msgPrefix: `[${moduleName}${functionName ? `:${functionName}` : ""}] `,
          }
        )
      ),
      promiseHandler
    );

    return logger;
  };
});
