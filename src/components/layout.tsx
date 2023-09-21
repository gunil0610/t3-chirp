import { type PropsWithChildren } from "react";
import { ScrollArea } from "./ui/scroll-area";

export const PageLayout = (props: PropsWithChildren) => {
  return (
    <main className="flex h-screen justify-center">
      <ScrollArea className="h-screen w-full md:max-w-2xl ">
        <div className="h-full w-full border-x border-slate-400 ">
          {props.children}
        </div>
      </ScrollArea>
    </main>
  );
};
