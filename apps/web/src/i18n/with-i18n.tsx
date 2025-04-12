import React from "react";
import { I18nFn, useI18n } from "./i18n";

export interface IWithI18nProps {
  i18n: I18nFn;
}

/**
 * Injects I18n instance from the context to C props.
 * @param Component component that consumes i18n in its props
 */
export const withI18n = <P extends IWithI18nProps>(
  Component: React.ComponentType<P>
): React.ComponentType<Pick<P, Exclude<keyof P, keyof IWithI18nProps>>> => {
  const With18N: React.FC = (props: {}) => {
    const i18n = useI18n();
    return <Component {...({ ...props, i18n } as P)} />;
  };

  With18N.displayName = "WithI18N";

  return With18N;
};
