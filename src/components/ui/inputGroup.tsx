import React from "react";

export const InputSuffix: React.FC<any> = (props: any) => {
  return <div className="flex items-center min-w-max">{props.children}</div>;
};

export const InputGroupInput: React.FC<any> = (props: any) => {
  return <div className="block w-full border-0 ">{props.children}</div>;
};

export const InputGroup: React.FC<any> = (props: any) => {
  return (
    <div className="rounded-md relative flex focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
      {props.children}
    </div>
  );
};
