import { ToolbarDropdown } from './ToolbarDropdown';
import * as React from 'react';
import { TooltipPosition } from '@patternfly/react-core';
import { DurationInSeconds } from '@backstage-community/plugin-kiali-common';
import { humanDurations } from '../../config';
import { KialiConfig } from '../../hooks';

type DurationDropdownProps =  {
    disabled?: boolean;
    id: string;
    nameDropdown?: string;
    prefix?: string;
    suffix?: string;
    tooltip?: string;
    tooltipPosition?: TooltipPosition;
    duration: DurationInSeconds;
    setDuration: (duration: DurationInSeconds) => void;
  };

export const DurationDropdown: React.FC<DurationDropdownProps> = (props: DurationDropdownProps) => {
  const updateDurationInterval = (duration: number): void => {
    props.setDuration(duration); // notify redux of the change   
  };
  const config = React.useContext(KialiConfig)
  const durations = humanDurations(config, props.prefix, props.suffix);

  return (
    <ToolbarDropdown
      id={props.id}
      disabled={props.disabled}
      handleSelect={key => updateDurationInterval(Number(key))}
      value={String(props.duration)}
      label={durations[props.duration]}
      options={durations}
      tooltip={props.tooltip}
      tooltipPosition={props.tooltipPosition}
      nameDropdown={props.nameDropdown}
    />
  );
};
