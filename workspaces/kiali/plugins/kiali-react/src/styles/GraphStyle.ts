import { PFColors } from '../components/Pf/PfColors';
import { style } from 'typestyle';

export const toolbarActiveStyle = style({
  top: '0.25rem',
  color: PFColors.Active,
  $nest: {
    '& svg': {
      width: '1.25rem',
      height: '1.25rem'
    }
  }
});
