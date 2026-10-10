type PagesContext = {
  request: Request;
  next: (input?: Request | string) => Promise<Response>;
};

function isPagesDevHost(host: string): boolean {
  return host === "pages.dev" || host.endsWith(".pages.dev");
}

/**
 * `_headers` cannot match on Host. Preview hosts on *.pages.dev stay
 * noindex; www.thezero.com.br is never tagged here.
 */
export async function onRequest(context: PagesContext): Promise<Response> {
  const response = await context.next();
  const host = new URL(context.request.url).hostname;
  if (!isPagesDevHost(host)) return response;

  const headers = new Headers(response.headers);
  headers.set("X-Robots-Tag", "noindex");
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
