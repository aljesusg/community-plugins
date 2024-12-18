import * as React from 'react';
import _ from 'lodash';
import {
  Button,
  TextInput,
  Tooltip,
  Divider,
  Badge,
  Dropdown,
  MenuToggleElement,
  MenuToggle,
  DropdownList,
  Checkbox
} from '@patternfly/react-core';
import {
  BoundingClientAwareComponent,
  PropertyType
} from '../BoundingClientAwareComponent/BoundingClientAwareComponent';
import { style } from 'typestyle';
import { Namespace } from '@backstage-community/plugin-kiali-common';
import { KialiIcon } from '../../config';

type NamespaceDropdownProps = {
  namespaces: Namespace[];
  activeNamespaces: Namespace[];
  setActiveNamespaces: (namespaces: Namespace[]) => void;
  clearAll: () => void;
  setFilter: (filter: string) => void;
  filter: string;
  disabledNs: boolean;
};

type NamespaceDropdownState = {
  isBulkSelectorOpen: boolean;
  isOpen: boolean;
  selectedNamespaces: Namespace[];
};

const optionBulkStyle = style({
  marginLeft: '0.5rem',
  position: 'relative',
  top: 8
});

const optionStyle = style({ marginLeft: '1.0rem' });

const optionLabelStyle = style({ marginLeft: '0.5rem' });

const headerStyle = style({
  margin: '0.5rem',
  marginTop: 0,
  width: 300
});

const marginBottom = 20;

const namespaceContainerStyle = style({
  overflow: 'auto'
});

const dividerStyle = style({
  paddingTop: '0.625rem'
});

const closeButtonStyle = style({
  borderTopLeftRadius: 0,
  borderBottomLeftRadius: 0
});

export class NamespaceDropdown extends React.PureComponent<NamespaceDropdownProps, NamespaceDropdownState> {
  constructor(props: NamespaceDropdownProps) {    
    super(props);
    console.log(this.props.activeNamespaces);
    this.state = {
      isBulkSelectorOpen: false,
      isOpen: false,
      selectedNamespaces: [...this.props.activeNamespaces]
    };
  }

  componentDidUpdate(prevProps: NamespaceDropdownProps): void {
    if (prevProps.activeNamespaces !== this.props.activeNamespaces) {      
      this.setState({ selectedNamespaces: this.props.activeNamespaces });
    }
  }

  private namespaceButtonText(): JSX.Element {
    if (this.state.selectedNamespaces.length === 0) {
      return <span>Select Namespaces</span>;
    }

    return (
      <>
        <span style={{ paddingRight: '0.75rem' }}>Namespace:</span>
        {this.state.selectedNamespaces.length === 1 ? (
          <span>{this.state.selectedNamespaces[0].name}</span>
        ) : (
          <Badge>{this.state.selectedNamespaces.length}</Badge>
        )}
      </>
    );
  }

  private getBulkSelector(): JSX.Element {
    const selectedNamespaces = this.filteredSelected();
    const numSelected = selectedNamespaces.length;
    const allSelected = numSelected === this.props.namespaces.length;
    const anySelected = numSelected > 0;
    const someChecked = anySelected ? null : false;
    const isChecked = allSelected ? true : someChecked;

    return (
      <div className={optionBulkStyle}>
        <Checkbox
          id="bulk-select-id"
          key="bulk-select-key"
          aria-label="Select all"
          isChecked={isChecked}
          onChange={() => {
            anySelected ? this.onBulkNone() : this.onBulkAll();
          }}
        ></Checkbox>
        <span className={optionLabelStyle}>Select all</span>
      </div>
    );
  }

  private getHeader(): JSX.Element {
    const hasFilter = !!this.props.filter;

    return (
      <div className={headerStyle}>
        <span style={{ display: 'flex' }}>
          <TextInput
            aria-label="filter-namespace"
            type="text"
            name="namespace-filter"
            placeholder="Filter by Name..."
            value={this.props.filter}
            onChange={(_event, value: string) => this.onFilterChange(value)}
          />
          {hasFilter && (
            <Tooltip key="ot_clear_namespace_filter" position="top" content="Clear Filter by Name">
              <Button className={closeButtonStyle} onClick={this.clearFilter} isInline>
                <KialiIcon.Close />
              </Button>
            </Tooltip>
          )}
        </span>
        {this.getBulkSelector()}
        <Divider className={dividerStyle} />
      </div>
    );
  }

  private getBody(): JSX.Element {
    if (this.props.namespaces.length > 0) {
      const selectedMap = this.state.selectedNamespaces.reduce((map, namespace) => {
        map[namespace.name] = namespace.name;
        return map;
      }, {});
      const namespaces = this.filtered()
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((namespace: Namespace) => (
          <div
            className={optionStyle}
            id={`namespace-list-item[${namespace.name}]`}
            key={`namespace-list-item[${namespace.name}]`}
          >
            <input
              type="checkbox"
              value={namespace.name}
              checked={!!selectedMap[namespace.name]}
              onChange={this.onNamespaceToggled}
            />
            <span className={optionLabelStyle}>{namespace.name}</span>
          </div>
        ));

      return (
        <>
          <BoundingClientAwareComponent
            className={namespaceContainerStyle}
            maxHeight={{ type: PropertyType.VIEWPORT_HEIGHT_MINUS_TOP, margin: marginBottom }}
          >
            {namespaces}
          </BoundingClientAwareComponent>
        </>
      );
    }
    return <div className={optionStyle}>No namespaces found</div>;
  }

  render(): JSX.Element {
    return (
        <Dropdown
          toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
            <MenuToggle
              ref={toggleRef}
              data-test="namespace-dropdown"
              id="namespace-selector"
              onClick={() => this.onToggle(!this.state.isOpen)}
              isExpanded={this.state.isOpen}
              isDisabled={this.props.disabledNs}
            >
              {this.namespaceButtonText()}
            </MenuToggle>
          )}
          isOpen={this.state.isOpen}
          onOpenChange={(isOpen: boolean) => this.onToggle(isOpen)}
        >
          <DropdownList>
            {this.getHeader()}
            {this.getBody()}
          </DropdownList>
        </Dropdown>
    );
  }

  private onToggle = (isOpen: boolean): void => {
    
    this.props.setActiveNamespaces(this.state.selectedNamespaces);
    this.clearFilter();
    
    this.setState({
      isOpen
    });
  };

  private onBulkAll = (): void => {
    const union = Array.from(new Set([...this.state.selectedNamespaces, ...this.filtered()]));
    this.setState({ selectedNamespaces: union });
  };

  private onBulkNone = (): void => {
    const filtered = this.filtered();
    const remaining = this.state.selectedNamespaces.filter(s => filtered.findIndex(f => f.name === s.name) < 0);
    this.setState({ selectedNamespaces: remaining });
  };

  onNamespaceToggled = (event): void => {
    const namespace = event.target.value;
    const selectedNamespaces = !!this.state.selectedNamespaces.find(n => n.name === namespace)
      ? this.state.selectedNamespaces.filter(n => n.name !== namespace)
      : this.state.selectedNamespaces.concat([{ name: event.target.value } as Namespace]);
    this.setState({ selectedNamespaces: selectedNamespaces });
  };

  private onFilterChange = (value: string): void => {
    this.props.setFilter(value);
  };

  private clearFilter = (): void => {
    this.props.setFilter('');
  };

  private filtered = (): Namespace[] => {
    return this.props.namespaces.filter(ns => ns.name.toLowerCase().includes(this.props.filter.toLowerCase()));
  };

  private filteredSelected = (): Namespace[] => {
    const filtered = this.filtered();
    return this.state.selectedNamespaces.filter(s => filtered.findIndex(f => f.name === s.name) >= 0);
  };
}