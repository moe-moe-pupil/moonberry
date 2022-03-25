import { forwardRef } from "@umijs/renderer-react/node_modules/@types/react";
import { Ref, useImperativeHandle, useRef } from "react";

export function CallbackRef(props: any, ref: Ref<unknown> | undefined) {
  const callbackRef = useRef();
  useImperativeHandle(ref, () => ({
    extra: () => {
      return(props)
    }
  }));
}
