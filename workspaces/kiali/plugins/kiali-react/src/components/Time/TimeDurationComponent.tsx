import * as React from 'react';
import { DurationDropdown } from '../Dropdown/DurationDropdown';
import { TooltipPosition} from '@patternfly/react-core';
import { DurationInSeconds } from '@backstage-community/plugin-kiali-common';


type TimeControlsProps = {
  duration: DurationInSeconds;
}


export const TimeDurationComponent: React.FC<TimeControlsProps> = (props: TimeControlsProps) => {  

  const durationTooltip = 'Traffic metrics per refresh';
  const [prefix, suffix] = ['Last', undefined];

  return (
    <span>     
      <DurationDropdown
        id="time_range_duration"
        disabled={false}
        prefix={prefix}
        suffix={suffix}
        tooltip={durationTooltip}
        tooltipPosition={TooltipPosition.left}
      />    
    </span>
  );
};
