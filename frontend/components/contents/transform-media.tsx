import React from "react";

import * as Immutable from "immutable";

import {
  ImmutableDisplayData,
  ImmutableExecuteResult
} from "@nteract/commutable";

export const richestMediaType = (
  output: ImmutableExecuteResult | ImmutableDisplayData,
  order: Immutable.List<string>,
  handlers: Immutable.Map<string, any>
) => {
  const outputData = output.data;

  // Find the first mediaType in the output data that we support with a handler
  const mediaType = order.find(key => {
    return (
      outputData.hasOwnProperty(key) &&
      (handlers.hasOwnProperty(key) || handlers.get(key, false))
    );
  });

  return mediaType;
};

interface Props {
  output?: ImmutableDisplayData | ImmutableExecuteResult;
  output_type: "execute_result" | "display_data";
  displayOrder: any;
  transformsById: any;
}

export const TransformMedia = (props: Props) => {
  const { output, transformsById, displayOrder } = props;
  if (!output) {
    return null;
  }
  const output_type = output.output_type;

  // This component should only be used with display data and execute result
  if (
    !output ||
    !(output_type === "display_data" || output_type === "execute_result")
  ) {
    console.warn(
      "connected transform media managed to get a non media bundle output"
    );
    return null;
  }

  const mediaType = richestMediaType(output, displayOrder, transformsById);

  if (mediaType) {
    const metadata = output.metadata.get(mediaType, Immutable.Map()).toJS();
    const data = output.data[mediaType];
    const Media = transformsById[mediaType];

    // If we had no valid result, return an empty output
    if (!data) {
      return null;
    }

    return <Media data={data} metadata={metadata} />;
  }

  return null;
};
