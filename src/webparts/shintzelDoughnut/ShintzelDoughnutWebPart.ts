import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import type { IReadonlyTheme } from '@microsoft/sp-component-base';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import { escape } from '@microsoft/sp-lodash-subset';

import * as strings from 'ShintzelDoughnutWebPartStrings';
import styles from './ShintzelDoughnutWebPart.module.scss';

export interface IShintzelDoughnutWebPartProps {
  description: string;
  listName: string;
  statusFieldName: string;
}

interface IStatusData {
  [status: string]: number;
}

export default class ShintzelDoughnutWebPart extends BaseClientSideWebPart<IShintzelDoughnutWebPartProps> {

  private _statusData: IStatusData = {};
  private _colors: string[] = [
    '#0078D4', // Blue
    '#FFB900', // Yellow
    '#E74856', // Red
    '#8764B8', // Purple
    '#00B294', // Teal
    '#FF8C00', // Orange
    '#A4262C', // Dark Red
    '#498205', // Green (not for approved)
    '#005A9E', // Dark Blue
  ];
  private _approvedColor: string = '#107c10'; // Microsoft Green for approved status

  public render(): void {
    try {
      this.domElement.innerHTML = `
        <div class="${styles.shintzelDoughnut}">
          <div id="chartContainer"></div>
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
      const container = this.domElement.querySelector('#chartContainer');
      if (!container) return;

      container.innerHTML = '<div>Loading...</div>';

      await this.fetchStatusData();
      this.renderDoughnutChart();
    } catch (error) {
      console.error('Error loading data:', error);
      const container = this.domElement.querySelector('#chartContainer');
      if (container) {
        container.innerHTML = `<div class="error">Error: ${escape(error.message)}</div>`;
      }
    }
  }

  private async fetchStatusData(): Promise<void> {
    try {
      const listName = this.properties.listName || 'ProcApprvlShnitzel3';
      const statusField = this.properties.statusFieldName || '_x05e1__x05d8__x05d8__x05d5__x05';

      const url = `${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('${listName}')/items?$top=5000`;

      const response: SPHttpClientResponse = await this.context.spHttpClient.get(
        url,
        SPHttpClient.configurations.v1
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const items = data.value || [];

      // Aggregate by status
      this._statusData = {};
      items.forEach((item: any) => {
        // Try both field name variations
        const status = item[statusField] ||
                      item[`OData_${statusField}`] ||
                      'Unknown';

        this._statusData[status] = (this._statusData[status] || 0) + 1;
      });

    } catch (error) {
      console.error('Error fetching status data:', error);
      this._statusData = {};
      throw error;
    }
  }

  private renderDoughnutChart(): void {
    try {
      const container = this.domElement.querySelector('#chartContainer');
      if (!container) return;

      // Calculate total using ES5-compatible approach
      let total = 0;
      for (const key in this._statusData) {
        if (this._statusData.hasOwnProperty(key)) {
          total += this._statusData[key];
        }
      }
      const lastUpdated = new Date().toLocaleTimeString();

      // Generate legend HTML using ES5-compatible approach
      const legendItems: string[] = [];
      let index = 0;
      for (const status in this._statusData) {
        if (this._statusData.hasOwnProperty(status)) {
          const count = this._statusData[status];
          const color = this.getColorForStatus(status, index);
          const percentage = ((count / total) * 100).toFixed(1);

          legendItems.push(`
            <li>
              <span class="legend-color" style="background-color: ${color}"></span>
              <span class="legend-label">${escape(status)}</span>
              <span class="legend-value">${count} (${percentage}%)</span>
            </li>
          `);
          index++;
        }
      }

      const html = `
        <div class="doughnut-chart-container">
          <div class="chart-header">
            <h3 class="chart-title">Status Distribution</h3>
            <div class="chart-actions">
              <button class="refresh-btn" aria-label="Refresh chart" title="Refresh">
                <i class="ms-Icon ms-Icon--Refresh"></i>
              </button>
            </div>
          </div>

          <div class="chart-body">
            <canvas id="doughnutChart" width="400" height="400" aria-label="Doughnut chart visualization"></canvas>
          </div>

          <div class="chart-legend">
            <ul class="legend-list">
              ${legendItems.join('')}
            </ul>
          </div>

          <div class="chart-footer">
            <span class="last-updated">Last updated: <time>${lastUpdated}</time></span>
          </div>
        </div>
      `;

      container.innerHTML = html;

      // Draw canvas chart
      this.drawDoughnutChart();

      // Attach event handlers
      this.attachEventHandlers();
    } catch (error) {
      console.error('Error rendering doughnut chart:', error);
    }
  }

  private drawDoughnutChart(): void {
    try {
      const canvas = this.domElement.querySelector('#doughnutChart') as HTMLCanvasElement;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const centerX = 200;
      const centerY = 200;
      const outerRadius = 150;
      const innerRadius = 75;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Calculate total using ES5-compatible approach
      let total = 0;
      for (const key in this._statusData) {
        if (this._statusData.hasOwnProperty(key)) {
          total += this._statusData[key];
        }
      }

      // Draw doughnut segments using ES5-compatible approach
      let currentAngle = -Math.PI / 2; // Start at top
      let index = 0;

      for (const status in this._statusData) {
        if (this._statusData.hasOwnProperty(status)) {
          const count = this._statusData[status];
          const percentage = count / total;
          const sliceAngle = percentage * 2 * Math.PI;
          const color = this.getColorForStatus(status, index);

          // Draw outer arc
          ctx.beginPath();
          ctx.arc(centerX, centerY, outerRadius, currentAngle, currentAngle + sliceAngle);
          ctx.arc(centerX, centerY, innerRadius, currentAngle + sliceAngle, currentAngle, true);
          ctx.closePath();
          ctx.fillStyle = color;
          ctx.fill();

          // Optional: Add stroke for better visibility
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.stroke();

          currentAngle += sliceAngle;
          index++;
        }
      }

      // Draw center circle (creates donut hole)
      ctx.beginPath();
      ctx.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI);
      ctx.fillStyle = '#ffffff';
      ctx.fill();

      // Draw center text (total count)
      ctx.fillStyle = '#323130';
      ctx.font = 'bold 32px Segoe UI';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(total.toString(), centerX, centerY - 10);

      // Draw "Total" label
      ctx.font = '14px Segoe UI';
      ctx.fillStyle = '#605e5c';
      ctx.fillText('Total', centerX, centerY + 20);

    } catch (error) {
      console.error('Error drawing doughnut chart:', error);
    }
  }

  private getColorForStatus(status: string, index: number): string {
    try {
      // Check if this is the approved status (in Hebrew)
      if (status === 'אושר ע"י המשתמש' || status.indexOf('אושר') !== -1) {
        return this._approvedColor;
      }

      return this._colors[index % this._colors.length];
    } catch (error) {
      console.error('Error getting color for status:', error);
      return '#808080'; // Gray fallback
    }
  }

  private attachEventHandlers(): void {
    try {
      const refreshBtn = this.domElement.querySelector('.refresh-btn');
      if (refreshBtn) {
        refreshBtn.addEventListener('click', () => this.handleRefresh());
      }
    } catch (error) {
      console.error('Error attaching event handlers:', error);
    }
  }

  private handleRefresh(): void {
    try {
      this.loadData();
    } catch (error) {
      console.error('Error handling refresh:', error);
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
                }),
                PropertyPaneTextField('statusFieldName', {
                  label: strings.StatusFieldNameLabel,
                  value: '_x05e1__x05d8__x05d8__x05d5__x05'
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
