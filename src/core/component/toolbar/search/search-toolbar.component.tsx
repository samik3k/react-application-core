import * as React from 'react';
import * as ramda from 'ramda';

import { isUndef } from 'core/util';
import { AnyT } from 'core/definition.interface';
import { BaseComponent } from 'core/component/base';
import { TextField } from 'core/component/field';
import { DelayedChangesFieldPlugin, IBasicTextFieldAction } from 'core/component/field';

import {
  ISearchToolbarInternalState,
  ISearchToolbarInternalProps,
} from './search-toolbar.interface';

export class SearchToolbar extends BaseComponent<SearchToolbar,
                                                 ISearchToolbarInternalProps,
                                                 ISearchToolbarInternalState> {

  private actions: IBasicTextFieldAction[] = [{
    type: 'filter_list',
    actionHandler: this.onFilterActionClick.bind(this),
  }];

  constructor(props: ISearchToolbarInternalProps) {
    super(props);
    this.onFilter = this.onFilter.bind(this);
    this.doSearch = this.doSearch.bind(this);
    this.onChangeQuery = this.onChangeQuery.bind(this);

    if (this.isPersistent) {
      this.state = {} as ISearchToolbarInternalProps;
    } else {
      this.state = {
        activated: this.definitePropsActivated,
        query: this.definitePropsQuery,
      };
    }
  }

  public componentWillReceiveProps(nextProps: Readonly<ISearchToolbarInternalProps>, nextContext: AnyT): void {
    super.componentWillReceiveProps(nextProps, nextContext);

    if (!this.isPersistent) {
      this.setState({
        activated: nextProps.activated,
        query: nextProps.query,
      });
    }
  }

  public render(): JSX.Element {
    const className = ['mdc-toolbar', 'app-search-toolbar', this.props.className];
    let searchFieldTpl;

    if (this.isActivated) {
      searchFieldTpl = (
          <section className={'mdc-toolbar__section visible'}>
            <TextField persistent={false}
                       autoFocus={true}
                       value={this.query}
                       placeholder={'Search'}
                       actions={this.actions}
                       onDelay={this.doSearch}
                       onChange={this.onChangeQuery}
                       plugins={DelayedChangesFieldPlugin}>
            </TextField>
          </section>
      );
    }
    return (
        <div className={className.filter((cls) => !!cls).join(' ')}>
          <div className='mdc-toolbar__row'>
            <section>
              <div className='material-icons mdc-toolbar__icon'
                   onClick={this.onFilter}>
                search
              </div>
            </section>
            {searchFieldTpl}
          </div>
        </div>
    );
  }

  private get isActivated(): boolean {
    return this.isPersistent ? this.props.activated : this.state.activated;
  }

  private get query(): boolean {
    return this.isPersistent ? this.props.query : this.state.query;
  }

  private onFilter(): void {
    if (this.isPersistent) {
      if (this.props.onFilter) {
        this.props.onFilter();
      }
    } else {
      this.setState({ activated: true });
    }
  }

  private onChangeQuery(value: string): void {
    if (this.isPersistent) {
      if (this.props.onChangeQuery) {
        this.props.onChangeQuery(value);
      }
    } else {
      this.setState({query: value});
    }
  }

  private onFilterActionClick(): void {
    if (this.props.onFilterAction) {
      this.props.onFilterAction();
    }
  }

  private doSearch(value: string): void {
    if (this.props.onSearch) {
      this.props.onSearch(value);
    }
  }

  private get definitePropsActivated(): boolean {
    return isUndef(this.props.activated) ? false : this.props.activated;
  }

  private get definitePropsQuery(): string {
    return isUndef(this.props.query) ? '' : this.props.query;
  }
}
