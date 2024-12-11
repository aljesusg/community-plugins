import * as React from 'react';
import { legendData, GraphLegendItem, GraphLegendItemRow } from './GraphLegendDataPF';
import { Button, ButtonVariant, Tooltip } from '@patternfly/react-core';
import { PFColors } from '../Pf/PfColors';
import { KialiIcon } from '../../config';
import { style } from 'typestyle';
import { ComputedServerConfig } from '@backstage-community/plugin-kiali-common';

interface GraphLegendPFProps {
  closeLegend: () => void;
  config: ComputedServerConfig
}

const legendBoxStyle = style({
  width: '225px',
  backgroundColor: PFColors.BackgroundColor100,
  border: `1px solid ${PFColors.BorderColor100}`,
  overflowY: 'auto',
  zIndex: 3
});

const headerStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderBottom: `1px solid ${PFColors.BorderColor100}`,
  padding: '0.5rem 0 0.5rem 1rem',
  fontWeight: 'bold'
});

const bodyStyle = style({
  padding: '0 0.5rem 1rem 1rem'
});

const keyStyle = style({
  minWidth: '70px',
  width: '70px'
});

const legendItemStyle = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  padding: '0.25rem 0.25rem 0 0.25rem'
});

const legendItemLabelStyle = style({
  fontWeight: 'normal'
});

const legendColumnHeadingStyle = style({
  fontWeight: 'bold',
  paddingTop: '1.25rem'
});

const legendBadgeStyle = style({
  borderRadius: '0.25rem',
  backgroundColor: '#6a6e73'
});

export const GraphLegendPF: React.FC<GraphLegendPFProps> = (props: GraphLegendPFProps) => {

  const renderGraphLegendList = (legendData: GraphLegendItem[]): React.ReactNode => {
    return (
      <>
        {legendData.map((legendItem: GraphLegendItem) => (
          <div key={legendItem.title} className={legendColumnHeadingStyle}>
            {legendItem.title}

            {legendItem.data.map((legendItemRow: GraphLegendItemRow) =>
              renderLegendIconAndLabel(legendItemRow, legendItem.isBadge)
            )}
          </div>
        ))}
      </>
    );
  };

  const renderLegendIconAndLabel = (legendItemRow: GraphLegendItemRow, isBadge?: boolean): React.ReactNode => {
    return (
      <div key={legendItemRow.icon} className={legendItemStyle}>
        <span className={keyStyle}>
          <img alt={legendItemRow.label} src={legendItemRow.icon} className={isBadge ? legendBadgeStyle : ''} />
        </span>

        <span className={legendItemLabelStyle}>{legendItemRow.label}</span>
      </div>
    );
  };

  return (
    <div className={legendBoxStyle} data-test="graph-legend">
      <div className={headerStyle}>
        <span>{'Legend'}</span>
        <Tooltip content={`Close Legend`}>
          <Button id="legend_close" variant={ButtonVariant.plain} onClick={props.closeLegend}>
            <KialiIcon.Close />
          </Button>
        </Tooltip>
      </div>

      <div className={bodyStyle}>{renderGraphLegendList(legendData(props.config))}</div>
    </div>
  );
};
