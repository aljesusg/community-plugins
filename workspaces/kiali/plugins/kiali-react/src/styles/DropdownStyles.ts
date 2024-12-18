
import { style } from 'typestyle';
import { NestedCSSProperties } from 'typestyle/lib/types';
import { PFColors } from '../components/Pf';

export const containerStyle = style({
  overflow: 'auto'
});

// this emulates Select component .pf-v5-c-select__menu
export const menuStyle = style({
  fontSize: 'var(--kiali-global--font-size)'
});

// this emulates Select component .pf-v5-c-select__menu but w/o cursor manipulation
export const menuEntryStyle = style({
  display: 'inline-block',
  width: '100%'
});

// this emulates Select component .pf-v5-c-select__menu-group-title but with less bottom padding to conserve space
export const titleStyle = style({
  padding: '0.5rem 1rem 0 1rem',
  fontWeight: 700,
  color: PFColors.Color200
});

const itemStyle: NestedCSSProperties = {
  alignItems: 'center',
  whiteSpace: 'nowrap',
  margin: 0,
  padding: '0.375rem 1rem',
  display: 'inline-block'
};

// this emulates Select component .pf-v5-c-select__menu-item but with less vertical padding to conserve space
export const itemStyleWithoutInfo = style(itemStyle);

// this emulates Select component .pf-v5-c-select__menu-item but with less vertical padding to conserve space
export const itemStyleWithInfo = style({
  ...itemStyle,
  padding: '0.375rem 0 0.375rem 1rem'
});

export const groupMenuStyle = style({
  textAlign: 'left'
});

export const kebabToggleStyle = style({
  paddingLeft: '0.5rem',
  paddingRight: '0.5rem'
});
