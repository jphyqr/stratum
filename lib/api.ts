// lib/api/makeExtensionRequest.ts
interface ExtensionRequestConfig extends RequestInit {
    baseUrl?: string;
  }
  
  export async function makeExtensionRequest<T = any>(
    path: string,
    options: ExtensionRequestConfig = {},
    bodyData?: unknown
  ): Promise<Response> {
    const baseUrl = 
      (options.baseUrl || process.env.NODE_ENV === 'development'  ? 
      'http://localhost:3009' : 
      'https://tndevs.com');
  
    const defaultHeaders = {
      'x-extension-token': process.env.NEXT_PUBLIC_STRATUM_TOKEN || '',
    };
  
    const hasBody = bodyData !== undefined || options.body !== undefined;
    const headers = {
      ...defaultHeaders,
      ...(hasBody ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    };
  
    const finalBody = bodyData ? JSON.stringify(bodyData) : options.body;
  
    const requestConfig: RequestInit = {
      ...options,
      headers,
      body: finalBody,
    };
  
    if (process.env.NODE_ENV === 'development') {
      console.log('Request:', {
        url: `${baseUrl}${path}`,
        method: options.method,
        headers,
        body: bodyData ? JSON.stringify(bodyData, null, 2) : undefined
      });
    }
  
    const response = await fetch(`${baseUrl}${path}`, requestConfig);
  
    if (process.env.NODE_ENV === 'development') {
      try {
        const responseClone = response.clone();
        const responseText = await responseClone.text();
        console.log('Response:', {
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
          body: responseText ? JSON.parse(responseText) : undefined
        });
      } catch (error) {
        console.log('Could not parse response for logging:', error);
      }
    }
  
    return response;
  }
  
  // Type guard for API responses
  export function isSuccessResponse<T>(response: unknown): response is { success: true } & T {
    return typeof response === 'object' && 
           response !== null && 
           'success' in response && 
           response.success === true;
  }