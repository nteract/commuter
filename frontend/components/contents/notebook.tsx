// All the ts-ignores in here should be deleted as we transition from the old
// flow backed versions of the nteract components to the typescript ones (which come
// with definitions).

// import NotebookPreview from "@nteract/notebook-preview";

import {
  Cells,
  Cell,
  Input,
  Prompt,
  Source,
  Outputs,
} from "@nteract/presentational-components";

import { Media, Output, KernelOutputError, StreamText } from "@nteract/outputs";

import MarkdownRender from "@nteract/markdown";

import { ImmutableNotebook } from "@nteract/commutable";

import { TransformMedia } from "./transform-media";

import React from "react";

import { isInputHidden } from "../../pages/view";
import { PlotlyTransform } from "../../transforms";
import VDOMDisplay from "@nteract/transform-vdom";

const NullTransform = () => null;
// As the transforms are loaded, these get overridden with the better variants
const transformsById = {
  "text/vnd.plotly.v1+html": PlotlyTransform,
  "application/vnd.plotly.v1+json": PlotlyTransform,
  "application/geo+json": NullTransform,
  "application/x-nteract-model-debug+json": NullTransform,
  "application/vnd.dataresource+json": NullTransform,
  "application/vnd.jupyter.widget-view+json": NullTransform,
  "application/vnd.vegalite.v1+json": NullTransform,
  "application/vnd.vegalite.v2+json": NullTransform,
  "application/vnd.vegalite.v3+json": NullTransform,
  "application/vnd.vegalite.v4+json": NullTransform,
  "application/vnd.vega.v2+json": NullTransform,
  "application/vnd.vega.v3+json": NullTransform,
  "application/vnd.vega.v4+json": NullTransform,
  "application/vnd.vega.v5+json": NullTransform,
  "application/vdom.v1+json": VDOMDisplay,
  "application/json": Media.Json,
  "application/javascript": Media.JavaScript,
  "text/html": Media.HTML,
  "text/markdown": Media.Markdown,
  "text/latex": Media.LaTeX,
  "image/svg+xml": Media.SVG,
  "image/gif": Media.Image,
  "image/png": Media.Image,
  "image/jpeg": Media.Image,
  "text/plain": Media.Plain,
};

const displayOrder = [
  "application/vnd.jupyter.widget-view+json",
  "application/vnd.vega.v5+json",
  "application/vnd.vega.v4+json",
  "application/vnd.vega.v3+json",
  "application/vnd.vega.v2+json",
  "application/vnd.vegalite.v4+json",
  "application/vnd.vegalite.v3+json",
  "application/vnd.vegalite.v2+json",
  "application/vnd.vegalite.v1+json",
  "application/geo+json",
  "application/vnd.plotly.v1+json",
  "text/vnd.plotly.v1+html",
  "application/x-nteract-model-debug+json",
  "application/vnd.dataresource+json",
  "application/vdom.v1+json",
  "application/json",
  "application/javascript",
  "text/html",
  "text/markdown",
  "text/latex",
  "image/svg+xml",
  "image/gif",
  "image/png",
  "image/jpeg",
  "text/plain",
];

interface NotebookProps {
  notebook: ImmutableNotebook;
  codeHidden?: boolean | undefined;
}

interface NotebookState {
  displayOrder: any;
  hiddenCodeCells: Map<string, boolean>;
  transformsById: any;
}

class Notebook extends React.Component<NotebookProps, NotebookState> {
  state = {
    displayOrder,
    hiddenCodeCells: new Map(),
    transformsById: transformsById,
  };

  registerTransform = (transform: { MIMETYPE: string }) => {
    this.setState((prevState) => {
      return {
        transformsById: {
          ...prevState.transformsById,
          [transform.MIMETYPE]: transform,
        },
      };
    });
  };

  loadTransforms = () => {
    import("@nteract/data-explorer").then((module) => {
      this.registerTransform(module.default);
    });

    import("@nteract/jupyter-widgets").then((module) => {
      this.registerTransform(module.WidgetDisplay);
    });

    import("@nteract/transform-model-debug").then((module) => {
      this.registerTransform(module.default);
    });

    // @ts-ignore
    import("@nteract/transform-vega").then((module) => {
      this.setState((prevState) => {
        return {
          transformsById: {
            ...prevState.transformsById,
            [module.VegaLite1.MIMETYPE]: module.VegaLite1,
            [module.VegaLite2.MIMETYPE]: module.VegaLite2,
            [module.Vega2.MIMETYPE]: module.Vega2,
            [module.Vega3.MIMETYPE]: module.Vega3,
          },
        };
      });
    });
  };

  checkIfCodeIsHidden = (id: string) => {
    return this.state.hiddenCodeCells.get(id);
  };

  setCodeHiddenState = (isHidden: boolean | undefined) => {
    if (isHidden) {
      this.state.displayOrder.forEach((id) => {
        this.state.hiddenCodeCells.set(id, true);
      });
    } else {
      this.state.displayOrder.forEach((id) => {
        this.state.hiddenCodeCells.set(id, false);
      });
    }
  };

  componentDidMount() {
    // Load every dynamic output type
    this.loadTransforms();

    // Set the display values of all input cells.
    // Values set to `false` by default.
    this.setCodeHiddenState(this.props.codeHidden);

    /**
     * Injected globals
     *
     * * jquery, $
     */

    // Provide jquery for users to use due to expectations on the notebook frontends.
    import("jquery").then((mod) => {
      (window as any).jquery = mod.default;
      (window as any).$ = mod.default;
    });
  }

  componentDidUpdate(prevProps: NotebookProps) {
    if (this.props.codeHidden !== prevProps.codeHidden) {
      this.setCodeHiddenState(this.props.codeHidden);
    }
  }

  render() {
    const { codeHidden, notebook } = this.props;
    const cellMap = notebook.cellMap;
    const cellOrder = notebook.cellOrder;

    return (
      <Cells>
        {cellOrder.map((id) => {
          const cell = cellMap.get(id);

          // Technically the cell order List can contain IDs that are not in the map, even though we construct the
          // two in parallel. This is primarily here for TypeScript and sanity sake
          if (!cell) {
            return null;
          }

          switch (cell.cell_type) {
            case "code":
              const hideInput =
                codeHidden ||
                isInputHidden(cell.metadata) ||
                this.checkIfCodeIsHidden(id);

              return (
                <Cell key={id} style={{ minHeight: "40px" }}>
                  {hideInput ? null : (
                    <Input>
                      <Prompt counter={cell.execution_count} />
                      <Source language="python">{cell.source}</Source>
                    </Input>
                  )}
                  {cell.outputs.size > 0 ? (
                    <Outputs>
                      {cell.outputs.map((output, index) => {
                        return (
                          <Output output={output} key={index}>
                            <TransformMedia
                              output_type="execute_result"
                              displayOrder={this.state.displayOrder}
                              transformsById={this.state.transformsById}
                            />
                            <TransformMedia
                              output_type="display_data"
                              displayOrder={this.state.displayOrder}
                              transformsById={this.state.transformsById}
                            />
                            <KernelOutputError />
                            <StreamText />
                          </Output>
                        );
                      })}
                    </Outputs>
                  ) : null}
                </Cell>
              );
            case "markdown":
              return (
                <Cell key={id}>
                  <Input></Input>
                  <Outputs>
                    <MarkdownRender source={cell.source} />
                  </Outputs>
                </Cell>
              );
            default:
              break;
          }
          return null;
        })}
      </Cells>
    );
  }
}

export default Notebook;
