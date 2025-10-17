import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import type { IReadonlyTheme } from '@microsoft/sp-component-base';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import { escape } from '@microsoft/sp-lodash-subset';

import * as strings from 'ShintzelTableWebPartStrings';
import styles from './ShintzelTableWebPart.module.scss';

export interface IShintzelTableWebPartProps {
  description: string;
  listName: string;
}

interface IListItem {
  Id: number;
  Title: string;
  Created: string;
  [key: string]: any;
}

interface IFieldInfo {
  InternalName: string;
  Title: string;
  TypeAsString: string;
}

export default class ShintzelTableWebPart extends BaseClientSideWebPart<IShintzelTableWebPartProps> {

  private _customFields: IFieldInfo[] = [];
  private _allItems: IListItem[] = [];
  private _currentPage: number = 1;
  private _pageSize: number = 10;
  private _sortColumn: string = 'Created';
  private _sortDirection: 'asc' | 'desc' = 'desc';

  public render(): void {
    try {
      this.domElement.innerHTML = `
        <div class="${styles.shintzelTable}">
          <div id="tableContainer"></div>
        </div>
      `;

      this.loadData();
    } catch (error) {
      console.error('Error in render:', error);
      this.domElement.innerHTML = `<div class="error">Error rendering web part</div>`;
    }
  }

  private async loadData(): Promise<void> {
    try {
      const container = this.domElement.querySelector('#tableContainer');
      if (!container) return;

      container.innerHTML = '<div>Loading...</div>';

      await this.fetchCustomFields();
      await this.fetchListItems();
      this.renderTable();
    } catch (error) {
      console.error('Error loading data:', error);
      const container = this.domElement.querySelector('#tableContainer');
      if (container) {
        container.innerHTML = `<div class="error">Error: ${escape(error.message)}</div>`;
      }
    }
  }

  private async fetchCustomFields(): Promise<void> {
    try {
      const listName = this.properties.listName || 'ProcApprvlShnitzel3';
      const url = `${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('${listName}')/Fields?$filter=Hidden eq false and ReadOnlyField eq false and InternalName ne 'Attachments' and InternalName ne 'ContentType' and InternalName ne 'ContentTypeId'&$select=InternalName,Title,TypeAsString`;

      const response: SPHttpClientResponse = await this.context.spHttpClient.get(
        url,
        SPHttpClient.configurations.v1
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      this._customFields = data.value || [];

      // Add Modified base field explicitly
      this._customFields.push({
        InternalName: 'Modified',
        Title: 'Modified',
        TypeAsString: 'DateTime'
      });
    } catch (error) {
      console.error('Error fetching custom fields:', error);
      this._customFields = [];
    }
  }

  private async fetchListItems(): Promise<void> {
    try {
      const listName = this.properties.listName || 'ProcApprvlShnitzel3';

      const url = `${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('${listName}')/items?$orderby=Created desc&$top=5000`;

      const response: SPHttpClientResponse = await this.context.spHttpClient.get(
        url,
        SPHttpClient.configurations.v1
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      this._allItems = data.value || [];
    } catch (error) {
      console.error('Error fetching list items:', error);
      this._allItems = [];
      throw error;
    }
  }

  private renderTable(): void {
    try {
      const container = this.domElement.querySelector('#tableContainer');
      if (!container) return;

      const sortedItems = this.getSortedItems();
      const paginatedItems = this.getPaginatedItems(sortedItems);
      const totalPages = Math.ceil(sortedItems.length / this._pageSize);

      const customFieldHeaders = this._customFields
        .map(field => `
          <th class="sortable" data-column="${escape(field.InternalName)}">
            ${escape(field.Title)} <span class="sort-icon">⇅</span>
          </th>
        `)
        .join('');

      let once = false;

      const itemRows = paginatedItems
        .map(item => {
          const customFieldCells = this._customFields
            .map(field => {
              let value = item[field.InternalName];
              // For User fields, SharePoint stores the ID as InternalName + "Id"
              if (field.TypeAsString === 'User' && (value === null || value === undefined)) {
                value = item[field.InternalName + 'Id'];
              }

              if (!value){
                value = item["OData_"+field.InternalName];
                if (!once) {
                  console.log(`value = item["OData_"+field.InternalName];`, value);
                  once = true;
                }
              }

              const displayValue = this.formatFieldValue(value, field.TypeAsString);
              return `<td>${escape(displayValue)}</td>`;
            })
            .join('');

          return `
            <tr>
              ${customFieldCells}
            </tr>
          `;
        })
        .join('');

      const html = `
        <div class="recent-sales-container">
          <div class="sales-header">
            <h6 class="sales-title">Recent Salse</h6>
            <a href="" class="show-all-link">Show All</a>
          </div>

          <div class="sales-table-wrapper">
            <table class="sales-table" role="table" aria-label="List items">
              <thead>
                <tr>
                  ${customFieldHeaders}
                </tr>
              </thead>
              <tbody>
                ${itemRows}
              </tbody>
            </table>
          </div>

          <div class="sales-pagination">
            <button class="page-btn prev-btn" ${this._currentPage === 1 ? 'disabled' : ''}>
              <i class="ms-Icon ms-Icon--ChevronLeft"></i> Previous
            </button>
            <span class="page-info">Page <span id="currentPage">${this._currentPage}</span> of <span id="totalPages">${totalPages}</span></span>
            <button class="page-btn next-btn" ${this._currentPage >= totalPages ? 'disabled' : ''}>
              Next <i class="ms-Icon ms-Icon--ChevronRight"></i>
            </button>
          </div>
        </div>
      `;

      container.innerHTML = html;
      this.attachEventHandlers();
    } catch (error) {
      console.error('Error rendering table:', error);
    }
  }

  private formatFieldValue(value: any, fieldType: string): string {
    try {
      if (value === null || value === undefined) return '';

      if (fieldType === 'DateTime') {
        return new Date(value).toLocaleString();
      }

      // Handle User field types
      if (fieldType === 'User') {
        // Value should be a number (user ID) at this point
        return value ? String(value) : '';
      }

      // Handle Lookup fields
      if (fieldType === 'Lookup' || fieldType === 'LookupMulti') {
        if (typeof value === 'object') {
          if (value.Title) return value.Title;
          if (value.lookupValue) return value.lookupValue;
        }
        return '';
      }

      if (typeof value === 'object') {
        // Try common display properties before stringifying
        if (value.Title) return value.Title;
        if (value.text) return value.text;
        if (value.name) return value.name;
        return JSON.stringify(value);
      }

      return String(value);
    } catch (error) {
      return '';
    }
  }

  private getSortedItems(): IListItem[] {
    try {
      return [...this._allItems].sort((a, b) => {
        const aValue = a[this._sortColumn];
        const bValue = b[this._sortColumn];

        if (aValue === bValue) return 0;

        const comparison = aValue < bValue ? -1 : 1;
        return this._sortDirection === 'asc' ? comparison : -comparison;
      });
    } catch (error) {
      console.error('Error sorting items:', error);
      return this._allItems;
    }
  }

  private getPaginatedItems(items: IListItem[]): IListItem[] {
    try {
      const startIndex = (this._currentPage - 1) * this._pageSize;
      const endIndex = startIndex + this._pageSize;
      return items.slice(startIndex, endIndex);
    } catch (error) {
      console.error('Error paginating items:', error);
      return items;
    }
  }

  private attachEventHandlers(): void {
    try {
      // Sort headers
      this.domElement.querySelectorAll('.sortable').forEach(header => {
        header.addEventListener('click', (e) => this.handleSort(e));
      });

      // Pagination
      const prevBtn = this.domElement.querySelector('.prev-btn');
      if (prevBtn) {
        prevBtn.addEventListener('click', () => this.handlePrevPage());
      }

      const nextBtn = this.domElement.querySelector('.next-btn');
      if (nextBtn) {
        nextBtn.addEventListener('click', () => this.handleNextPage());
      }

      // Export button
      const exportBtn = this.domElement.querySelector('.export-btn');
      if (exportBtn) {
        exportBtn.addEventListener('click', () => this.exportToCSV());
      }
    } catch (error) {
      console.error('Error attaching event handlers:', error);
    }
  }

  private handleSort(event: Event): void {
    try {
      const target = event.currentTarget as HTMLElement;
      const column = target.getAttribute('data-column');

      if (!column) return;

      if (this._sortColumn === column) {
        this._sortDirection = this._sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        this._sortColumn = column;
        this._sortDirection = 'asc';
      }

      this.renderTable();
    } catch (error) {
      console.error('Error handling sort:', error);
    }
  }

  private handlePrevPage(): void {
    try {
      if (this._currentPage > 1) {
        this._currentPage--;
        this.renderTable();
      }
    } catch (error) {
      console.error('Error handling previous page:', error);
    }
  }

  private handleNextPage(): void {
    try {
      const totalPages = Math.ceil(this._allItems.length / this._pageSize);
      if (this._currentPage < totalPages) {
        this._currentPage++;
        this.renderTable();
      }
    } catch (error) {
      console.error('Error handling next page:', error);
    }
  }

  private exportToCSV(): void {
    try {
      const headers = ['ID', 'Title', 'Created', ...this._customFields.map(f => f.Title)];
      const rows = this._allItems.map(item => [
        item.Id,
        item.Title || '',
        new Date(item.Created).toLocaleString(),
        ...this._customFields.map(f => {
          let value = item[f.InternalName];
          // For User fields, SharePoint stores the ID as InternalName + "Id"
          if (f.TypeAsString === 'User' && (value === null || value === undefined)) {
            value = item[f.InternalName + 'Id'];
          }
          return this.formatFieldValue(value, f.TypeAsString);
        })
      ]);

      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      link.setAttribute('href', url);
      link.setAttribute('download', `${this.properties.listName || 'data'}_${new Date().toISOString()}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting to CSV:', error);
      alert('Error exporting data to CSV');
    }
  }

  protected onInit(): Promise<void> {
    try {
      return this._getEnvironmentMessage().then(() => {
        // Environment message loaded
      });
    } catch (error) {
      console.error('Error in onInit:', error);
      return Promise.resolve();
    }
  }

  private _getEnvironmentMessage(): Promise<string> {
    try {
      if (!!this.context.sdks.microsoftTeams) {
        return this.context.sdks.microsoftTeams.teamsJs.app.getContext()
          .then(context => {
            let environmentMessage: string = '';
            switch (context.app.host.name) {
              case 'Office':
                environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOffice : strings.AppOfficeEnvironment;
                break;
              case 'Outlook':
                environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOutlook : strings.AppOutlookEnvironment;
                break;
              case 'Teams':
              case 'TeamsModern':
                environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentTeams : strings.AppTeamsTabEnvironment;
                break;
              default:
                environmentMessage = strings.UnknownEnvironment;
            }
            return environmentMessage;
          });
      }

      return Promise.resolve(this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentSharePoint : strings.AppSharePointEnvironment);
    } catch (error) {
      console.error('Error getting environment message:', error);
      return Promise.resolve('');
    }
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    try {
      if (!currentTheme) {
        return;
      }

      const { semanticColors } = currentTheme;

      if (semanticColors) {
        this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || null);
        this.domElement.style.setProperty('--link', semanticColors.link || null);
        this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered || null);
      }
    } catch (error) {
      console.error('Error in onThemeChanged:', error);
    }
  }

  protected onDispose(): void {
    try {
      // Clean up event listeners if needed
    } catch (error) {
      console.error('Error in onDispose:', error);
    }
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('listName', {
                  label: strings.ListNameFieldLabel,
                  value: 'ProcApprvlShnitzel3'
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
