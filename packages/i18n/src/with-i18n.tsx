import React from "react";
import { I18nFn, I18nNamespaces, useI18n } from "./i18n";

export interface IWithI18nProps<T extends I18nNamespaces> {
  i18n: I18nFn<T>;
}

/**
 * Injects I18n instance from the context to C props.
 * @param Component component that consumes i18n in its props
 */
export const withI18n = <T extends I18nNamespaces, P extends IWithI18nProps<T>>(
  Component: React.ComponentType<P>,
  namespace: T = "translation" as T
): React.ComponentType<Pick<P, Exclude<keyof P, keyof IWithI18nProps<T>>>> => {
  const With18N: React.FC = (props: {}) => {
    const i18n = useI18n(namespace);
    return <Component {...({ ...props, i18n } as P)} />;
  };

  With18N.displayName = "WithI18N";

  return With18N;
};
