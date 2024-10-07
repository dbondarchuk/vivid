import { forwardRef, HTMLAttributes } from "react";

const h1 = forwardRef<HTMLHeadingElement>(
  (props: HTMLAttributes<HTMLHeadingElement>, ref) => (
    <h1 ref={ref} {...props} className="text-center font-bold my-8" />
  )
);

h1.displayName = "h1";

const h2 = forwardRef<HTMLHeadingElement>(
  (props: HTMLAttributes<HTMLHeadingElement>, ref) => (
    <h1 ref={ref} {...props} className="text-center font-semibold my-6" />
  )
);

h2.displayName = "h2";

const h3 = forwardRef<HTMLHeadingElement>(
  (props: HTMLAttributes<HTMLHeadingElement>, ref) => (
    <h3
      ref={ref}
      {...props}
      className="text-center font-header font-normal my-4"
    />
  )
);

h3.displayName = "h3";

const h4 = forwardRef<HTMLHeadingElement>(
  (props: HTMLAttributes<HTMLHeadingElement>, ref) => (
    <h4 ref={ref} {...props} className="font-light text-xl my-4" />
  )
);

h4.displayName = "h4";

const h5 = forwardRef<HTMLHeadingElement>(
  (props: HTMLAttributes<HTMLHeadingElement>, ref) => (
    <h5 ref={ref} {...props} className="font-light my-2" />
  )
);

h5.displayName = "h5";

const h6 = forwardRef<HTMLHeadingElement>(
  (props: HTMLAttributes<HTMLHeadingElement>, ref) => (
    <h6 ref={ref} {...props} className="font-light my-2" />
  )
);

h6.displayName = "h6";

const p = forwardRef<HTMLParagraphElement>(
  (props: HTMLAttributes<HTMLParagraphElement>, ref) => (
    <p ref={ref} {...props} className="font-thin" />
  )
);

p.displayName = "p";

export const MdxOverrides = {
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p,
};
