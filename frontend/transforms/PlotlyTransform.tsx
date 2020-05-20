// NOTE: this Plotly transform assumes Plotly is globally defined on the page

import * as React from "react";
import { cloneDeep } from "lodash";

interface Props {
  data: string | PlotlyFigure;
}

interface PlotlyFigure {
  data: any;
  layout: {
    height: number;
    autosize: boolean;
  };
}

declare class PlotlyHTMLElement extends HTMLElement {
  data: PlotlyFigure["data"];
  layout?: PlotlyFigure["layout"];
}

const NULL_MIMETYPE = "text/vnd.plotly.v1+html";
const MIMETYPE = "application/vnd.plotly.v1+json";

/*
 * As part of the init notebook mode, Plotly sneaks a <script> tag in to load
 * the plotlyjs lib. We have already loaded this though, so we "handle" the
 * transform by doing nothing and returning null.
 */
const PlotlyNullTransform = () => null;
PlotlyNullTransform.MIMETYPE = NULL_MIMETYPE;

class PlotlyTransform extends React.Component<Props> {
  plotDiv!: PlotlyHTMLElement;

  static MIMETYPE = MIMETYPE;

  componentDidMount(): void {
    // Handle case of either string to be `JSON.parse`d or pure object
    const figure = this.getFigure();
    (window as any).Plotly.newPlot(this.plotDiv, figure.data, figure.layout);
  }

  shouldComponentUpdate(nextProps: Props): boolean {
    return this.props.data !== nextProps.data;
  }

  componentDidUpdate() {
    const figure = this.getFigure();
    this.plotDiv.data = figure.data;
    this.plotDiv.layout = figure.layout;
    (window as any).Plotly.redraw(this.plotDiv);
  }

  plotDivRef = (plotDiv: PlotlyHTMLElement | null): void => {
    if (plotDiv) {
      this.plotDiv = plotDiv;
    }
  };

  getFigure = (): PlotlyFigure => {
    const figure = this.props.data;
    if (typeof figure === "string") {
      return JSON.parse(figure);
    }

    // The Plotly API *mutates* the figure to include a UID, which means
    // they won't take our frozen objects
    if (Object.isFrozen(figure)) {
      return cloneDeep(figure);
    }
    return figure;
  };

  render() {
    const { layout } = this.getFigure();
    const style: { height?: number } = {};
    if (layout && layout.height && !layout.autosize) {
      style.height = layout.height;
    }
    // @ts-ignore
    return <div ref={this.plotDivRef} style={style} />;
  }
}

export { PlotlyNullTransform };
export default PlotlyTransform;
