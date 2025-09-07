// Public API service for civic organizations and third-party integrations
export interface PublicAPIConfig {
  apiKey: string;
  orgId: string;
}

export interface CivicDataRequest {
  dataType: 'projects' | 'leaders' | 'events' | 'stats' | 'transparency';
  filters?: {
    state?: string;
    lga?: string;
    dateFrom?: string;
    dateTo?: string;
    status?: string;
  };
  limit?: number;
  offset?: number;
}

export interface PublicAPIResponse<T> {
  success: boolean;
  data: T;
  meta: {
    total: number;
    limit: number;
    offset: number;
    timestamp: string;
  };
  error?: string;
}

export class PublicAPIService {
  private baseUrl: string;
  private version: string;

  constructor() {
    this.baseUrl = '/api/public/v1';
    this.version = '1.0.0';
  }

  // Authentication for API clients
  async authenticateAPIKey(apiKey: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey })
      });
      
      return response.ok;
    } catch (error) {
      console.error('API key verification failed:', error);
      return false;
    }
  }

  // Get civic projects for third-party display
  async getPublicProjects(config: PublicAPIConfig, filters?: CivicDataRequest['filters']): Promise<PublicAPIResponse<any[]>> {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters?.state) queryParams.append('state', filters.state);
      if (filters?.lga) queryParams.append('lga', filters.lga);
      if (filters?.status) queryParams.append('status', filters.status);
      if (filters?.dateFrom) queryParams.append('dateFrom', filters.dateFrom);
      if (filters?.dateTo) queryParams.append('dateTo', filters.dateTo);

      const response = await fetch(`${this.baseUrl}/projects?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'X-Org-ID': config.orgId,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      return {
        success: false,
        data: [],
        meta: {
          total: 0,
          limit: 0,
          offset: 0,
          timestamp: new Date().toISOString()
        },
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Get credible leaders for civic organization directories
  async getPublicLeaders(config: PublicAPIConfig, filters?: CivicDataRequest['filters']): Promise<PublicAPIResponse<any[]>> {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters?.state) queryParams.append('state', filters.state);
      if (filters?.lga) queryParams.append('lga', filters.lga);

      const response = await fetch(`${this.baseUrl}/leaders?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'X-Org-ID': config.orgId,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      return {
        success: false,
        data: [],
        meta: {
          total: 0,
          limit: 0,
          offset: 0,
          timestamp: new Date().toISOString()
        },
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Get transparency data for watchdog organizations
  async getTransparencyData(config: PublicAPIConfig, dataType: string): Promise<PublicAPIResponse<any>> {
    try {
      const response = await fetch(`${this.baseUrl}/transparency/${dataType}`, {
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'X-Org-ID': config.orgId,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      return {
        success: false,
        data: null,
        meta: {
          total: 0,
          limit: 0,
          offset: 0,
          timestamp: new Date().toISOString()
        },
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Get civic engagement statistics
  async getCivicStats(config: PublicAPIConfig, timeframe?: 'week' | 'month' | 'quarter' | 'year'): Promise<PublicAPIResponse<any>> {
    try {
      const queryParams = new URLSearchParams();
      if (timeframe) queryParams.append('timeframe', timeframe);

      const response = await fetch(`${this.baseUrl}/stats?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'X-Org-ID': config.orgId,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      return {
        success: false,
        data: null,
        meta: {
          total: 0,
          limit: 0,
          offset: 0,
          timestamp: new Date().toISOString()
        },
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Webhook system for real-time data
  async registerWebhook(config: PublicAPIConfig, webhookUrl: string, events: string[]): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/webhooks`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'X-Org-ID': config.orgId,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url: webhookUrl,
          events: events // ['project.created', 'project.funded', 'leader.verified', etc.]
        })
      });

      return response.ok;
    } catch (error) {
      console.error('Webhook registration failed:', error);
      return false;
    }
  }

  // Submit civic data from partner organizations
  async submitCivicData(config: PublicAPIConfig, dataType: string, data: any): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/submit/${dataType}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'X-Org-ID': config.orgId,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      return response.ok;
    } catch (error) {
      console.error('Data submission failed:', error);
      return false;
    }
  }

  // Get API documentation and usage guidelines
  getAPIDocumentation(): string {
    return `
Step Up Naija Public API v${this.version}

AUTHENTICATION:
All requests require an API key in the Authorization header:
Authorization: Bearer YOUR_API_KEY
X-Org-ID: YOUR_ORGANIZATION_ID

AVAILABLE ENDPOINTS:

1. GET /api/public/v1/projects
   - Get community projects data
   - Filters: state, lga, status, dateFrom, dateTo
   - Returns: Project list with funding progress

2. GET /api/public/v1/leaders  
   - Get credible leaders directory
   - Filters: state, lga, credibleLevel
   - Returns: Verified leader profiles

3. GET /api/public/v1/transparency/{type}
   - Get transparency data
   - Types: funding, expenses, impact, governance
   - Returns: Financial and impact transparency data

4. GET /api/public/v1/stats
   - Get civic engagement statistics
   - Parameters: timeframe (week/month/quarter/year)
   - Returns: Participation and impact metrics

5. POST /api/public/v1/webhooks
   - Register webhook for real-time updates
   - Events: project.*, leader.*, vote.*, petition.*

6. POST /api/public/v1/submit/{dataType}
   - Submit civic data to platform
   - Types: events, reports, surveys
   - Requires verification and approval

RATE LIMITS:
- 1000 requests per hour per API key
- 10 requests per second burst limit

For API access, contact: api@stepupnaija.com
Documentation: https://docs.stepupnaija.com/api
    `;
  }
}

// Export singleton instance
export const publicAPIService = new PublicAPIService();