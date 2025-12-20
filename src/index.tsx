import React, { useMemo } from 'react';

export function Component() {
  const foo = useMemo(() => (_unused: string, used: string) => {
    return used;
  }, []);

  const value = foo('ignore me', 'use me');

  return <div>Hello, world! {value}</div>;
}
