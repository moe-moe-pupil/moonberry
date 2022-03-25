export const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

export const waitTimeAndReturn = (time: number = 100, comp: JSX.Element) => {
  return new Promise<JSX.Element>((resolve) => {
    setTimeout(() => {
      resolve(comp)
    }, time);
  })
};